import React, { useState,useContext } from "react";
import axios from "axios"
import {AuthContext} from "./context/AuthContext"
import {FetchContext, FetchProvider} from "./context/FetchContext"
import Alert from '@material-ui/lab/Alert';

function SignUp_3(props){
    const [wrongLog,SetWrongLog]=useState(false);
    const [error,setError]=useState("");

    function  calcularDigitoVerificacion ( myNit )  {
        console.log("Func: ",myNit)
        var vpri,
            x,
            y,
            z;
        
        // Se limpia el Nit
        myNit = myNit.replace ( /\s/g, "" ) ; // Espacios
        myNit = myNit.replace ( /,/g,  "" ) ; // Comas
        myNit = myNit.replace ( /\./g, "" ) ; // Puntos
        myNit = myNit.replace ( /-/g,  "" ) ; // Guiones
        
        // Se valida el nit
        if  ( isNaN ( myNit ) )  {
          console.log ("El nit/cédula '" + myNit + "' no es válido(a).") ;
          return "" ;
        };
        
        // Procedimiento
        vpri = new Array(16) ; 
        z = myNit.length ;
      
        vpri[1]  =  3 ;
        vpri[2]  =  7 ;
        vpri[3]  = 13 ; 
        vpri[4]  = 17 ;
        vpri[5]  = 19 ;
        vpri[6]  = 23 ;
        vpri[7]  = 29 ;
        vpri[8]  = 37 ;
        vpri[9]  = 41 ;
        vpri[10] = 43 ;
        vpri[11] = 47 ;  
        vpri[12] = 53 ;  
        vpri[13] = 59 ; 
        vpri[14] = 67 ; 
        vpri[15] = 71 ;
      
        x = 0 ;
        y = 0 ;
        for  ( var i = 0; i < z; i++ )  { 
          y = ( myNit.substr (i, 1 ) ) ;
          console.log ( y + "x" + vpri[z-i] + ":" ) ;
      
          x += ( y * vpri [z-i] ) ;
          console.log ( x ) ;    
        }
      
        y = x % 11 ;
        console.log ( y ) ;
      
        return ( y > 1 ) ? 11 - y : y ;
      }

    console.log(props);
const [phoneNo,setPhoneNo]=useState(props.PhoneNum)
const authContext = useContext(AuthContext);
const[UserData,SetUserData]=useState({ })
const fauth = useContext(FetchContext);

    function handleChange(event){
        const {name,value}=event.target;
        console.log("bti",name,value);
        SetUserData((prev)=>{
            return {
                ...prev,
                [name]:value
            }
        })

    }

    function SeeVid(e)
{
    e.preventDefault();
    if(UserData.nit)
    UserData.vid=calcularDigitoVerificacion(UserData.nit)
    else
     UserData.vid=calcularDigitoVerificacion(UserData.id)
    document.getElementById('Vid').innerHTML="VID:"+UserData.vid;
}

async function SubmitHandle(e){
    console.log("yo:",e.nit);
    e.preventDefault();
    const phoneNo = localStorage.getItem('phone');
    const num= parseInt(phoneNo.slice(3,phoneNo.length));
    //var mobile = phoneNo.replace(/^\+[0-9]{1,3}(\s|)/, "");
    var mobile=phoneNo.replace(/^\+?1|\|1|\D/," ");
        console.log(typeof(num));
        console.log("mobile",num);
    UserData.phoneNo=num;
    if(UserData.nit)
    UserData.vid=calcularDigitoVerificacion(UserData.nit)
    else
    UserData.vid=calcularDigitoVerificacion(UserData.id)
    console.log(UserData);
        try{
                    const data = await fauth.authAxios.post("/signup",UserData); 
                    console.log(data);
        
                   const data1 = 
                   {
                    token: data.data.token,
                    expiresAt: data.data.expiresAt,
                    userInfo: data.data.userInfo,
                  
                   }
                  console.log(data1);
                  authContext.setAuthState(data1);
                  
                    localStorage.removeItem('phone');
                    window.location="/";
           }
    
    catch(err)
    {
        // SetWrongLog(true)
        alert("Error Occurred")
        console.log(err)
        
        const { data } = err.response;
        setError(data.message);
    }
}
return (
    <div style={{color:"black"}} className="container SignUpForm">
     {
        wrongLog &&
      <Alert style ={{position:"fixed",width:"70%",zIndex:"1120",justifyContent:"center",alignItems:"center",marginLeft:"auto",marginRight:"auto",top:"0",margin:"20px",marginTop:"80px",fontSize:"17px"}}severity="error" onClick={()=>{SetWrongLog(false)}}>{error}</Alert>
      }
    <h2 >{props.HeaderText}</h2>
    <p>{props.PTxt}</p>
    
    <form style={{color:"black"}} onSubmit= {SubmitHandle}>
    
    <input id="entry1" style={{color:"black"}} onChange={handleChange} name="id" type="text" className="" placeholder={props.Entry1} value={props.PhoneNum} required  />
    <button  className="btn btn-default" id="Vid" onClick={SeeVid} >Show Vid</button>
    <input id="entry2" onChange={handleChange} name="firstName" type="text" className="" placeholder={props.Entry2} required />
    <input id="entry3" onChange={handleChange} name="lastName"type="text" className="" placeholder={props.Entry3} required />
    <input id="entry4" onChange={handleChange} name="email" type="text" className="" placeholder={props.Entry4} required  />
    <input id="entry5" onChange={handleChange} name="DOB" type={props.typ} className="" placeholder={props.Entry5} required />
    <select id="entry6" onChange={handleChange} name="gender" className="custom-select " id={props.UniqId1} required >
        <option defaultValue>{props.Select1} </option>
        <option value="Male">{props.Select1_1}</option>
        <option value="Female">{props.Select1_2}</option>
        <option value="Custom">{props.Select1_3}</option>
    </select>
    <select id="entry7" onChange={handleChange} name="country"className="custom-select " id={props.UniqId2} required>
        <option defaultValue>{props.Select2} </option>
        <option value={props.Select2_1}>{props.Select2_1}</option>
    </select>





    <select id="entry8" onChange={handleChange} name="city" className="HalfCustom" id={props.UniqId3} required>
        <option defaultValue>{props.Select3}</option>
        <option value={props.Select3_1}>{props.Select3_1}</option>
        <option value={props.Select3_2}>{props.Select3_2}</option>
        <option value={props.Select3_3}>{props.Select3_3}</option>
    </select>


    <select id="entry9" onChange={handleChange} name="locality"className="HalfCustom" id={props.UniqId4} required >
        <option defaultValue>{props.Select4}</option>
        <option value={props.Select4_1}>{props.Select4_1}</option>
        <option value={props.Select4_2}>{props.Select4_2}</option>
        <option value={props.Select4_3}>{props.Select4_3}</option>
    </select>


    <input id="entry10" onChange={handleChange} name="address" type="text" className="" placeholder={props.Entry6} required/>
    <input id="entry11" onChange={handleChange} name="password" type="text" className="" placeholder={props.Entry7} required  />
   

    <button type="submit" className="btn btn-default" id="step3Btn2">Submit</button>
    </form>
    <p>All rights are reserved 2020</p>

</div>
)
}
export default SignUp_3;