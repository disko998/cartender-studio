import React, { Component } from 'react'
import { Share, AsyncStorage } from 'react-native'
import { RNS3 } from 'react-native-aws3'
import * as VideoThumbnails from 'expo-video-thumbnails'
import * as ImagePicker from 'expo-image-picker'
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'

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

        if (!(vin && title && details)) {
            throw new Error('Please fill out the form')
        }

        if (!(Intro, Interior, Exterior, Outro)) {
            throw new Error(
                'You must record a clip for each segment before generating a video',
            )
        }

        const image = await this.generateThumbnail(Intro, 500)

        const thumbnail = await this.saveFileToS3(image)

        const postData = {
            'request-type': 'new',
            template: templates.walkaround,
            'vehicle-title': title,
            'vehicle-details': details,
            'vehicle-image': thumbnail,
            'vehicle-vin': vin,
            'video-clip1': Intro,
            'video-clip2': Exterior,
            'video-clip3': Interior,
            'video-clip4': Outro,
            output: `${title} ${vin}`,
        }

        __DEV__ && console.log('GENERATE REQUEST', postData)

        const res = await post(api.projects, postData, {
            Authorization: `Bearer ${this.state.user.token}`,
        })

        if (res.message) {
            throw new Error(res.message)
        }

        __DEV__ && console.log('POST PROJECT RESPONSE', res)

        this.getProjects()

        this.setState({
            ...this.state,
            currentVideo: {},
        })
    }

    getProjects = async () => {
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

    generateThumbnail = async (video, time = 5000) => {
        try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(video, {
                time,
            })
            return uri
        } catch (e) {
            __DEV__ && console.warn(e)
        }
    }

    saveFileToS3 = async uri => {
        const uriFragments = uri.split('/')

        const file = {
            uri,
            name: uriFragments[uriFragments.length - 1],
            type: 'image/jpg',
        }

        const data = new FormData()
        data.append('image', file)

        const res = await RNS3.put(file, s3Options)

        return res.body.postResponse.location
    }

    onStepFinish = async (stepName, uri) => {
        const uriFragments = uri.split('/')

        const file = {
            uri,
            name: uriFragments[uriFragments.length - 1],
            type: 'video/mp4',
        }

        __DEV__ && console.log('FILE', file)

        const res = await RNS3.put(file, s3Options)

        const videoUrl = res.body.postResponse.location

        const stepVideo = { [stepName]: videoUrl }

        __DEV__ && console.log('S3 VIDEO', stepVideo)

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

    pickVideoFromLibrary = async (duration = 15000) => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(
                Permissions.CAMERA_ROLL,
            )
            if (status !== 'granted') {
                throw new Error(
                    `Sorry, we need camera roll permissions to make this work!`,
                )
            }
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            quality: 0.5,
            videoExportPreset: ImagePicker.VideoExportPreset.MediumQuality,
            allowsEditing: true,
        })

        __DEV__ && console.log('Video chosen', result)

        if (result.cancelled) {
            return null
        }

        if (result.duration > duration) {
            throw new Error(
                `Video is to big! ${result.duration}ms. Max allowed ${duration}ms`,
            )
        }

        return result
    }

    render() {
        const {
            onShare,
            loginWithEmailAndPassword,
            getProjects,
            generateVideo,
            onStepFinish,
            getCurrentUser,
            hideLoading,
            showLoading,
            generateThumbnail,
            pickVideoFromLibrary,
        } = this

        __DEV__ && console.log('State', this.state)

        return (
            <Provider
                value={{
                    data: this.state,
                    actions: {
                        onShare,
                        loginWithEmailAndPassword,
                        getProjects,
                        generateVideo,
                        onStepFinish,
                        getCurrentUser,
                        showLoading,
                        hideLoading,
                        generateThumbnail,
                        pickVideoFromLibrary,
                    },
                }}
            >
                {this.props.children}
            </Provider>
        )
    }
}
