// StartDateDTO.ts
import { IsNotEmpty, Validate } from 'class-validator';
import { DateValidator } from '../validator/validator';

class DatesDTO {
  @IsNotEmpty()
  @Validate(DateValidator)
  //@IsDate({ message: 'Invalid date format. Date should be in the format "YYYY-MM-DD"' })
  startDate!: string;
}
export default DatesDTO;
