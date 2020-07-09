import React from 'react'
import { ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native'
import MaterialCommunityIconsIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import Color from '../constants/Colors'
import { AppContext } from '../context/AppProvider'

export default function Settings() {
    const {
        actions: { logoutUser },
    } = React.useContext(AppContext)

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.option} onPress={logoutUser}>
                <MaterialCommunityIconsIcon
                    name='logout'
                    size={22}
                    color={Color.dark}
                />
                <Text style={styles.optionText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white,
    },
    option: {
        width: '100%',
        padding: 20,
        borderWidth: 1,
        borderColor: Color.lightGray,
        flexDirection: 'row',
    },
    optionText: {
        color: Color.dark,
        fontFamily: 'roboto-700',
        fontSize: 15,
        marginLeft: 10,
    },
})
