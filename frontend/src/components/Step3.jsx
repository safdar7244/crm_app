import React, { useState } from "react";
import SignUp3a from "./SignUp_3"
import Sign3_1 from "./Step3_1"
import SignUpType2 from "./SIgnUpType2"




function Step3(props) {

    const [phoneNo,setPhoneNo ]=useState(props.PhoneNum)
    const [Checker,SetChecker]=useState(false)

    
    console.log(props)
    console.log("adsad",phoneNo)
    // if (props.check == 1)
    // {
    //     SetChecker(true)
    // }
    // else SetChecker(false)


    if (props.check === 1)
    {
        return(
<SignUp3a 
    phoneNum={props.PhoneNum}
    HeaderText="Step3-Sign Up"
    PTxt="ID or Foreign ID"
    Entry1="Id"
    Entry2="Name"
    Entry3="Last Name"
    Entry4="Email"

    typ="Date"    
    Entry5="Date Of Birth"
    UniqId1="inputGroupSelect01"
    UniqId2="inputGroupSelect02"
    UniqId3="inputGroupSelect03"
    UniqId4="inputGroupSelect04"
    Select1="Sex"
    Select1_1="Male"
    Select1_2="Female"
    Select1_3="Other"

    Select2="Country"
    Select2_1="Colombia"
    Select2_2="Country2"
    Select2_3="Country3"

    Select3="City"
    Select3_1="Bogotá"
    Select3_2="Medellin"
    Select3_3="Cali"

    Select4="Locality"
    Select4_1="Fontibón"
    Select4_2=" Antioquia Department"
    Select4_3="Valle del Cauca"

    Entry6="Address"
    Entry7="Password"
   
/>
        );
    }
    else
    {
        return(
        <SignUpType2 
    phoneNum={props.PhoneNum}
    HeaderText="Step3-Sign Up"
    PTxt="Nit or Foreign Nit"
    Entry1="Nit"
    Entry2="Company Name"
    Entry3="Contact Name"
    Entry4="Email"
    Entry5="Telephone"
    UniqId1="inputGroupSelect05"
    UniqId2="inputGroupSelect06"
    UniqId3="inputGroupSelect07"
    UniqId4="inputGroupSelect08"
    typ="Text"  


    Select1= "Country"
    Select1_1="Colombia"
    Select1_2="Country2"
    Select1_3="Country3"

    Select2="Self-retainer"
    Select2_1="Self-retainer1"
    Select2_2="Self-retainer2"
    Select2_3="Self-retainer3"


    Select3="City"
    Select3_1="Bogotá"
    Select3_2="Medellin"
    Select3_3="Cali"

    Select4="Locality"
    Select4_1="Fontibón"
    Select4_2="Antioquia Department"
    Select4_3="Valle del Cauca"

    Entry6="Address"
    Entry7="Password"
   

/>);
    }
}


export default Step3;