import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { ProductsModule } from '../products/products.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [ProductsModule, ProjectsModule],
  controllers: [TestController],
})
export class TestModule {}