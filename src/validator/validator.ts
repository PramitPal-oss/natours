import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';
import Tours from '../Entites/Tours';
import UserDTO from '../DTO/UserDTO';

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
