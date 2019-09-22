import Router from 'koa-router';
import { uploadQnA, answerQnA, QnaList} from './qna.controller';

const qna = new Router();

qna.get('/question', QnaList);

qna.post('/question', uploadQnA);
qna.post('/answer', answerQnA);

export default qna;