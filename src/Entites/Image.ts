import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, IsOptional, Matches } from 'class-validator';
import Tours from './Tours';

@Entity()
class Images {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  @IsNotEmpty()
  @Matches(/\.(jpg|jpeg|png|gif)$/i, { message: 'Image Cover must be an image string' })
  imageCover!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  @IsOptional()
  @Matches(/\.(jpg|jpeg|png|gif)$/i, { message: 'Images must be an image string' })
  images!: string | null;

  @CreateDateColumn({
    type: 'timestamp',
    update: false,
  })
  created_at!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at!: Date;

  @ManyToOne(() => Tours, (tour: Tours) => tour.Images, { onDelete: 'CASCADE' })
  tour!: Tours;
}

export default Images;
