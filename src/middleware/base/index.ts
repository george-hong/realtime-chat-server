import jwt from 'jsonwebtoken';
import {
  ExtendedRequest,
  ExtendedResponse,
  NextFunction,
} from '../../types/request.interface';
import DataBase from '../../libs/database';
import {
  ITokenParseResult,
  ITokenQueryInfo,

} from '../../types/base.interface';

const DEFAULT_ERROR_CODE = 503;
const DEFAULT_ERROR_MESSAGE = 'Internal error';

class Base {
  static setRequest(req: ExtendedRequest, res: ExtendedResponse, next: NextFunction): void {
    res.supply = function (response: unknown) {
      res.status(200)
         .json({
           status: 200,
           data: response,
         });
    };
    res.throw = function (messageOrProps, code?) {
      const errorCode = code ?? DEFAULT_ERROR_CODE;
      const responseProps = !messageOrProps ? {} :
        typeof messageOrProps === 'string' ? { message: messageOrProps } : messageOrProps;
      const { message, ...otherResponse } = responseProps;
      res.status(errorCode)
         .json({
           ...otherResponse,
           message: message ?? DEFAULT_ERROR_MESSAGE,
           status: errorCode,
         });
    };
    next();
  }

  static parseUserFromToken(req: ExtendedRequest, res: ExtendedResponse, next: NextFunction): void {
    if (req.headers.token) {
      const payload = jwt.decode(req.headers.token as string);
      const db = new DataBase();
      if (payload && (payload as ITokenParseResult).id === undefined) return;
      db.query<Array<ITokenQueryInfo>>(`SELECT privateKey FROM user WHERE id = ${ (payload as ITokenParseResult).id }`)
        .then(result => {
          const resultOfVerify = jwt.verify(req.headers.token as string, result[0].privateKey) as ITokenParseResult;
          req.userFromToken = { id: resultOfVerify.id };
          next();
        })
        .catch(next);
    } else {
      next();
    }
  }

  static allowCrossOrigin(req: ExtendedRequest, res: ExtendedResponse, next: NextFunction): void {
    // allowed origins
    res.setHeader('Access-Control-Allow-Origin', '*');
    // allowed headers
    res.setHeader('Access-Control-Allow-Headers', 'content-type,token');
    // allowed methods
    res.setHeader('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');
    next();
  }

  static responseOptionsSpeedy(req: ExtendedRequest, res: ExtendedResponse, next: NextFunction): void {
    if (req?.method?.toLowerCase() === 'options') {
      res.supply({ result: 'success' });
      return next();
    }
    next();
  }
}

export default Base;
