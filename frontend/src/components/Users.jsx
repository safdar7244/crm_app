import React, { useState, useEffect ,useContext } from 'react';
///import Table from 'react-bootstrap/Table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
// import Button from 'react-bootstrap/Button';
import Axios from "axios";
import  { AuthContext } from "./context/AuthContext";
import {FetchContext, FetchProvider} from "./context/FetchContext"
import SideBar from "./context/SideBar";
import {Redirect} from 'react-router-dom'
// import Pagination from './Pagination'
import { Link } from "react-router-dom"
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { Button } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function Users(props) {

  const auth = useContext(AuthContext);
  const fauth = useContext(FetchContext);


  const [UserRole,SetUserRole]=useState(false);
  const [Red,SetRed]=useState(false);
  const [users, setUsers] = useState(null);
  const [page, setPage] =   useState(null);
  const [check, setCheck] = useState(0);
  const [error, setError] = useState(null);
  const [Page,SetPage]=useState(1);
  const [idd,SetIdd]=useState(null);
   
  
    const [pageNum,SetPageNum]=useState(0);

  function handlePage(event, value)
  {
      
      SetPage(value);
      console.log(value)
  }
 

  const TableStyle =
  {
   
    minHeight:"400px",
    background:"white",
    opacity:"80%"
  }

  const DeleteButton=
  {
    background :"red",
    color:"white",
    maxWidth:"80px",
    fontSize:"10px",
    padding:"10px",
    borderRadius:"5px"
    
  }

  
  useEffect(() => {

    const getUsers = async () => {

      console.log("HELLO I AM 222222");
      try 
      {


        const data = await fauth.authAxios.get("/clients/1")

        console.log(data.data);
        SetPageNum(Math.ceil(data.data.count/10))
        setUsers(data.data.data);
      } 
      catch (err) 
      {
        console.log(err);
        setError("An error occured!")
      }

      if (auth.authState.userInfo.role === "Simple Agent")
       {
          SetUserRole(false)
       }
       else if (auth.authState.userInfo.role === "Super Agent")
      {
        SetUserRole(true)
      }
    }
    getUsers();
  }, []);


  async function AgentAddSub(e)
  {
    console.log(props.location.state.AgentAddtoEvent)
    const info=
      {
        user_id : e.target.id,
        meeting_id : props.location.state.AgentAddtoEvent
      }

      try
      {
      const data = await fauth.authAxios.post("/subscribe",info);
      alert("Suscriber Added")
      }
      catch(err)
      {
        console.log(err)
        alert("Error Ocuured")
      }
  }

  useEffect(() => {

    const getUsers = async () => {

      console.log("HELLO I AM 1");
      try {
        setUsers(null);
        const data = await fauth.authAxios.get(`/clients/${Page}`)

        console.log(data.data);
        setUsers(data.data.data);
        SetPageNum(Math.ceil(data.data.count/10))
      } catch (err) {
        console.log(err);
        setError("An error occured!")
      }

      if (auth.authState.userInfo.role === "Simple Agent")
       {
          SetUserRole(false)
       }
       else if (auth.authState.userInfo.role === "Super Agent")
      {
        SetUserRole(true)
      }
    }
    getUsers();
  }, [Page]);


  
  async function DeleteClick(e)
  {
    const id1 = e.target.id;
    console.log(id1)
    const id=
    {
      id:id1
    }
    try
    {
    const del = await fauth.authAxios.post("/clients/delete",id);
    console.log(e.target.value)
    const arr = users
    setUsers(null)
    arr.splice(e.target.value,1)
    console.log(arr)
    setUsers(arr)

    console.log(del)
    alert("Client Deleted")
    }

    catch(err)
    {
      console.log(err)
      alert("An Error Occurred Try Again Later")
    }
  }

 
  function EditClick(e)
  {
    
    console.log(e.target.id)
    SetIdd(users[e.target.id])
    SetRed(true)
    console.log(users[e.target.id])
  }

  return (
    <>


{ auth.isAuthenticated() && auth.isAgent()? 
                <SideBar/>:<></>
            }

            { Red &&  
             <Redirect
            to={{
            pathname: "/editUser",
            state: { User: idd }
          }}
        />}

      {!error && <>

        {!users && <div style = {{display:"grid",placeItems:"center",justifyContent:"center",alignItems:"center",width:"100%"}}>
        <div>
            <CircularProgress color="secondary" />
            </div>
        </div>}

       
        {users && <div className="content" style={{background:"none"}}>
    

          <div style={{marginLeft:"10px", marginRight:"10px", color:"black",fontSize:"16px"}} className="tabler">

          

          <Table style ={TableStyle} className="yo">

          
            <Thead>
              <Tr>

                <Th style={{color:"black"}}>.      .    .</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>PhoneNumber</Th>
                <Th>Address</Th>
                <Th>Country</Th>
                <Th>City</Th>
                <Th>NIT/ID</Th>
                <Th>VID</Th>
                <Th>Last Login</Th>
                <Th>Edit</Th>

                {/* <Th>Edit</Th> */}
                {
                  UserRole && !props.location.state &&
                  <Th>Delete</Th>
                }
                {
                  props.location.state &&
                  <Th>Add As Suscriber</Th>
                }

                


              </Tr>
            </Thead>
            <Tbody>
              {users.map((user, i) => {
                return (
                  <Tr>
                    <Td style={{color:"white"}}>{i}</Td>
                    <Td data-label="Name"> 
                      {user.contactName? user.contactName : user.firstName + " " + user.lastName} 
                      
                    </Td>
                    <Td  data-label="Email">{user.email}</Td>
                    <Td  data-label="phone">{user.phoneNo}</Td>
                    <Td  data-label="address">{user.address}</Td>
                    <Td  data-label="address">{user.country}</Td>
                    <Td  data-label="address">{user.city}</Td>
                    <Td  data-label="nit">{user.id}{user.nit}</Td>
                    <Td  data-label="vid">{user.vid? user.vid :"None"}</Td>
                    <Td  data-label="lastlogin">{user.lastLogin.slice(0,10)+" "}<br/> {user.lastLogin.slice(10)}</Td>
                    <Td style={{padding:"0px",margin:"0px"}}> <button onClick={EditClick} id={i} style={DeleteButton}>Edit </button></Td>
                    {
                      UserRole&& !props.location.state &&
                    <Td style={{padding:"0px",margin:"0px"}}> <button onClick={DeleteClick} value={i} id={user._id} style={DeleteButton}>Delete </button></Td>
                    }
                   
                    {
                      props.location.state &&
                      <Td style={{padding:"0px",margin:"0px"}}> <button onClick={AgentAddSub} id={user._id} style={DeleteButton}>Add As Suscriber </button></Td>
                    }

                

                    
                  </Tr>

                );
              })}

            </Tbody>
          </Table>

          <div>

          <div style={{position:"fixed",bottom:"0",marginBottom:"40px",left:"54%",transform: "translateX(-54%)"}} >
        <Pagination style={{marginTop:"20px"}} count={pageNum} page={Page} onChange={handlePage} size="small" color="primary" /></div>
        </div>

          </div>

        </div>}

      </>}
      {error && <>
        <h1>An error occured!</h1>
      </>}
    </>
  );
}