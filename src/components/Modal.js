import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Overlay } from 'react-native-elements'

import Color from '../constants/Colors'

const Modal = ({ isVisible, toggleVisible, children, title }) => {
    return (
        <Overlay
            isVisible={isVisible}
            onBackdropPress={toggleVisible}
            overlayStyle={styles.overlay}
        >
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>
                {children}
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
})

export default Modal
