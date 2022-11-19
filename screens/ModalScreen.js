import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import useAuth from '../hooks/useAuth'
import { useNavigation } from '@react-navigation/native'
import {doc, setDoc, serverTimestamp} from 'firebase/firestore'
import { db } from '../firebase'

const ModalScreen = () => {

    const { user } = useAuth();
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    const [job, setJob] = useState(null);
    const [age, setAge] = useState(null);

    const incompleteForm = !image || !job || !age;

    // useLayoutEffect(() => {
    //     navigation.setOptions({
    //         headerShown: true,
    //         headerTitle: 'Update your profile',
    //         headerStyle: {
    //             backgroundColor: '#FF5864',
    //         },
    //         headerTitleStyle: { color: 'white' }
    //     })
    // }, [])

    const docRef = doc(db, "users", user.uid);
    const data = {
        id: user.uid,
        displayName: user.displayName,
        photoURL: image,
        job: job,
        age: age,
        timestamp: serverTimestamp()
    }

    const updateUserProfile = () => {
        setDoc(docRef, data).then(() => {
            navigation.navigate('Home')
        }).catch(error => {
            alert(error.message)
        });
    }

  return (
    <View style={tw`flex-1 items-center pt-3`}>
      <Image 
        source={{uri: 'https://links.papareact.com/2pf'}}
        style={tw`h-20 w-full`}
        resizeMode='contain'
      />

      <Text style={tw`text-xl text-gray-500 p-2 font-bold`}>
        Welcome { user.displayName }
      </Text>

      <Text style={tw`text-red-400 p-4 text-center font-bold`}>
        Step 1: Upload profile pic
      </Text>

      <TextInput 
        style={tw`text-center text-xl pb-2`}
        placeholder='URL to profile pic'
        onChangeText={setImage}
        value={image}
      />

      <Text style={tw`text-red-400 p-4 text-center font-bold`}>
        Step 2: Occupation
      </Text>

      <TextInput 
        style={tw`text-center text-xl pb-2`}
        placeholder='What do you do for a living?'
        onChangeText={setJob}
        value={job}
      />

      <Text style={tw`text-red-400 p-4 text-center font-bold`}>
        Step 3: Age
      </Text>

      <TextInput 
        style={tw`text-center text-xl pb-2`}
        placeholder='How old are you?'
        onChangeText={setAge}
        value={age}
        maxLength={2}
        keyboardType={'numeric'}
      />


      <TouchableOpacity 
        style={[
            tw`w-64 p-3 rounded-xl absolute bottom-10 bg-red-400`, 
            incompleteForm ? tw`bg-gray-400` : tw`bg-red-400`
        ]}
        disabled={incompleteForm}
        onPress={updateUserProfile}
      >
        <Text style={tw`text-center text-white text-xl`}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ModalScreen