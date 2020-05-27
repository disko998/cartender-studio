import React from 'react'
import { StyleSheet, View, Text, TextInput } from 'react-native'
import Color from '../constants/Colors'

function StyledInput({ containerStyle, label, helper, ...TextInputProps }) {
    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.inputStyle}
                {...TextInputProps}
            ></TextInput>
            <Text style={styles.helper}>{helper}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        width: 237,
    },
    label: {
        fontSize: 12,
        textAlign: 'left',
        color: Color.black,
        opacity: 0.6,
    },
    inputStyle: {
        borderBottomWidth: 1,
        borderColor: Color.lightGray,
        color: Color.black,
        fontSize: 16,
        alignSelf: 'stretch',
        lineHeight: 16,
        paddingTop: 8,
        paddingBottom: 8,
        width: '100%',
        minHeight: 40,
    },
    helper: {
        fontSize: 12,
        textAlign: 'left',
        color: Color.black,
        opacity: 0.6,
    },
})

export default StyledInput
