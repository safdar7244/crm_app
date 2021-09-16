import React, { useState } from "react";
import Step3 from "./Step3"


function StepForm(props) {


   const [FormType, SetFormType]= useState(0)
   
   function FormSubmit(e)
   {
        e.preventDefault();

        if(e.target[0].checked || e.target[2].checked)
        {
            SetFormType(1);
        }
        else if (e.target[1].checked || e.target[3].checked)
        {
            SetFormType(2);
        }      
   }

    if (FormType === 0)
    {
    return (
 

       
    <div className="container">
    <h2 >Step3-Sign Up</h2>
    <p style={{fontSize:"15px"}}>Client type </p>
    <input type="text" id="step3Input1" disabled placeholder={props.PhoneNum}/>
    <form id="cpa-form" style={{fontSize:"25px"}} onSubmit={FormSubmit}> 

    <ul>
    <li>
        <input type='radio' value='ID' name='radio' id='radio1'/>
        <label htmlFor='radio1'>ID</label>
    </li>
    <li>
        <input type='radio' value='NIT' name='radio'  id='radio2'/>
        <label htmlFor='radio2'>NIT</label>
    </li>
    <li>
        <input type='radio' value='Foreign ID<' name='radio'  id='radio3'/>
        <label htmlFor='radio3'>Foreign ID</label>
    </li>
    <li>
        <input type='radio' value='Foreign NIT' name='radio'  id='radio4'/>
        <label htmlFor='radio4'>Foreign NIT</label>
    </li>
</ul>
      <button type="submit" className="btn btn-default" id="step3Btn1">Send</button>
      <p style={{fontSize:"25px"}}>All rights are reserved 2020</p>
    </form>

</div>
    );
    }
    else
    {
        console.log("aa to ra he phir kia msla")
        return(
        <Step3 check={FormType} PhoneNum={props.PhoneNum}/>
        );
        
    }
}
export default StepForm;