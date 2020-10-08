import React, { Component } from 'react'
import { Share, AsyncStorage } from 'react-native'
import { RNS3 } from 'react-native-aws3'
import * as VideoThumbnails from 'expo-video-thumbnails'
import * as ImagePicker from 'expo-image-picker'
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'

import { _DATA } from './_DATA'
import { api, post, apiRoutes, get, WORDPRESS_AUTH } from '../api'
import { s3Options, templates, steps } from '../constants/Settings'

export const AppContext = React.createContext()
export const Provider = AppContext.Provider

const devCredentials = {
    username: 'stefan',
    password: '9zQVzQC5WAR08aqouNGlkMAD',
}

export default class AppProvider extends Component {
    state = {
        loading: false,
        user: null,
        projects: null,
        walkaround: {
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
        },
        dealership: {
            currentVideo: {},
        },
        inspection: {
            currentVideo: null,
        },
        greeting: {
            currentVideo: null,
        },
    }

    /* User actions */
    loginWithEmailAndPassword = async (email, password) => {
        if (!email.length || !password.length) {
            throw new Error('Please enter correct email and password')
        }

        const response = await fetch(WORDPRESS_AUTH, {
            method: 'POST',
            body: __DEV__
                ? JSON.stringify(devCredentials)
                : JSON.stringify({
                      username: email,
                      password: password,
                  }),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const resJson = await response.json()

        if (!response.ok) {
            throw new Error(resJson.message)
        }

        await AsyncStorage.setItem('token', resJson.data.user.render_api_key)
        await AsyncStorage.setItem('wordpress_token', resJson.data.user.api_key)

        this.getCurrentUser()
    }

    logoutUser = async () => {
        await AsyncStorage.removeItem('token')

        this.setState({ ...this.state, user: null })
    }

    getCurrentUser = async () => {
        const token = await AsyncStorage.getItem('token')

        const userData = await get(apiRoutes.profile, {
            Authorization: `Bearer ${token}`,
        })

        if (userData.message) {
            throw new Error(userData.message)
        }

        this.setState({
            ...this.state,
            user: { ...userData.user, token },
        })
    }

    /* Video actions */
    getProjects = async () => {
        const projects = await get(`${apiRoutes.projects}?sort=-createDate`, {
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

    saveFileToS3 = async (uri, type) => {
        const uriFragments = uri.split('/')

        const file = {
            uri,
            name: uriFragments[uriFragments.length - 1],
            type: type,
        }

        __DEV__ && console.log('FILE TO S3', file)

        const res = await RNS3.put(file, s3Options)

        return res.body.postResponse.location
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

        this.showLoading()

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            quality: 0.5,
            videoExportPreset: ImagePicker.VideoExportPreset.MediumQuality,
            allowsEditing: true,
        })

        this.hideLoading()

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

    /* Save recorded video */
    setInspectionVideo = async uri => {
        const url = await this.saveFileToS3(uri, 'video/mp4')

        __DEV__ && console.log('S3 url', url)

        if (!url) {
            throw new Error('Uploading to S3 failed')
        }

        this.setState({
            ...this.state,
            inspection: { ...this.state.inspection, currentVideo: url },
        })
    }

    setGreetingVideo = async uri => {
        const url = await this.saveFileToS3(uri, 'video/mp4')

        __DEV__ && console.log('S3 url', url)

        if (!url) {
            throw new Error('Uploading to S3 failed')
        }

        this.setState({
            ...this.state,
            greeting: { ...this.state.greeting, currentVideo: url },
        })
    }

    setDealershipVideo = async (stepName, uri) => {
        const url = await this.saveFileToS3(uri, 'video/mp4')

        __DEV__ && console.log('S3 url', url)

        if (!url) {
            throw new Error('Uploading to S3 failed')
        }

        this.setState({
            ...this.state,
            dealership: {
                ...this.state.dealership,
                currentVideo: {
                    ...this.state.dealership.currentVideo,
                    [stepName]: url,
                },
            },
        })
    }

    setWalkaroundStep = async (stepName, uri) => {
        const url = await this.saveFileToS3(uri, 'video/mp4')

        __DEV__ && console.log('S3 url', url)

        if (!url) {
            throw new Error('Uploading to S3 failed')
        }

        this.setState({
            ...this.state,
            walkaround: {
                ...this.state.walkaround,
                currentVideo: {
                    ...this.state.walkaround.currentVideo,
                    [stepName]: url,
                },
            },
        })
    }

    /* Process clips after recording */
    generateInspectionVideo = async ({ title }) => {
        const video = this.state.inspection.currentVideo

        if (!title) {
            throw new Error('Please fill out the form')
        }

        if (!video) {
            throw new Error('You must record a clip before generating a video')
        }

        const imagePath = await this.generateThumbnail(video, 500)
        const thumbnail = await this.saveFileToS3(imagePath, 'image/jpg')

        const postData = {
            'request-type': 'new',
            'data-source': 'mobile-app',
            'video-title': title,
            'video-image': thumbnail,
            'video-clip1': video,
            template: templates.inspection,
            output: title,
        }

        __DEV__ && console.log('POST request', postData)

        const res = await post(apiRoutes.projects, postData, {
            Authorization: `Bearer ${this.state.user.token}`,
        })

        __DEV__ && console.log('POST response', res)

        if (res.message) {
            throw new Error(res.message)
        }

        this.getProjects()

        this.setState({
            ...this.state,
            inspection: { ...this.state.inspection, currentVideo: null },
        })
    }

    generateGreetingVideo = async ({ name, job, phone, customer }) => {
        const video = this.state.greeting.currentVideo

        if (!(name && job && phone && customer)) {
            throw new Error('Please fill out the form')
        }

        if (!video) {
            throw new Error('You must record a clip before generating a video')
        }

        const imagePath = await this.generateThumbnail(video, 500)
        const thumbnail = await this.saveFileToS3(imagePath, 'image/jpg')

        const postData = {
            'request-type': 'new',
            'data-source': 'mobile-app',
            'staff-name': name,
            'staff-job-title': job,
            'staff-phone': phone,
            'video-image': thumbnail,
            'video-clip1': video,
            'customer-name': customer,
            template: templates.greeting,
            output: `${name} - ${job}`,
        }

        __DEV__ && console.log('POST request', postData)

        const res = await post(apiRoutes.projects, postData, {
            Authorization: `Bearer ${this.state.user.token}`,
        })

        __DEV__ && console.log('POST response', res)

        if (res.message) {
            throw new Error(res.message)
        }

        this.getProjects()

        this.setState({
            ...this.state,
            greeting: { ...this.state.greeting, currentVideo: null },
        })
    }

    generateWalkaroundVideo = async ({ vin, title, details }) => {
        const {
            Intro,
            Interior,
            Exterior,
            Outro,
        } = this.state.walkaround.currentVideo

        if (!(vin && title && details)) {
            throw new Error('Please fill out the form')
        }

        if (!(Intro, Interior, Exterior, Outro)) {
            throw new Error(
                'You must record a clip for each segment before generating a video',
            )
        }

        const imagePath = await this.generateThumbnail(Intro, 500)

        const thumbnail = await this.saveFileToS3(imagePath, 'image/jpg')

        const postData = {
            'request-type': 'new',
            'data-source': 'mobile-app',
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

        const res = await post(apiRoutes.projects, postData, {
            Authorization: `Bearer ${this.state.user.token}`,
        })

        if (res.message) {
            throw new Error(res.message)
        }

        __DEV__ && console.log('POST PROJECT RESPONSE', res)

        this.getProjects()

        this.setState({
            ...this.state,
            walkaround: {
                ...this.state.walkaround,
                currentVideo: {},
            },
        })
    }

    saveDealershipVideo = async ({ dealership }) => {
        const videos = this.state.dealership.currentVideo

        // Validate user inputs
        if (!dealership) {
            throw new Error('Please choose a dealership profile')
        }

        if (
            !(videos[steps.dealership.BUILDING],
            videos[steps.dealership.CAR_LOT],
            videos[steps.dealership.SERVICE_BAYS],
            videos[steps.dealership.SHOWROOM])
        ) {
            throw new Error(
                'You must record a clip for each segment before saving a video',
            )
        }

        //TODO: Submit video to WordPress backend

        // Set state
        this.setState({
            ...this.state,
            dealership: { ...this.state.dealership, currentVideo: {} },
        })
    }

    /* Utils */
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
            getProjects,
            generateWalkaroundVideo,
            setWalkaroundStep,
            getCurrentUser,
            hideLoading,
            showLoading,
            generateThumbnail,
            pickVideoFromLibrary,
            setInspectionVideo,
            generateInspectionVideo,
            setGreetingVideo,
            generateGreetingVideo,
            logoutUser,
            setDealershipVideo,
            saveDealershipVideo,
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
                        generateWalkaroundVideo,
                        setWalkaroundStep,
                        getCurrentUser,
                        showLoading,
                        hideLoading,
                        generateThumbnail,
                        pickVideoFromLibrary,
                        setInspectionVideo,
                        generateInspectionVideo,
                        setGreetingVideo,
                        generateGreetingVideo,
                        logoutUser,
                        setDealershipVideo,
                        saveDealershipVideo,
                    },
                }}
            >
                {this.props.children}
            </Provider>
        )
    }
}
