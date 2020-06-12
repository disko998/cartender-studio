import * as ScreenOrientation from 'expo-screen-orientation'
import * as React from 'react'

export default function useOrientation() {
    const [orientation, setOrientation] = React.useState(false)

    React.useEffect(() => {
        async function unlockOrientation() {
            try {
                ScreenOrientation.unlockAsync()

                ScreenOrientation.addOrientationChangeListener(oInfo => {
                    const position = oInfo.orientationInfo.orientation

                    switch (position) {
                        case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
                            setOrientation(
                                ScreenOrientation.OrientationLock
                                    .LANDSCAPE_LEFT,
                            )
                            break
                        case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
                            setOrientation(
                                ScreenOrientation.OrientationLock
                                    .LANDSCAPE_RIGHT,
                            )
                            break
                        case ScreenOrientation.Orientation.PORTRAIT_UP:
                            setOrientation(
                                ScreenOrientation.OrientationLock.PORTRAIT_UP,
                            )
                            break
                        case ScreenOrientation.Orientation.PORTRAIT_DOWN:
                            setOrientation(
                                ScreenOrientation.OrientationLock.PORTRAIT_DOWN,
                            )
                            break

                        default:
                            setOrientation(
                                ScreenOrientation.OrientationLock.LANDSCAPE,
                            )
                            break
                    }
                })
            } catch (e) {
                // We might want to provide this error information to an error reporting service
                console.warn(e)
            }
        }

        unlockOrientation()
    }, [])

    return isLoadingComplete
}
