import { IResponseBase } from './base.interface';

export enum ExistenceCheckType {
  account = 'account', nickName = 'nickName',
}

export interface IExistenceVerificationParams {
  field: ExistenceCheckType;
  value: string;
}

export interface ISignUpParams {
  account: string;
  password: string;
  nickName: string;
}

export interface ISignInResponse extends IResponseBase {
  data: IUserBaseInfo;
}

export interface ISignInParams {
  account: string;
  password: string;
}

export interface ISignInQueryResult {
  id: number;
  password: string;
  privateKey: string;
  nickName: string;
  avatar?: string;
}

export interface IUserBaseInfo {
  id: number;
  nickName: string;
  token: string;
  avatar?: string;
}

export interface IEditArticleResponse extends IResponseBase {
  data: {
    id: number;
  };
}

export interface IGetPublicKeyResponse extends IResponseBase {
  data: {
    content: string;
  };
}

export interface ISignUpResponse extends IResponseBase {
  data: {
    existence: boolean;
  }
}
