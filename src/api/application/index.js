import Router from 'koa-router';
import { SearchSchoolList, ApplicantInfo, ProtectorInfo, TeacherInfo } from './application.controller';

const application = new Router();

application.get('/searchSchoolList', SearchSchoolList);
application.post('/insert/applicant', ApplicantInfo);
application.post('/insert/protector', ProtectorInfo);
application.post('/insert/teacher', TeacherInfo);

export default application;