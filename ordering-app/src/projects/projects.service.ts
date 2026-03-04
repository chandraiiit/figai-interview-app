import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { ProjectItem } from 'src/entities/project-item.entity';
import { Project, ProjectStatus } from 'src/entities/project.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectItem)
    private readonly projectItemRepo: Repository<ProjectItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(dto: { name: string; requester_name: string; requester_email: string }): Promise<Project> {
    const project = this.projectRepo.create(dto);
    return this.projectRepo.save(project);
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  async addItem(projectId: string, productId: string): Promise<ProjectItem> {
    const project = await this.projectRepo.findOneBy({ id: projectId });
    if (!project) throw new NotFoundException(`Project ${projectId} not found`);
    if (project.status === ProjectStatus.SUBMITTED)
      throw new BadRequestException('Cannot modify a submitted project');

    const product = await this.productRepo.findOneBy({ item_id: productId });
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    const existing = await this.projectItemRepo.findOne({
      where: { project: { id: projectId }, product: { item_id: productId } },
    });
    if (existing) throw new BadRequestException('Product already in project');

    const item = this.projectItemRepo.create({ project, product });
    return this.projectItemRepo.save(item);
  }

  async removeItem(projectId: string, productId: string): Promise<void> {
    const project = await this.projectRepo.findOneBy({ id: projectId });
    if (!project) throw new NotFoundException(`Project ${projectId} not found`);
    if (project.status === ProjectStatus.SUBMITTED)
      throw new BadRequestException('Cannot modify a submitted project');

    const item = await this.projectItemRepo.findOne({
      where: { project: { id: projectId }, product: { item_id: productId } },
    });
    if (!item) throw new NotFoundException('Item not found in project');

    await this.projectItemRepo.remove(item);
  }

  async submit(projectId: string): Promise<Project> {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['items'],
    });
    if (!project) throw new NotFoundException(`Project ${projectId} not found`);
    if (project.status === ProjectStatus.SUBMITTED)
      throw new BadRequestException('Project already submitted');
    if (project.items.length === 0)
      throw new BadRequestException('Cannot submit an empty project');

    project.status = ProjectStatus.SUBMITTED;
    return this.projectRepo.save(project);
  }
}