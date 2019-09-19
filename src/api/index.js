import Router from 'koa-router';

import auth from './auth';
import application from './application';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/application', application.routes());

export default api;