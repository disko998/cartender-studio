import React from 'react'
import { StyleSheet, ScrollView, Text } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'

import Color from '../../constants/Colors'
import BorderInput from '../../components/BorderInput'
import StepButton from '../../components/StepButton'
import Routes from '../../constants/Routes'
import { recordingDuration, steps } from '../../constants/Settings'
import { AppContext } from '../../context/AppProvider'
import VideoOptionsModal from '../../components/VideoOptionsModal'

function RecordWalkaround({ navigation, route }) {
    const {
        data: { walkaround },
        actions: {
            generateWalkaroundVideo,
            showLoading,
            hideLoading,
            pickVideoFromLibrary,
            setWalkaroundStep,
        },
    } = React.useContext(AppContext)
    const { currentVideo } = walkaround

    const [selectedStep, setSelectedStep] = React.useState(null)
    const [scanQR, setScanQR] = React.useState(false)
    const [hasPermission, setHasPermission] = React.useState(null)
    const [form, setForm] = React.useState({
        vin: '',
        title: '',
        details: '',
    })

    React.useEffect(() => {
        navigation.setOptions({
            headerTitle: route.name,
            headerRight: null,
            headerTitleAlign: 'center',
        })
        ;(async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync()
            setHasPermission(status === 'granted')
        })()
    }, [])

    const navigateToRecordingScreen = React.useMemo(
        () => () => {
            navigation.navigate(Routes.CAMERA, JSON.stringify(selectedStep))
            setSelectedStep(null)
        },
        [selectedStep],
    )

    const chooseVideo = React.useMemo(
        () => async () => {
            try {
                const video = await pickVideoFromLibrary(selectedStep.duration * 1000)
                const stepName = selectedStep.stepName
                setSelectedStep(null)

                if (video) {
                    showLoading()
                    await setWalkaroundStep(stepName, video.uri)
                }
            } catch (error) {
                alert(error.message)
                setSelectedStep(null)
            } finally {
                hideLoading()
            }
        },
        [selectedStep],
    )

    const onStepPress = React.useMemo(
        () => (duration, stepName) => {
            setSelectedStep({
                duration,
                stepName,
                actionType: 'setWalkaroundStep',
            })
        },
        [],
    )

    const onGenerateVideo = async () => {
        try {
            showLoading()
            await generateWalkaroundVideo(form)
            navigation.goBack()
        } catch (error) {
            alert(error.message)
        } finally {
            hideLoading()
        }
    }

    const handleBarCodeScanned = ({ type, data }) => {
        setScanQR(false)
        setForm({ ...form, vin: data })
    }

    const onScanQR = () => {
        if (hasPermission) {
            setScanQR(!scanQR)
        } else {
            alert('No access to camera')
        }
    }

    return (
        <ScrollView style={styles.container}>
            <BorderInput
                iconName={scanQR ? 'eye-off' : 'qrcode-scan'}
                onIconPress={onScanQR}
                placeholder='Enter VIN #'
                value={form.vin}
                onChangeText={value => setForm({ ...form, vin: value })}
            />
            <BorderInput
                placeholder='Enter Vehicle Title'
                value={form.title}
                onChangeText={value => setForm({ ...form, title: value })}
            />
            <BorderInput
                placeholder='Enter Vehicle Details'
                value={form.details}
                onChangeText={value => setForm({ ...form, details: value })}
            />
            <Text style={styles.text}>Select or Record Your Video Segments</Text>
            <StepButton
                title={`Step 1: ${steps.walkaround.INTRO}`}
                success={!!currentVideo[steps.walkaround.INTRO]}
                onPress={() =>
                    onStepPress(
                        recordingDuration.walkaround.INTRO,
                        steps.walkaround.INTRO,
                    )
                }
            />
            <StepButton
                title={`Step 2: ${steps.walkaround.EXTERIOR}`}
                success={!!currentVideo[steps.walkaround.EXTERIOR]}
                onPress={() =>
                    onStepPress(
                        recordingDuration.walkaround.EXTERIOR,
                        steps.walkaround.EXTERIOR,
                    )
                }
            />
            <StepButton
                title={`Step 3: ${steps.walkaround.INTERIOR}`}
                success={!!currentVideo[steps.walkaround.INTERIOR]}
                onPress={() =>
                    onStepPress(
                        recordingDuration.walkaround.INTERIOR,
                        steps.walkaround.INTERIOR,
                    )
                }
            />
            <StepButton
                title={`Step 4: ${steps.walkaround.OUTRO}`}
                success={!!currentVideo[steps.walkaround.OUTRO]}
                onPress={() =>
                    onStepPress(
                        recordingDuration.walkaround.OUTRO,
                        steps.walkaround.OUTRO,
                    )
                }
            />
            <StepButton
                title='GENERATE VIDEO'
                style={styles.generateButton}
                onPress={onGenerateVideo}
            />

            <VideoOptionsModal
                isVisible={Boolean(selectedStep)}
                onBackdropPress={() => setSelectedStep(null)}
                title={`${selectedStep && selectedStep.stepName}`}
                recordVideo={navigateToRecordingScreen}
                chooseVideo={chooseVideo}
            />

            {scanQR && (
                <BarCodeScanner
                    onBarCodeScanned={handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white,
        padding: 15,
    },
    text: {
        fontFamily: 'roboto-700',
        color: Color.black,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 5,
    },
    generateButton: {
        backgroundColor: Color.mainBlue,
        borderRadius: 10,
        marginBottom: 30,
    },
})

export default RecordWalkaround
