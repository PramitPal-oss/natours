import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsNumber, IsPositive, IsInt, MinLength, MaxLength, Matches, Min, Max, IsArray, IsNotEmpty, IsDateString, Validate } from 'class-validator';
import { DifficultyType, ImageValidator, IsPriceDiscountValid } from '../validator/validator';
import Dates from './Date';

@Entity()
class Tours {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  @MinLength(5)
  @MaxLength(40)
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9\s]+$/, { message: 'name contains only letters and number' })
  name!: string;

  @Column('decimal', {
    precision: 2,
    scale: 1,
    nullable: false,
    default: 4.5,
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating!: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price!: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  duration!: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  maxGroupSize!: number;

  @Column({
    type: 'enum',
    enum: ['easy', 'medium', 'difficult'],
    nullable: false,
  })
  @IsNotEmpty()
  difficulty!: DifficultyType;

  @Column({
    type: 'decimal',
    precision: 2,
    scale: 1,
    default: 4,
    nullable: true,
  })
  @IsPositive()
  @IsNumber()
  @Min(1)
  @Max(5)
  ratingsAverage!: number | null;

  @Column({
    type: 'int',
    nullable: true,
    default: 1,
  })
  @IsPositive()
  @IsNumber()
  ratingsQuantity!: number | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  @IsPriceDiscountValid()
  @IsNumber()
  @IsPositive()
  priceDiscount!: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  @MinLength(15)
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9\s]+$/, { message: 'Summary contains only number and letters' })
  summary!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  @MinLength(20)
  @Matches(/^[A-Za-z0-9\s]+$/, { message: 'Description contains only letters and number' })
  description!: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  @IsNotEmpty()
  @Matches(/\.(jpg|jpeg|png|gif)$/i, { message: 'Image Cover must be an image string' })
  imageCover!: string;

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  @Validate(ImageValidator)
  @IsArray()
  images!: string[] | null;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @IsDateString()
  created_at!: Date;

  @OneToMany(() => Dates, (date: Dates) => date.tour, { cascade: true })
  Dates!: Dates[];
}
export default Tours;
