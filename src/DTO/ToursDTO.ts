import { IsOptional, IsInt, IsNotEmpty, IsNumber, IsPositive, Matches, Max, MaxLength, Min, MinLength, IsIn } from 'class-validator';

import { IsPriceDiscountValid } from '../validator/validator';
import { DifficultyType } from '../interface/ToursInterface';

class TourDTO {
  @MinLength(5)
  @MaxLength(40)
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9\s]+$/, { message: 'name contains only letters and number' })
  name!: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(5, { message: 'Must be maximum 5' })
  @IsNotEmpty()
  rating!: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price!: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  duration!: number;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  maxGroupSize!: number;

  @IsNotEmpty()
  @IsIn(['easy', 'medium', 'difficult'])
  difficulty!: DifficultyType;

  @IsPositive()
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  ratingsAverage!: number | null;

  @IsPositive()
  @IsNumber()
  @IsOptional()
  ratingsQuantity!: number | null;

  @IsPriceDiscountValid()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  priceDiscount!: number;

  @MinLength(15)
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9\s]+$/, { message: 'Summary contains only number and letters' })
  summary!: string;

  @MinLength(20)
  @IsOptional()
  // @Matches(/^[A-Za-z0-9\s]+$/, { message: 'Description contains only letters and number' })
  description!: string | null;
}

export default TourDTO;
