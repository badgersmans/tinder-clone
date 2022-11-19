import { StatusBar } from 'expo-status-bar';
import { View, Text, Button, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../hooks/useAuth';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons'
import Swiper from 'react-native-deck-swiper'
import { onSnapshot, doc, collection, setDoc, getDocs, query, where, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import generateId from '../lib/generateId';


const HomeScreen = () => {

  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [profiles, setProfiles] = useState([])
  const swipeRef = useRef(null);

  const DUMMY_DATA = [
    {
      firstName: 'Darlene',
      lastName: 'Alderson',
      job: 'fsociety member',
      photoURL: 'https://static.wikia.nocookie.net/mrrobot/images/5/5c/Tumblr_96060a66d3af926ec3f638882b6ebb79_b2da2bc6_640.jpg/revision/latest?cb=20190928213622',
      age: 24,
      id: 123
    },
    {
      firstName: 'Elon',
      lastName: 'Musk',
      job: 'Software Developer',
      photoURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/1280px-Elon_Musk_Royal_Society_%28crop2%29.jpg',
      age: 24,
      id: 456
    },
    {
      firstName: 'Angela',
      lastName: 'Moss',
      job: 'fsociety member',
      photoURL: 'https://www.denofgeek.com/wp-content/uploads/2019/10/mr-robot-season-4-angela-moss.jpg?resize=768%2C432',
      age: 24,
      id: 789
    },
  ]

  const docRef = doc(db, "users", user.uid);

  useLayoutEffect(() => onSnapshot(docRef, (snapshot) => {
    // console.log(snapshot);
      if(!snapshot.exists()) {
        navigation.navigate('Modal')
      }
  }), [])

  useEffect(() => {
    let unsub;

    const fetchCards = async() => {

      const passes = await getDocs(collection(db, 'users', user.uid, 'passes'))
      .then((snapshot) => snapshot.docs.map((doc) => doc.id))

      const swipes = await getDocs(collection(db, 'users', user.uid, 'swipes'))
      .then((snapshot) => snapshot.docs.map((doc) => doc.id))

      const passedUserIds = passes.length > 0 ? passes : ['test']
      const swipedUserIds = swipes.length > 0 ? swipes : ['test']

      unsub = onSnapshot(
        query(
          collection(db, 'users'), 
          where('id', 'not-in', [...passedUserIds, ...swipedUserIds])
        ), 
        (snapshot) => {
        setProfiles(
          snapshot.docs
          .filter((doc) => doc.id !== user.uid)
          .map((doc) => ({
            id: doc.id,
            ...doc.data()
          }))
        )
      })
    }

    fetchCards();
    return unsub;
  }, [db, profiles])

  // console.log(profiles)

  const swipeLeft = (cardIndex) => {
    
    if(!profiles[cardIndex]) return;
    
    const userSwiped = profiles[cardIndex]
    const docRef = doc(db, "users", user.uid, 'passes', userSwiped.id);

    console.log(`wtf is userSwiped? ${userSwiped}`)
    console.log(`wtf is cardIndex? ${cardIndex}`)
    console.log(`swiped PASS on ${userSwiped.displayName}`);

    setDoc(docRef, userSwiped)
  }

  const swipeRight = async (cardIndex) => {
    if(!profiles[cardIndex]) return;
    
    const userSwiped = profiles[cardIndex]
    // const docRef = doc(db, "users", user.uid, 'swipes', userSwiped.id);
    const loggedInProfile = await (await getDoc(doc(db, 'users', user.uid))).data();
    
    // check if user swiped on you...
    getDoc(doc(db, 'users', userSwiped.id, 'swipes', user.uid))
    .then((documentSnapshot) => {
      if(documentSnapshot.exists()) {
        // user has matched with you before you matched with them
        console.log(`YOU MATCHED WITH ${userSwiped.displayName}`)
        
        setDoc(
          doc(db, 'users', user.uid, 'swipes', userSwiped.id), 
          userSwiped
        )

        // create a MATCH!
        setDoc(doc(db, 'matches', generateId(user.uid, userSwiped.id)), {
          users: {
            [user.uid]: loggedInProfile,
            [userSwiped.id]: userSwiped
          },
          usersMatch: [user.uid, userSwiped.id],
          timestamp: serverTimestamp()
        });

        navigation.navigate('Match', {
          loggedInProfile, 
          userSwiped,
        })
      } else {
        // user has swiped as first interaction between the two or didn't get swiped on...
        console.log(`swiped on ${userSwiped.displayName} (${userSwiped.job})`);
        setDoc(
          doc(db, 'users', user.uid, 'swipes', userSwiped.id), 
          userSwiped
        )
      }
    })
  }


  return (
    <SafeAreaView style={tw`flex-1`}>
      {/* Header */}
        <View style={tw`items-center justify-between flex-row px-5`}>
          <TouchableOpacity
            onPress={logout}
          >
            <Image 
              source={{uri: user?.photoURL}}
              style={tw`h-10 w-10 rounded-full`}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Modal')}>
            <Image 
              source={require("../tinder.png")}
              style={tw`w-14 h-14`}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Chat')}
          >
            <Ionicons name='chatbubbles-sharp' size={30} color="#FF5864"/>
          </TouchableOpacity>
        </View>
      {/* End of Header */}

        {/* Cards */}
        <View style={tw`flex-1 -mt-6`}>
          <Swiper 
            ref={swipeRef}
            cards={profiles}
            stackSize={5}
            cardIndex={0}
            verticalSwipe={false}
            onSwipedLeft={(cardIndex) => {
              console.log('swiped pass...')
              swipeLeft(cardIndex)
            }}
            onSwipedRight={(cardIndex) => {
              console.log('swiped match...')
              swipeRight(cardIndex)
            }}
            overlayLabels={{
              left: {
                title: '❌',
                style: {
                  label: {
                    textAlign: 'right',
                    color: 'red'
                  },
                },
              },
              right: {
                title: '✅',
                style: {
                  label: {
                    color: '#4DED30'
                  },
                },
              },
            }}
            animateCardOpacity
            renderCard={card => card ? (
              <View style={tw`bg-white h-3/4 rounded-xl relative`} key={card.id}>
                <Image 
                  source={{uri: card.photoURL}}
                  style={tw`h-full w-full rounded-xl absolute top-0`}
                />

                <View 
                  style={tw`bg-white w-full h-20 absolute bottom-0 justify-between items-center flex-row px-6 py-2 rounded-b-xl shadow-xl`}
                >
                  <View style={tw`text-xl font-bold`}>
                    <Text>{card.firstName} {card.lastName}</Text>
                    <Text>{card.job}</Text>
                  </View>
                  <Text style={tw`text-2xl font-bold`}>{card.age}</Text>
                </View>
              </View>
            ) : (
              <View
                style={
                  tw`relative bg-white h-3/4 rounded-xl justify-center items-center shadow-xl`}
              >
                <Text style={tw`text-xl font-bold pb-5`}>No more people</Text>

                <Image 
                  source={{ uri: 'https://links.papareact.com/6gb' }}
                  style={tw`h-20 w-full`}
                  height={100}
                  width={100}
                />
              </View>
            )
          }
            containerStyle={{ backgroundColor: "transparent" }}
          />
        </View>
        {/* End Cards */}

        <View style={tw`flex-row justify-evenly`}>
          <TouchableOpacity 
            style={tw`items-center justify-center rounded-full w-16 h-16 bg-red-200`}
            onPress={() => swipeRef.current.swipeLeft()}
          >
              <Entypo name='cross' size={24} color='red'/>
          </TouchableOpacity>

          <TouchableOpacity 
            style={tw`items-center justify-center rounded-full w-16 h-16 bg-green-200`}
            onPress={() => swipeRef.current.swipeRight()}
          >
              <Entypo name='heart' size={24} color='green'/>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default HomeScreen