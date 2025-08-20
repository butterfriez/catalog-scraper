import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { MetadataService } from './metadata.service';
import { CatalogService } from './catalog.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseProvider } from './firebase.provider';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [CatalogController],
  providers: [MetadataService, CatalogService, FirebaseProvider],
})
export class AppModule {}
