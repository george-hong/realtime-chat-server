import { IUniformObject } from './base.interface';
import {
  Request,
  Response,
} from 'express';

export interface IResponseBase {
  status: number;
}

export interface IRequestWithLocale {
  locale?: string;
}

export interface ExtendedRequest extends Request {
  userFromToken?: {
    id: number;
  }
}

export interface IUserFromToken {
  id: number;
}

export interface ExtendedResponse extends Response {
  userFromToken?: IUserFromToken;
  supply: (response: unknown) => void;
  throw: (messageOrProps?: string | IUniformObject<string>, code?: number) => void;
}

export interface IPageBaseData<T> {
  meta: {
    title: string;
    keywords?: string;
    description?: string;
  };
  pageData?: T;
  error?: unknown;
}

export interface IPageBaseDataBeforeSend<T> {
  props: IPageBaseData<T>
}

export interface NextFunction {
  (): void;
}
