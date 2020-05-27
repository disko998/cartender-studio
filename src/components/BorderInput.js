import React from 'react'
import { StyleSheet, TextInput } from 'react-native'
import Color from '../constants/Colors'

function BorderInput(props) {
    return (
        <TextInput
            style={styles.input}
            placeholderTextColor={Color.darkGray}
            {...props}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        minWidth: 300,
        height: 46,
        backgroundColor: 'rgba(255,255,255,1)',
        borderWidth: 1,
        borderColor: 'rgba(155,155,155,1)',
        borderStyle: 'solid',
        margin: 10,
        padding: 5,
    },
})

export default BorderInput
