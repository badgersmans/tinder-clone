import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
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
    const [user, setUser] = useState(null)
    const [loadingInitial, setLoadingInitial] = useState(true)
    const [loading, setLoading] = useState(false)

    useEffect(() => onAuthStateChanged(auth, (user) => {
        if(user) {
            // Logged in
            setUser(user)
        } else {
            // Not logged in
            setUser(null)
        }
        setLoadingInitial(false)
    }), [])

    const signInWithGoogle = async () => {
        setLoading(true)

        await Google.logInAsync(config).then(async (logInResult) => {
            if(logInResult.type === 'success') {
                // login...
                const { idToken, accessToken } = logInResult;
                // console.log(logInResult)
                const credential = GoogleAuthProvider.credential(idToken, accessToken);

                await signInWithCredential(auth, credential);
            }
            return Promise.reject();
        }).catch(error => setError(error))
        .finally(() => setLoading(false))
    }

    const logout = async () => {
        setLoading(true)

        await signOut(auth).catch(error => setError(error)).finally(()=> setLoading(false));
    }

    const memoedValue = useMemo(() => ({
        user,
        loading,
        error,
        signInWithGoogle,
        logout
    }), [user, loading, error])

  return (
    <AuthContext.Provider value={memoedValue}>
      { !loadingInitial && children}
    </AuthContext.Provider>
  )
}


export default function useAuth() {
    return useContext(AuthContext);
}