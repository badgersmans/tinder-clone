import { View, Text, Button, SafeAreaView, ImageBackground, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import useAuth from '../hooks/useAuth'
import { useNavigation } from '@react-navigation/native'
import tw from 'twrnc'

const LoginScreen = () => {
    const { loading, signInWithGoogle } = useAuth()
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        })
    }, [])
  return (
    <View style={tw`flex-1`}>
        <ImageBackground
            source={{uri: "https://tinder.com/static/tinder.png"}}
            style={tw`flex-1`}
        >
            <TouchableOpacity 
                onPress={signInWithGoogle} 
                style={[tw`absolute bottom-28 w-52 bg-white p-4 rounded-2xl`, { marginHorizontal: '25%' }]}
            >
                <Text style={tw`text-center font-semibold`}>Sign in & get matched</Text>
            </TouchableOpacity>
        </ImageBackground>
    </View>
  )
}

export default LoginScreen