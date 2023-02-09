import express from 'express';
import checkExistence from './check-existence';
import getPublicKey from './get-public-key';
import signIn from './sign-in';
import signUp from './sign-up';

const userRouter = express.Router();

userRouter.get('/check-existence', checkExistence);
userRouter.get('/get-public-key', getPublicKey);
userRouter.post('/sign-in', signIn);
userRouter.post('/sign-up', signUp);


export default userRouter;
