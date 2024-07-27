import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

class DatesDTO {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  @IsDateString()
  startDate!: Date;
}
export default DatesDTO;
