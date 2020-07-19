import * as React from 'react'
import { StatusBar, StyleSheet, SafeAreaView } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'

import useCachedResources from './src/hooks/useCachedResources'
import Color from './src/constants/Colors'
import RootNavigation from './src/navigation/Navigation'
import AppProvider, { AppContext } from './src/context/AppProvider'

export default function App() {
    const isLoadingComplete = useCachedResources()

    if (!isLoadingComplete) {
        return null
    } else {
        return (
            <>
                <StatusBar
                    barStyle='dark-content'
                    backgroundColor={Color.white}
                />
                <SafeAreaView style={styles.container}>
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
                        <RootNavigation />
                    </AppProvider>
                </SafeAreaView>
            </>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white,
    },
})
