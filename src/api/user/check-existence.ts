import DataBase from '../../libs/database';
import { ExistenceCheckType } from '../../types/request-response/user.interface';
import Validator from '../../libs/validator';
import { ServiceError } from '../../types/base.interface';

export default (req, res, next) => {
  const { query = {} } = req;
  const { field, value } = query;
  const validator = new Validator(query);
  const errorMessage = validator.validate({
    field: { isRequired: true },
    value: { isRequired: true },
  });
  if (errorMessage) return res.throw(errorMessage);
  if (!ExistenceCheckType[field as ExistenceCheckType]) res.throw(ServiceError.parameterError);
  const db = new DataBase();
  db
    .query(`SELECT id FROM user WHERE ${ field } = '${ value }';`)
    .then((result) => {
      const existence = !!(result as Array<object>).length;
      res.supply({ existence });
    })
    .catch(error => {
      res.throw(error);
    })
    .finally(() => {
      db.dispose();
      next();
    });
}
