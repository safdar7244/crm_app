import React, { useState } from "react";
var sendCode=true;
function ValidtionStep1(){
    return( sendCode);
}
function setCode(cc){
    sendCode=cc
    console.log("VAlidations",sendCode);

}
export default ValidtionStep1
export {setCode}