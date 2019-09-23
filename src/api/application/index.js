import Router from 'koa-router';
import { SearchSchoolList, ApplicationInfo , DeleteApplication, ApplicationLoad } from './application.controller';

const application = new Router();

application.get('/searchSchoolList', SearchSchoolList);
application.get('/application', ApplicationLoad);

application.post('/application', ApplicationInfo);

application.delete('/application', DeleteApplication);

export default application;