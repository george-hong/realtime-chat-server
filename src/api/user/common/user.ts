import { IUserClassOptions } from '../../../types/user-class.interface';
import Secret, {
  SecretType,
} from '../../../libs/secret';
import { ISignUpParams } from '../../../types/request-response/user.interface';

// This class is creating for deal user relative logical.
class User {
  static TOKEN_EXPIRE_TIME = 1;
  static TOKEN_EXPIRE_UNIT = 'h';

  readonly userOptions: IUserClassOptions;

  constructor(userOptions: IUserClassOptions) {
    this.userOptions = userOptions;
  }

  public encodeAndSetPassword(password: string, key?: string): this {
    const tempPassword = Secret.encode(password, { type: SecretType.SHA256 });
    this.userOptions.password = Secret.encode(tempPassword, {
      type: SecretType.RSA,
      key,
    });
    return this;
  }

  public generateSignUpParams(): ISignUpParams {
    const { account, password, nickName } = this.userOptions;
    return {
      account,
      password: password ?? '',
      nickName: nickName ?? '',
    };
  }

  public getDecodedPassword() {
    const decodeResult = (this.userOptions.password && Secret.decode(this.userOptions.password, { type: SecretType.RSA })) ?? null;
    return (decodeResult && decodeResult.payload) ?? '';
  }
}

export default User;
