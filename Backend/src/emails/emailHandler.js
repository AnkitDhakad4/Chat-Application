import emailTemplate from "./emailTemplate.js"
import { resendClient,sender } from "./resend.js"
import ENV from "../ENV.js"

const welcomeEmail=async function(email,name,clientURL){
        const {data,error}=await resendClient.emails.send(
            {
                from:`${sender.name}<${sender.email}>`,
                to:email,
                subject:`WelCome to ${ENV.APP_NAME}`,
                html:emailTemplate(name,clientURL)

            }
        )

        if(error)
        {
            console.log("Error while sending Email:",error)
            throw error
        }else{
            console.log("email is sended successfully: ",data)
            return data
        }

    

}


export default welcomeEmail