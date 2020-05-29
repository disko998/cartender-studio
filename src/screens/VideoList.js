import React from 'react'
import { SafeAreaView, FlatList, StyleSheet } from 'react-native'

import VideoCard from '../components/VideoCard'
import Color from '../constants/Colors'
import Routes from '../constants/Routes'
import { AppContext } from '../context/AppProvoder'

export default function VideoList({ navigation }) {
    const {
        data: { videoList },
        actions: { onShare },
    } = React.useContext(AppContext)

    const navigateToPlayback = item => {
        navigation.navigate(Routes.PLAYBACK, item)
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={videoList}
                renderItem={({ item }) => (
                    <VideoCard
                        title={item.title}
                        details={item.details}
                        thumbnail={item.thumbnail}
                        onPlay={() => navigateToPlayback(item)}
                        onShare={() =>
                            onShare({
                                message: item.video,
                                title: item.title,
                                subject: item.details,
                            })
                        }
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
