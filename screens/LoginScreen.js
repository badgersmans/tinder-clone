import { View, Text, Button } from 'react-native'
import React from 'react'
import useAuth from '../hooks/useAuth'

const LoginScreen = () => {
    const { user, signInWithGoogle } = useAuth()
  return (
    <View>
      <Text>login screen</Text>
      <Button title="Sign In With Google" onPress={signInWithGoogle}/>
    </View>
  )
}

export default LoginScreen