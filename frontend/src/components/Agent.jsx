import React, { useState,useContext } from 'react';
import axios from "axios"
import  { AuthContext } from "./context/AuthContext";
import SideBar from "./context/SideBar";
import {FetchContext, FetchProvider} from "./context/FetchContext"
import Alert from '@material-ui/lab/Alert';


function Agent() {

    const auth = useContext(AuthContext);
    const fauth = useContext(FetchContext);
    const [wrongLog,SetWrongLog]=useState(false);
    const [error,setError]=useState("");

    const [AgentData, SetAgentData] = useState(
        {
        }
    )
    function handleChange(event) {
        const { name, value } = event.target;
        console.log("Agent form", name, value);
        SetAgentData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })

    }

    const FluidStyle=
    {
        margin: "auto auto",
        textAlign: "center"
    }


    async function HandleSubmit(e) {
        e.preventDefault();
        console.log("All Event Data ", AgentData)

        try {
            const data = await fauth.authAxios.post("/addagent", AgentData);

            alert("Agent created!!!!")
            window.location = "/addagent"
        }
        catch (err) {
            console.log(err)

            alert("Error Occured")
            window.location = "/addagent"
            SetWrongLog(true)
        console.log(err)
        
        const { data } = err.response;
        setError(data.message);
        }

    }
    return (
        <div>
        {auth.isAuthenticated() && auth.isAgent()?
                <SideBar/>:<></>
            }
            <div  style={{margin:"auto"}} className="container container-fluid FluidStyle" >

            {
        wrongLog &&
      <Alert style ={{position:"fixed",width:"70%",zIndex:"1120",justifyContent:"center",alignItems:"center",marginLeft:"auto",marginRight:"auto",top:"0",margin:"20px",marginTop:"80px",fontSize:"17px"}}severity="error" onClick={()=>{SetWrongLog(false)}}>{error}</Alert>
      }
        
        <h1 style={{color:"black",paddingBottom:"10px",opacity:"70%"}}>Add New Agent</h1>

            <form style ={{width:"100%"}} onSubmit={HandleSubmit}>

                <input style={{color:"black"}} onChange={handleChange} name="name" type="text" placeholder="Name" />
                <input style={{color:"black"}} onChange={handleChange} name="id" type="text" placeholder="ID" />
                <input style={{color:"black"}} onChange={handleChange} name="phoneNo" type="text" placeholder="CellPhone" />
                <input style={{color:"black"}} onChange={handleChange} name="email" type="text" placeholder="Email" />
                <input style={{color:"black"}} onChange={handleChange} name="position" type="text" placeholder="Position" />
                <input style={{color:"black"}} onChange={handleChange} name="password" type="text" placeholder="password" />
                <input style={{color:"black"}} onChange={handleChange} name="role" type="text" placeholder="Role" />
                <select  style={{color:"black"}}  onChange={handleChange} name="role" className="HalfCustom" >
                    <option  style={{color:"black"}} value="Simple Agent" defaultValue>Simple Agent</option>
                    <option  style={{color:"black"}} value="Super Agent">Super Agent</option>
                </select>
                <button style={{color:"white",background:"#413c69"}}  type="submit">Submit</button>
            </form>

        
        </div>
        </div>
    )
}
export default Agent;