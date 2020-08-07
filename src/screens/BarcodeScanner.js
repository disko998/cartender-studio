import React, { useEffect } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import * as ScreenOrientation from 'expo-screen-orientation'
import { Camera } from 'expo-camera'

import Routes from '../constants/Routes'
import Color from '../constants/Colors'

export default function BarcodeScanner({ route, navigation }) {
    const [hasPermission, setHasPermission] = React.useState(null)

    useEffect(() => {
        ;(async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync()
            setHasPermission(status === 'granted')
        })()

        navigation.setOptions({
            headerTitle: 'VIN Scan',
            headerTitleAlign: 'center',
        })

        // ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)

        // return () => {
        //     ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
        // }
    }, [])

    const handleBarCodeScanned = ({ type, data }) => {
        route.params.onScan(data)
        navigation.navigate(Routes.RECORD_WALKAROUND)
        //alert(`Bar code with type ${type} and data ${data} has been scanned!`)
    }

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>
    }

    return (
        <Camera
            style={styles.container}
            onBarCodeScanned={handleBarCodeScanned}
            barCodeScannerSettings={{
                barCodeTypes: [
                    BarCodeScanner.Constants.BarCodeType.code39,
                    BarCodeScanner.Constants.BarCodeType.qr,
                    BarCodeScanner.Constants.BarCodeType.code128,
                    BarCodeScanner.Constants.BarCodeType.code39mod43,
                    BarCodeScanner.Constants.BarCodeType.pdf417,
                ],
            }}
        >
            <View style={styles.scanner} />
            <Text style={styles.text}>
                Line up the VIN barcode inside the box to automatically capture the VIN
            </Text>
        </Camera>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanner: {
        width: 250,
        height: 250,
        backgroundColor: 'rgba(18,97,189,.2)',
        borderColor: Color.white,
        borderRadius: 5,
        borderWidth: 1,
        borderStyle: 'solid',
    },
    text: {
        color: Color.white,
        textAlign: 'center',
        marginTop: 5,
    },
})
