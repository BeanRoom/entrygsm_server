import Router from 'koa-router';

import auth from './auth';
import application from './application';
import qna from './qna';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/application', application.routes());
api.use('/qna', qna.routes());

export default api;