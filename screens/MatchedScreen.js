import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import tw from 'twrnc';


const MatchedScreen = () => {
  const navigation = useNavigation();
  const { params: { loggedInProfile, userSwiped } } = useRoute();

  return (
    <View style={[tw`h-full bg-red-500 pt-20`, { opacity: 0.89 }]}>
      <View style={tw`justify-center px-10 pt-20`}>
        <Image 
          source={{uri: 'https://links.papareact.com/mg9'}}
          style={tw`h-20 w-full`}
        />
        <Text style={tw`text-white text-center mt-10`}>
          You and { userSwiped.displayName } have liked each other.
        </Text>

        <View style={tw`flex-row justify-evenly mt-5`}>
          <Image 
            source={{uri: loggedInProfile.photoURL}}
            style={tw`h-32 w-32 rounded-full`}
          />

          <Image 
            source={{uri: userSwiped.photoURL}}
            style={tw`h-32 w-32 rounded-full`}
          />
        </View>

        <TouchableOpacity
          style={tw`bg-white rounded-full px-10 py-8 mt-15`}
          onPress={() => {
            navigation.goBack()
            navigation.navigate('Chat')
          }}
        >
          <Text style={tw`text-center`}>Send a Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default MatchedScreen