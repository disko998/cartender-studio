import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Overlay } from 'react-native-elements'

import Color from '../constants/Colors'

export default function VideoOptionsModal({
    title,
    chooseVideo,
    recordVideo,
    ...overlayProps
}) {
    return (
        <Overlay {...overlayProps}>
            <View>
                <Text style={styles.overlayTitle}>{title}:</Text>
                <TouchableOpacity
                    style={styles.overlayButton}
                    onPress={chooseVideo}
                >
                    <Text style={styles.overlayText}>Choose from library</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.overlayButton}
                    onPress={recordVideo}
                >
                    <Text style={styles.overlayText}>Record new clip</Text>
                </TouchableOpacity>
            </View>
        </Overlay>
    )
}

const styles = StyleSheet.create({
    overlayButton: {
        padding: 15,
    },
    overlayText: {
        color: Color.mainBlue,
        fontFamily: 'roboto-700',
        textTransform: 'uppercase',
    },
    overlayTitle: {
        color: Color.dark,
        fontFamily: 'roboto-700',
        fontSize: 17,
        textAlign: 'center',
        marginBottom: 10,
    },
})
