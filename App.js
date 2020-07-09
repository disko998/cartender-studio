import * as React from 'react'
import { StatusBar, StyleSheet, SafeAreaView } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'

import useCachedResources from './src/hooks/useCachedResources'
import Color from './src/constants/Colors'
import Navigation from './src/navigation/Navigation'
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
                        {state => (
                            <Spinner
                                visible={state.data.loading}
                                textContent='Uploading...please wait'
                                color={Color.white}
                                textStyle={{ color: Color.white }}
                                animation='fade'
                                overlayColor='rgba(0,0,0,.5)'
                            />
                        )}
                    </AppContext.Consumer>
                    <Navigation />
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
