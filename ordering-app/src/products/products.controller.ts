import { Controller, Get, Param, Query, Post, BadRequestException } from '@nestjs/common';
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

  @Get('search/llm')
searchWithLLM(@Query('q') q: string) {
  if (!q) throw new BadRequestException('Query parameter q is required');
  return this.productsService.searchWithLLM(q);
}
}