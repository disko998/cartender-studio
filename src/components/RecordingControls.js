import React from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import Color from '../constants/Colors'

export default function ConfirmControls({
    step,
    onRecord,
    isRecording,
    onFlip,
}) {
    return (
        <>
            <Text style={styles.label}>{step}</Text>
            <TouchableOpacity
                onPress={onRecord}
                style={[
                    styles.recordButton,
                    { borderRadius: isRecording ? 10 : 50 },
                ]}
            />

            <TouchableOpacity onPress={onFlip}>
                <Ionicons
                    name={'ios-reverse-camera'}
                    size={40}
                    color={Color.black}
                />
            </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    label: {
        fontFamily: 'roboto-700',
        color: Color.danger,
        fontSize: 20,
        textAlign: 'center',
    },
    recordButton: {
        backgroundColor: Color.danger,
        width: 60,
        height: 60,
        borderRadius: 50,
    },
})
