import Joi from 'joi';
import axios from 'axios';
import urlencode from 'urlencode';

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