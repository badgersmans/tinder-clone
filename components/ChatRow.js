import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import useAuth from '../hooks/useAuth';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import { db } from '../firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

const ChatRow = ({matchedDetails}) => {
    const navigation = useNavigation();
    const { user } = useAuth
    const [matchedUserInfo, setMatchedUserInfo] = useState(null)
    const [lastMessage, setLastMessage] = useState('')

    useEffect(() => {
        setMatchedUserInfo(getMatchedUserInfo(matchedDetails.users, user.uid))
    }, [matchedDetails, user])

    useEffect(() => onSnapshot(
            query(
                collection(db, 'matches', matchedDetails.id, 'messages'),
                orderBy('timestamp', 'desc')
            )
        ), snapshot =>setLastMessage(snapshot.docs[0]?.data()?.message)
    , [matchedDetails, db])

  return (
    <TouchableOpacity 
        style={tw`flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg shadow-xl`}
        onPress={() => navigation.navigate('Message', {
            matchedDetails
        })}
    >
        <Image 
            source={{uri: matchedUserInfo?.photoURL}}
            style={tw`rounded-full h-16 w-16 mr-4`}
        />

        <View>
            <Text style={tw`text-lg font-semibold`}>
                {matchedUserInfo?.displayName}
            </Text>
            <Text>{ lastMessage || 'Say Hi!' }</Text>
        </View>
    </TouchableOpacity>
  )
}

export default ChatRow