import { StatusBar } from 'expo-status-bar';
import { View, Text, Button, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { useLayoutEffect } from 'react'
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../hooks/useAuth';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons'

const HomeScreen = () => {

  const navigation = useNavigation();
  const { user, logout } = useAuth();

  return (
    <SafeAreaView>
      {/* Header */}
        <View style={tw`items-center justify-between flex-row px-5`}>
          <TouchableOpacity
            onPress={logout}
          >
            <Image 
              source={{uri: user.photoURL}}
              style={tw`h-10 w-10 rounded-full`}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image 
              source={require("../tinder.png")}
              style={tw`w-14 h-14`}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Ionicons name='chatbubbles-sharp' size={30} color="#FF5864"/>
          </TouchableOpacity>
        </View>

      {/* End of Header */}
        {/* <Text>home screen</Text>
        <Button title='Click me' onPress={() => navigation.navigate('Chat')}/>
        <Button title='Log Out' onPress={logout}/> */}
    </SafeAreaView>
  )
}

export default HomeScreen