export enum SecretType {
  Base64 = 'Base64', SHA256 = 'SHA256', RSA = 'RSA',
}

export interface ISecretEncodeOptions {
  type?: SecretType;
  key?: string;
}

export interface ISecretDecodeOptions {
  type?: string;
}

export interface IRSAEncodeOptions {
  key?: string;
}

export interface IRSADecodeOptions {
  key?: string;
}

export interface ISecretCache<T> {
  payload: T;
}

export interface IDecodeResult<T> {
  success: boolean;
  payload?: T;
}
