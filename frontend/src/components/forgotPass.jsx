import React, { useState,useContext } from 'react';
import axios from "axios"
import {FetchContext, FetchProvider} from "./context/FetchContext"
import  { AuthContext } from "./context/AuthContext";


function ForgotPass(props) {


    const fauth = useContext(FetchContext);
    const auth = useContext(AuthContext);


    const [FormData, SetFormData] = useState(
        {
        }
    )
    function handleChange(event) {
        const { name, value } = event.target;
        console.log("Agent form", name, value);
        SetFormData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })

    }

    async function HandleSubmit(e) {
        e.preventDefault();
        

        FormData.userId= props.match.params.userId;
        FormData.token= props.match.params.token;


        console.log(FormData)

        try
        {

            const frgt = await fauth.authAxios.post("/savenewpassword",FormData)
            alert("password updated");
        }
        catch(er)
        {
            console.log(er)
        }

    }

   

    return (
        <div className="container container-fluid FluidStyle">
            <form style={{color:"black"}} onSubmit={HandleSubmit}>

            <input style={{color:"black"}} onChange={handleChange} name="password" type="text" placeholder="New Password"/>
                
                <button style={{color:"white",background:"#413c69"}} type="submit">Submit</button>
            </form>

        </div>
    )
}
export default ForgotPass;