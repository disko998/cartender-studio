import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Video } from 'expo-av'
import * as ScreenOrientation from 'expo-screen-orientation'

import Layout from '../constants/Layout'
import Color from '../constants/Colors'

export default function VideoPlayer({ src, containerStyle, ...props }) {
    const videoRef = React.useRef()

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
        <View style={[styles.container, containerStyle]}>
            <Video
                ref={videoRef}
                source={{ uri: src }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode='contain'
                shouldPlay={true}
                style={styles.video}
                useNativeControls={true}
                {...props}
                onFullscreenUpdate={onFullScreen}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Layout.window.width,
        height: Layout.window.width / 1.8,
        backgroundColor: Color.lightGray,
    },
    video: { width: '100%', height: '100%' },
})
