import { StatusBar } from 'expo-status-bar';
import { View, Text, Button } from 'react-native'
import React from 'react'
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const navigation = useNavigation();
  return (
    <View style={tw`items-center justify-center flex-1`}>
        <Text>home screen</Text>
        <Button title='Click me' onPress={() => navigation.navigate('Chat')}/>
    </View>
  )
}

export default HomeScreen