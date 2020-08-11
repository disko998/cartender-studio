import React from 'react'
import { StyleSheet, ScrollView, Text } from 'react-native'

import Color from '../../constants/Colors'
import BorderInput from '../../components/BorderInput'
import StepButton from '../../components/StepButton'
import Routes from '../../constants/Routes'
import { recordingDuration, steps } from '../../constants/Settings'
import { AppContext } from '../../context/AppProvider'
import VideoOptionsModal from '../../components/VideoOptionsModal'

export default function RecordGreeting({ navigation, route }) {
    const {
        data: { greeting },
        actions: {
            generateGreetingVideo,
            showLoading,
            hideLoading,
            pickVideoFromLibrary,
            setGreetingVideo,
        },
    } = React.useContext(AppContext)

    const [selectedStep, setSelectedStep] = React.useState(null)
    const [form, setForm] = React.useState({
        name: '',
        job: '',
        phone: '',
        customer: '',
    })

    React.useEffect(() => {
        navigation.setOptions({
            headerTitle: route.name,
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

                setSelectedStep(null)

                if (video) {
                    showLoading()
                    await setGreetingVideo(video.uri)
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
                actionType: 'setGreetingVideo',
            })
        },
        [],
    )

    const onGenerateVideo = async () => {
        try {
            showLoading()
            await generateGreetingVideo(form)
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
                placeholder='Enter Customer Name'
                value={form.customer}
                onChangeText={value => setForm({ ...form, customer: value })}
            />
            <BorderInput
                placeholder='Enter Your Name'
                value={form.name}
                onChangeText={value => setForm({ ...form, name: value })}
            />
            <BorderInput
                placeholder='Enter Job Title'
                value={form.job}
                onChangeText={value => setForm({ ...form, job: value })}
            />
            <BorderInput
                placeholder='Enter Phone Number'
                value={form.phone}
                onChangeText={value => setForm({ ...form, phone: value })}
                keyboardType='phone-pad'
            />
            <Text style={styles.text}>Select or Record Your Video Segments</Text>
            <StepButton
                title={`Select or Record Video`}
                success={!!greeting.currentVideo}
                onPress={() => onStepPress(recordingDuration.greeting, steps.greeting)}
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
