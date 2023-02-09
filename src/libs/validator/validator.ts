import type { IConfigOfValidator, IConfigOfValidatorObject } from './validator.interface';
import type { IUniformObject } from '../../types/base.interface';
import { ServiceError } from '../../types/base.interface';

class Validator {
  readonly parameters: IUniformObject<string | string[] | undefined>;

  constructor(parameters: IUniformObject<string | string[] | undefined>) {
    this.parameters = parameters;
  }

  public validate(config: IConfigOfValidatorObject): string | undefined {
    let message;
    try {
      Object.entries(config).forEach((fieldAndConfig: [string, IConfigOfValidator]) => {
        const [field, config] = fieldAndConfig;
        let value = this.parameters[field];
        if (Array.isArray(value)) value = value.join();
        const {
          isRequired,
          max,
          min,
          maxLength,
          minLength,
        } = config;
        if (isRequired && value === undefined) throw(`${ServiceError.missingParameter} '${field}'`);
        if (!value) return;
        // If parameter is not required, do not check any more.
        const length = value.length;
        if (max !== undefined && Number(value) > max) throw(`'${field}' should less than or equal ${max}`);
        if (min !== undefined && Number(value) < min) throw(`'${field}' should great than or equal ${min}`);
        if (maxLength !== undefined && length > maxLength) throw(`'${field}' should short than or equal ${maxLength} charts`);
        if (minLength !== undefined && length < minLength) throw(`'${field}' should long than or equal ${minLength} charts`);
      });
    } catch (error) {
      message = error as string;
    }
    return message;
  }
}

export default Validator;
