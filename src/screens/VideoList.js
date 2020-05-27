import React from 'react'
import { SafeAreaView, FlatList, StyleSheet } from 'react-native'

import VideoCard from '../components/VideoCard'
import Color from '../constants/Colors'
import Routes from '../constants/Routes'

const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'Video Title',
        details: 'Video Details (VIN, Stock, Short Description, etc.)',
        thumbnail: require('../assets/images/cardImage3.png'),
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Video Title',
        details: 'Video Details (VIN, Stock, Short Description, etc.)',
        thumbnail: require('../assets/images/cardImage3.png'),
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Video Title',
        details: 'Video Details (VIN, Stock, Short Description, etc.)',
        thumbnail: require('../assets/images/cardImage3.png'),
    },
]

export default function VideoList({ navigation }) {
    const navigateToPlayback = item => {
        navigation.navigate(Routes.PLAYBACK, item)
    }
    const onTextMessage = () => {}
    const onEmail = () => {}

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={DATA}
                renderItem={({ item }) => (
                    <VideoCard
                        title={item.title}
                        details={item.details}
                        thumbnail={item.thumbnail}
                        onPlay={navigateToPlayback.bind(item)}
                        onTextMessage={onTextMessage}
                        onEmail={onEmail}
                    />
                )}
                keyExtractor={item => item.id}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white,
        paddingVertical: 5,
    },
})
