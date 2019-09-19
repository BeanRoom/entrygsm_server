import Router from 'koa-router';
import { uploadQnA, answerQnA} from './qna.controller';

const qna = new Router();

qna.post('/question', uploadQnA);
qna.post('/answer', answerQnA);

export default qna;