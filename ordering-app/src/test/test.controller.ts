import { Controller, Post } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { ProjectsService } from '../projects/projects.service';

@Controller('test')
export class TestController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Post('demo')
  async demo() {
    const results: Record<string, any> = {};

    // Step 1: Seed
    results.seed = await this.productsService.seed();

    // Step 2: Browse all products
    results.all_products = await this.productsService.findAll({});

    // Step 3: Filter by category
    results.filter_by_category = await this.productsService.findAll({ category: 'Fruits' });

    // Step 4: Filter by certification
    results.filter_by_cert = await this.productsService.findAll({ cert: 'USDA Organic' });

    // Step 5: Text search
    results.search_smoothie = await this.productsService.findAll({ q: 'smoothie' });

    // Step 6: Create a project
    const project = await this.projectsService.create({
      name: 'Q3 Sample Request',
      requester_name: 'Jane Doe',
      requester_email: 'jane@acme.com',
    });
    results.created_project = project;

    // Step 7: Add items
    results.add_item_1 = await this.projectsService.addItem(project.id, 'HV-STR-80P');
    results.add_item_2 = await this.projectsService.addItem(project.id, 'HV-WBB-WH');
    results.add_item_3 = await this.projectsService.addItem(project.id, 'TV-DRG-WH');

    // Step 8: Get project with items
    results.project_before_submit = await this.projectsService.findOne(project.id);

    // Step 9: Submit project
    results.submitted_project = await this.projectsService.submit(project.id);

    return results;
  }
}