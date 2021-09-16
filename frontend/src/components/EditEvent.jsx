import React, { useState, useContext } from 'react';
import axios from "axios";
import SideBar from "./context/SideBar";
import  { AuthContext } from "./context/AuthContext";
import {FetchContext, FetchProvider} from "./context/FetchContext"

function EditEvent(props) {


    console.log(props.location.state)
    const auth = useContext(AuthContext);
    const fauth = useContext(FetchContext);


    const [FormData, SetFormData] = useState(
        {
            topic:props.location.state.event.topic,
            description:props.location.state.event.description,
            meetingNumber:props.location.state.event.meetingNumber,
            date:props.location.state.event.date,
            startTime:props.location.state.event.startTime,
            password:props.location.state.event.password,
            eventName:props.location.state.event.eventName
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
        
        FormData.id = props.location.state.event._id

        console.log(FormData)
        try{
        const upd = await fauth.authAxios.patch("/events",FormData)
        console.log(upd)
        alert("Event Updated")
        }
        catch(er)
        {
            console.log(er)
            alert("Error Occurred")
        }

    }
    return (
        <div>

            {auth.isAuthenticated() && auth.isAgent()?
                <SideBar/>:<></>
            }

            
        <div style={{margin:"auto"}} class="container-fluid" className="container-fluid container FluidStyle">
            <h1 style={{color:"black",paddingBottom:"10px",opacity:"70%"}}>Edit Event</h1>
            <form style={{color:"black"}} onSubmit={HandleSubmit}>

                <input style={{color:"black"}} onChange={handleChange} value={FormData.eventName} name="eventName" type="text" placeholder={FormData.eventName}/>
                <input style={{color:"black"}} onChange={handleChange} value ={FormData.topic} name="topic" type="text" placeholder={FormData.topic} />
                <input style={{color:"black"}} onChange={handleChange} value ={FormData.startTime} name="startTime" type="Time" placeholder={FormData.startTime} />
                <input style={{color:"black"}} onChange={handleChange} value ={FormData.date} name="date" type="Date" className="" placeholder={FormData.date}  />
                <input style={{color:"black"}} onChange={handleChange} value ={FormData.meetingNumber} name="meetingNumber" type="text" placeholder={FormData.meetingNumber} />
                <input style={{color:"black"}} onChange={handleChange} value ={FormData.password} name="password" type="text" placeholder="Password" />
                <input style={{color:"black"}} onChange={handleChange} value ={FormData.description} name="description" type="text" placeholder={FormData.description} />

                <button style={{color:"white",background:"#413c69"}} type="submit">Submit</button>
            </form>
            </div>
        </div>
     
    )
}
export default EditEvent;