import nodemailer from 'nodemailer';
import smtpTransporter from 'nodemailer-smtp-transport';

import dotenv from 'dotenv';
dotenv.config();

// SMTP 메일 설정
const smtpTransport = nodemailer.createTransport(smtpTransporter({
    host : 'smtp.daum.net',
    secure : true,
    auth : {
        user : process.env.email_id,
        pass : process.env.email_password
    }
}));

// 회원가입 시 이메일 인증을 위한 메일 발송
export const sendRegisterEmail = (email, key_for_verify) => {
    const url = 'http://localhost:4000/api/auth/confirmEmail?key=' + key_for_verify;

    const mailOpt = {
        from : {
            name : '빈실',
            address : process.env.email_id
        },
        to : email,
        subject : '[잎새] 이메일 인증을 진행하여주세요',
        html : '<h1>이메일 인증을 위해 URL을 클릭하여주세요.</h1><br>'+url
    };

    smtpTransport.sendMail(mailOpt, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Register - 이메일 전송에 성공하였습니다. 이메일 : ${email}`);
        }
        smtpTransport.close();
    });
}

// 비밀번호 변경 시 연결되는 링크를 제공하는 이메일 발송
export const sendPasswordChange = (email) => {
    const url = '';

    const mailOpt = {
        from : {
            name : '빈실',
            address : process.env.email_id
        },
        to : email,
        subject : '[잎새] 비밀번호 변경을 위한 이메일입니다.',
        html : '<h1>비밀번호 변경을 위해 URL을 클릭하여주세요.</h1><br>'+url
    };

    smtpTransport.sendMail(mailOpt, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`SendChangePW - 이메일 전송에 성공하였습니다. 이메일 : ${email}`);
        }
        smtpTransport.close();
    });
}

// QnA에 새로운 질문이 올라왔을 시 답변을 요구하는 메일 발송 ( to 어드민 )
export const sendPleaseAnswer = (email) => {
    const url = '';

    const mailOpt = {
        from : {
            name : '빈실',
            address : process.env.email_id
        },
        to : email,
        subject : '[잎새] 새로운 질문이 들어왔습니다.',
        html : '<h1>새로운 질문에 대답해주세요.</h1>'
    };

    smtpTransport.sendMail(mailOpt, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`sendPleaseAnswer - 이메일 전송에 성공하였습니다. 이메일 : ${email}`);
        }
        smtpTransport.close();
    });
}

// QnA에 본인이 올린 것에 대한 답변이 올라왔다는 것을 알려주는 메일 발송 ( to 유저 )
export const sendAnswered = (email) => {
    const url = '';

    const mailOpt = {
        from : {
            name : '빈실',
            address : process.env.email_id
        },
        to : email,
        subject : '[잎새] 문의하신 질문에 대한 답변이 완료되었습니다.',
        html : '<h1>잎새에 로그인하셔서 지금 확인해보세요!</h1>'
    };

    smtpTransport.sendMail(mailOpt, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`sendAnswered - 이메일 전송에 성공하였습니다. 이메일 : ${email}`);
        }
        smtpTransport.close();
    });
}