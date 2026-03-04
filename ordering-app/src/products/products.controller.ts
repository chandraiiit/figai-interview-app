import { Controller, Get, Param, Query, Post } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('seed')
  seed() {
    return this.productsService.seed();
  }

  @Get()
  findAll(@Query() query: { category?: string; cert?: string; supplier?: string; q?: string }) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}