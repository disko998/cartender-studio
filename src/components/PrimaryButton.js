import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import Color from '../constants/Colors'

function PrimaryButton(props) {
    return (
        <TouchableOpacity {...props} style={[styles.container, props.style]}>
            <Text style={styles.login}>Login</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.mainBlue,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 5,
        paddingLeft: 16,
        paddingRight: 16,
    },
    login: {
        color: Color.white,
        fontSize: 17,
        alignSelf: 'center',
        fontFamily: 'roboto-regular',
    },
})

export default PrimaryButton
