import { Controller, Get } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('/assets')
  getAssets() {
    return this.catalog.getAssets();
  }

  @Get('/bundles')
  getBundles() {
    return this.catalog.getBundles();
  }

  @Get()
  async getAll() {
    const assets = await this.catalog.getAssets();
    const bundles = await this.catalog.getBundles();

    return [...assets, ...bundles];
  }
}
