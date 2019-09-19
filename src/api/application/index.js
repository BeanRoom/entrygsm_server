import Router from 'koa-router';
import { SearchSchoolList, ApplicantInfo, ProtectorInfo, TeacherInfo } from './application.controller';

const application = new Router();

application.get('/searchSchoolList', SearchSchoolList);
application.post('/insert/applicant', ApplicantInfo);

export default application;