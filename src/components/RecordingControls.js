import React from 'react'
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import Color from '../constants/Colors'

export default function ConfirmControls({
    step,
    onRecord,
    isRecording,
    onFlip,
    onExit,
}) {
    return (
        <>
            <TouchableOpacity
                style={styles.backButton}
                hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
                onPress={onExit}
            >
                <Text style={styles.label}>
                    {`Exit\n`}
                    <Text style={styles.stepName}>{step}</Text>
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={onRecord}
                style={[
                    styles.recordButton,
                    { borderRadius: isRecording ? 10 : 50 },
                ]}
            />

            <TouchableOpacity onPress={onFlip} disabled={isRecording}>
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
        fontSize: 18,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    recordButton: {
        backgroundColor: Color.danger,
        width: 60,
        height: 60,
        borderRadius: 50,
    },
    stepName: {
        textTransform: 'none',
    },
})
