import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'
import Color from '../constants/Colors'

function CameraButton(props) {
    return (
        <TouchableOpacity {...props}>
            <Icon name='camera' size={40} color={Color.dark}></Icon>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({})

export default CameraButton
