import React, { createContext, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
//"https://apple-shortcake-28807.herokuapp.com"
const apiURL= "https://whispering-beyond-76044.herokuapp.com";
// const apiURL= "http://localhost:3001"
const FetchContext = createContext();
const { Provider } = FetchContext;

const FetchProvider = ({ children }) => {
  const authContext = useContext(AuthContext);

  const authAxios = axios.create({
    baseURL: apiURL
  });

  authAxios.interceptors.request.use(
    config => {
      config.headers.Authorization = `Bearer ${authContext.authState.token}`;
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  authAxios.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      const code =
        error && error.response ? error.response.status : 0;
      if (code === 401 || code === 403) {
        console.log('error code', code);
        authContext.logOut();
      }
      return Promise.reject(error);
    }
  );

  return (
    <Provider
      value={{
        authAxios
      }}
    >
      {children}
    </Provider>
  );
};

export { FetchContext, FetchProvider };
