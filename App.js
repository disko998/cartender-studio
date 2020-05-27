import * as React from 'react'
import { StatusBar, StyleSheet, SafeAreaView } from 'react-native'

import useCachedResources from './src/hooks/useCachedResources'
import Router from './src/navigation/Router'
import Color from './src/constants/Colors'

export default function App() {
    const isLoadingComplete = useCachedResources()

    if (!isLoadingComplete) {
        return null
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle='dark-content' backgroundColor={Color.white} />
                <Router />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white,
    },
})
