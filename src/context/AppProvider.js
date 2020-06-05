import React, { Component } from 'react'
import { Share, AsyncStorage } from 'react-native'
import { RNS3 } from 'react-native-aws3'

import { _DATA } from './_DATA'
import { post, api, get } from '../api'
import { s3Options, templates } from '../constants/Settings'

export const AppContext = React.createContext()
export const Provider = AppContext.Provider

const myCred = {
    email: 'disko998@gmail.com',
    password: '697971a5294079197abe596f57f425fd',
}

export default class AppProvider extends Component {
    state = {
        loading: false,
        user: null,
        projects: null,
        currentVideo: {
            // Exterior:
            //     'https://ct-sales-studio.s3.amazonaws.com/a384f275-cd2b-49d2-9990-f36c97af47ed.mp4',
            // Interior:
            //     'https://ct-sales-studio.s3.amazonaws.com/691eb6fb-1a9c-4790-b7b8-216d2551c5f2.mp4',
            // Intro:
            //     'https://ct-sales-studio.s3.amazonaws.com/11b7cb92-be93-4a08-9240-f30dd0a78c2c.mp4',
            // Outro:
            //     'https://ct-sales-studio.s3.amazonaws.com/b3890fe1-37e8-4788-ae14-1d63f68aa764.mp4',
        },
    }

    loginWithEmailAndPassword = async (email, password) => {
        if (!email.length || !password.length) {
            throw new Error('Please enter correct email and password')
        }

        let user = await post(api.auth, {
            email,
            password,
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

    generateVideo = async ({ vin, title, details }) => {
        const { Intro, Interior, Exterior, Outro } = this.state.currentVideo

        if (!(vin && title && details) || !(Intro, Interior, Exterior, Outro)) {
            throw new Error('not valid')
        }

        const postData = {
            'request-type': 'new',
            template: templates.walkaround,
            'vehicle-title': title,
            'vehicle-details': details,
            'vehicle-vin': vin,
            'video-clip1': Intro,
            'video-clip2': Interior,
            'video-clip3': Exterior,
            'video-clip4': Outro,
            output: `${title} ${vin}`,
        }

        const res = await post(api.projects, postData, {
            Authorization: `Bearer ${this.state.user.token}`,
        })

        if (res.message) {
            throw new Error(res.message)
        }

        __DEV__ && console.log(res)

        this.getVideos()

        this.setState({
            ...this.state,
            currentVideo: {},
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

    onStepFinish = async (stepName, uri) => {
        const uriFragments = uri.split('/')

        const file = {
            uri,
            name: uriFragments[uriFragments.length - 1],
            type: 'video/mp4',
        }

        const data = new FormData()
        data.append('video', file)

        __DEV__ && console.log(data)

        const res = await RNS3.put(file, s3Options)

        const videoUrl = res.body.postResponse.location

        const stepVideo = { [stepName]: videoUrl }

        __DEV__ && console.log(stepVideo)

        this.setState({
            ...this.state,
            currentVideo: { ...this.state.currentVideo, ...stepVideo },
        })
    }

    showLoading = () => {
        this.setState({ ...this.state, loading: true })
    }

    hideLoading = () => {
        this.setState({ ...this.state, loading: false })
    }

    render() {
        const {
            onShare,
            loginWithEmailAndPassword,
            getVideos,
            generateVideo,
            onStepFinish,
            getCurrentUser,
            hideLoading,
            showLoading,
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
                        generateVideo,
                        onStepFinish,
                        getCurrentUser,
                        showLoading,
                        hideLoading,
                    },
                }}
            >
                {this.props.children}
            </Provider>
        )
    }
}
