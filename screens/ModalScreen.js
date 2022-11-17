import { View, Text, Image } from 'react-native'
import React from 'react'
import tw from 'twrnc'

const ModalScreen = () => {
  return (
    <View style={tw`flex-1 items-center pt-3`}>
      <Image 
        source={{uri: 'https://links.papareact.com/2pf'}}
        style={tw`h-20 w-full`}
        resizeMode='contain'
      />
    </View>
  )
}

export default ModalScreen