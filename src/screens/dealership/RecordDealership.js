import React from 'react'
import { StyleSheet, ScrollView, Text } from 'react-native'

import { BorderInput, StepButton, VideoOptionsModal } from '../../components'
import Color from '../../constants/Colors'
import Routes from '../../constants/Routes'
import { recordingDuration, steps } from '../../constants/Settings'
import { AppContext } from '../../context/AppProvider'

export default function RecordDealership({ navigation, route }) {
    const {
        data: { dealership },
        actions: {
            saveDealershipVideo,
            showLoading,
            hideLoading,
            pickVideoFromLibrary,
            setDealershipVideo,
        },
    } = React.useContext(AppContext)

    const { currentVideo } = dealership

    const [selectedStep, setSelectedStep] = React.useState(null)
    const [form, setForm] = React.useState({
        dealership: '',
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
                const video = await pickVideoFromLibrary(
                    selectedStep.duration * 1000,
                )
                const stepName = selectedStep.stepName
                setSelectedStep(null)

                if (video) {
                    showLoading()
                    await setDealershipVideo(stepName, video.uri)
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

    // Not sure how to pass fun as param, so i use action name (actionType) and invoke it in next rout.
    const onStepPress = React.useMemo(
        () => (duration, stepName) => {
            setSelectedStep({
                duration,
                stepName,
                actionType: 'setDealershipVideo',
            })
        },
        [],
    )

    const saveVideoClips = async () => {
        try {
            showLoading()
            await saveDealershipVideo(form)
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
                placeholder='Dealership Profile'
                value={form.dealership}
                onChangeText={value => setForm({ ...form, dealership: value })}
            />

            <Text style={styles.text}>
                Select or Record Your Video Segments
            </Text>

            <StepButton
                title={`Exterior - ${steps.dealership.BUILDING}`}
                success={!!currentVideo[steps.dealership.BUILDING]}
                onPress={() =>
                    onStepPress(
                        recordingDuration.dealership,
                        steps.dealership.BUILDING,
                    )
                }
            />
            <StepButton
                title={`Exterior - ${steps.dealership.CAR_LOT}`}
                success={!!currentVideo[steps.dealership.CAR_LOT]}
                onPress={() =>
                    onStepPress(
                        recordingDuration.dealership,
                        steps.dealership.CAR_LOT,
                    )
                }
            />
            <StepButton
                title={`Interior - ${steps.dealership.SHOWROOM}`}
                success={!!currentVideo[steps.dealership.SHOWROOM]}
                onPress={() =>
                    onStepPress(
                        recordingDuration.dealership,
                        steps.dealership.SHOWROOM,
                    )
                }
            />
            <StepButton
                title={`Interior - ${steps.dealership.SERVICE_BAYS}`}
                success={!!currentVideo[steps.dealership.SERVICE_BAYS]}
                onPress={() =>
                    onStepPress(
                        recordingDuration.dealership,
                        steps.dealership.SERVICE_BAYS,
                    )
                }
            />
            <StepButton
                title='SAVE CLIPS'
                style={styles.generateButton}
                onPress={saveVideoClips}
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
