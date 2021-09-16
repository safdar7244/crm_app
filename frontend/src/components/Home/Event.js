import React, { useState,useContext ,useEffect,lazy} from "react";
import  { AuthContext } from "../context/AuthContext";
import {Link} from "react-router-dom"
import {Redirect} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios'
import Zoom from '../Zoom'
import {FetchContext, FetchProvider} from "../context/FetchContext"
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import Alert from '@material-ui/lab/Alert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const TableStyle =
{
 
  minHeight:"200px",
  background:"white",
  opacity:"80%"
}



function Event(props) {

 
  const [expanded, setExpanded] = React.useState(false);
  const [wrongLog,SetWrongLog]=useState(false);
  const [alertMsg,SetalertMsg]=useState("");
  const [eventmap,Seteventmap]=useState(props.event.subcribers);

  const handleExpandClick = () => {
    setExpanded(!expanded);
    SetsubOrDet(false)
  };

  const handleExpandClick2 = () => {
    setExpanded(!expanded);
    SetsubOrDet(true)
  };

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };


  const auth = useContext(AuthContext);
  const fauth = useContext(FetchContext);

  const [IsSubscribed,SetIsSubscribed]= useState(false)

  const [JoinZoom, SetJoinZoom]=useState(false)
  
  const [redirect, SetRedirect]=useState(false)
  
  const [redirect2, SetRedirect2]=useState(false)

  const [redirect3, SetRedirect3]=useState(false)

  const [redirect4, SetRedirect4]=useState(false)

  const [subOrDet, SetsubOrDet]=useState(false)

  function DetailsClick()
  {
    SetRedirect3(true)
  }

  useEffect(()=>{

    const getData= async()=>{
    
     
    if(auth.isAuthenticated())
    { 

     if (props.eventSubs === false)
     {
       SetIsSubscribed(true)
     }
     else 
     {
      SetIsSubscribed(false)
     }


    }
    }

    console.log("asdssad");
    getData();


  },[props.eventSubs]);


  const classes = useStyles();

  async function AgentAddSub(e)
  {
    SetRedirect4(true)
  }

  function HandleStart()
{
  SetJoinZoom(true)
}

   async function HandleSusrcribe()
   {
    

     if(auth.isAuthenticated())
    {
      
      if (auth.isAgent())
      {
        SetRedirect2(true)
        return <Redirect to="/editEvent"/>
      }


      if (IsSubscribed)

      {

          console.log("ZOOOOOOOm");
          SetJoinZoom(true)
      }
      else
      {

      const info=
      {
        user_id : auth.authState.userInfo._id,
        meeting_id : props.eventID
      }

      

      try
      {

      const data = await fauth.authAxios.post("/subscribe",info);
      SetIsSubscribed(true)
      alert("Event Suscribed")
      }
      catch(error)
      {
        console.log(error)
        SetIsSubscribed(false)
        alert("Error Ocuurred")
      }
    }
      
    }
    else
    { 
      SetRedirect(true); 
       return <Redirect to="/login"/>
    }
 }

 async function DeleteEvent(e)
 {

  const deldata =
  {
    id:props.eventID
  }
  

   try
   {
     const del = await fauth.authAxios.post("/events/delete",deldata)
     console.log(del)
     props.delEv(props.index)
     alert("Event Deleted")
     
    //  SetWrongLog(true)
    //  SetalertMsg("Event Deleted Refresh Page")
   }
   catch(er)
   {
     console.log(er)
     //SetWrongLog(false)
     alert("Error Occurred")
     SetalertMsg("Error Event Not Deleted")
   }
 }

 async function deleteSub(e)
 {
  const info=
  {
    userId : e.target.id,
    eventId : props.eventID
  }

  try
   {
     const del = await fauth.authAxios.post("/removesubscriber",info)
     console.log(del)
    //  SetWrongLog(true)
     const arr = eventmap
     Seteventmap(null)
     arr.splice(e.target.value,1)
     Seteventmap(arr)
     alert("Subscriber Removed")
   
     SetalertMsg("Subscriber Removed")
   }
   catch(er)
   {
     console.log(er)
    //  SetWrongLog(false)
    alert("Error Occurred")
     SetalertMsg(er.response.msg)
   }


 }

   let time = props.event.startTime.slice(0,2);
   let next = props.event.startTime.slice(2,5);
   let tamee;

   if(time > 12)
   {
     time = time - 12;
     tamee = time + next + " pm"
   } 
   else
   {
     tamee = time + next + " am"
   }

   const EventStyle ={
     padding:"3rem",
     maxWidth:"400px",
     minWidth:"100px",
     background:"white",
     textAlign:"center",
     borderRadius:"5px",
     opacity:"90%"
   }

    return (
      <>
      <div class="container-sm">
          { redirect &&  
             <Redirect to="/login"/>}
             { redirect2 &&  
             <Redirect
            to={{
            pathname: "/editEvent",
            state: { event: props.event }
          }}
        />}

        {redirect3 &&  
             <Redirect
            to={{
            pathname: "/eventDetails",
            state: { event: props.event }
          }}
        />}

         {redirect4 &&  
             <Redirect
            to={{
            pathname: "/clients",
            state: { AgentAddtoEvent: props.eventID }
          }}
        />}
       
       {
        wrongLog &&
      <Alert style ={{margin:"20px"}}severity="error" onClick={()=>{SetWrongLog(false)}}>{alertMsg}</Alert>
      }

      <Card className={classes.root} style={{fontSize:"20px",paddingBottom:"0px"}}>

    
      
      <CardMedia
        onClick={DetailsClick}
        className={classes.media}
        image= {props.event.imageUrl}
        title="Paella dish"
        style={{opacity:"90%",paddingLeft:"5px",paddingRight:"5px"}}
      />
       {
            props.eventRole && auth.isAuthenticated() &&
            <button style={{float:"right",background:"#FA8072", color:"white",opacity:"80%",margin:"20px",padding:"5px",width:"70px",fontSize:"12px"}} onClick={DeleteEvent}  className="" type="button">Delete</button>
       }

       {
        (auth.isAgent() && auth.isAuthenticated()) &&
            <button style={{float:"right",background:"black", color:"white",opacity:"80%",marginTop:"20px",padding:"5px",width:"70px",fontSize:"12px"}} onClick={handleExpandClick} className="" type="button">Suscribers</button>
       }
        {/* <CardHeader
        title={props.event.eventName}
        style={{textAlign:"left",fontSize:"30px",paddingTop:"30px",margin:"0px",marginBottom:"0px"}}
      /> */}


      <h1 style={{paddingLeft:"17px",textAlign:"left",fontWeight:"700",fontSize:"17px",paddingTop:"24px",margin:"0px",marginBottom:"0px"}}>{props.event.eventName}</h1>
      <p style={{paddingLeft:"17px",textAlign:"left",fontSize:"13px",margin:"0px"}}>{props.event.date.slice(0,10)}</p>
      <p style={{paddingLeft:"17px",textAlign:"left",fontSize:"13px",margin:"0px"}}>{tamee}</p>
      <p style={{paddingLeft:"17px",textAlign:"left",fontSize:"15px",marginTop:"10px"}}>{props.event.topic}</p>

      <CardContent>
      
      
     
      {/* <button style={{background:"#6495ED", color:"white",margin:"2px",opacity:"80%",padding:"5px",width:"90px",fontSize:"15px"}} className="" onClick={DetailsClick} type="button">Open Details</button> */}

          { !auth.isAgent()  &&
          <>
          <button style={ IsSubscribed ? {float:"left",background:"#FA8072" ,color:"white",margin:"2px",opacity:"80%",padding:"5px",width:"90px",fontSize:"15px"} : {float:"left",background:"#66CDAF" ,color:"white",margin:"5px",opacity:"80%",padding:"5px",width:"90px",fontSize:"15px"} } className="" type="button" id="subsBtn" onClick={HandleSusrcribe}>{IsSubscribed? "Join" : "Subscribe"}</button>
         
           </>
          }
          { (auth.isAgent() && auth.isAuthenticated()) &&
             <>
            <button style={ {float:"right",background:"#289672" ,color:"white",margin:"5px",opacity:"80%",padding:"5px",width:"90px",fontSize:"15px"} } className="" type="button" id="subsBtn" onClick={HandleSusrcribe}>Edit</button>
            <button style={ {float:"left",background:"#184d47" ,color:"white",margin:"5px",opacity:"80%",padding:"5px",width:"90px",fontSize:"15px"} } className="" type="button" id="subsBtn" onClick={HandleStart} >Start Meeting</button>
            </>
          }
         
          <button style={{float:"right",background:"#eeebdd", color:"black",margin:"5px",opacity:"80%",padding:"5px",width:"90px",fontSize:"15px"}} onClick={handleExpandClick2} className="" type="button">Details</button>
          <div style={{width:"200px",padding:"50px",paddingTop:"10px",paddingBottom:"10px"}}></div>
      </CardContent>
      <CardActions disableSpacing>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent >
          { subOrDet ? <> <Typography style={{fontSize:"20px"}} paragraph>Description:</Typography>
          <Typography style={{fontSize:"15px",color:"#7b113a"}} paragraph>
          {props.event.description}
          </Typography>
          </>
      
          
               :

                <div>
                <Typography style={{fontSize:"20px"}} paragraph>Subscribers:</Typography>
                
                
                {
                  eventmap &&
                eventmap.map((Data,i)=>
                {
                    return(
                    <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                    
                      <p style={{fontSize:"15px",color:"#413c69", paddingTop:"8px"}} >{Data.firstName}</p>
                      <button id={Data._id} value={i} onClick={deleteSub} style={{marginLeft:"30px",fontSize:"15px",background:"red",width:"55px",height:"25px",color:"white",padding:"0px"}}> Remove </button>
                 
                      
                    </div>);
                })
                }
                
               
                <div style={{paddingTop:"40px"}} />
                <button style={{background:"#eeebdd", color:"black",marginBottom:"5px",opacity:"80%",padding:"5px",width:"90px",fontSize:"15px"}} onClick={AgentAddSub}  className="" type="button">+ Add New</button>
          
                </div>
             

                
            }
        </CardContent>
      </Collapse>
    </Card>

     


    {JoinZoom &&  
             <Redirect
            to={{
            pathname: "/zoomNew",
            state: { _id : props.eventJoin ,
                     _pass: props.eventPass,
                      number: props.eventNo },
                      target:"_blank"
                      
                      
          }}
          target="_blank"
        />}






    {/* {JoinZoom && <Zoom _id={props.eventJoin} _pass={props.eventPass}  number= {props.eventNo} />} */}
      </div>
      </>
    )
}

export default Event;