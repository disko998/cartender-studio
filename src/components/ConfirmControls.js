import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import Color from '../constants/Colors'

export default function RecordingControls({ onConfirm, onReject }) {
    return (
        <>
            <TouchableOpacity onPress={onConfirm} style={styles.buttonConfirm}>
                <Ionicons name={'md-checkmark'} size={40} color={Color.white} />
            </TouchableOpacity>

            <TouchableOpacity onPress={onReject} style={styles.buttonReject}>
                <Ionicons name={'md-close'} size={40} color={Color.white} />
            </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    buttonConfirm: {
        backgroundColor: Color.success,
        width: 60,
        height: 60,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonReject: {
        backgroundColor: Color.danger,
        width: 60,
        height: 60,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
