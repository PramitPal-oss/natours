import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
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

  @ManyToOne(() => Tours, (tour: Tours) => tour.Dates, { onDelete: 'CASCADE' })
  tour!: Tours;
}

export default Dates;
