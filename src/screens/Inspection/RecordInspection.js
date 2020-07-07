import React from 'react'
import { StyleSheet, ScrollView, Text } from 'react-native'

import Color from '../../constants/Colors'
import BorderInput from '../../components/BorderInput'
import StepButton from '../../components/StepButton'
import Routes from '../../constants/Routes'
import { recordingDuration, steps } from '../../constants/Settings'
import { AppContext } from '../../context/AppProvider'
import VideoOptionsModal from '../../components/VideoOptionsModal'

function RecordInspection({ navigation, route }) {
    const {
        data: { inspection },
        actions: {
            generateVideo,
            showLoading,
            hideLoading,
            pickVideoFromLibrary,
            setInspectionVideo,
        },
    } = React.useContext(AppContext)

    const [selectedStep, setSelectedStep] = React.useState(null)
    const [form, setForm] = React.useState({
        title: '',
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
            navigation.navigate(
                Routes.CAMERA,
                JSON.stringify({
                    ...selectedStep,
                }),
            )
            setSelectedStep(null)
        },
        [selectedStep],
    )

    const chooseVideo = React.useMemo(
        () => async () => {
            try {
                const video = await pickVideoFromLibrary(
                    selectedStep.duration * 1000,
                )

                setSelectedStep(null)

                if (video) {
                    showLoading()
                    await setInspectionVideo(video.uri)
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
                actionType: 'setInspectionVideo',
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
                placeholder='Enter Video Title'
                value={form.title}
                onChangeText={value => setForm({ ...form, title: value })}
            />
            <Text style={styles.text}>
                Select or Record Your Video Segments
            </Text>
            <StepButton
                title={`Select or Record Video`}
                success={!!inspection.currentVideo}
                onPress={() =>
                    onStepPress(recordingDuration.inspection, steps.inspection)
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

export default RecordInspection
