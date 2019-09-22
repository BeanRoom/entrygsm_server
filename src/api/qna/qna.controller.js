import Joi from 'joi';
import { user, question, answer } from 'models';
import { sendPleaseAnswer, sendAnswered } from 'lib/sendEmail.js';
import { decodeToken } from 'lib/token.js';

import dotenv from 'dotenv';
dotenv.config();

// QnA 업로드하기
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

// QnA 답변하기
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
        return;
    }

    // 관리자 접속 여부를 확인해야 함. ( 임시로 admin_id를 0으로 설정 )

    ctx.request.body.admin_id = 1;

    await answer.create(ctx.request.body);

    await founded.update({
        "is_answered" : true
    });

    const asker = await user.findOne({
        where : {
            "user_id" : founded.user_id
        }
    });

    sendAnswered(asker.email);

    ctx.status = 200;
    ctx.body = {
        "admin_id" : 1
    }
}

// 전체 질문에 대한 리스트
export const QnaList = async (ctx) => {
    const list = await question.findAll();

    const body = [];
    for(var i in list){
        let json = {
            "question_id" : list[i].question_id,
            "kind" : list[i].kind,
            "title" : list[i].title,
            "content" : list[i].content,
            "created_at" : list[i].created_at
        };

        if(list[i].is_answered){
            const a = await answer.findOne({
                where : {
                    question_id : list[i].question_id
                }
            });

            json.answer = {
                "answer_id" : a.answer_id,
                "admin_id" : a.admin_id,
                "content" : a.content,
                "created_at" : a.created_at
            };
        }

        body.push(json);
    }

    ctx.status = 200;
    ctx.body = {
        list : body
    };
}