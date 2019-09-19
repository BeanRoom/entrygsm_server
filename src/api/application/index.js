import Router from 'koa-router';
import { SearchSchoolList } from './application.controller';

const application = new Router();

application.get('/searchSchoolList', SearchSchoolList);

export default application;