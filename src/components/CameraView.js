import React from 'react'
import { View } from 'react-native'
import { Camera } from 'expo-camera'

export default CameraView = React.forwardRef((props, ref) => (
    <Camera style={{ flex: 1 }} {...props} ref={ref}>
        <View
            style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
                margin: '5%',
                borderWidth: 3,
                borderStyle: 'dotted',
                borderColor: '#fff',
                borderRadius: 1,
            }}
        />
    </Camera>
))
