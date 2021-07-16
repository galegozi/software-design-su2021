// import App from "next/app";
import "../styles/globals.css";
import { userContext} from '../context/userContext'

import type { AppProps } from "next/app";
import {
  Provider as AlertProvider,
  positions as AlertPositions,
} from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { useEffect } from "react"
import localforage from "localforage"
import jwtDecode from "jwt-decode"
import { useState } from "react"
import { useCallback } from "react"

const AlertOptions = {
  position: AlertPositions.TOP_CENTER,
  timeout: 3000,
};

export interface Token {
  iss: string
  aud: string
  exp: number
  iat: number
  sub: { id: number, username: string}
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [user, setUser] = useState<{username: string, id: number, loading: boolean}>({username: '', id: null, loading: true})
   useEffect(() => {
  (async () => {
    const token = await localforage.getItem('token')

    if(token && typeof token == 'string'){

      const decoded: Token = jwtDecode(token) as Token
      console.log(decoded)
      
      const {username, id } = decoded.sub
        setUser({username, id, loading: false})
      
    } else {
      setUser({username: null, id: null, loading: false})
    }
    
  })()
  },[] )

  const logout = useCallback(() => {
    setUser({username: null, id: null, loading: false})
  }, [])

  const login = useCallback((username: string, id: number) => {
    setUser({ username, id, loading: false })
  }, [user])
  return (
    <userContext.Provider value={{user, logout, login}}><AlertProvider {...AlertOptions} template={AlertTemplate}>
      <Component {...pageProps} />
    </AlertProvider></userContext.Provider>
  );
};

export default MyApp;
