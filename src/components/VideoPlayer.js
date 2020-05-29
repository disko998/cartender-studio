import React from 'react'
import { View, StyleSheet, TouchableHighlight, Text } from 'react-native'
import { Video } from 'expo-av'
import Icon from 'react-native-vector-icons/Entypo'

import Layout from '../constants/Layout'
import Color from '../constants/Colors'

export default function VideoPlayer({ src, containerStyle, ...props }) {
    const videoRef = React.useRef()

    return (
        <View style={[styles.container, containerStyle]}>
            <Video
                ref={videoRef}
                source={{ uri: src }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode='cover'
                shouldPlay={true}
                style={styles.video}
                useNativeControls={true}
                {...props}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Layout.window.width,
        height: Layout.window.width / 1.5,
        backgroundColor: Color.lightGray,
    },
    video: { width: '100%', height: '100%' },
    playPause: {
        position: 'absolute',
        bottom: 10,
        left: 20,
    },
    timer: {
        position: 'absolute',
        bottom: 10,
        right: 20,
        color: Color.white,
        fontFamily: 'roboto-regular',
        fontSize: 17,
    },
})
