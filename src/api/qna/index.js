import Router from 'koa-router';
import { uploadQnA } from './qna.controller';

const qna = new Router();

qna.post('/question', uploadQnA);

export default qna;