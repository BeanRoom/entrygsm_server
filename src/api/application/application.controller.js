import Joi from 'joi';

import dotenv from 'dotenv';
dotenv.config();

export const SearchSchoolList = async (ctx) => {

    const Request = Joi.object().keys({
        gubun : Joi.number().max(2).required(),
        searchSchulNm : Joi.string().required()
    });

    // 넘어온 body의 형식을 검사한다.
    const Result = Joi.validate(ctx.request.body, Request);

    // 만약 형식이 불일치한다면, 그 이후 문장도 실행하지 않는다.
    if(Result.error) {
        console.log(`Login - Joi 형식 에러`);
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        }
        return;
    }

    let gubun;
    if(ctx.request.body.gubun == 1){
        gubun = "elem_list"
    }else{
        gubun = "mid_list"
    }

    const url = 'www.career.go.kr/cnet/openapi/getOpenApi?apiKey='+careernet_key+'&svcType=api&svcCode=SCHOOL&contentType=json&gubun='+gubun+'&searchSchulNm'+ctx.request.body.searchSchulNm;

    
}