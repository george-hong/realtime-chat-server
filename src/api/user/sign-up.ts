import DataBase from '../../libs/database';
import Validator from '../../libs/validator';
import { UserForServer } from './common';
import { ServiceError } from '../../types/base.interface';

export default (req, res, next) => {
  const { body } = req;
  const validator = new Validator(body);
  const errorMessage = validator.validate({
    account: {
      isRequired: true,
      minLength: 5,
      maxLength: 15,
    },
    nickName: {
      isRequired: true,
      minLength: 2,
      maxLength: 20,
    },
    password: {
      isRequired: true,
      minLength: 15,
    },
  });
  if (errorMessage) return res.throw(errorMessage);
  const db = new DataBase();
  db
    .query(`SELECT id FROM user WHERE account = '${ body.account }';`)
    .then((result) => {
      const existence = !!(result as Array<object>).length;
      if (existence) throw(ServiceError.accountExist);
      return db.query(`SELECT id FROM user WHERE nickName = '${ body.nickName }';`);
    })
    .then((result) => {
      const existence = !!(result as Array<object>).length;
      if (existence) throw(ServiceError.nickNameExist);
      const currentTimeStamp = Date.now();
      const realPassword = new UserForServer({
        account: body.account,
        password: body.password,
      }).getDecodedPassword();
      return db.query(`INSERT INTO user (account, password, nickName, privateKey, createTime) VALUES ('${ body.account }', '${ realPassword }', '${ body.nickName }', ${ currentTimeStamp }, ${ currentTimeStamp })`);
    })
    .then((result) => {
      res.supply({ id: (result as { insertId?: string }).insertId });
      next();
    })
    .catch(error => {
      res.throw(error);
      next();
    })
    .finally(() => db.dispose());
}
