import nodemailer from 'nodemailer';
import smtpTransporter from 'nodemailer-smtp-transport';

import dotenv from 'dotenv';
dotenv.config();

const smtpTransport = nodemailer.createTransport(smtpTransporter({
    host : 'smtp.daum.net',
    secure : true,
    auth : {
        user : process.env.email_id,
        pass : process.env.email_password
    }
}));

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