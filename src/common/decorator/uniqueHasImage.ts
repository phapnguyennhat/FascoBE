import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class UniqueHasImageConstraint implements ValidatorConstraintInterface {
  validate(value: any[]) {
    if (!Array.isArray(value)) return false;
    // Kiểm tra số phần tử có hasImage = true
    const count = value.filter((item) => item.hasImage === true).length;
    return count === 1;
  }

  defaultMessage() {
    return 'There must be exactly one item with hasImage set to true';
  }
}

export function UniqueHasImage(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueHasImageConstraint,
    });
  };
}
