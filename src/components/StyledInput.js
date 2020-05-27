import React from 'react'
import { StyleSheet, View, Text, TextInput } from 'react-native'
import Color from '../constants/Colors'

function StyledInput({ containerStyle, light, label, helper, ...TextInputProps }) {
    const labelColor = light ? Color.white : Color.black

    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={[styles.labe, { color: labelColor }]}>{label}</Text>
            <TextInput
                placeholderTextColor={Color.lightGray}
                style={[styles.inputStyle, { color: labelColor }]}
                {...TextInputProps}
            />
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
        opacity: 0.6,
    },
    inputStyle: {
        borderBottomWidth: 1,
        borderColor: Color.lightGray,
        color: Color.black,
        fontSize: 16,
        alignSelf: 'stretch',
        paddingHorizontal: 10,
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
