import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseProvider {
  private app: admin.app.App;

  constructor(private config: ConfigService) {
    const serviceAccount = {
      type: this.config.get<string>('TYPE'),
      project_id: this.config.get<string>('PROJECT_ID'),
      private_key_id: this.config.get<string>('PRIVATE_KEY_ID'),
      private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: this.config.get<string>('CLIENT_EMAIL'),
      client_id: this.config.get<string>('CLIENT_ID'),
      auth_uri: this.config.get<string>('AUTH_URI'),
      token_uri: this.config.get<string>('TOKEN_URI'),
      auth_provider_x509_cert_url: this.config.get<string>(
        'AUTH_PROVIDER_X509_CERT_URL',
      ),
      client_x509_cert_url: this.config.get<string>('CLIENT_X509_CERT_URL'),
      universe_domain: this.config.get<string>('UNIVERSE_DOMAIN'),
    };
    this.app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }

  getFirestore() {
    return this.app.firestore();
  }
}
