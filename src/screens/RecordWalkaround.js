import React from 'react'
import { StyleSheet, ScrollView, Text } from 'react-native'

import Color from '../constants/Colors'
import BorderInput from '../components/BorderInput'
import StepButton from '../components/StepButton'
import Routes from '../constants/Routes'
import { recordingDuration, steps } from '../constants/Settings'
import { AppContext } from '../context/AppProvider'

function RecordWalkaround({ navigation }) {
    const {
        data: { currentVideo },
        actions: { generateVideo, showLoading, hideLoading },
    } = React.useContext(AppContext)

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
        () => (duration, stepName) => {
            navigation.navigate(
                Routes.CAMERA,
                JSON.stringify({
                    duration,
                    stepName,
                }),
            )
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
            <Text style={styles.text}>
                Select or Record Your Video Segments
            </Text>
            <StepButton
                title={`Step 1: ${steps.INTRO}`}
                success={!!currentVideo[steps.INTRO]}
                onPress={() =>
                    navigateToRecordingScreen(
                        recordingDuration.INTRO,
                        steps.INTRO,
                    )
                }
            />
            <StepButton
                title={`Step 2: ${steps.EXTERIOR}`}
                success={!!currentVideo[steps.EXTERIOR]}
                onPress={() =>
                    navigateToRecordingScreen(
                        recordingDuration.EXTERIOR,
                        steps.EXTERIOR,
                    )
                }
            />
            <StepButton
                title={`Step 3: ${steps.INTERIOR}`}
                success={!!currentVideo[steps.INTERIOR]}
                onPress={() =>
                    navigateToRecordingScreen(
                        recordingDuration.INTERIOR,
                        steps.INTERIOR,
                    )
                }
            />
            <StepButton
                title={`Step 4: ${steps.OUTRO}`}
                success={!!currentVideo[steps.OUTRO]}
                onPress={() =>
                    navigateToRecordingScreen(
                        recordingDuration.OUTRO,
                        steps.OUTRO,
                    )
                }
            />
            <StepButton
                title='GENERATE VIDEO'
                style={styles.generateButton}
                onPress={onGenerateVideo}
            />
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
