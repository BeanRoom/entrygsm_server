import Joi from 'joi';
import axios from 'axios';
import urlencode from 'urlencode';
import { decodeToken } from 'lib/token.js';
import { user, applicant, protector, teacher} from 'models';

import dotenv from 'dotenv';
dotenv.config();

// 학교 목록 검색
export const SearchSchoolList = async (ctx) => {

    const Request = Joi.object().keys({
        gubun : Joi.number().max(2).required(),
        searchText : Joi.string().required()
    });

    // 넘어온 body의 형식을 검사한다.
    const Result = Joi.validate(ctx.query, Request);

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
    if(ctx.query.gubun == 1){
        gubun = "elem_list"
    }else{
        gubun = "midd_list"
    }

    const text = urlencode(ctx.query.searchText);

    const url = `https://www.career.go.kr/cnet/openapi/getOpenApi?apiKey=${process.env.careernet_key}&svcType=api&svcCode=SCHOOL&contentType=json&gubun=${gubun}&searchSchulNm=${text}`;

    const api_result = await axios.get(url);
    const schoolList = api_result.data.dataSearch.content;

    let search_result = [];
    for(var i in schoolList){
        search_result.push({
            "school_name" : schoolList[i].schoolName,
            "address" : schoolList[i].adres,
            "seq" : schoolList[i].seq
        });
    }

    ctx.status = 200;
    ctx.body = {
        "list" : search_result
    }
}

// 지원자 정보 입력
export const ApplicantInfo = async (ctx) => {

    const Request = Joi.object().keys({
        sex : Joi.number().min(1).max(2),
        birthday : Joi.date(),
        address : Joi.string(),
        home_phone : Joi.string(),
        celluar_phone : Joi.string().length(11),
        due_date : Joi.date(),
        type : Joi.number()
    });

    const result = Joi.validate(ctx.request.body, Request);

    // 비교한 뒤 만약 에러가 발생한다면 400 에러코드를 전송하고, body에 001 이라는 내용(우리끼리의 오류 코드 약속)을 담아 joi 오류임을 알려줌
    if(result.error) {
        console.log("Register - Joi 형식 에러")
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        }
        return;
    }

    const decoded = await decodeToken(ctx.header.token);

    const saved = await applicant.findOne({
        where : {
            "user_id" : decoded.user_id
        }
    });

    if(saved == null){
        ctx.request.body.user_id = decoded.user_id

        await applicant.create(ctx.request.body);

        console.log(`ApplicationInfo - 새로운 원서가 작성되었습니다. 유저id - ${decoded.user_id}`);
        ctx.status = 200;
        ctx.body = {
            "user_id" : decoded.user_id
        }
        return;
    }

    await saved.update(ctx.request.body);

    console.log(`ApplicationInfo - 원서가 갱신되었습니다. 유저id - ${decoded.user_id}`);
    ctx.status = 200;
    ctx.body = {
        "user_id" : decoded.user_id
    };
}

// 보호자 정보 입력
export const ProtectorInfo = async (ctx) => {

    const Request = Joi.object().keys({
        name : Joi.string().min(2).max(20),
        relation : Joi.string(),
        celluar_phone : Joi.string().length(11)
    });

    const result = Joi.validate(ctx.request.body, Request);

    // 비교한 뒤 만약 에러가 발생한다면 400 에러코드를 전송하고, body에 001 이라는 내용(우리끼리의 오류 코드 약속)을 담아 joi 오류임을 알려줌
    if(result.error) {
        console.log("Register - Joi 형식 에러")
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        }
        return;
    }

    const decoded = await decodeToken(ctx.header.token);

    const saved = await protector.findOne({
        where : {
            "user_id" : decoded.user_id
        }
    });

    if(saved == null){
        ctx.request.body.user_id = decoded.user_id

        await protector.create(ctx.request.body);

        console.log(`ProtectorInfo - 새로운 원서가 작성되었습니다. 유저id - ${decoded.user_id}`);
        ctx.status = 200;
        ctx.body = {
            "user_id" : decoded.user_id
        }
        return;
    }

    await saved.update(ctx.request.body);

    console.log(`ProtectorInfo - 원서가 갱신되었습니다. 유저id - ${decoded.user_id}`);
    ctx.status = 200;
    ctx.body = {
        "user_id" : decoded.user_id
    };
}

// 담임 선생님 정보 입력
export const TeacherInfo = async (ctx) => {

    const Request = Joi.object().keys({
        name : Joi.string().min(2).max(20),
        celluar_phone : Joi.string().length(11)
    });

    const result = Joi.validate(ctx.request.body, Request);

    // 비교한 뒤 만약 에러가 발생한다면 400 에러코드를 전송하고, body에 001 이라는 내용(우리끼리의 오류 코드 약속)을 담아 joi 오류임을 알려줌
    if(result.error) {
        console.log("Register - Joi 형식 에러")
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        }
        return;
    }

    const decoded = await decodeToken(ctx.header.token);

    const saved = await teacher.findOne({
        where : {
            "user_id" : decoded.user_id
        }
    });

    if(saved == null){
        ctx.request.body.user_id = decoded.user_id

        await teacher.create(ctx.request.body);

        console.log(`TeacherInfo - 새로운 원서가 작성되었습니다. 유저id - ${decoded.user_id}`);
        ctx.status = 200;
        ctx.body = {
            "user_id" : decoded.user_id
        }
        return;
    }

    await saved.update(ctx.request.body);

    console.log(`TeacherInfo - 원서가 갱신되었습니다. 유저id - ${decoded.user_id}`);
    ctx.status = 200;
    ctx.body = {
        "user_id" : decoded.user_id
    };
}