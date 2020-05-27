import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import Color from '../constants/Colors'

function StepButton({ title, success, ...props }) {
    const bg = success ? Color.success : Color.dark
    return (
        <TouchableOpacity
            {...props}
            style={[styles.container, { backgroundColor: bg }, props.style]}
        >
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 73,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    title: {
        fontFamily: 'roboto-700',
        color: Color.white,
        fontSize: 22,
    },
})

export default StepButton
