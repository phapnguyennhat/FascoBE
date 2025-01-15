import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  validate(value: any[]) {
    if (!Array.isArray(value)) {
      return false;
    }
    const uniqueValues = new Set(value);
    return uniqueValues.size === value.length;
  }

  defaultMessage() {
    return 'All elements in the array must be unique';
  }
}

export function IsSet(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueConstraint,
    });
  };
}
