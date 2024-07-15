import { ValidateNested } from 'class-validator';
import TourDTO from './ToursDTO';
import DatesDTO from './DatesDTO';

class InfoDTO {
  @ValidateNested({ each: true })
  tour!: TourDTO;

  @ValidateNested({ each: true })
  dates!: DatesDTO[];
}

export default InfoDTO;
