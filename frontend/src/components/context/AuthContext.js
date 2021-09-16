import React, {useState, createContext } from "react";

const AuthContext = createContext();
const {Provider} = AuthContext;

const AuthProvider = ({ children})=>{
    
  const token = localStorage.getItem('token');
  const userInfo = localStorage.getItem('userInfo');
  const expiresAt = localStorage.getItem('expiresAt');
  
    const [authState, setAuthState] = React.useState({
                token,
                expiresAt,
                userInfo: userInfo? JSON.parse(userInfo):null,
             });
    
    const setAuthInfo = ({token, expiresAt, userInfo})=>{
        
        localStorage.setItem('token', token);
        localStorage.setItem(
        'userInfo',
        JSON.stringify(userInfo)
        );
        localStorage.setItem('expiresAt', expiresAt);
    

        setAuthState({
            token,
            expiresAt,
            userInfo,
        });

    };

    const isAuthenticated=()=>{

        if(!authState.token || !authState.expiresAt){
            return false;
        }
        
        return new Date().getTime() / 1000 < authState.expiresAt;

    }

    const isAgent=()=>{

        if(authState.userInfo){
        return authState.userInfo.isAgent;
        }
        else 
         return false;
    }
    

    const logOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
    
        localStorage.removeItem('expiresAt');
        setAuthState({
            token: null,
            expiresAt:null,
            userInfo:{}

        });

        window.locattion="/";

    }

    return (
        <Provider 
            value = {{
            authState,
            setAuthState: authInfo => setAuthInfo(authInfo),
            isAuthenticated,
            logOut,
            isAgent,
            } } 
        > 
        { children }
        </Provider>
    );
};

export {AuthContext , AuthProvider};


