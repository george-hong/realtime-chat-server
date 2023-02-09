export interface IUniformObject<T> {
  [key: string]: T;
}

export const enum ErrorEnum {
  formValidation = 1,
}

export interface ISystemError {
  [key: string | number]: unknown;
  type: ErrorEnum,
}

export const enum ServiceError {
  missingParameter = 'missing parameter',
  parameterError = 'parameter error',
  accountExist = 'account exist',
  nickNameExist = 'nick name exist',
  pleaseSignInFirst = 'please sign in first',
  articleTitleExist = 'article title exist',
  articleNotExist = 'article not exist',
  noAuthenticPleaseCheckBelong = 'no authentic, please check belong'
}

export interface ITokenParseResult {
  id: number;
}

export interface ITokenQueryInfo {
  privateKey: string;
}

