import Joi from 'joi';
import axios from 'axios';
import urlencode from 'urlencode';
import { decodeToken } from 'lib/token.js';
import { savePhoto } from 'lib/uploadPicture.js';
import { user, application } from 'models';

import dotenv from 'dotenv';
dotenv.config();

// 학교 목록 검색
export const SearchSchoolList = async (ctx) => {

    const Request = Joi.object().keys({
        searchText: Joi.string().required()
    });

    // 넘어온 body의 형식을 검사한다.
    const Result = Joi.validate(ctx.query, Request);

    // 만약 형식이 불일치한다면, 그 이후 문장도 실행하지 않는다.
    if (Result.error) {
        console.log(`Login - Joi 형식 에러`);
        ctx.status = 400;
        ctx.body = {
            "error": "001"
        }
        return;
    }

    const text = urlencode(ctx.query.searchText);

    const url = `https://www.career.go.kr/cnet/openapi/getOpenApi?apiKey=${process.env.careernet_key}&svcType=api&svcCode=SCHOOL&contentType=json&gubun=midd_list&searchSchulNm=${text}`;

    const api_result = await axios.get(url);
    const schoolList = api_result.data.dataSearch.content;

    let search_result = [];
    for (var i in schoolList) {
        search_result.push({
            "school_name": schoolList[i].schoolName,
            "address": schoolList[i].adres,
            "seq": schoolList[i].seq
        });
    }

    ctx.status = 200;
    ctx.body = {
        "list": search_result
    }
}

// 지원서 입력
export const ApplicationInfo = async (ctx) => {

    const Request = Joi.object().keys({
        sex: Joi.number().min(1).max(2),
        birthday: Joi.date(),
        address: Joi.string(),
        home_phone: Joi.string(),
        phone: Joi.string().length(11),
        graduation_date: Joi.date(),
        graduation_option: Joi.number().max(3),
        protector_name: Joi.string().min(2).max(20),
        relation: Joi.string(),
        protector_home_phone: Joi.string(),
        protector_phone: Joi.string().length(11),
        teacher_name: Joi.string().min(2).max(20),
        teacher_phone: Joi.string().length(11),
        school_number: Joi.string(),
        type: Joi.number().max(5)
    });

    const result = Joi.validate(ctx.request.body, Request);

    // 비교한 뒤 만약 에러가 발생한다면 400 에러코드를 전송하고, body에 001 이라는 내용(우리끼리의 오류 코드 약속)을 담아 joi 오류임을 알려줌
    if (result.error) {
        console.log("ApplicationInfo - Joi 형식 에러")
        ctx.status = 400;
        ctx.body = {
            "error": "001"
        }
        return;
    }

    const decoded = await decodeToken(ctx.header.token);

    let file;
    let url;
    try {
        file = ctx.request.files.image;

        url = await savePhoto({
            fileName: decoded.user_id,
            filePath: file.path,
            fileType: file.type
        });

    } catch (e) {
        console.log(e.name);
    }

    const saved = await application.findOne({
        where: {
            "user_id": decoded.user_id
        }
    });

    if (saved == null) {
        ctx.request.body.user_id = decoded.user_id;
        ctx.request.body.image_url = url;

        await application.create(ctx.request.body);

        console.log(`ApplicationInfo - 새로운 원서가 작성되었습니다. 유저id - ${decoded.user_id}`);
        ctx.status = 200;
        ctx.body = {
            "user_id": decoded.user_id
        }
        return;
    }

    await saved.update(ctx.request.body);

    console.log(`ApplicationInfo - 원서가 갱신되었습니다. 유저id - ${decoded.user_id}`);
    ctx.status = 200;
    ctx.body = {
        "user_id": decoded.user_id
    };
}

// 원서 삭제
export const DeleteApplication = async (ctx) => {
    const decoded = await decodeToken(ctx.header.token);

    await application.destroy({
        where: {
            "user_id": decoded.user_id
        }
    });

    console.log(`DeleteApplication - 삭제에 성공하였습니다. 유저id - ${decoded.user_id}`);
    ctx.status = 200;
    ctx.body = {
        "user_id": decoded.user_id
    };
}

// 작성 중이던 원서 로드
export const ApplicationLoad = async (ctx) => {

    const decoded = await decodeToken(ctx.header.token);

    const saved = await application.findOne({
        user_id : decoded.user_id
    });

    let data;

    data = saved;

    if(saved.user_id != decoded.user_id){
        data = {};
    }

    ctx.status = 200;
    ctx.body = {
        "data" : data
    };
}