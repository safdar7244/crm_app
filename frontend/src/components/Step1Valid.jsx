import React, { useState } from "react";
import SignUp_1 from "./SignUp_1";
// import ValidtionStep1,{setCode} from "./Validations"


function Step1Valid(){
    // const [sendCode,setsendCode]=useState(ValidtionStep1)

    
console.log("sendCode");
// const [CodeValid,SetCodeValid]=useState(true)

var sendCode=false
return (

<div>
{
        
          <SignUp_1
            headTag="Sign In"
            ptag="Enter Your Credentials"
            placeHolder="cellPhone"
            buttonText="Send Code" /> 
        
}
</div>
    
)
}
export default Step1Valid;