import React, { Component } from 'react'
import { Share, AsyncStorage } from 'react-native'

import { _DATA } from './_DATA'
import { post, api, get } from '../api'

export const AppContext = React.createContext()
export const Provider = AppContext.Provider

export default class AppProvider extends Component {
    state = {
        user: null,
        videoList: _DATA,
    }

    loginWithEmailAndPassword = async (email, password) => {
        if (!email.length || !password.length) {
            throw new Error('Please enter correct email and password')
        }

        const user = await post(api.auth, {
            email,
            password,
        })

        await AsyncStorage.setItem('token', user.token)

        this.setState({ ...this.state, user })
    }

    getCurrentUser = async () => {
        const token = await AsyncStorage.getItem('token')

        const user = await get(`${api.profile}`, {
            Authorization: `Bearer ${token}`,
        })

        this.setState({ ...this.state, user })
    }

    renderVideo = async metadata => {
        const video = await post(
            api.projects,
            {
                ...metadata,
            },
            {
                Authorization: `Bearer ${this.state.user.token}`,
            },
        )

        this.setState({
            ...this.state,
            videoList: { video, ...this.state.videoList },
        })
    }

    getVideos = async () => {
        const videos = await get(`${api.projects}?sort=-createDate`, {
            Authorization: `Bearer ${this.state.user.token}`,
        })

        this.setState({ ...this.state, videoList: videos })
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
        const {
            onShare,
            loginWithEmailAndPassword,
            getVideos,
            renderVideo,
        } = this

        return (
            <Provider
                value={{
                    data: this.state,
                    actions: {
                        onShare,
                        loginWithEmailAndPassword,
                        getVideos,
                        renderVideo,
                    },
                }}
            >
                {this.props.children}
            </Provider>
        )
    }
}
