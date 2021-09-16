import React, { useState, useEffect ,useContext } from 'react';
///import Table from 'react-bootstrap/Table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
// import Button from 'react-bootstrap/Button';
import Axios from "axios";
import  { AuthContext } from "./context/AuthContext";
import SideBar from "./context/SideBar";

// import Pagination from './Pagination'
import { Link } from "react-router-dom"
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { Button } from '@material-ui/core';
import {FetchContext, FetchProvider} from "./context/FetchContext"
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));


export default function Agents(props) {

  const auth = useContext(AuthContext);
  const fauth = useContext(FetchContext);

  const [users, setUsers] = useState(null);
  const [page, setPage] =   useState(null);
  const [check, setCheck] = useState(0);
  const [error, setError] = useState(null);
  const [Page,SetPage]=useState(1);
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


  const EditButton=
  {
    background :"#2f5d62",
    color:"white",
    maxWidth:"85px",
    fontSize:"10px",
    borderRadius:"2px",
    height:"33px"
  }

  const DeleteButton=
  {
    background :"red",
    color:"white",
    maxWidth:"85px",
    fontSize:"10px",
    padding:"10px",
    borderRadius:"5px"
  }

  const classes = useStyles();
  
  useEffect(() => {

    const getUsers = async () => {
      try 
      {
        const data = await fauth.authAxios.get("/agents/1")

        console.log(data);
        setUsers(data.data.data);
        SetPageNum(Math.ceil(data.data.count/10))
        
      } 
      catch (err) 
      {
        console.log(err);
        setError("An error occured!")
      }
    }
    getUsers();
  }, []);

  useEffect(() => {

    const getUsers = async () => {
      try 
      {
        const data = await fauth.authAxios.get(`/agents/${Page}`)

        console.log(data);
        SetPageNum(Math.ceil(data.data.count/10))
        setUsers(data.data.data);
      } 
      catch (err) {
        console.log(err);
        setError("An error occured!")
      }
    }
    getUsers();
  }, [Page]);


  const [editUser,SeteditUser]=useState(false)

  async function EditClick(e)
  {
    console.log(e.target.value)

    const Data=
    {
      id:e.target.id,
      role:e.target.value
    }

    try
    {
    const del = await  fauth.authAxios.patch("/agents",Data);
    alert("Agent Updated")
    }
    catch(error)
    {
      console.log(error)
      alert("Error Occurred")
    }
  }

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
    const del = await  fauth.authAxios.post("/agents/delete",id);
    console.log(e.target.value)
    const arr = users
    setUsers(null)
    arr.splice(e.target.value,1)
    console.log(arr)
    setUsers(arr)
    alert("Agent Deleted")
    }
    catch(err)
    {
      alert("Error Occurred")
    }    
   
    
  }
  


  return (
    <>

{ auth.isAuthenticated() && auth.isAgent()? 
                <SideBar/>:<></>
            }

      {!error && <>

        {!users && <>
          <div style = {{display:"grid",placeItems:"center",justifyContent:"center",alignItems:"center",width:"100%"}}>
        <div>
            <CircularProgress color="secondary" />
            </div>
        </div>
        </>}
        {users && <div className="content" style={{background:"none"}}>
   

          <div style={{marginLeft:"10px", marginRight:"10px", color:"black",fontSize:"16px"}} className="tabler">
          <Table style ={TableStyle} className="yo">
            <Thead>
              <Tr>

                <Th style={{color:"black"}}>.      .    .</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>PhoneNumber</Th>
                <Th>Last Login</Th>
                <Th>Role</Th>
                <Th>Edit</Th>
                <Th>Delete User</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user, i) => {
                return (
                  <Tr>
                    <Td style={{color:"white"}}>{i}</Td>
                    <Td data-label="Name"> 
                      {user.name} 

                    </Td>
                    <Td  data-label="Email">{user.email}</Td>
                    <Td  data-label="number">{user.phoneNo}</Td>
                    {user.lastLogin ?
                    <Td  data-label="lastLogin">{user.lastLogin.slice(0,10)+" "}<br/> {user.lastLogin.slice(10)}</Td>
                    :<Td  data-label="lastLogin">not found</Td>
                    }
                    
                    <Td  data-label="State">{user.stateName}{user.role}</Td>
                    <Td style={{padding:"0px",margin:"0px"}}>
                    <select id={user._id} onChange={EditClick} style={EditButton} name="Edit Role"className="HalfCustom" >
                        <option value="Simple Agent" defaultValue>Change Role</option>
                        <option value="Simple Agent" >Simple Agent</option>
                       <option value="Super Agent">Super Agent</option>
                    </select></Td>
                    <Td style={{padding:"0px",margin:"0px"}}> <button onClick={DeleteClick} value={i} id={user._id} style={DeleteButton}>Delete </button></Td>
                    
                  </Tr>

                );
              })}

            </Tbody>
          </Table>
          <div>
          <div className={classes.root}style={{position:"fixed",bottom:"0",marginBottom:"40px",left:"54%",transform: "translateX(-54%)"}} >
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