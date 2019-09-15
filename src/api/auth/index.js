import Router from 'koa-router';
import { Register, Login, CheckUserValidate, CheckUser, UpdateGeneral, ConfirmEmail, SendChangePW } from './auth.controller';

const auth = new Router();

auth.get('/checkValidation', CheckUserValidate);
auth.get('/checkUser', CheckUser);
auth.get('/confirmEmail', ConfirmEmail);

auth.post('/register', Register);
auth.post('/login', Login);
auth.post('/checkId', SendChangePW);

auth.patch('/updateGeneral', UpdateGeneral);

export default auth;