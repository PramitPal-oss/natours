import { Entity } from 'typeorm';
import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';
import { IsMatch } from '../validator/validator';

@Entity()
class UserDTO {
  @MaxLength(50, { groups: ['create'] })
  @IsNotEmpty({ groups: ['create'] })
  @Matches(/^[A-Za-z0-9\s]+$/, { message: 'FIRST_NAME contains only letters and number', groups: ['create'] })
  FIRST_NAME!: string;

  @MaxLength(50)
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9\s]+$/, { message: 'LAST_NAME contains only letters and number', groups: ['create'] })
  LAST_NAME!: string;

  @IsNotEmpty({ groups: ['create', 'login'] })
  @IsEmail()
  EMAIL!: string;

  @MinLength(8, { groups: ['create', 'login'] })
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contains  number , special chracter, letter, one capitalLetter and must be more than or equal to 8 character',
    groups: ['create', 'login'],
  })
  PASSWORD!: string;

  @MinLength(8, { groups: ['create'] })
  @IsNotEmpty({ groups: ['create'] })
  @IsMatch({ groups: ['create'] })
  CONFIRM_PASSWORD!: string;

  @MinLength(5, { groups: ['create'] })
  @MaxLength(40, { groups: ['create'] })
  @IsNotEmpty({ groups: ['create'] })
  @Matches(/^[A-Za-z0-9\s]+$/, { message: 'ADDRESS contains only letters and number', groups: ['create'] })
  ADDRESS!: string;
}

export default UserDTO;
