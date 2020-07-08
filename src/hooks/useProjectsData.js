import { Ionicons } from '@expo/vector-icons'

import * as React from 'react'

import { AppContext } from '../context/AppProvider'
import { pullingInterval } from '../constants/Settings'

export default function useProjectsData() {
    const {
        actions: { getProjects },
    } = React.useContext(AppContext)

    React.useEffect(() => {
        let interval
        ;(async () => {
            try {
                await getProjects()
                interval = setInterval(getProjects, pullingInterval)
            } catch (error) {
                __DEV__ && console.log(error.message)
            }
        })()
    }, [])
}
