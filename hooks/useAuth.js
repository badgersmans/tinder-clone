import { View, Text } from 'react-native'
import React, { createContext, useContext, useState } from 'react'
import * as Google from 'expo-google-app-auth'
import { 
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithCredential,
    signOut
 } from 'firebase/auth'
import { auth } from '../firebase'

const AuthContext = createContext({})

const config = {
    iosClientId: '46940775425-8rc6pqjtu0cn4pcebttneheje89fhk34.apps.googleusercontent.com',
    androidClientId: '46940775425-j4r5ha7ch7s2tvqnugifla3v77bj4bjj.apps.googleusercontent.com',
    scopes: ["profile", "email"],
    permissions: ["public_profile", "email", "gender", "location"],
}

export const AuthProvider = ({ children }) => {

    const [error, setError] = useState(null)

    const signInWithGoogle = async () => {
        await Google.logInAsync(config).then(async (logInResult) => {
            if(logInResult.type === 'success') {
                // login...
                const { idToken, accessToken } = logInResult;
                console.log(logInResult)
                const credential = GoogleAuthProvider.credential(idToken, accessToken);

                await signInWithCredential(auth, credential);
            }

            return Promise.reject();
        }).catch(error => setError(error))
        
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