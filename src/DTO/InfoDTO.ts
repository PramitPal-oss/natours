import { ArrayMinSize, IsArray, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import TourDTO from './ToursDTO';
import DatesDTO from './DatesDTO';
import ImageDTO from './ImageDTO';

class InfoDTO {
  @ValidateNested({ each: true })
  @Type(() => TourDTO)
  @IsObject()
  tour!: TourDTO;

  @IsArray()
  @ArrayMinSize(1, { message: 'Dates array should have at least one date' })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => DatesDTO)
  dates!: DatesDTO[];

  @IsArray()
  @ArrayMinSize(1, { message: 'Dates array should have at least one date' })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => ImageDTO)
  images!: ImageDTO[];
}

export default InfoDTO;
