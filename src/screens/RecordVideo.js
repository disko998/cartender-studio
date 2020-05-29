import React, { useState, useEffect, useRef } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from 'react-native'
import { Camera } from 'expo-camera'
import * as ScreenOrientation from 'expo-screen-orientation'
import * as Permissions from 'expo-permissions'
import { Ionicons } from '@expo/vector-icons'

import CameraView from '../components/CameraView'
import Color from '../constants/Colors'

export default function RecordVideo() {
    const [direction, setDirection] = useState(null)
    const [isRecording, setRecording] = useState(false)
    const [hasPermission, setHasPermission] = useState(null)
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

    if (hasPermission === false || hasPermission === null) {
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
                console.log(src)
            } else {
                setRecording(false)
                cameraRef.current.stopRecording()
            }
        } catch (error) {
            alert(error.message)
        } finally {
            setRecording(false)
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />

            <CameraView type={type} style={styles.camera} ref={cameraRef} />

            <View style={[styles.controls]}>
                <Text style={styles.label}>Intro</Text>
                <TouchableOpacity
                    onPress={onRecord}
                    style={[
                        styles.recordButton,
                        { borderRadius: isRecording ? 10 : 50 },
                    ]}
                />

                <TouchableOpacity onPress={onFlip}>
                    <Ionicons
                        name={'ios-reverse-camera'}
                        size={40}
                        color={Color.black}
                    />
                </TouchableOpacity>
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
    label: {
        fontFamily: 'roboto-700',
        color: Color.danger,
        fontSize: 20,
        textAlign: 'center',
    },
    recordButton: {
        backgroundColor: Color.danger,
        width: 60,
        height: 60,
        borderRadius: 50,
    },
})

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
