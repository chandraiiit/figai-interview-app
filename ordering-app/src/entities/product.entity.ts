import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryColumn()
  item_id: string;

  @Column()
  listing: string;

  @Column()
  category: string;

  @Column()
  supplier: string;

  @Column('jsonb')
  details: Record<string, any>;

  @Column('text', { array: true })
  certifications: string[];

  @Column()
  sourcing: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  price_per_kg: number;

  @Column('int', { nullable: true })
  moq_kg: number;

  @Column()
  in_stock: boolean;

  @Column({ nullable: true })
  technical: string;

  @Column({ nullable: true })
  suggested_use: string;

  @Column({ nullable: true })
  notes: string;
}