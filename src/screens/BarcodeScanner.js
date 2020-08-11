import React, { useEffect } from 'react'
import { Text, View, StyleSheet, StatusBar, TouchableOpacity } from 'react-native'
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
            headerShown: false,
        })

        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)

        return () => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
        }
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

    const onBack = async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
        navigation.goBack()
    }

    return (
        <>
            <StatusBar hidden />
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
                <Text style={styles.text}>
                    Line up the VIN barcode inside the box to automatically capture the
                    VIN.
                </Text>
                <View style={styles.scanner} />
                <TouchableOpacity style={styles.button} onPress={onBack}>
                    <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
            </Camera>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    wrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: 'transparent',
        padding: '5%',
        flex: 1,
    },
    scanner: {
        height: 150,
        width: '80%',
        backgroundColor: 'rgba(18,97,189,.2)',
        borderColor: Color.white,
        borderRadius: 5,
        borderWidth: 1,
        borderStyle: 'solid',

        marginVertical: 10,
    },
    text: {
        color: Color.white,
    },
    button: {
        backgroundColor: Color.mainBlue,
        padding: 10,
        borderRadius: 10,
        paddingHorizontal: 20,
    },
    btnText: {
        color: Color.white,
        textTransform: 'uppercase',
        fontSize: 18,
    },
})
