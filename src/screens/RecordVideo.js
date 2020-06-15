import React, { useState, useEffect, useRef, useContext } from 'react'
import { Text, View, StyleSheet, StatusBar } from 'react-native'
import { Camera } from 'expo-camera'
import * as ScreenOrientation from 'expo-screen-orientation'
import * as Permissions from 'expo-permissions'

import CameraView from '../components/CameraView'
import RecordingControls from '../components/RecordingControls'
import ConfirmControls from '../components/ConfirmControls'
import VideoPlayer from '../components/VideoPlayer'
import { AppContext } from '../context/AppProvider'

export default function RecordVideo({ route, navigation }) {
    const { duration = 15, stepName = 'Video' } = JSON.parse(route.params)
    const {
        actions: { onStepFinish, hideLoading, showLoading },
    } = useContext(AppContext)
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

        navigation.setOptions({
            headerShown: false,
        })

        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)

        return () => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
        }
    }, [])

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
                const uri = await cameraRef.current.recordAsync({
                    quality: Camera.Constants.VideoQuality['480p'],
                    maxDuration: duration,
                })

                setVideo(uri)
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

    const onConfirm = async () => {
        try {
            showLoading()
            await onStepFinish(stepName, video.uri)
            await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT_UP,
            )
            navigation.goBack()
        } catch (error) {
            alert(error.message)
        } finally {
            hideLoading()
        }
    }

    if (!hasPermission) {
        return <Text>No access to camera</Text>
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
                        duration={duration}
                    />
                ) : (
                    <VideoPlayer src={video.uri} containerStyle={styles.videoPlayer} />
                )}
            </View>

            <View style={[styles.controls]}>
                {!video ? (
                    <RecordingControls
                        isRecording={isRecording}
                        step={stepName}
                        onFlip={onFlip}
                        onRecord={onRecord}
                    />
                ) : (
                    <ConfirmControls onConfirm={onConfirm} onReject={onReject} />
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
