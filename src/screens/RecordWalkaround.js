import React from 'react'
import { StyleSheet, ScrollView, Text } from 'react-native'

import Color from '../constants/Colors'
import BorderInput from '../components/BorderInput'
import StepButton from '../components/StepButton'
import Routes from '../constants/Routes'
import { recordingDuration } from '../constants/Settings'

function RecordWalkaround({ navigation }) {
    React.useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Record Walkaround',
            headerRight: null,
            headerTitleAlign: 'center',
        })
    }, [])

    const onStepFinish = video => {
        console.log(video)
        navigation.goBack()
    }

    const navigateToRecordingScreen = (duration, stepName) => {
        navigation.navigate(
            Routes.CAMERA,
            JSON.stringify({
                duration,
                stepName,
                onStepFinish,
            }),
        )
    }

    return (
        <ScrollView style={styles.container}>
            <BorderInput placeholder='Enter VIN #' />
            <BorderInput placeholder='Enter Vehicle Title' />
            <BorderInput placeholder='Enter Vehicle Details' />
            <Text style={styles.text}>
                Select or Record Your Video Segments
            </Text>
            <StepButton
                title='Step 1: Intro'
                success
                onPress={() =>
                    navigateToRecordingScreen(recordingDuration.INTRO, 'Intro')
                }
            />
            <StepButton
                title='Step 2: Exterior'
                onPress={() =>
                    navigateToRecordingScreen(
                        recordingDuration.EXTERIOR,
                        'Exterior',
                    )
                }
            />
            <StepButton
                title='Step 3: Interior'
                onPress={() =>
                    navigateToRecordingScreen(
                        recordingDuration.INTERIOR,
                        'Interior',
                    )
                }
            />
            <StepButton
                title='Step 4: Outro'
                onPress={() =>
                    navigateToRecordingScreen(recordingDuration.OUTRO, 'Outro')
                }
            />
            <StepButton title='GENERATE VIDEO' style={styles.generateButton} />
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
