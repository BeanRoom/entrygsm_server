import Joi from 'joi';
import { question, answer } from 'models';
import { sendPleaseAnswer } from 'lib/sendEmail.js';
import { decodeToken } from 'lib/token.js';

import dotenv from 'dotenv';
dotenv.config();

export const uploadQnA = async (ctx) => {

    const Request = Joi.object().keys({
        kind : Joi.number().min(1).max(5).integer().required(),
        title : Joi.string().max(255).required(),
        content : Joi.string().max(65535).required()
    });

    const result = Joi.validate(ctx.request.body, Request );

    if(result.error) {
        console.log("uploadQnA - Joi 형식 에러")
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        }
        return;
    }

    const decoded = await decodeToken(ctx.header.token);

    ctx.request.body.user_id = decoded.user_id;

    await question.create(ctx.request.body);

    sendPleaseAnswer(process.env.admin_email);

    ctx.status = 200;
    ctx.body = {
        "user_id" : decoded.user_id
    };
}

export const answerQnA = async (ctx) => {

    const Request = Joi.object().keys({
        question_id : Joi.number().integer().required(),
        content : Joi.string().max(65535).required()
    });

    const result = Joi.validate(ctx.request.body, Request );

    if(result.error) {
        console.log("answerQnA - Joi 형식 에러")
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        }
        return;
    }

    const founded = await question.findOne({
        where : {
            "question_id" : ctx.request.body.question_id
        }
    });

    if(founded.is_answered){
        console.log(`answerQnA - 이미 답변이 된 질문입니다.`);
        ctx.status = 400;
        ctx.body = {
            "error" : "005"
        };
    }

    ctx.request.body.admin_id = 1;

    await answer.create(ctx.request.body);

    await founded.update({
        "is_answered" : true
    });

    ctx.status = 200;
    ctx.body = {
        "admin_id" : 1
    }
}