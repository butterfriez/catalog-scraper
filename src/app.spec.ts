import { ConfigService } from '@nestjs/config';
import { CatalogController } from './catalog.controller';
import { Asset, Bundle, CatalogService } from './catalog.service';
import { FirebaseProvider } from './firebase.provider';
import { MetadataService } from './metadata.service';
import { HttpService } from '@nestjs/axios';

jest.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: jest.fn().mockReturnValue({}),
  credential: { cert: jest.fn() },
  firestore: jest.fn().mockReturnValue({ collection: jest.fn() }),
}));

const TestAsset: Asset = {
  id: 0,
  itemType: '',
  assetType: 0,
  name: '',
  description: '',
  productId: 0,
  itemStatus: [],
  itemRestrictions: [],
  creatorHasVerifiedBadge: false,
  creatorType: 'User',
  creatorTargetId: 0,
  creatorName: '',
  price: 0,
  lowestPrice: 0,
  lowestResalePrice: 0,
  unitsAvailableForConsumption: 0,
  favoriteCount: 0,
  offSaleDeadline: '',
  collectibleItemId: '',
  totalQuantity: 0,
  saleLocationType: 'ShopAndAllExperiences',
  hasResellers: false,
};

const TestBundle: Bundle = {
  bundledItems: [],
  id: 0,
  itemType: 'Bundle',
  bundleType: 0,
  isRecolorable: false,
  name: '',
  description: '',
  productId: 0,
  itemStatus: [],
  itemRestrictions: [],
  creatorHasVerifiedBadge: false,
  creatorType: 'User',
  creatorTargetId: 0,
  creatorName: '',
  price: 0,
  lowestPrice: 0,
  lowestResalePrice: 0,
  unitsAvailableForConsumption: 0,
  favoriteCount: 0,
  offSaleDeadline: '',
  collectibleItemId: '',
  totalQuantity: 0,
  saleLocationType: 'ShopAndAllExperiences',
  hasResellers: false,
};

describe('CatalogService', () => {
  let configService: ConfigService;
  let firebaseProvider: FirebaseProvider;
  let metadataService: MetadataService;
  let httpService: HttpService;
  let catalogService: CatalogService;
  let catalogController: CatalogController;

  beforeEach(() => {
    configService = new ConfigService();
    firebaseProvider = new FirebaseProvider(configService);
    metadataService = new MetadataService(firebaseProvider);
    httpService = new HttpService();
    catalogService = new CatalogService(
      firebaseProvider,
      metadataService,
      httpService,
    );
    catalogController = new CatalogController(catalogService);
  });

  describe('CatalogService Methods', () => {
    it('should return an array of assets or empty array', async () => {
      jest.spyOn(catalogService, 'getAssets').mockResolvedValue([TestAsset]);
      const assets = await catalogController.getAssets();
      expect(assets).toEqual([TestAsset]);
    });

    it('should return an array of bundles or empty array', async () => {
      jest.spyOn(catalogService, 'getBundles').mockResolvedValue([TestBundle]);
      const bundles = await catalogController.getBundles();
      expect(bundles).toEqual([TestBundle]);
    });

    it('should return every asset & bundle', async () => {
      jest
        .spyOn(catalogController, 'getAll')
        .mockResolvedValue([TestAsset, TestBundle]);
      const all = await catalogController.getAll();
      expect(all).toEqual([TestAsset, TestBundle]);
    });
  });
});
