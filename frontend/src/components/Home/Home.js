import React, { useState,useEffect,useContext } from "react";
import Event from "./Event"
import axios from 'axios' 
import  { AuthContext } from "../context/AuthContext";
import {FetchContext, FetchProvider} from "../context/FetchContext"
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import CircularProgress from '@material-ui/core/CircularProgress';
import Switch from '@material-ui/core/Switch';

import SideBar from "../context/SideBar";
import { useForkRef } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        marginTop: theme.spacing(2),
      },
    },
  }));



function Home() 
{

  // function compare( a, b ) 
  // {
  //   const date1 = a.slice(4,6) +  a.slice(7,8)
  //   console.log(date1)
  //   // if ( a.date < b.date ){
  //   //   console.log("hello")
  //   // }
  //   // if ( a.date > b.date ){
  //   //   console.log("bye")
  //   // }
  //   // return 0;
  // }
  

    const classes = useStyles();
    // document.getElementById('navvbar').style.display="block"

  const auth = useContext(AuthContext);
  const fauth = useContext(FetchContext);


  const [state, setState] = React.useState({
    isAgent: true,
  });

  

    const [EventData,SetEventData]=useState(null);
    const [UserEvent,SetUserEvent]=useState([{}]);
    const [UserRole,SetUserRole]=useState(false);
    const [Page,SetPage]=useState(1);
    const [pageNum,SetPageNum]=useState(0);


    function delEv(e)
    {
      console.log(e)
      const arr = EventData
      SetEventData(null)
      arr.splice(e,1)
      SetEventData(arr)
      console.log(EventData)
    }

    const handleChange = (event) => {
      setState({[event.target.name]: event.target.checked });
      document.getElementById('SetNone').style.display="none"
      SetEventData(null)
    };

    function handlePage(event, value)
    {
        
        SetPage(value);
        console.log(value)
    }

    useEffect(()=>{
        async function hello()
        {
            console.log("hello");
        
        SetEventData(null)
        const data = await fauth.authAxios.get(`/events/${Page}`);
        

        if (auth.isAuthenticated())
        {
       const role = auth.authState.userInfo.role;

       if (role === "Simple Agent")
       {
           SetUserRole(false)
       }
       else if (role === "Super Agent")
       {
           SetUserRole(true) 
       }

       }

        const temp =[]

        
        }
       
       
        hello()
    },[Page])


    useEffect(()=>{
        async function hello()
        {

          //THIS IS ROLE OF AGENT
          if (auth.isAuthenticated())
          {
         const role = auth.authState.userInfo.role;
  
         if (role === "Simple Agent")
         {
             SetUserRole(false)
         }
         else if (role === "Super Agent")
         {
             SetUserRole(true) 
         }
  
         }
         //THIS IS ROLE OF AGENT
            
        if (!state.isAgent && auth.isAuthenticated())
        {
         
              
              const user_id=auth.authState.userInfo._id
              const  data = await fauth.authAxios.post("/user/events",{user_id});
              const temp =[]
              data.data.forEach(element => {
              temp.push(element)
                  
              });
              console.log(temp);
              SetEventData(temp);
              document.getElementById('SetNone').style.display="flex"
        }
        else
        {
            const data = await fauth.authAxios.get("/events/1");
            const data1= data.data.data;
            
            if(auth.isAuthenticated() && !auth.isAgent()) 
            
          { 
            


            const user_id=auth.authState.userInfo._id
            const  data2 = await fauth.authAxios.post("/user/events",{user_id});            
            const data3= data2.data;
            const dd1=[]
            const dd3=[]
            data1.forEach(d=>{
            dd1.push(d._id)
             })
            data3.forEach(d=>{
            dd3.push(d._id)
             })
            const dataFinal=  data1.filter(x => !data3.includes(x));
            const ddf=  dd1.filter(x => !dd3.includes(x));
            console.log("ddFF: ",ddf)
            const dataReal=[]

            data1.forEach(data=>{
              ddf.forEach(d=>{
                if(data._id===d)
                {
                  dataReal.push(data)
                }
              })
            })
            

            const temp =[]

            if(dataReal)
            {
                SetPageNum(Math.ceil(data.data.count/10))
                dataReal.forEach(element => 
                {
                  temp.push(element)
                });
                
                console.log(temp);
                SetEventData(temp);
               
             }
            
     }
     else
     {

        const temp =[]
        SetPageNum(Math.ceil(data.data.count/10))
        data1.forEach(element => {
        temp.push(element)

        });

        console.log(temp);
        SetEventData(temp);
       

      }

}

     
        
        }
       
      
        hello()
    },[state.isAgent])



    useEffect(()=>{
        async function hello()
    {
          
          //THIS IS USER ROLE FUNC
          if (auth.isAuthenticated())
          {
         const role = auth.authState.userInfo.role;
  
         if (role === "Simple Agent")
         {
             SetUserRole(false)
         }
         else if (role === "Super Agent")
         {
             SetUserRole(true) 
         }
  
         }  
          //THIS IS USER ROLE FUNC
            
        
        
        if (auth.isAuthenticated() && !auth.isAgent())
        {
        const user_id=auth.authState.userInfo._id
        const  subs = await fauth.authAxios.post("/user/events",{user_id});
        SetUserEvent(subs)
        }
        else 
        {
              const data = await fauth.authAxios.get("/events/1");    
          
              const temp =[]
              if(data)
            {
              SetPageNum(Math.ceil(data.data.count/10))

              data.data.data.forEach(element => 
                {
                  temp.push(element)  
                });
              
              console.log(temp);
              SetEventData(temp);
            }
        }
        
    }
       
        
        hello()
    },[])

    // useEffect(
    //   ()=>
    //   {
    //       if (EventData)
    //       {
    //         EventData.sort(compare)
    //         console.log("ffffffffffffffffffffff")
    //         console.log(EventData)
    //       }
    // }
    // ,[EventData])

    return (<><div>
            {auth.isAuthenticated() && auth.isAgent()?
                <SideBar/>:<></>
            }
     
            {/* <SideBar/> */}
        <div className= { (auth.isAuthenticated() && auth.isAgent()) ? "mobileEvent" : ""} >

        {
            auth.isAuthenticated() && !auth.isAgent() &&
            <>
        <p style={{color:"black",opacity:"80%",marginLeft:"10px"}}>{state.isAgent ? "All Events" : "My Events"}</p>
        <div className="radios">

        <Switch
        checked={state.isAgent}
        onChange={handleChange}
        name="isAgent"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
      

      </div>
      </>
        }
            <div id="SetNone"  className="flex-container container">
            


          
            
            {
                
            !EventData &&
            <div style = {{display:"grid",placeItems:"center",justifyContent:"center",alignItems:"center",width:"100%"}}>
            <div>
             <CircularProgress color="secondary" />
             </div>
             </div>
        }

            {EventData &&  EventData.map((Data,i)=>{
                return(
                <div className="flex-item-left"><Event delEv={delEv} index={i} event ={Data}
                 eventSubs ={state.isAgent} eventRole = {UserRole}
                 eventPass={Data.password} eventJoin={Data.id} eventName={Data.topic}  eventStatus={Data.status} eventTimezone={Data.timezone} eventID={Data._id} eventNo={Data.meetingNumber} /></div>
                );
            })}
            </div>

            </div>

            </div>
            { state.isAgent &&
            <div className={classes.root}style={{position:"fixed",bottom:"0",marginBottom:"40px",left:"50%",transform: "translateX(-50%)"}} >
          <Pagination style={{marginTop:"20px"}} count={pageNum} page={Page} onChange={handlePage} size="small" color="primary" /></div>
            }
            </>

    )
}

export default Home;