import React, { useState,useContext } from 'react';
import axios from "axios"
import {FetchContext, FetchProvider} from "./context/FetchContext"
import  { AuthContext } from "./context/AuthContext";


function EditUser(props) {


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
        
        const idd = props.location.state.User._id

        console.log(props.location.state.User)

        FormData._id= idd

         console.log("All Event Data ", FormData)

        try
        {
            const del = await fauth.authAxios.patch("/clients",FormData);
            console.log(del);
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

                <p style={{fontSize:"13px"}} >First Name</p>
                <input style={{color:"black"}} onChange={handleChange}  name="firstName" type="text"  placeholder={props.location.state.User.firstName} />
                <p style={{fontSize:"13px"}} > Last Name</p>
                <input style={{color:"black"}} onChange={handleChange}  name="lastName"  type="text" placeholder={ props.location.state.User.lastName }/>
                <p style={{fontSize:"13px"}} >Email</p>
                <input style={{color:"black"}} onChange={handleChange}  name="email" type="text"  placeholder={ props.location.state.User.email } />
                <p style={{fontSize:"13px"}} >Address</p>
                <input style={{color:"black"}} onChange={handleChange}  name="address" type="address"  placeholder={ props.location.state.User.address} />
                <p style={{fontSize:"13px"}} >Country</p>
                <input style={{color:"black"}} onChange={handleChange}  name="country" type="text"  placeholder={ props.location.state.User.country } />
                <p style={{fontSize:"13px"}} >City</p>
                <input style={{color:"black"}} onChange={handleChange}  name="city" type="text"  placeholder={ props.location.state.User.city } />
                { props.location.state.User.gender &&
                <>
                <p style={{fontSize:"13px"}} >Gender</p>
                <input style={{color:"black"}} onChange={handleChange}  name="gender" type="text"  placeholder={ props.location.state.User.gender } />
                </>
                }
                { props.location.state.User.companyName &&
                <>
                <p style={{fontSize:"13px"}} >Company Name</p>
                <input style={{color:"black"}} onChange={handleChange}  name="companyName" type="text"  placeholder={ props.location.state.User.companyName } />
                </>
                }
                { props.location.state.User.contactName &&
                <>
                <p style={{fontSize:"13px"}} >Contact Name</p>
                <input style={{color:"black"}} onChange={handleChange}  name="contactName" type="text"  placeholder={ props.location.state.User.contactName } />
                </>
                }
                { props.location.state.User.nit &&
                <>
                <p style={{fontSize:"13px"}} >NIT</p>
                <input style={{color:"black"}} onChange={handleChange}  name="nit" type="text"  placeholder={ props.location.state.User.nit } />
                </>
                }
                { props.location.state.User.vid &&
                <>
                <p style={{fontSize:"13px"}} >VID</p>
                <input style={{color:"black"}} onChange={handleChange}  name="vid" type="text"  placeholder={ props.location.state.User.vid } />
                </>
                }
                <p style={{fontSize:"13px"}} >Phone Number</p>
                <input style={{color:"black"}} onChange={handleChange}  name="phoneNo" type="text"  placeholder={ props.location.state.User.phoneNo } />
                <button style={{color:"white",background:"#413c69"}} type="submit">Submit</button>
            </form>

        </div>
    )
}
export default EditUser;