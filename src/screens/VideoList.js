import React from 'react'
import {
    SafeAreaView,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    View,
    Text,
} from 'react-native'

import VideoCard from '../components/VideoCard'
import Color from '../constants/Colors'
import Routes from '../constants/Routes'
import { AppContext } from '../context/AppProvider'

export default function VideoList({ navigation }) {
    const {
        data: { projects },
        actions: { onShare, getVideos },
    } = React.useContext(AppContext)

    React.useEffect(() => {
        ;(async () => {
            try {
                await getVideos()
            } catch (error) {
                alert(error.message)
            }
        })()
    }, [])

    const navigateToPlayback = item => {
        navigation.navigate(Routes.PLAYBACK, item)
    }

    if (!projects) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size='large' />
            </View>
        )
    }

    if (!projects.projects.length) {
        return (
            <View style={styles.center}>
                <Text style={styles.empty}>You don't have any videos</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={projects.projects}
                renderItem={({ item }) => (
                    <VideoCard
                        title={item['vehicle-title']}
                        details={item['vehicle-details']}
                        thumbnail={item['vehicle-image']}
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
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    empty: {
        fontFamily: 'roboto-regular',
    },
})
