import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ProjectItem } from './project-item.entity';

export enum ProjectStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  requester_name: string;

  @Column()
  requester_email: string;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.DRAFT })
  status: ProjectStatus;

  @OneToMany(() => ProjectItem, (item) => item.project, { cascade: true })
  items: ProjectItem[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}