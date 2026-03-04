import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() dto: { name: string; requester_name: string; requester_email: string }) {
    return this.projectsService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Post(':id/items')
  addItem(@Param('id') id: string, @Body() dto: { product_id: string }) {
    return this.projectsService.addItem(id, dto.product_id);
  }

  @Delete(':id/items/:productId')
  removeItem(@Param('id') id: string, @Param('productId') productId: string) {
    return this.projectsService.removeItem(id, productId);
  }

  @Post(':id/submit')
  submit(@Param('id') id: string) {
    return this.projectsService.submit(id);
  }
}