import * as React from 'react'
import { StatusBar, StyleSheet, SafeAreaView } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'

import useCachedResources from './src/hooks/useCachedResources'
import Color from './src/constants/Colors'
import Router from './src/navigation/Router'
import AppProvider, { AppContext } from './src/context/AppProvider'

export default function App() {
    const isLoadingComplete = useCachedResources()

    if (!isLoadingComplete) {
        return null
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar
                    barStyle='dark-content'
                    backgroundColor={Color.white}
                />
                <AppProvider>
                    <AppContext.Consumer>
                        {state => <Spinner visible={state.data.loading} />}
                    </AppContext.Consumer>
                    <Router />
                </AppProvider>
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
