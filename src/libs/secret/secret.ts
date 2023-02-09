/**
 * class to encode / decode
 */
import cloneDeep from 'lodash.clonedeep';
import sha256 from 'crypto-js/sha256';
import {
  KEYUTIL,
  KJUR,
  RSAKey,
} from 'jsrsasign';
import {
  isString,
  splitStringByByteLength,
} from '../base-type-utils';
import RSAString from './rsa';
import {
  IDecodeResult,
  IRSADecodeOptions,
  IRSAEncodeOptions,
  ISecretCache,
  ISecretDecodeOptions,
  ISecretEncodeOptions,
  SecretType,
} from './secret.interface';

const secretEncodeOptions = {
  type: SecretType.Base64,
};

const secretDecodeOptions = {
  type: SecretType.Base64,
};

const ALG_NAME = 'RSAOAEP';

function encode(payload: string, options?: Partial<ISecretEncodeOptions>): string;
function encode(payload: object, options?: Partial<ISecretEncodeOptions>): string;
function encode(payload: string | object, options?: Partial<ISecretEncodeOptions>) {
  const realOptions = Object.assign(cloneDeep(secretEncodeOptions), options) as ISecretEncodeOptions;
  const { type } = realOptions;
  let encodedStr;
  switch (type) {
    case SecretType.SHA256:
      encodedStr = Secret.encodeBySHA256(payload);
      break;
    case SecretType.RSA:
      const realPayload = (isString(payload) ? payload : JSON.stringify(payload)) as string;
      encodedStr = Secret.encodeByRSA(realPayload, options);
      break;
    default:
      encodedStr = Secret.encodeByBase64(payload);
  }
  return encodedStr;
}

// fix: When we are in development environmental, if some server-side api refer this file
// and developer visit it, it will cause the rsa key refresh. Eventually, encode/decode fail
// at the first time.
let RSAPublicKey: string;
let RSAPrivateKey: string;
// if (process.env.NODE_ENV === 'production') {
  const keyPair = KEYUTIL.generateKeypair('RSA', 1024);
  RSAPublicKey = KEYUTIL.getPEM(keyPair.pubKeyObj);
  RSAPrivateKey = KEYUTIL.getPEM(keyPair.prvKeyObj, 'PKCS8PRV');
// } else {
//   RSAPublicKey = RSAString.public;
//   RSAPrivateKey = RSAString.private;
// }

class Secret {
  static RSAPublicKey: string = RSAPublicKey;

  static RSAPrivateKey: string = RSAPrivateKey;

  static RSASplitString: string = '.';

  static encode = encode;

  static decode<T>(str: string, options?: Partial<ISecretDecodeOptions>): IDecodeResult<T> | IDecodeResult<string> {
    const realOptions = Object.assign(cloneDeep(secretDecodeOptions), options) as ISecretDecodeOptions;
    const { type } = realOptions;
    let decodeResult;
    switch (type) {
      case SecretType.RSA:
        decodeResult = this.decodeByRSA(str);
        break;
      default:
        decodeResult = this.decodeByBase64<T>(str);
    }
    return decodeResult;
  }

  static encodeByBase64(payload: string | object): string {
    const cache: ISecretCache<string | object> = {
      payload,
    };
    // 1. to string
    // 2. transform chinese
    // 3. to base64
    return btoa(encodeURI(JSON.stringify(cache)));
  }

  static decodeByBase64<T>(str: string): IDecodeResult<T> {
    const decodeResult: IDecodeResult<T> = {
      success: false,
    };
    try {
      const cache: unknown = JSON.parse(decodeURI(atob(str)));
      decodeResult.payload = (cache as ISecretCache<T>).payload;
      decodeResult.success = true;
    } catch (error) {
      // Do not need to do anything.
    }
    return decodeResult;
  }

  static encodeBySHA256(payload: string | object): string {
    const cache: ISecretCache<string | object> = {
      payload: payload,
    };
    return sha256(JSON.stringify(cache))
      .toString();
  }

  static encodeByRSA(payload: string, options: IRSAEncodeOptions = {}): string {
    const { key } = options;
    const RSAPublicKey = KEYUTIL.getKey(key ?? this.RSAPublicKey) as RSAKey;
    return (splitStringByByteLength(payload, 117)
      .map(str => KJUR.crypto.Cipher.encrypt(str, RSAPublicKey, ALG_NAME))
      .join(this.RSASplitString));
  }

  static decodeByRSA(str: string, options: IRSADecodeOptions = {}): IDecodeResult<string> {
    const decodeResult: IDecodeResult<string> = {
      success: false,
    };
    const { key } = options;
    const RSAPrivateKey = KEYUTIL.getKey(key ?? this.RSAPrivateKey) as RSAKey;
    try {
      decodeResult.payload = (str
        .split(this.RSASplitString)
        .map(secretString => {
          return KJUR.crypto.Cipher.decrypt(secretString, RSAPrivateKey, ALG_NAME);
        })
        .join());
      decodeResult.success = true;
    } catch (error) {
      throw(error);
      // Do not need to do anything.
    }
    return decodeResult;
  }
}

export default Secret;
