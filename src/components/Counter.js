import React from 'react'
import { Text, StyleSheet } from 'react-native'

import Color from '../constants/Colors'

export default function Counter({ duration, start }) {
    const [counter, setCounter] = React.useState(duration)

    React.useEffect(() => {
        let interval = null
        if (start) {
            interval =
                counter > 0 &&
                setInterval(() => setCounter(counter => counter - 1), 1000)
        } else {
            setCounter(duration)
        }
        return () => clearInterval(interval)
    }, [counter, start, duration])

    return (
        <Text style={styles.timer}>{`Time Remaining: ${
            counter < 10 ? `0${counter}` : counter
        } sec`}</Text>
    )
}

const styles = StyleSheet.create({
    timer: {
        color: Color.white,
        textAlign: 'center',
        fontFamily: 'roboto-700',
        fontSize: 17,
        marginBottom: 10,
    },
})
