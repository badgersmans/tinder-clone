import { View, Text, SafeAreaView, TextInput, Button, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard, FlatList} from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import getMatchedUserInfo from '../lib/getMatchedUserInfo'
import useAuth from '../hooks/useAuth'
import { useRoute } from '@react-navigation/native'
import tw from 'twrnc'
import SenderMessage from '../components/SenderMessage'
import ReceiverMessage from '../components/ReceiverMessage'
import { addDoc, collection, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const MessageScreen = () => {
    const { user } = useAuth();
    const { params } = useRoute();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([])

    const { matchDetails } = params;

    useEffect(() => onSnapshot(
            query(
                collection(db, 'matches', matchDetails.id, 'messages'),
                orderBy('timestamp', 'desc')
            ), snapshot => setMessages(snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        )), [matchDetails, db])

    const sendMessage = () => {
        addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
            timestamp: serverTimestamp(),
            userId: user.uid,
            displayName: user.displayName,
            photoURL: matchDetails.users[user.uid].photoURL,
            message: input
        })
        setInput('')
    };

    // console.log(getMatchedUserInfo(matchDetails.users, user.uid).displayName);
  return (
    <SafeAreaView style={tw`flex-1`}>
        <Header callEnabled title={getMatchedUserInfo(matchDetails.users, user.uid).displayName}/>
        
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={tw`flex-1`}
            keyboardVerticalOffset={10}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <FlatList
                    data={messages}
                    style={tw`pl-4`}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => 
                        item.userId === user.uid ? (
                            <SenderMessage key={item.id} message={item} />
                            ) : (
                            <ReceiverMessage key={item.id} message={item} />
                            )
                    }
                    inverted={-1}
                />

                 
            </TouchableWithoutFeedback>


            <View style={tw`flex-row justify-between items-center border-t border-gray-200 px-5 py-2`}>
                <TextInput 
                    style={tw`h-10 text-lg`}
                    placeholder="Send Message..."
                    onChangeText={setInput}
                    onSubmitEditing={sendMessage}
                    value={input}
                />

                <Button title='Send' color='#FF5864' onPress={sendMessage}/>
            </View>
        </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default MessageScreen