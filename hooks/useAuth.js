import { View, Text } from 'react-native'
import React, { createContext, useContext } from 'react'
import * as Google from 'expo-google-app-auth'

const AuthContext = createContext({})

const config = {
    iosClientId: '46940775425-8rc6pqjtu0cn4pcebttneheje89fhk34.apps.googleusercontent.com',
    androidClientId: '46940775425-j4r5ha7ch7s2tvqnugifla3v77bj4bjj.apps.googleusercontent.com',
    scopes: ["profile", "email"],
    permissions: ["public_profile", "email", "gender", "location"],
}

export const AuthProvider = ({ children }) => {

    const signInWithGoogle = async () => {
        Google.logInAsync(config).then(async (logInResult => {
            if(logInResult.type === 'success') {
                // login...
            }
        }))
    }

  return (
    <AuthContext.Provider value={{
        user: null,
        signInWithGoogle
    }}>
      {children}
    </AuthContext.Provider>
  )
}


export default function useAuth() {
    return useContext(AuthContext);
}