import React,{useContext} from "react";
import {Link} from "react-router-dom"
import  { AuthContext } from "./context/AuthContext";


const NavbarStyle={
  position:"fixed",
  right:"0",
  left:"0",
  borderRadius:"0px",
  minHeight:"70px",
  zIndex:"99",
  background:"#F5F5F5",
  color:"black",
  border:"0px",
  
}




function NavBar()
{
   const auth = useContext(AuthContext);

   if (auth.isAuthenticated())
   {
   if (auth.authState.userInfo.name == "undefined undefined")
   {
    auth.authState.userInfo.name = null
   }
  }

   return ( 
   <nav className="navbar navbar-inverse" id ="navvbar"style={NavbarStyle}>
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" style ={{width:"45px"}} className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>                        
            </button>
            <a className="navbar-brand" style ={{color:"#413c69",fontWeight:"bolder",fontSize:"25px",marginLeft:"10px"}} href="#">Logo</a>
          </div>
          <div className="collapse navbar-collapse" id="myNavbar">
            <ul className="nav navbar-nav navbar-right">

              
                <li ><Link style ={{color:"#413c69",fontSize:"20px"}} to="/"><span className="glyphicon glyphicon-home"></span> Home</Link></li>
             
              { !auth.isAuthenticated() &&
              <li><Link style ={{color:"#413c69",fontSize:"20px"}} to="/signup"><span className="glyphicon glyphicon-user"></span> 
              Sign Up </Link></li>
              }

              {
                auth.isAuthenticated() && 
                <li><Link style ={{color:"#413c69",fontSize:"20px"}} to="/editProfile"><span className="glyphicon glyphicon-user"></span> { auth.authState.userInfo.name ? auth.authState.userInfo.name : auth.authState.userInfo.contactName }</Link></li>
              }

              <li><Link style ={{color:"#413c69",fontSize:"20px"}} to="/login"><span className="glyphicon glyphicon-list-alt"></span> 
              {auth.isAuthenticated()? <span onClick={auth.logOut}>{ " Log Out"}</span>:" Login" } </Link></li>
                
            </ul>
          </div>
        </div>
      </nav>);


}
export default NavBar;