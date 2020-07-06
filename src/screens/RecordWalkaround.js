import React from 'react'
import { StyleSheet, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Overlay } from 'react-native-elements'

import Color from '../constants/Colors'
import BorderInput from '../components/BorderInput'
import StepButton from '../components/StepButton'
import Routes from '../constants/Routes'
import { recordingDuration, steps } from '../constants/Settings'
import { AppContext } from '../context/AppProvider'

function RecordWalkaround({ navigation }) {
    const {
        data: { currentVideo },
        actions: {
            generateVideo,
            showLoading,
            hideLoading,
            pickVideoFromLibrary,
            onStepFinish,
        },
    } = React.useContext(AppContext)

    const [selectedStep, setSelectedStep] = React.useState(null)
    const [form, setForm] = React.useState({
        vin: '',
        title: '',
        details: '',
    })

    React.useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Record Walkaround',
            headerRight: null,
            headerTitleAlign: 'center',
        })
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
                    await onStepFinish(stepName, video.uri)
                }
            } catch (error) {
                setSelectedStep(null)
                alert(error.message)
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
            })
        },
        [],
    )

    const onGenerateVideo = async () => {
        try {
            showLoading()
            await generateVideo(form)
            navigation.goBack()
        } catch (error) {
            alert(error.message)
        } finally {
            hideLoading()
        }
    }

    return (
        <ScrollView style={styles.container}>
            <BorderInput
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
                title={`Step 1: ${steps.INTRO}`}
                success={!!currentVideo[steps.INTRO]}
                onPress={() => onStepPress(recordingDuration.INTRO, steps.INTRO)}
            />
            <StepButton
                title={`Step 2: ${steps.EXTERIOR}`}
                success={!!currentVideo[steps.EXTERIOR]}
                onPress={() => onStepPress(recordingDuration.EXTERIOR, steps.EXTERIOR)}
            />
            <StepButton
                title={`Step 3: ${steps.INTERIOR}`}
                success={!!currentVideo[steps.INTERIOR]}
                onPress={() => onStepPress(recordingDuration.INTERIOR, steps.INTERIOR)}
            />
            <StepButton
                title={`Step 4: ${steps.OUTRO}`}
                success={!!currentVideo[steps.OUTRO]}
                onPress={() => onStepPress(recordingDuration.OUTRO, steps.OUTRO)}
            />
            <StepButton
                title='GENERATE VIDEO'
                style={styles.generateButton}
                onPress={onGenerateVideo}
            />

            <Overlay
                isVisible={Boolean(selectedStep)}
                onBackdropPress={() => setSelectedStep(null)}
            >
                <View>
                    <Text style={styles.overlayTitle}>
                        {selectedStep && selectedStep.stepName}:
                    </Text>
                    <TouchableOpacity style={styles.overlayButton} onPress={chooseVideo}>
                        <Text style={styles.overlayText}>Choose from library</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.overlayButton}
                        onPress={navigateToRecordingScreen}
                    >
                        <Text style={styles.overlayText}>Record new clip</Text>
                    </TouchableOpacity>
                </View>
            </Overlay>
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
    overlayButton: {
        padding: 15,
    },
    overlayText: {
        color: Color.mainBlue,
        fontFamily: 'roboto-700',
        textTransform: 'uppercase',
    },
    overlayTitle: {
        color: Color.dark,
        fontFamily: 'roboto-700',
        fontSize: 17,
        textAlign: 'center',
        marginBottom: 10,
    },
})

export default RecordWalkaround
