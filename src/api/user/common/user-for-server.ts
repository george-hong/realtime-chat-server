import jwt from 'jsonwebtoken';
import User from './user';
import {
  ISignInQueryResult,
  IUserBaseInfo,
} from '../../../types/request-response/user.interface';
import PROJECT_CONFIG, { AVATARS_DIR } from '../../../../config/project';
import { ExtendedRequest, ExtendedResponse } from '../../../types/request.interface';
import { ServiceError } from '../../../types/base.interface';

class UserForServer extends User {
  static generateUserInfoBySignInResult(accountInfo: ISignInQueryResult): IUserBaseInfo {
    const { id, privateKey, nickName, avatar } = accountInfo;
    const token = jwt.sign({ id }, privateKey, { expiresIn: User.TOKEN_EXPIRE_TIME + User.TOKEN_EXPIRE_UNIT });
    const avatarResult = avatar ? `${ PROJECT_CONFIG.CLIENT_BASE_URL }${ AVATARS_DIR }/${ avatar }` : '';
    return {
      token,
      nickName,
      avatar: avatarResult,
      id: accountInfo.id,
    };
  }

  static warningIfNotLogin(req: ExtendedRequest, res: ExtendedResponse): boolean {
    let hasError = true;
    if (req && req.userFromToken && req.userFromToken.id !== undefined) hasError = false;
    else res.throw(ServiceError.pleaseSignInFirst);
    return hasError;
  }
}

export default UserForServer;
