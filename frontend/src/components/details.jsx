import { useContext,useEffect,useState } from "react"
import  { AuthContext } from "./context/AuthContext";
import react from 'react'
import SideBar from "./context/SideBar"

function EventDetails(props)
{   
    const event = props.location.state.event;
    const auth = useContext(AuthContext);

    const DetailsStyle ={
        display:"block",
        width:"70%",
        color:"black",
        textAlign:"center",
        background:"white",
        opacity:"70%",
        padding:"20px"
    }


    console.log(event.subcribers);

    return(
        <div>
         {auth.isAuthenticated() && auth.isAgent()?
                <SideBar/>:<></>
            }
        <div class="container-fluid" style={DetailsStyle} className="details">

            <h1 style={{fontSize:"55px",fontWeight:"bolder",color:"#7b113a"}}>{event.eventName}</h1>
            <h1 style={{fontSize:"40px",fontWeight:"bolder"}}>Topic:</h1>
            <h1 style={{fontSize:"30px",color:"#413c69"}}>{event.topic}</h1>
            <h1 style={{fontSize:"40px",fontWeight:"bolder"}}>Description:</h1>
            <p style={{fontSize:"15px",color:"#413c69"}} >{event.description}</p>
            <h1 style={{fontSize:"40px",fontWeight:"bolder"}}>Start Time:</h1>
            <p style={{fontSize:"15px",color:"#413c69"}} >{event.startTime}</p>
            <h1 style={{fontSize:"40px",fontWeight:"bolder"}}>Date:</h1>
            <p style={{fontSize:"15px",color:"#413c69"}} >{event.date}</p>

            {
                auth.isAgent() && 

                <>
                <h1 style={{fontSize:"40px",fontWeight:"bolder"}}>Subscribers:</h1>
                <ul>
                {
                event.subcribers.map((Data)=>
                {
                    return(
                    <>
                     <ui> <p style={{fontSize:"15px",color:"#413c69"}} >{Data.firstName+" "+Data.lastName}</p></ui>
                    
                    </>);
                })
                }
                </ul>
                <div style={{paddingTop:"40px"}} />
                </>
             

                
            }

        </div>
        </div>
    );
}

export default EventDetails
