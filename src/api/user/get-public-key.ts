import Secret from '../../libs/secret';

export default (req, res, next) => {
  res.supply({
    content: Secret.RSAPublicKey,
  });
  next();
}
