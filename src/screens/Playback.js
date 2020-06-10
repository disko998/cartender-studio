import React from 'react'
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    TouchableOpacity,
} from 'react-native'
import * as ScreenOrientation from 'expo-screen-orientation'
import { Video } from 'expo-av'
import MaterialCommunityIconsIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import Color from '../constants/Colors'
import VideoPlayer from '../components/VideoPlayer'
import { AppContext } from '../context/AppProvider'

function Playback({ route, navigation }) {
    const {
        actions: { onShare },
    } = React.useContext(AppContext)

    const { title, details, video, poster } = route.params

    React.useEffect(() => {
        navigation.setOptions({
            headerTitle: title,
            headerRight: null,
            headerTitleAlign: 'center',
        })
    }, [])

    const shareVideo = React.useMemo(
        () => () => onShare({ message: video, title: title, subject: details }),
        [route.params],
    )

    const onFullScreen = React.useMemo(
        () => ({ fullscreenUpdate }) => {
            if (
                fullscreenUpdate === Video.FULLSCREEN_UPDATE_PLAYER_WILL_PRESENT
            ) {
                ScreenOrientation.unlockAsync()
            } else if (
                fullscreenUpdate === Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS
            ) {
                ScreenOrientation.lockAsync(
                    ScreenOrientation.OrientationLock.PORTRAIT,
                )
            }
        },
        [],
    )

    return (
        <ScrollView style={styles.container}>
            <VideoPlayer
                src={video}
                usePoster={false}
                posterSource={poster}
                onFullscreenUpdate={onFullScreen}
            />

            <View style={styles.contentWrapper}>
                <Text style={styles.videoTitle}>{title}</Text>
                <Text style={styles.videoDetails}>{details}</Text>

                <View style={styles.shareContainer}>
                    <Text style={styles.shareTitle}>Share Video</Text>
                    <View style={styles.shareButtonWrapper}>
                        <TouchableOpacity
                            style={styles.shareButton}
                            onPress={shareVideo}
                        >
                            <MaterialCommunityIconsIcon
                                name='share'
                                size={55}
                                color={Color.mainBlue}
                            />
                            <Text style={styles.shareLabel}>Share</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white,
    },
    videoDetails: {
        fontFamily: 'roboto-regular',
        color: Color.black,
        fontSize: 14,
    },
    videoTitle: {
        fontFamily: 'roboto-700',
        color: Color.black,
        fontSize: 20,
    },
    contentWrapper: {
        flex: 1,
        padding: 15,
    },
    shareContainer: {
        width: '100%',
        height: 200,
        borderRadius: 5,
        borderColor: Color.mainBlue,
        borderWidth: 1,
        padding: 10,
        marginVertical: 20,
    },
    shareTitle: {
        fontFamily: 'roboto-700',
        color: Color.mainBlue,
        fontSize: 20,
        textAlign: 'center',
    },
    shareButton: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    shareLabel: {
        fontFamily: 'roboto-regular',
        color: Color.mainBlue,
        fontSize: 17,
        textAlign: 'center',
    },
    shareButtonWrapper: {
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
    },
})

export default Playback
