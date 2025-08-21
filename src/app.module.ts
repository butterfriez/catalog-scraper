import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { MetadataService } from './metadata.service';
import { CatalogService } from './catalog.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseProvider } from './firebase.provider';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  controllers: [CatalogController],
  providers: [MetadataService, CatalogService, FirebaseProvider],
})
export class AppModule {}
