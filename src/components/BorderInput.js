import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import MaterialCommunityIconsIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import Color from '../constants/Colors'
import { TouchableOpacity } from 'react-native-gesture-handler'

function BorderInput({ iconName, onIconPress, ...props }) {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholderTextColor={Color.darkGray}
                {...props}
            />
            {iconName && (
                <TouchableOpacity onPress={onIconPress} style={styles.icon}>
                    <MaterialCommunityIconsIcon
                        name={iconName}
                        size={30}
                        color={Color.dark}
                    />
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: 'rgba(155,155,155,1)',
        borderStyle: 'solid',
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: 46,
        minWidth: 150,
        flex: 1,
        padding: 5,
        backgroundColor: 'rgba(255,255,255,1)',
    },
    icon: {
        marginRight: 10,
    },
})

export default BorderInput
