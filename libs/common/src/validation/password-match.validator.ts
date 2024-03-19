import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'passwordMatch', async: false })
export class matchPassword implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    return password === (args.object as any)[args.constraints[0]];
  }

  defaultMessage(args: ValidationArguments) {
    return 'Passwords do not match!';
  }
}
