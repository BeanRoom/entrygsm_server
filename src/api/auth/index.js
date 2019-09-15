import Router from 'koa-router';
import { Register, Login, CheckUserValidate, UpdateGeneral } from './auth.controller';

const auth = new Router();

auth.post('/register', Register);
auth.post('/login', Login);
auth.get('/checkValidation', CheckUserValidate);
auth.patch('/updateGeneral', UpdateGeneral)

export default auth;