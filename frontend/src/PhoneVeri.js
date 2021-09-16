import React,{useEffect} from "react"
import './App.css';
import * as firebaseui from "firebaseui";
import firebase from "firebase";
import StepForm from "./components/Step3_1"
import SignUp_1 from "./components/SignUp_1"

function PhoneVeri() {
  var firebaseConfig = {
    apiKey: "AIzaSyAoYm53x3u5siJ05XGZeEAV_zL0PgUEG7U",
    authDomain: "crm-app-a8c0e.firebaseapp.com",
    projectId: "crm-app-a8c0e",
    storageBucket: "crm-app-a8c0e.appspot.com",
    messagingSenderId: "42638318247",
    appId: "1:42638318247:web:f7ebb47fe37cb7d0f81982",
    measurementId: "G-B56KSS091B"
  };

  const [ph,setPh]=React.useState(0);
  // Initialize Firebase
  useEffect(()=>{

  if(!firebase.apps.length){  
  const fbase = firebase.initializeApp(firebaseConfig);
  }else{
    const fbase = firebase.app();
  }
    const uiConfig = {
      
      signInOptions: [firebase.auth.PhoneAuthProvider.PROVIDER_ID],
      defaultCountry: 'GB',
      defaultNationalNumber: '1234567890',
       'callbacks': {
      // Called when the user has been successfully signed in.
      'signInSuccessWithAuthResult': function(authResult, redirectUrl) {
        if (authResult.user) {
          console.log("boga ooasdasd");
        console.log(authResult.user);
        
        localStorage.setItem('phone',authResult.user.phoneNumber);
        setPh(authResult.user.phoneNumber);
        }
        
      
      }
      }
    };

     if(firebaseui.auth.AuthUI.getInstance()) {
      const ui = firebaseui.auth.AuthUI.getInstance()
      ui.start('#firebaseui-auth-container', uiConfig)
    } else {
      const ui = new firebaseui.auth.AuthUI(firebase.auth())
      ui.start('#firebaseui-auth-container', uiConfig)
    }
    
    // var ui = new firebaseui.auth.AuthUI(firebase.auth());
    // var anonymousUser = firebase.auth().currentUser;
    // ui.start("#firebaseui-auth-container", uiConfig);


  },[])

  return (
    <div>
    <div id="firebaseui-auth-container">
    </div>
  { ph && <div>
  
  <StepForm PhoneNum={ph} />

    </div>}

    </div>
  );
}

export default PhoneVeri;
