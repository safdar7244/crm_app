import React, { useState,useContext } from "react";
import Switch from '@material-ui/core/Switch';
import userEvent from "@testing-library/user-event";
import axios from "axios" 
import {AuthContext} from "./context/AuthContext"
import {FetchContext, FetchProvider} from "./context/FetchContext"
import Alert from '@material-ui/lab/Alert';

function SignUp_1(props){
    // const [checkCode,setCheckCode]=useState(ValidtionStep1)
    const fauth = useContext(FetchContext);
    const authContext = useContext(AuthContext);
    const [wrongLog,SetWrongLog]=useState(false);

    const [state, setState] = React.useState({
      isAgent: false,
    });

    function ClickHandle()
    {
       
        console.log("Clicked");
//    if(!checkCode){
//     setCheckCode(!checkCode)
//     setCode(!checkCode)
//    }

    }

    const [UserData,SetUserData] = useState(
      {
        phoneNo:null,
        password:null
      }
    )

    const [Forgot,SetForgot] = useState(false)
    const [email,SetEmail] = useState("")
    
    function HandleForgot()
    {
      SetForgot(!Forgot)
    }

    function ChangeMail(e)
    {
      SetEmail(e.target.value)
    }

    async function SubmitForgot()
    {
      console.log(email)
      
      try
      {
      const mail = await fauth.authAxios.post("/resetpassword",{email})
      console.log(mail)
      alert("mail sent")
      }
      catch(er)
      {
        console.log(er)
        alert("Error Occurred")
      }
    }
   
    async function  handleSubmit(e)
    {
      e.preventDefault();
      SetUserData(
        {
          phoneNo:e.target[0].value,
          password:e.target[1].value
        }
      )
  
      if(state.isAgent){
        
      try
    {
        
        const data = await fauth.authAxios.post("/login/agent",UserData); 
        const data1 = {
          token: data.data.token,
          expiresAt: data.data.expiresAt,
          userInfo: data.data.userInfo,
        
        }
        console.log(data1);
        authContext.setAuthState(data1);
        window.location="/";
        console.log(data);
        
    }
        catch(err)
        {
          // SetWrongLog(true)
            console.log(err)
            alert("Wrong Password or Number")
        }

      }
      else
      {
          try
          {
              const data = await fauth.authAxios.post("/login",UserData); 
              const data1 = {
              token: data.data.token,
              expiresAt: data.data.expiresAt,
              userInfo: data.data.userInfo,
            
            }
            
            console.log(data1);
            authContext.setAuthState(data1);
            window.location="/";
            console.log(data);
        }
    
      catch(err)
    {
        // SetWrongLog(true)
        console.log(err)
        alert("Wrong Password or Number")
    }

      }
    }

    
    function handleChange2(event){
      const {name,value}=event.target;
      SetUserData((prev)=>{
          return {
              ...prev,
              [name]:value
          }
      })

  }

  
    const handleChange = (event) => {
      setState({[event.target.name]: event.target.checked });
    };


    return (

     
        <div style={{margin:"auto"}} class="container-fluid" className="container-fluid container FluidStyle">
      <h1 style={{color:"black",opacity:"80%"}}>{state.isAgent ? "Sign In Agent" : "Sign In Client"} </h1>
      
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange2}
          type="text"
          placeholder="Cell Phone"
          name="phoneNo"
          style ={{color:"black"}}
        />

        <input
          onChange={handleChange2}
          type="password"
          placeholder="Password"
          name="password"
          style ={{color:"black"}}
        />
        <div style={{}}>
        <p style={{color:"black",opacity:"80%",fontSize:"20px"}}>{state.isAgent ? "I am  an Agent" : "I am a Client"}</p>
        <div className="radios">
        <Switch
        checked={state.isAgent}
        onChange={handleChange}
        name="isAgent"

        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
      </div>
      </div>
        <br/>
        <button style={{color:"white",background:"#413c69"}} type="submit">Sign In</button>
      </form>
      <a style={{marginTop:"20px",fontSize:"20px"}} onClick={HandleForgot}>Forgot Password?</a>

      {
        Forgot &&
        <>
        <h2 style={{color:"black",opacity:"80%"}}>enter email </h2>
        <input  style={{color:"black"}} type="email" placeholder="email" onChange={ChangeMail}/>
        <button style={{color:"white",background:"#413c69"}} onClick={SubmitForgot} type="submit">Reset</button></>
      }
      {
        wrongLog &&
      <Alert style ={{position:"fixed",width:"70%",zIndex:"1120",justifyContent:"center",alignItems:"center",marginLeft:"auto",marginRight:"auto",top:"0",margin:"20px",marginTop:"80px",fontSize:"17px"}}severity="error" onClick={()=>{SetWrongLog(false)}}>Wrong Password or Email</Alert>
      }
    </div>
 
    );
}

export default SignUp_1;
