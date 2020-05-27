import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Overlay } from 'react-native-elements'

import StyledInput from './StyledInput'
import BorderInput from './BorderInput'
import PrimaryButton from './PrimaryButton'
import Color from '../constants/Colors'

const ShareTextOverlay = ({ isVisible, toggleVisible }) => {
    return (
        <Overlay
            isVisible={isVisible}
            onBackdropPress={toggleVisible}
            overlayStyle={styles.overlay}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Text Video</Text>
                {/* <StyledInput
                    light
                    placeholder='000 000 0000'
                    label='Enter Mobile Number'
                    keyboardType='numeric'
                /> */}
                <BorderInput
                    keyboardType='numeric'
                    autoFocus={true}
                    placeholder='Enter Mobile Number'
                />
                <PrimaryButton style={styles.button} title='SEND TEXT' />
            </View>
        </Overlay>
    )
}

const styles = StyleSheet.create({
    overlay: {
        width: '90%',
        backgroundColor: Color.mainBlue,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderRadius: 10,
    },
    title: {
        textAlign: 'center',
        fontFamily: 'roboto-700',
        fontSize: 25,
        marginBottom: 20,
        color: Color.white,
    },
    button: {
        width: 150,
        backgroundColor: Color.dark,
        alignSelf: 'center',
        height: 50,
        marginTop: 20,
    },
})

export default ShareTextOverlay
