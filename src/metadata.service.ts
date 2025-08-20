import { Injectable } from '@nestjs/common';
import { FirebaseProvider } from './firebase.provider';

interface Metadata {
  current_cursor: string;
  last_time: number;
}

@Injectable()
export class MetadataService {
  constructor(private firebase: FirebaseProvider) {}

  async getMetadata(): Promise<Metadata> {
    const snapshot = await this.firebase.getFirestore().doc('metadata/main');
    return (await snapshot.get()).data() as Promise<Metadata>;
  }
}
