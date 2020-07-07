import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Camera } from 'expo-camera'
import { Countdown } from 'react-native-popcountdown'

import Counter from './Counter'
import Color from '../constants/Colors'

export default CameraView = React.forwardRef(
    ({ isRecording, duration, ...props }, ref) => {
        return (
            <Camera
                style={styles.camera}
                ref={ref}
                ratio='16:9'
                autoFocus={Camera.Constants.AutoFocus.on}
                whiteBalance={Camera.Constants.WhiteBalance.auto}
                videoStabilizationMode={
                    Camera.Constants.VideoStabilization.auto
                }
                onMountError={err => {
                    alert(err.message)
                }}
                {...props}
            >
                <View style={styles.overlay}>
                    <View style={styles.frame} />
                    <View style={styles.counter}>
                        <Text style={styles.digitTxtStyle}>
                            Time Remaining:
                        </Text>
                        <Countdown
                            running={isRecording}
                            until={duration}
                            timeToShow={['M', 'S']}
                            digitStyle={styles.digitStyle}
                            digitTxtStyle={styles.digitTxtStyle}
                        />
                    </View>
                </View>
            </Camera>
        )
    },
)

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'transparent',
        padding: '5%',
    },
    camera: { flex: 1 },
    frame: {
        flex: 1,
        backgroundColor: 'transparent',
        borderWidth: 3,
        borderStyle: 'dotted',
        borderColor: Color.white,
        borderRadius: 1,
    },
    digitStyle: {
        backgroundColor: 'transparent',
        height: 'auto',
    },
    digitTxtStyle: {
        margin: 0,
        padding: 0,
        color: Color.white,
        textAlign: 'center',
        fontFamily: 'roboto-700',
        fontSize: 17,
    },
    counter: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
})
