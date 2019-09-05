import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const jwtSecret = process.env.JWT_KEY;

/**
 * JWT 토큰 생성
 * @param {any} payload 
 * @returns {string} token
 */

 export const generateToken = (payload) => {
     return new Promise(
         (resolve, reject) => {
             jwt.sign(
                 payload,
                 jwtSecret,
                 {
                     expiresIn : '7d'
                 }, (error, token) => {
                     if(error) reject(error);
                     resolve(token);
                 }
             );
         }
     );
 };

export const decodeToken = (token) => {
    return new Promise(
        (resolve, reject) => {
            jwt.verify(token, jwtSecret, (error, decoded) => {
                if(error) reject(error);
                resolve(decoded);
            });
        }
    );
}