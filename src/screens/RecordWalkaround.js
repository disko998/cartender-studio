import React from 'react'
import { StyleSheet, ScrollView, Text } from 'react-native'

import Color from '../constants/Colors'
import BorderInput from '../components/BorderInput'
import StepButton from '../components/StepButton'

function RecordWalkaround({ navigation }) {
    React.useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Record Walkaround',
            headerRight: null,
            headerTitleAlign: 'center',
        })
    }, [])

    return (
        <ScrollView style={styles.container}>
            <BorderInput placeholder='Enter VIN #' />
            <BorderInput placeholder='Enter Vehicle Title' />
            <BorderInput placeholder='Enter Vehicle Details' />
            <Text style={styles.text}>
                Select or Record Your Video Segments
            </Text>
            <StepButton title='Step 1: Intro' success />
            <StepButton title='Step 2: Exterior' />
            <StepButton title='Step 3: Interior' />
            <StepButton title='Step 4: Outro' />
            <StepButton title='GENERATE VIDEO' style={styles.finishButton} />
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
    finishButton: {
        backgroundColor: Color.mainBlue,
        borderRadius: 10,
        marginBottom: 30,
    },
})

export default RecordWalkaround
