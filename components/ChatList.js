import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { onSnapshot, doc, collection, setDoc, getDocs, query, where, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import ChatRow from './ChatRow';


const ChatList = () => {
  const [matches, setMatches] = useState([])
  const { user } = useAuth()

  useEffect(() => onSnapshot(
      query(
        collection(db, 'matches'),
        where('usersMatched', 'array-contains', user.uid)
      ), snapshot => setMatches(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })))
    ), [user])

  return (
      <FlatList 
        data={matches}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ChatRow matchedDetails={item} />}
      />

    // matches.length > 0 ? (
    //   <FlatList 
    //     data={matches}
    //     keyExtractor={item => item.id}
    //     renderItem={({ item }) => <ChatRow matchedDetails={item} />}
    //   />
    // ) : (
    //   <View>
    //     <Text style={tw`text-center text-lg`}>No matches at the moment</Text>
    //   </View>
    // )
  )
}

export default ChatList