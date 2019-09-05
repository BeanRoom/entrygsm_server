import Router from 'koa-router';
import { Register, Login, CheckUserValidate } from './auth.controller';

const auth = new Router();

auth.post('/register', Register);
auth.post('/login', Login);
auth.post('/checkValidation', CheckUserValidate);

export default auth;