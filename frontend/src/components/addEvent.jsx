import React, { useState, useContext } from 'react';
import axios from "axios";
import SideBar from "./context/SideBar";
import  { AuthContext } from "./context/AuthContext";
import {FetchContext, FetchProvider} from "./context/FetchContext"
import Alert from '@material-ui/lab/Alert';
// import FormDataa from 'form-data'
import firebase from 'firebase';
import $ from "jquery"

function AddEvent() {


    var firebaseConfig = {
        apiKey: "AIzaSyAoYm53x3u5siJ05XGZeEAV_zL0PgUEG7U",
        authDomain: "crm-app-a8c0e.firebaseapp.com",
        projectId: "crm-app-a8c0e",
        storageBucket: "crm-app-a8c0e.appspot.com",
        messagingSenderId: "42638318247",
        appId: "1:42638318247:web:f7ebb47fe37cb7d0f81982",
        measurementId: "G-B56KSS091B"
      };


    const auth = useContext(AuthContext);
    const fauth = useContext(FetchContext);
    const [wrongLog,SetWrongLog]=useState(false);
    const [error,setError]=useState("");
    const [fale,SetFale]= useState(null)

    const [FormDataa, SetFormData] = useState(
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
        // console.log("All Event Data ", FormData)

        // try
        // {
        // const del = await fauth.authAxios.post("/events",FormData)
        // console.log(del)
        

        // document.getElementById("subBut").style.display="none"

        // alert("Event Added!")
        // }
        // catch(err)
        // {
        // SetWrongLog(true)
        // console.log(err)
        
        // const { data } = err.response;
        //     if (data)
        //     {
        //     setError(data.message);
        //     }
        //     else 
        //     {
        //         setError("Unknown Error Occurred");
        //     }
        // }



        const form = new FormData();
        
        //NEW

        var fbase = null 
        if(!firebase.apps.length)
        {  

            fbase = firebase.initializeApp(firebaseConfig);
        }
        else
        {
            fbase = firebase.app();
        }

            const storageRef = fbase.storage().ref();
            var imageName=fale.name;
            console.log(imageName);
            const fileRef = storageRef.child(fale.name);
   

            var uploadTask = fileRef.put(fale);

            uploadTask.on('state_changed', 
            (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            SetWrongLog(true)
            console.log('Upload is ' + progress + '% done');
            setError('Adding Event Please Wait');

            }, 
            (error) => {}, 
            () => {
            
            uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
            console.log('File available at',downloadURL);

            try
            {
                  
    
                FormDataa.imageUrl = downloadURL
    
                console.log(FormDataa)
    
                const del = await fauth.authAxios.post("/events",FormDataa)
                console.log(del)
                setError('Added Event');
    
            }
            catch(err)
            {
                console.log(err)
            }


            });});

        //NEW

        form.append('file', fale);

        console.log(form.entries().next())
        
       

        

       

    }

    function handleChange2(e)
    {
        // var file = e.target.files[0];
        // const formData = new FormDataa();
        // formData.append('file', file);

        // try{
        //       const suc = fauth.authAxios.post("/events",formData, {
        //       headers: {
        //         'accept': 'application/json',
        //         'Accept-Language': 'en-US,en;q=0.8',
        //         'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        //       }
        //     })

        //     console.log(suc)
        // }
        // catch(err)
        // {
        //     console.log(err)
        // }
              

        // FormData.picture = file

        SetFale( e.target.files[0])

    }


    return (
        <div>

            {auth.isAuthenticated() && auth.isAgent()?
                <SideBar/>:<></>
            }

            
        <div style={{margin:"auto"}} class="container-fluid" className="container-fluid container FluidStyle">
        {
        wrongLog &&
      <Alert style ={{position:"fixed",width:"70%",zIndex:"1120",justifyContent:"center",alignItems:"center",marginLeft:"auto",marginRight:"auto",top:"0",margin:"20px",marginTop:"80px",fontSize:"17px"}}severity="error" onClick={()=>{SetWrongLog(false)}}>{error}</Alert>
      }
            <h1 style={{color:"black",paddingBottom:"10px",opacity:"70%"}}>Add New Event</h1>
            <form style={{color:"black"}} onSubmit={HandleSubmit}>

                <input style={{color:"black"}} onChange={handleChange} name="eventName" type="text" placeholder="Name" required />
                <input style={{color:"black"}} onChange={handleChange} name="topic" type="text" placeholder="Topic" required />
                <input style={{color:"black"}} onChange={handleChange} name="startTime" type="Time" placeholder="Start Time" required/>
                <input style={{color:"black"}} onChange={handleChange} name="date" type="Date" className="" placeholder="Date" required/>
                <input style={{color:"black"}} onChange={handleChange} name="meetingNumber" type="text" placeholder="Meeting Number" required/>
                <input style={{color:"black"}} onChange={handleChange} name="password" type="text" placeholder="Password" required/>
                <input style={{color:"black"}} onChange={handleChange} name="description" type="text" placeholder="Description" required/>
                <input style={{color:"black"}} onChange={handleChange2} type="file" id="myFile" name="eventPic" required/>
                <button style={{color:"white",background:"#413c69"}} id="subBut" type="submit">Submit</button>
            </form>
            </div>
        </div>
      
    )
}
export default AddEvent;