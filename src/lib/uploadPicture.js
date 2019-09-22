import AWS from 'aws-sdk';
import fs from 'fs';

import dotenv from 'dotenv';
dotenv.config();

const s3 = new AWS.S3({
    accessKeyId : process.env.ACCESSKEYID,
    secretAccessKey : process.env.SECRET_ACCESSKEY,
    region : process.env.REGION
});

// 증명 사진을 s3 서버에 업로드하는 함수
export const savePhoto = async ({fileName, filePath, fileType}) => {
 
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(filePath);
        
        stream.on("error", function(err) {
            reject(err);
        });
        
        const param = {
            'Bucket' : 'ipse-ip-photo',
            'Key' : 'id_photo/' + fileName,
            'ACL' : 'public-read',
            'Body' : stream,
            'ContentType' : fileType
        };

        s3.upload(param, function(err, data) {
            if(err) reject(err);
            else if (data) resolve({ url : data.Location });
        });
    });
}