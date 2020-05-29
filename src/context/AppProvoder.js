import React, { Component } from 'react'
import { Share } from 'react-native'

import { _DATA } from './_DATA'

export const AppContext = React.createContext()
export const Provider = AppContext.Provider

export default class AppProvider extends Component {
    state = {
        videoList: _DATA,
    }

    onShare = async ({ message, title, subject }) => {
        try {
            const result = await Share.share({
                message,
                title,
                subject,
                url: message,
            })

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message)
        }
    }

    render() {
        const { onShare } = this

        return (
            <Provider
                value={{
                    data: this.state,
                    actions: { onShare },
                }}
            >
                {this.props.children}
            </Provider>
        )
    }
}
