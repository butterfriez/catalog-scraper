import { Injectable, OnModuleInit } from '@nestjs/common';
import { FirebaseProvider } from './firebase.provider';
import { MetadataService } from './metadata.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Cron } from '@nestjs/schedule';

interface BundleAsset {
  id: number;
  assetType: number;
  name: string;
  type: string;
}

export interface Asset {
  id: number;
  itemType: string;
  assetType: number;
  name: string;
  description: string;
  productId: number;
  itemStatus: string[];
  itemRestrictions: string[];
  creatorHasVerifiedBadge: boolean;
  creatorType: 'User' | 'Group';
  creatorTargetId: number;
  creatorName: string;
  price: number;
  lowestPrice: number;
  lowestResalePrice: number;
  unitsAvailableForConsumption: number;
  favoriteCount: number;
  offSaleDeadline: string | null;
  collectibleItemId: string | null;
  totalQuantity: number;
  saleLocationType: 'ShopAndAllExperiences' | 'Other';
  hasResellers: boolean;
}

export interface Bundle {
  bundledItems: BundleAsset[]; // replace with a stronger type if you know the shape
  id: number;
  itemType: 'Bundle';
  bundleType: number;
  isRecolorable: boolean;
  name: string;
  description: string;
  productId: number;
  itemStatus: string[];
  itemRestrictions: string[];
  creatorHasVerifiedBadge: boolean;
  creatorType: 'User' | 'Group';
  creatorTargetId: number;
  creatorName: string;
  price: number;
  lowestPrice: number;
  lowestResalePrice: number;
  unitsAvailableForConsumption: number;
  favoriteCount: number;
  offSaleDeadline: string | null;
  collectibleItemId: string | null;
  totalQuantity: number;
  saleLocationType: 'ShopAndAllExperiences' | 'Other'; // can expand if more values exist
  hasResellers: boolean;
}

type CatalogEntry = Asset | Bundle;

@Injectable()
export class CatalogService implements OnModuleInit {
  private base_catalog_url =
    'https://catalog.roblox.com/v1/search/items/details?limit=30';

  constructor(
    private firebase: FirebaseProvider,
    private metadata: MetadataService,
    private readonly httpService: HttpService,
  ) {}
  async onModuleInit() {
    try {
      await this.updateAssets();
    } catch (error) {
      console.log(error);
    }
  }

  async getCurrentCatalogPage() {
    const metadata = await this.metadata.getMetadata();

    const cursor = metadata.current_cursor || '';
    const { data } = await firstValueFrom(
      this.httpService.get(this.base_catalog_url + `&cursor=${cursor}`).pipe(
        catchError((err) => {
          throw err;
        }),
      ),
    );

    if (data.nextPageCursor) {
      const newCursor = data.nextPageCursor;

      this.firebase
        .getFirestore()
        .doc('metadata/main')
        .update({ current_cursor: newCursor });
    }

    return data;
  }

  async getAssets(): Promise<Asset[]> {
    const snapshot = await this.firebase
      .getFirestore()
      .collection('assets')
      .get();

    return (
      (snapshot.docs.map((doc) => ({
        id: doc.id as unknown as number,
        ...doc.data(),
      })) as Asset[]) || []
    );
  }

  async getBundles(): Promise<Bundle[]> {
    const snapshot = await this.firebase
      .getFirestore()
      .collection('bundles')
      .get();
    return (
      (snapshot.docs.map((doc) => ({
        id: doc.id as unknown as number,
        ...doc.data(),
      })) as Bundle[]) || []
    );
  }

  @Cron('0 0 * * *')
  async scheduledAssetUpdate() {
    console.log('updating');
    await this.updateAssets();
  }

  async updateAssets() {
    const newAssets: CatalogEntry[] = await this.getCurrentCatalogPage().then(
      (v) => v.data,
    );

    const bundles = newAssets.filter((v) => 'bundleType' in v);
    const assets = newAssets.filter((v) => 'assetType' in v);

    bundles.forEach(async (bundle) => {
      const docRef = this.firebase
        .getFirestore()
        .collection('bundles')
        .doc(bundle.id.toString());

      const docSnap = await docRef.get();

      if (docSnap.exists) {
        console.log('Bundle already exists:', bundle.id);
      } else {
        console.log('Bundle does not exist, create it now');
        await docRef.set(bundle);
      }
    });

    assets.forEach(async (asset) => {
      const docRef = this.firebase
        .getFirestore()
        .collection('assets')
        .doc(asset.id.toString());

      const docSnap = await docRef.get();

      if (docSnap.exists) {
        console.log('asset already exists:', asset.id);
      } else {
        console.log('asset does not exist, create it now');
        await docRef.set(asset);
      }
    });
  }
}
