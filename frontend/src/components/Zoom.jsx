import React,{ useEffect,useContext } from 'react';
import {ZoomMtg} from "@zoomus/websdk"
import * as base64JS from 'js-base64';
import * as hmacSha256 from 'crypto-js/hmac-sha256';
import  { AuthContext } from "./context/AuthContext";
import * as encBase64 from 'crypto-js/enc-base64';
import {FetchContext, FetchProvider} from "./context/FetchContext"
function Zoom(props) {


  

  const fauth = useContext(FetchContext);
  const auth = useContext(AuthContext);
  
  let rol =0

  if (auth.isAgent())
  {
  rol = 0;
  }
  


 const data ={
    apiKey:"_M_zeNc_QoOdFPCEYhFNXA",
    apiSecret:'yHcPtSvLCshBF6rZZyelNjzDTnKeiMr5Uj6a',
    role:rol,
    meetingNumber:props.number,
}


console.log(props);
console.log(rol);


 useEffect(()=>{

  

  const boga = async ()=>{


  try
  {
    const func = await fauth.authAxios.get("/test")
  }
  catch(error)
  {

  }
 
  let nam

  if (auth.authState.userInfo.name)
  {
   nam = auth.authState.userInfo.name
  }
  else
  {
    nam = auth.authState.userInfo.companyName
  }

    ZoomMtg.setZoomJSLib('https://source.zoom.us/1.9.1/lib', '/av');;
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();

 
    document.getElementById("zmmtg-root").style.display="flex";
    document.body.style['overflow-y']='hidden';

     ZoomMtg.init({
    leaveUrl: "https://zoomsdk.netlify.app",
    isSupportAV: true,
    success: (success) => {
    console.log(success)
     var signature = ZoomMtg.generateSignature({

        meetingNumber: props.number,
        apiKey:"_M_zeNc_QoOdFPCEYhFNXA",
        apiSecret:'yHcPtSvLCshBF6rZZyelNjzDTnKeiMr5Uj6a',

        
        role:rol,
        success: function (res) {
        console.log("lol",res.result);
        ZoomMtg.join({
        signature: res.result,
        meetingNumber: props.number,
        userName: nam,
        apiKey: '_M_zeNc_QoOdFPCEYhFNXA',
        userEmail:auth.authState.userInfo.email,
        passWord: props._pass,
        success: (success) => {
        console.log(success)
        },
        error: (error) => {
        console.log(error)
      }
    })

        },
      });
     }
 })
}
   

    boga();

 },[])

 return (
  <div>
      
  </div>
 )
}

export default Zoom
