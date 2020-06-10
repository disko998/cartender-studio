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
import { pullingInterval } from '../constants/Settings'

export default function VideoList({ navigation }) {
    const {
        data: { projects },
        actions: { onShare, getProjects },
    } = React.useContext(AppContext)

    React.useEffect(() => {
        let interval
        ;(async () => {
            try {
                await getProjects()
                interval = setInterval(getProjects, pullingInterval)
            } catch (error) {
                alert(error.message)
                clearInterval(interval)
            }
        })()
        return () => clearInterval(interval)
    }, [])

    const navigateToPlayback = item => {
        navigation.navigate(Routes.PLAYBACK, {
            title: item['vehicle-title'],
            details: item['vehicle-details'],
            video: item['s3_url'],
            poster: { uri: item['vehicle-image'] },
        })
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
                data={projects.projects.filter(
                    i =>
                        i['render-status'] !== 'canceled' &&
                        i.template.template === 'CT_Walkaround',
                )}
                renderItem={({ item }) => (
                    <VideoCard
                        status={item['render-status']}
                        title={item['vehicle-title']}
                        details={item['vehicle-details']}
                        thumbnail={item['vehicle-image']}
                        onPlay={() => navigateToPlayback(item)}
                        onShare={() =>
                            onShare({
                                message: item['s3_url'],
                                title: item['vehicle-title'],
                                subject: item['vehicle-details'],
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
