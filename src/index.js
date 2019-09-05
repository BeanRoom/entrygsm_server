// 환경 변수 로드
require('dotenv').config();

import Koa from 'koa';
import Router from 'koa-router';
import cors from '@koa/cors';

const app = new Koa();
const router = new Router();
import api from './api';

import { sequelize } from './models';
sequelize.sync();

import bodyParser from 'koa-bodyparser';

app.use(cors());

const port = process.env.PORT || 4000;

app.use(bodyParser());
router.use('/api', api.routes());
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, ()=> {
    console.log(`Backend Server has been started : PORT : ${port}`);
});