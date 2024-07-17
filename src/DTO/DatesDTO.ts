import { IsDateString, IsNotEmpty } from 'class-validator';

class DatesDTO {
  @IsNotEmpty()
  @IsDateString()
  startDate!: Date;
}
export default DatesDTO;
