import zIndex from '@material-ui/core/styles/zIndex';
import React ,{useState,useEffect,useContext} from 'react'
import { NavLink,Link } from "react-router-dom";
import  { AuthContext } from "../context/AuthContext";

function Sidebar() {


  const [UserRole,SetUserRole]=useState(false);
  const auth = useContext(AuthContext);


  useEffect(()=>{
    
    async function hello()
    {
      if (auth.isAuthenticated())
      {
       if (auth.authState.userInfo.role === "Simple Agent")
       {
          SetUserRole(false)
       }
       else if (auth.authState.userInfo.role === "Super Agent")
      {
        SetUserRole(true)
      }
    }
     
    }
   
    hello()
},[])


  

  const [mobileShow,SetmobileShow]=useState(false)

  function HandleClick()
  {
    SetmobileShow(!mobileShow)
  }

  const displaySidebar=
  {
    position:"fixed",
    bottom: "10",
    background:"#413c69",
    right:"0",
    borderRadius:"50",
    color:"white",
    padding:"20px",
    zIndex:"1000",
    top:"90%",
    borderRadius:"50%",
    marginRight:"30px"
  }


  const MobileBar=
  {
    position:"fixed",
    background:"#F5F5F5",
    width:"200px",
    color:"black",
    border:"0px",
    boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    right:"0",
    zIndex:"1000",
    top:"60%",
    marginRight:"10px",
    alignText:"center",
    fontSize:"20px"
  }


  function MobileSideBar()
  {
    return(
      <div style={MobileBar}>
       <NavLink className="links" style ={{color:"white", fontWeight:"bolder",background:"#413c69"}} activeClassName='linksactive' to="/clients" exact={true}>Clients</NavLink>
       <NavLink className="links" style ={{color:"white", fontWeight:"bolder",background:"#413c69"}} activeClassName='linksactive' to="/addagent">Agents</NavLink>
      </div>
    )
  }

  const SidebarStyle ={
    paddingTop:"100px",
    background:"#F5F5F5",
  color:"black",
  border:"0px",
  boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  fontSize:"20px"
  }

 return (
  <div>

{auth.isAuthenticated() && auth.isAgent() &&

<div className="mobileSidebar" >
<a onClick={HandleClick} style={displaySidebar} class="glyphicon glyphicon-cog"/>
  {
    mobileShow &&  auth.isAuthenticated() && auth.isAgent() &&
  <div style={MobileBar}>
  {
    UserRole &&
     <>
     <NavLink className="links" style ={{color:"white", fontWeight:"bolder",background:"#413c69"}} activeClassName='linksactive' to="/addagent">Add Agents</NavLink>
   <NavLink className="links" style ={{color:"white", fontWeight:"bolder",background:"#413c69"}} activeClassName='linksactive' to="/agents" exact={true}>Agents</NavLink>
   </>
   }
   <NavLink className="links" style ={{color:"white", fontWeight:"bolder",background:"#413c69"}} activeClassName='linksactive' to="/clients" exact={true}>Clients</NavLink>
   
   <NavLink className="links" style ={{color:"white", fontWeight:"bolder",background:"#413c69"}} activeClassName='linksactive' to="/addEvent">Add Events</NavLink>
 </div>
  }
</div>

}
   <div style ={SidebarStyle} className="sidebar" >

   <h1 style={{textAlign:"center",fontSize:"20px"}}>Welcome to Zoom App</h1>
   { auth.isAuthenticated() && auth.isAgent() &&

   <>
   {
    UserRole &&
     <>
     <NavLink className="links" style ={{color:"white", fontWeight:"bolder",background:"#413c69"}} activeClassName='linksactive' to="/addagent">Add Agents</NavLink>
   <NavLink className="links" style ={{color:"white", fontWeight:"bolder",background:"#413c69"}} activeClassName='linksactive' to="/agents" exact={true}>Agents</NavLink>
   </>
   }
   <NavLink className="links" style ={{color:"white", fontWeight:"bolder",background:"#413c69"}} activeClassName='linksactive' to="/clients" exact={true}>Clients</NavLink>
   
   <NavLink className="links" style ={{color:"white", fontWeight:"bolder",background:"#413c69"}} activeClassName='linksactive' to="/addEvent">Add Events</NavLink>
   </>

   }
   </div>
 

  </div>
 )
}

export default Sidebar;