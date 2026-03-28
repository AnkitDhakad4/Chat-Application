import jwt from 'jsonwebtoken'
import ENV from '../ENV.js'



function generateToken(userId){
    const token= jwt.sign({id:userId},ENV.jwtSecretKey,{expiresIn:ENV.EXPIRY})

    return token;
}


export default generateToken