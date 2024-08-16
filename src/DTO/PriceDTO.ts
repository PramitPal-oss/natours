import { IsNumberString, IsOptional } from 'class-validator';

class PriceDto {
  @IsNumberString()
  @IsOptional()
  more!: string;

  @IsNumberString()
  @IsOptional()
  less!: string;
}

export default PriceDto;
