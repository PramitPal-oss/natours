import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';
import Tours from '../Entites/Tours';

@ValidatorConstraint({ name: 'isPriceDiscountValid', async: false })
export class IsPriceDiscountValidConstraint implements ValidatorConstraintInterface {
  validate(priceDiscount: number, args: ValidationArguments): boolean {
    const { object }: { object: object } = args;
    console.log('testd', priceDiscount);
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
