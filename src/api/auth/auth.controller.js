import Joi from 'joi';
import crypto from 'crypto';
import { user } from 'models';
import { generateToken, decodeToken } from 'lib/token.js';
import { sendRegisterEmail, sendPasswordChange }from 'lib/sendEmail.js';

import dotenv from 'dotenv';
dotenv.config();

// 회원가입
export const Register = async (ctx) => {

    // Joi 라이브러리를 활용해서 형식을 검사하기 위해 객체를 하나 만들어 줌.
    // 왼쪽의 각 name에 해당하는 값의 요구조건임을 알 수 있다.
    // id를 예시로 들자면 '형식은 string이고, 입력 가능한 것은 alphanum( a-z, A-Z, 0-9 )이고, 최소 6글자 최대 30글자, 무조건 입력되야한다'라는 것을 알 수 있다.
    const Request = Joi.object().keys({
        id : Joi.string().alphanum().min(5).max(20).required(),
        password : Joi.string().min(8).max(30).required(),
        name : Joi.string().min(2).max(20).required(),
        school_name : Joi.string().required(),
        school_seq : Joi.string().required(),
        grade : Joi.number().integer().max(6).required(),
        class : Joi.number().integer().required(),
        number : Joi.number().integer().required(),
        email : Joi.string().email().required()
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

    // 아이디 중복체크
    // 사용자가 입력한 id와 동일한 id가 데이터베이스에 있는지 검사하고, 만약 있다면 exist에 저장함
    const exist = await user.findOne({
        where: {
            id : ctx.request.body.id
        }
    });

    // exist의 길이가 0이 아니라면, 중복된 아이디가 있다는 뜻
    // 따라서 만약 중복된 아이디가 있다면, 400 에러코드를 전송하고, body에 002라는 내용을 담아서 보냄
    if(exist != null){
        console.log(`Register - 이미 존재하는 아이디입니다. / 입력된 아이디 : ${ctx.request.body.id}`);

        ctx.status = 400;
        ctx.body = {
            "error" : "002"
        }
        return;
    }

    // 데이터베이스에 저장할 내용을 정리하는 코드
    const id = ctx.request.body.id;

    // 비밀번호를 crypto 모듈을 이용해서 암호화해줌.
    const password = crypto.createHmac('sha256', process.env.Password_KEY).update(ctx.request.body.password).digest('hex');

    // 이메일 인증 키를 제작합니다.
    let verifycode;
    let key_for_verify;
    do {
        let key_one=crypto.randomBytes(256).toString('hex').substr(100, 5);
        let key_two=crypto.randomBytes(256).toString('base64').substr(50, 5);
        key_for_verify = key_one+key_two;

        verifycode = await user.findAll({
            where : {
                "key_for_verify" : key_for_verify
            }
        });
    }while(verifycode.length);
    
    
    // 데이터베이스에 값을 저장함.  
    await user.create({
        "id" : id,
        "password" : password,
        "name" : ctx.request.body.name,
        "school_name" : ctx.request.body.school_name,
        "school_seq" : ctx.request.body.school_seq,
        "grade" : ctx.request.body.grade,
        "class" : ctx.request.body.class,
        "number" : ctx.request.body.number,
        "email" : ctx.request.body.email,
        "key_for_verify" : key_for_verify
    });

    // 이메일 인증을 위해 이메일을 전송하는 부분입니다.
    sendRegisterEmail(ctx.request.body.email, key_for_verify);

    console.log(`Register - 새로운 회원이 저장되었습니다. / 아이디 : ${id}`);
    
    ctx.status = 200;
    ctx.body = {
        "name" : ctx.request.body.name
    };
}

// 로그인
export const Login = async (ctx) => {
    
    // Joi 라이브러리를 활용해서 형식을 검사하기 위해 객체를 하나 만들어 줌.
    const Request = Joi.object().keys({
        id : Joi.string().alphanum().min(5).max(50).required(),
        password : Joi.string().min(5).max(50).required()
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

    // 데이터베이스에 해당하는 아이디가 있는지 검사합니다.
    const founded = await user.findOne({
        where: {
            id : ctx.request.body.id
        }
    });

    if(founded == null){
        console.log(`Login - 존재하지 않는 계정입니다. / 입력된 아이디 : ${ctx.request.body.id}`);
        ctx.status = 400;
        ctx.body = {
            "error" : "003"
        }
        return;
    }

    const input = crypto.createHmac('sha256', process.env.Password_KEY).update(ctx.request.body.password).digest('hex');

    if(founded.password != input){
        console.log(`Login - 비밀번호를 틀렸습니다.`);
        ctx.status = 400;
        ctx.body = {
            "error" : "004"
        }
        return;
    }

    const payload = {
        user_id : founded.user_id
    };

    let token = null;
    token = await generateToken(payload);

    console.log(`Login - 로그인에 성공하였습니다 : 유저 - ${founded.user_id}`);
    
    ctx.status = 200;
    ctx.body = {
        "token" : token
    };
}

// 이메일 인증 여부 확인
export const CheckUserValidate = async (ctx) => {
    const token = ctx.header.token;

    const decoded = await decodeToken(token);

    console.log(`CheckUserValidate - 접속한 유저 키 : ${decoded.user_id}`);
    
    const founded = await user.findOne({
        where : {
            "user_id" : decoded.user_id
        }
    });

    ctx.status = 200;
    ctx.body = {
        "validation" : founded.validation
    }
}

// 유저 일반 정보 반환
export const CheckUser = async (ctx) => {
    const token = ctx.header.token;

    const decoded = await decodeToken(token);

    console.log(`CheckUserValidate - 접속한 유저 키 : ${decoded.user_id}`);
    
    const founded = await user.findOne({
        where : {
            "user_id" : decoded.user_id
        }
    });

    ctx.status = 200;
    ctx.body = {
        "name" : founded.name,
        "school_name" : founded.school_name,
        "school_seq" : founded.school_seq,
        "grade" : founded.grade,
        "class" : founded.class,
        "number" : founded.number
    };
}

// 회원 일반 정보 수정
export const UpdateGeneral = async (ctx) => {

    const Request = Joi.object().keys({
        name : Joi.string().min(2).max(20).required(),
        school_name : Joi.string().required(),
        school_seq : Joi.string().required(),
        grade : Joi.number().integer().max(6).required(),
        class : Joi.number().integer().required(),
        number : Joi.number().integer().required(),
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

    const token = ctx.header.token;

    const decoded = await decodeToken(token);
    
    const founded = await user.findOne({
        where : {
            "user_id" : decoded.user_id
        }
    });

    await founded.update({
        "name" : ctx.request.body.name,
        "school_name" : ctx.request.body.school_name,
        "school_seq" : ctx.request.body.school_seq,
        "grade" : ctx.request.body.grade,
        "class" : ctx.request.body.class,
        "number" : ctx.request.body.number,
    });

    console.log(`UpdateGeneral - 회원 정보를 수정하였습니다. / 유저코드 : ${decoded.user_id}`);
    
    ctx.status = 200;
    ctx.body = {
        "user_id" : decoded.user_id
    };
}

// 이메일 인증
export const ConfirmEmail = async (ctx) => {
    const key_for_verify = ctx.query.key;

    const account = await user.findOne({
        where : {
            "key_for_verify" : key_for_verify
        }
    });

    await account.update({
        "validation" : true
    });

    console.log(`ConfirmEmail - 이메일 인증이 완료되었습니다. / 유저코드 : ${account.user_id}}`);

    ctx.status = 200;
    ctx.body = {
        "user_id" : account.user_id
    }
}

// 비밀번호 변경 이메일 전송
export const SendChangePW = async (ctx) => {

    const Request = Joi.object().keys({
        id : Joi.string().alphanum().min(5).max(50).required()
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

    const founded = await user.findOne({
        where : {
            id : ctx.request.body.id
        }
    });

    if(founded == null){
        console.log(`ChangePassword - 존재하지 않는 계정입니다. / 입력된 아이디 : ${ctx.request.body.id}`);
        ctx.status = 400;
        ctx.body = {
            "error" : "003"
        }
        return;
    }

    // 만약 인증이 안되었을 경우엔???

    sendPasswordChange(founded.email);

    ctx.status = 200;
    ctx.body = {
        "user_id" : founded.user_id
    };
}

// 비밀번호 변경
export const ChangePassword = async (ctx) => {

    const Request = Joi.object().keys({
        user_id : Joi.number().integer().required(),
        password : Joi.string().min(8).max(30).required()
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

    const password = crypto.createHmac('sha256', process.env.Password_KEY).update(ctx.request.body.password).digest('hex');

    const account = await user.findOne({
        where : {
            "user_id" : ctx.request.body.user_id
        }
    });

    await account.update({
        "password" : password
    });

    console.log(`ChangePassword - 비밀번호 변경을 성공하였습니다. / 유저코드 : ${account.user_id}`);

    ctx.status = 200;
    ctx.body = {
        "user_id" : account.user_id
    };
}

// 계정 삭제
export const DeleteUser = async (ctx) => {

    const Request = Joi.object().keys({
        password : Joi.string().min(5).max(50).required()
    });

    // 넘어온 body의 형식을 검사한다.
    const Result = Joi.validate(ctx.request.body, Request);

    // 만약 형식이 불일치한다면, 그 이후 문장도 실행하지 않는다.
    if(Result.error) {
        console.log(`DeleteUser - Joi 형식 에러`);
        ctx.status = 400;
        ctx.body = {
            "error" : "001"
        }
        return;
    }

    const token = ctx.header.token;

    const decoded = await decodeToken(token);

    console.log(`DeleteUser - 접속한 유저 키 : ${decoded.user_id}`);

    const founded = await user.findOne({
        where : {
            "user_id" : decoded.user_id
        }
    });

    const input = crypto.createHmac('sha256', process.env.Password_KEY).update(ctx.request.body.password).digest('hex');

    if(founded.password != input){
        console.log(`DeleteUser - 비밀번호를 틀렸습니다.`);
        ctx.status = 400;
        ctx.body = {
            "error" : "004"
        }
        return;
    }

    founded.destroy();

    console.log(`DeleteUser - 성공하였습니다. / 삭제된 유저 : ${decoded.user_id}`);
    ctx.status = 200;
    ctx.body = {
        "user_id" : decoded.user_id
    };
}