import { StatusBar } from 'expo-status-bar';
import { View, Text, Button } from 'react-native'
import React from 'react'
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../hooks/useAuth';

const HomeScreen = () => {
    const navigation = useNavigation();
    const { logout } = useAuth();
  return (
    <View style={tw`items-center justify-center flex-1`}>
        <Text>home screen</Text>
        <Button title='Click me' onPress={() => navigation.navigate('Chat')}/>
        <Button title='Log Out' onPress={logout}/>
    </View>
  )
}

export default HomeScreen