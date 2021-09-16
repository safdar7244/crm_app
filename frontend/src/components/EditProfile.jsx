import React, { useState,useContext } from 'react';
import axios from "axios"
import {FetchContext, FetchProvider} from "./context/FetchContext"
import  { AuthContext } from "./context/AuthContext";


function EditProfile() {


    const fauth = useContext(FetchContext);
    const auth = useContext(AuthContext);

    let name

    if (auth.authState.userInfo.name)
    {
    name = auth.authState.userInfo.name.split(" ")
    }

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
        console.log("All Event Data ", FormData)

        FormData._id = auth.authState.userInfo._id;
        try

        {
            let data
            if (auth.isAgent())
            {
                data = await fauth.authAxios.patch("/agents",FormData);
                const data1 = 
            {
                token: data.data.token,
                expiresAt: data.data.expiresAt,
                userInfo: data.data.userInfo,
              
              }
              console.log(data1);
              auth.setAuthState(data1);
                
            }
            else
            {
            data = await fauth.authAxios.patch("/clients",FormData);
            const data1 = 
            {
                token: data.data.token,
                expiresAt: data.data.expiresAt,
                userInfo: data.data.userInfo,
              
              }
              console.log(data1);
              auth.setAuthState(data1);

            }
            console.log(data);
            alert("Updated");
        }
        catch(er)
        {
            console.log(er)
            alert("Error Occurred")
        }
    }

   

    return (
        <div className="container container-fluid FluidStyle">
            <form style={{color:"black"}} onSubmit={HandleSubmit}>

                {
                  !auth.isAgent() && auth.authState.userInfo.name &&
                  <>
                 <input style={{color:"black"}} onChange={handleChange} name="firstName" type="text" value = {FormData.firstName} placeholder={auth.authState.userInfo.name[0] } />
                 <input style={{color:"black"}} onChange={handleChange} name="lastName" value = {FormData.lastName} type="text" placeholder={auth.authState.userInfo.name[0]}/>
                 </>
                }

                {
                  !auth.isAgent() && auth.authState.userInfo.companyName &&
                  <>
                 <input style={{color:"black"}} onChange={handleChange} name="companyName" type="text" value = {FormData.firstName} placeholder={auth.authState.userInfo.companyName } />
                 <input style={{color:"black"}} onChange={handleChange} name="contactName" value = {FormData.lastName} type="text" placeholder={auth.authState.userInfo.contactName}/>
                 </>
                }
                {
                auth.isAgent() &&
                 <>
                 <input style={{color:"black"}} onChange={handleChange} name="name" type="text"  placeholder={auth.authState.userInfo.name} />
                 </>
                }

                <input style={{color:"black"}} onChange={handleChange} name="email" type="text" value = {FormData.email} placeholder={auth.authState.userInfo.email} />
                <button style={{color:"white",background:"#413c69"}} type="submit">Submit</button>
            </form>

        </div>
    )
}
export default EditProfile;