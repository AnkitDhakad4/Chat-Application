import { Resend } from "resend";
import ENV from "../ENV.js"


const resendClient=new Resend(ENV.RESEND_API_KEY)

const sender={
    name:ENV.EMAIL_FROM_NAME,
    email:ENV.EMAIL_FROM_EMAIL
}


export {sender,resendClient}