import React, { useEffect } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'

import Routes from '../constants/Routes'

export default function ScanQR({ route, navigation }) {
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
    }, [])

    const handleBarCodeScanned = ({ type, data }) => {
        route.params.onScan(data)
        navigation.navigate(Routes.RECORD_WALKAROUND)
        // alert(`Bar code with type ${type} and data ${data} has been scanned!`)
    }

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner
                barCodeTypes={[
                    BarCodeScanner.Constants.BarCodeType.code39,
                    BarCodeScanner.Constants.BarCodeType.qr,
                    BarCodeScanner.Constants.BarCodeType.code128,
                    BarCodeScanner.Constants.BarCodeType.code39mod43,
                    BarCodeScanner.Constants.BarCodeType.pdf417,
                ]}
                onBarCodeScanned={handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
})
