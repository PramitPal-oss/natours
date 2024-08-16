import { Type } from 'class-transformer';
import { IsIn, IsNumberString, IsOptional, IsString, ValidateNested } from 'class-validator';
import PriceDto from './PriceDTO';
import { sortQueryValidation } from '../validator/validator';
import { DifficultyType } from '../interface/ToursInterface';
import { fields, requiredField } from '../utils/helper';

class QueryDTO {
  @IsOptional()
  @IsNumberString()
  duration!: string;

  @IsString()
  @IsOptional()
  @IsIn(['easy', 'medium', 'difficult'])
  difficulty!: DifficultyType;

  @ValidateNested()
  @Type(() => PriceDto)
  @IsOptional()
  price!: PriceDto;

  @IsString()
  @IsOptional()
  @sortQueryValidation(requiredField)
  sort!: string;

  @IsString()
  @IsOptional()
  @sortQueryValidation(fields)
  fields!: string;

  @IsNumberString()
  @IsOptional()
  page!: string;

  @IsNumberString()
  @IsOptional()
  take!: string;
}

export default QueryDTO;
