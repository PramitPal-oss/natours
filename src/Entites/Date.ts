import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import Tours from './Tours';

@Entity()
class Dates {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'date',
    nullable: false,
  })
  startDate!: string;

  @CreateDateColumn({
    type: 'timestamp',
    update: false,
  })
  created_at!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at!: Date;

  @ManyToOne(() => Tours, (tour: Tours) => tour.Dates, { onDelete: 'CASCADE' })
  tour!: Tours;
}

export default Dates;
