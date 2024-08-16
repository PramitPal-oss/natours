import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';
import Tours from '../Entites/Tours';
import UserDTO from '../DTO/UserDTO';

/*Price and price discount validator */
@ValidatorConstraint({ name: 'isPriceDiscountValid', async: false })
export class IsPriceDiscountValidConstraint implements ValidatorConstraintInterface {
  validate(priceDiscount: number, args: ValidationArguments): boolean {
    const { object }: { object: object } = args;
    return priceDiscount < (object as Tours).price;
  }

  defaultMessage = (): string => {
    return `Price discount must be less than the price`;
  };
}

export function IsPriceDiscountValid(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsPriceDiscountValidConstraint,
      async: false,
    });
  };
}

/*query String sorting parameter validator */
@ValidatorConstraint({ name: 'sortQueryValidation', async: false })
export class IsSortQueryValidation implements ValidatorConstraintInterface {
  private requiredField: string[] = [];

  constructor(requiredField: string[]) {
    this.requiredField = requiredField;
  }

  validate(value: string): boolean {
    const queryArr: string[] = value?.split(',');
    let results: boolean = true;
    queryArr?.forEach((el: string) => {
      results = this.requiredField.includes(el);
    });
    return results;
  }

  defaultMessage = (validationArguments: ValidationArguments): string => {
    return `Wrong sorting Parameter ${validationArguments.value}`;
  };
}

export function sortQueryValidation(requiredField: string[], validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: new IsSortQueryValidation(requiredField),
      async: false,
    });
  };
}

/*Passowrd and Forget Passoword validator */
@ValidatorConstraint({ name: 'Match' })
export class MatchContraints implements ValidatorConstraintInterface {
  validate(value: string, validationArguments: ValidationArguments): Promise<boolean> | boolean {
    const { object }: { object: object } = validationArguments;
    return value === (object as UserDTO).PASSWORD;
  }

  defaultMessage = (validationArguments: ValidationArguments): string => {
    return `${validationArguments.property} must match with PASSWORD`;
  };
}

export function IsMatch(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: MatchContraints,
      async: false,
    });
  };
}
