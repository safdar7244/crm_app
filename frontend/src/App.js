import React,{useEffect,useContext, useState} from "react"
import './App.css';
import * as firebaseui from "firebaseui";
import firebase from "firebase";
import PhoneVeri from "./PhoneVeri"
import NavBar from "./components/NavBar"
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Home from "./components/Home/Home"
import SideBar from "./components/context/SideBar";
import LogIn from "./components/SignUp_1"
// import EventForm from "./components/Home/EventForm"
import {AuthContext,AuthProvider} from "./components/context/AuthContext";
import EditProfile from "./components/EditProfile.jsx"
import AddEevnt from "./components/addEvent.jsx"
import {FetchProvider} from "./components/context/FetchContext"
import ForgotPass from "./components/forgotPass"

import Agent from "./components/Agent.jsx"
import Agents from "./components/Agents.jsx"
import EditEvent from "./components/EditEvent"
import eventDetails from "./components/details"
import editUser from "./components/editUser"
import zoomNew from "./components/zoomNew"

// import {ZoomMtg} from "@zoomus/websdk"
// ZoomMtg.setZoomJSLib('https://source.zoom.us/1.9.1/lib', '/av');
import Users from "./components/Users"
// ZoomMtg.preLoadWasm();
// ZoomMtg.prepareJssdk()





function App() {

  const ProtectedRoute = ({component: Component,...rest}) => 
  {
  const auth = useContext(AuthContext);
  console.log(auth.isAuthenticated());
  console.log(rest.path);
  console.log(Component);
  
  	return (
        <Route {...rest}
        render={(props) => 
            auth.isAuthenticated()  && auth.isAgent() ?(
                <Component {...props} />
            ):(
              <Redirect to="/" {...props}/>
            )
          }
          />
          
    );

}
//   const AgentRoute = () => {
//   const auth = useContext(AuthContext);
//   console.log("dasdsdsadsad");
//   const agent= auth.isAgent();
//   	return (
//         <Route path="/addagent"  render={() => 
//             auth.isAuthenticated() && auth.isAgent() ?(
//                <Agent />
//             ):(
//               <Redirect to="/" />
//             )
//           }
//           />
          
//     );

// }

//   const ManageClients = () => {
//   const auth = useContext(AuthContext);
//   console.log("dasdsdsadsad");
//   const agent= auth.isAgent();
//       return (
//         <Route path="/clients"  render={() => 
//             auth.isAuthenticated() && auth.isAgent() ?(
//             <Users />
//             ):(
//               <Redirect to="/" />
//             )
//           }
//           />
          
//     );

// }

const auth = useContext(AuthContext);

const [agent,Setagent]=useState(false)



  return(
    <Router>
      <AuthProvider>
      <FetchProvider>
      <NavBar/>
  

    <Switch>
          <div style ={{paddingTop:"100px"}}>
          
          <Route path="/reset/:userId/:token" exact component={ForgotPass} />
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={LogIn} />
          <Route path="/signup" exact component={PhoneVeri} />
          <Route path="/eventDetails" exact component={eventDetails}/>
          <Route path="/editProfile" exact component={EditProfile}/>
          <ProtectedRoute component={Users} path="/clients"/>
          <ProtectedRoute component={Agent} path="/addagent"/>
          <ProtectedRoute component={AddEevnt} path="/addEvent"/>
          <ProtectedRoute component={Agents} path="/agents"/>
          <ProtectedRoute component={EditEvent} path="/editEvent"/>
          <ProtectedRoute component={ForgotPass} path="/forgtPassword"/>
          <ProtectedRoute component={editUser} path="/editUser"/>
          <Route component={zoomNew} path="/zoomNew"/>
          <Route path="/reset/:userId/:token" exact component={ForgotPass} />
          </div>
        </Switch>

        </FetchProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
