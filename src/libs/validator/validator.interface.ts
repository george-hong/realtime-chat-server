export interface IConfigOfValidator {
  isRequired?: boolean,
  max?: number;
  min?: number;
  maxLength?: number;
  minLength?: number;
}

export interface IConfigOfValidatorObject {
  [key: string]: IConfigOfValidator;
}
