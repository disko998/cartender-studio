import React, { useState, useEffect, useRef } from 'react'
import { Text, View, StyleSheet, StatusBar } from 'react-native'
import { Camera } from 'expo-camera'
import * as ScreenOrientation from 'expo-screen-orientation'
import * as Permissions from 'expo-permissions'

import CameraView from '../components/CameraView'
import RecordingControls from '../components/RecordingControls'
import ConfirmControls from '../components/ConfirmControls'
import VideoPlayer from '../components/VideoPlayer'

const RECORDING_DURATION = 15
const RECORDING_TYPE = 'Intro'

export default function RecordVideo() {
    const [video, setVideo] = useState(null)
    const [isRecording, setRecording] = useState(false)
    const [hasPermission, setHasPermission] = useState(false)
    const [type, setType] = useState(Camera.Constants.Type.back)
    const cameraRef = useRef()

    useEffect(() => {
        ;(async () => {
            const { status } = await Permissions.askAsync(
                Permissions.AUDIO_RECORDING,
                Permissions.CAMERA,
            )
            setHasPermission(status === 'granted')
        })()

        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)

        return () => {
            ScreenOrientation.unlockAsync()
        }
    }, [])

    if (!hasPermission) {
        return <Text>No access to camera</Text>
    }

    const onFlip = () => {
        setType(
            type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back,
        )
    }

    const onRecord = async () => {
        try {
            if (!isRecording) {
                setRecording(true)
                const src = await cameraRef.current.recordAsync({
                    maxDuration: 15,
                })

                // Do something on finish
                console.log(src)
                setVideo(src)
            } else {
                cameraRef.current.stopRecording()
            }
        } catch (error) {
            alert(error.message)
        } finally {
            setRecording(false)
        }
    }

    const onReject = () => {
        setVideo(null)
    }

    const onConfirm = () => {
        console.log(video)
    }

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />

            <View style={styles.camera}>
                {!video ? (
                    <CameraView
                        isRecording={isRecording}
                        type={type}
                        ref={cameraRef}
                        duration={RECORDING_DURATION}
                    />
                ) : (
                    <VideoPlayer
                        src={video.uri}
                        containerStyle={styles.videoPlayer}
                    />
                )}
            </View>

            <View style={[styles.controls]}>
                {!video ? (
                    <RecordingControls
                        isRecording={isRecording}
                        step={RECORDING_TYPE}
                        onFlip={onFlip}
                        onRecord={onRecord}
                    />
                ) : (
                    <ConfirmControls
                        onConfirm={onConfirm}
                        onReject={onReject}
                    />
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'row' },
    camera: { flex: 4 },
    controls: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    videoPlayer: {
        flex: 1,
        width: '100%',
    },
})

// IF WE NEED PORTRAIT
// const [direction, setDirection] = useState(null)
// ScreenOrientation.addOrientationChangeListener(oInfo => {
//     const orientation = oInfo.orientationInfo.orientation
//     if (
//         orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
//         orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
//     ) {
//         setDirection('row')
//     } else {
//         setDirection('column')
//     }
// })
