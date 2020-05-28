import React from 'react'
import { SafeAreaView, FlatList, StyleSheet } from 'react-native'

import VideoCard from '../components/VideoCard'
import Color from '../constants/Colors'
import Routes from '../constants/Routes'
import ShareTextOverlay from '../components/ShareTextOverlay'
import ShareEmailOverlay from '../components/ShareEmailOverlay'

const _DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'Video Title',
        details: 'Video Details (VIN, Stock, Short Description, etc.)',
        thumbnail: 'https://images4.alphacoders.com/947/thumb-1920-947053.jpg',
        video: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Video Title',
        details: 'Video Details (VIN, Stock, Short Description, etc.)',
        thumbnail: 'https://images4.alphacoders.com/947/thumb-1920-947053.jpg',
        video: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Video Title',
        details: 'Video Details (VIN, Stock, Short Description, etc.)',
        thumbnail: 'https://images4.alphacoders.com/947/thumb-1920-947053.jpg',
        video: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    },
]

export default function VideoList({ navigation }) {
    const [shareTextVisible, setShareTextVisible] = React.useState(false)
    const [shareEmailVisible, setShareEmailVisible] = React.useState(false)

    const navigateToPlayback = item => {
        navigation.navigate(Routes.PLAYBACK, item)
    }
    const onTextMessage = () => {
        setShareTextVisible(true)
    }
    const onEmail = () => {
        setShareEmailVisible(true)
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={_DATA}
                renderItem={({ item }) => (
                    <VideoCard
                        title={item.title}
                        details={item.details}
                        thumbnail={item.thumbnail}
                        onPlay={() => navigateToPlayback(item)}
                        onTextMessage={onTextMessage}
                        onEmail={onEmail}
                    />
                )}
                keyExtractor={item => item.id}
            />

            <ShareTextOverlay
                isVisible={shareTextVisible}
                toggleVisible={() => setShareTextVisible(false)}
            />
            <ShareEmailOverlay
                isVisible={shareEmailVisible}
                toggleVisible={() => setShareEmailVisible(false)}
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
