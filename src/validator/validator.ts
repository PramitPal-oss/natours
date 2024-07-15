import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import * as validator from 'validator';
import moment from 'moment';
import Tours from '../Entites/Tours';

export const RegexValidation = (
  Regx: RegExp,
  value: number | string | any,
  { message }: { message: string }
) => {
  if (value && !Regx.test(value)) {
    console.log('testss', value);
    throw new Error(message);
  }
};

export const RangeValidtion = (
  value: number | string | any,
  { message, min, max }: { message: string; min: number; max: number }
) => {
  if (value && !(value > min && value < max)) {
    throw new Error(message);
  }
};

@ValidatorConstraint({ name: 'isPriceDiscountValid', async: false })
export class IsPriceDiscountValidConstraint implements ValidatorConstraintInterface {
  validate(priceDiscount: number, args: ValidationArguments) {
    const { object } = args;
    console.log('testd', priceDiscount);
    return priceDiscount < (object as Tours).price;
  }

  defaultMessage(args: ValidationArguments) {
    return `Price discount must be less than the price`;
  }
}

export function IsPriceDiscountValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsPriceDiscountValidConstraint,
      async: false,
    });
  };
}

@ValidatorConstraint({ name: 'numberValidator', async: false })
export class NumberValidator implements ValidatorConstraintInterface {
  validate(value: string, validationArguments?: ValidationArguments): boolean {
    return /^\d+(\.\d+)?$/.test(value);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.value} must contains only positive numbers`;
  }
}

@ValidatorConstraint({ name: 'checkIsImage', async: false })
export class ImageValidator implements ValidatorConstraintInterface {
  validate(value: string[], validationArguments?: ValidationArguments | undefined): boolean {
    return value.every(
      (el) =>
        /\.(jpg|jpeg|png|gif)$/i.test(el) ||
        validator.isURL(el, { protocols: ['http', 'https'], require_protocol: true })
    );
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.value}  must contains image only`;
  }
}

@ValidatorConstraint({ name: 'checkIsDate', async: false })
export class DateValidator implements ValidatorConstraintInterface {
  validate(value: string[], validationArguments?: ValidationArguments | undefined): boolean {
    return moment(value, 'YYYY-MM-DD', true).isValid();
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.value}  must contains date format YYYY-MM-DD`;
  }
}

export type DifficultyType = 'easy' | 'medium' | 'difficult';
