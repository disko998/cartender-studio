import React, { Component } from 'react'
import { Share, AsyncStorage } from 'react-native'

import { _DATA } from './_DATA'
import { post, api, get } from '../api'

export const AppContext = React.createContext()
export const Provider = AppContext.Provider

export default class AppProvider extends Component {
    state = {
        user: null,
        projects: null,
        currentVideo: {},
    }

    loginWithEmailAndPassword = async (email, password) => {
        if (!email.length || !password.length) {
            throw new Error('Please enter correct email and password')
        }

        let user = await post(api.auth, {
            email: 'disko998@gmail.com',
            password: '697971a5294079197abe596f57f425fd',
        })

        if (!user.token) {
            throw new Error(user.message)
        }

        await AsyncStorage.setItem('token', user.token)

        this.getCurrentUser()
    }

    getCurrentUser = async () => {
        const token = await AsyncStorage.getItem('token')

        const userData = await get(`${api.profile}`, {
            Authorization: `Bearer ${token}`,
        })

        if (userData.message) {
            throw new Error(user.message)
        }

        this.setState({
            ...this.state,
            user: { ...userData.user, token },
        })
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
        const projects = await get(`${api.projects}?sort=-createDate`, {
            Authorization: `Bearer ${this.state.user.token}`,
        })

        if (projects.message) {
            throw new Error(projects.message)
        }

        this.setState({ ...this.state, projects })
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

    onStepFinish = uri => {
        this.setState({
            ...this.state,
            currentVideo: { ...this.state.currentVideo, ...uri },
        })
    }

    render() {
        const {
            onShare,
            loginWithEmailAndPassword,
            getVideos,
            renderVideo,
            onStepFinish,
            getCurrentUser,
        } = this

        console.log('State', this.state)

        return (
            <Provider
                value={{
                    data: this.state,
                    actions: {
                        onShare,
                        loginWithEmailAndPassword,
                        getVideos,
                        renderVideo,
                        onStepFinish,
                        getCurrentUser,
                    },
                }}
            >
                {this.props.children}
            </Provider>
        )
    }
}
