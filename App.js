import * as React from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'

import useCachedResources from './src/hooks/useCachedResources'
import Router from './src/navigation/Router'
import Color from './src/constants/Colors'

export default function App() {
    const isLoadingComplete = useCachedResources()

    if (!isLoadingComplete) {
        return null
    } else {
        return (
            <View style={styles.container}>
                <StatusBar barStyle='dark-content' />
                <Router />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white,
    },
})
