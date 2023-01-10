import IValidator from '../contracts/IValidator';
import ValidationError from '../errors/ValidationError';
import Uuid from './Uuid';
import AppError from '../errors/AppError';

class Validator {
  private static readonly rules: any = {
    required: {
      name: 'isRequired',
      message: 'The :field field must be required',
    },
    string: {
      name: 'isString',
      message: 'The :field field must be a string',
    },
    number: {
      name: 'isNumber',
      message: 'The :field field must be a number',
    },
    arrayOfStrings: {
      name: 'isArrayOfStrings',
      message: 'The :field field must be a array of strings',
    },
    uuid: {
      name: 'isUuid',
      message: 'The :field field must be a uuid',
    },
  };

  public static validate(
    data: { [key: string]: string },
    rules: { [key: string]: string },
    isThrowError = true,
  ): (IValidator | null)[] {
    const errors = Object
      .keys(rules)
      .map((item) => Validator.checkEachField(item, data, rules))
      .filter((item) => item);
    const error = errors.shift() ?? null;

    if (isThrowError && error !== null) {
      throw new ValidationError(error.message);
    }

    return errors ?? [];
  }

  private static checkEachField(
    field: string,
    data: { [key: string]: string },
    rules: { [key: string]: string },
  ): IValidator | null {
    const value = data[field];
    const ruleNames: string[] = rules[field].split('|');
    const methods = ruleNames
      .map((ruleName) => Validator.rules[ruleName])
      .filter((item) => item !== undefined);
    const errors = methods
      .map((method) => Validator.checkEachFieldRule(method, value))
      .filter((item) => item);

    if (errors.length === 0) {
      return null;
    }

    const { message } = errors.shift();

    return {
      field,
      message: Validator.getMessage(message, field),
    };
  }

  private static checkEachFieldRule(method: { name: string }, value: any): any {
    const isValidationMethodNotFount = method === undefined
        || typeof (Validator as any)[method.name] !== 'function';

    if (isValidationMethodNotFount) {
      throw new AppError('Calling a non-existent validation method');
    }

    const isValid = (Validator as any)[method.name](value);

    if (isValid) {
      return null;
    }

    return method;
  }

  private static getMessage(template: string, field: string = ''): string {
    return template.replace(':field', field);
  }

  private static isUuid(value: any): boolean {
    const isNotString = !Validator.isString(value);

    if (isNotString) {
      return false;
    }

    return Uuid.validate(value);
  }

  private static isRequired(value: any): boolean {
    return value;
  }

  private static isString(value: any): boolean {
    return typeof value === 'string';
  }

  private static isNumber(value: any): boolean {
    return typeof value === 'number';
  }

  private static isArrayOfStrings(values: any): boolean {
    const isNotArray = !Array.isArray(values);

    if (isNotArray) {
      return false;
    }

    const errors = values
      .map((item) => Validator.isString(item))
      .filter((item) => item !== true);

    return errors.length === 0;
  }
}

export default Validator;
