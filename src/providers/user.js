import React, { createContext, useEffect, useState } from 'react'
import { AsyncStorage, Alert } from 'react-native'
import { api, WORDPRESS_URL, wpRoutes } from '../api'

export const UserContext = createContext({
    current: null,
    loading: false,
})

export const RENDER_API_TOKEN = '@RENDER_API_TOKEN'
export const WORDPRESS_TOKEN = '@WORDPRESS_TOKEN'

const UserProvider = ({ children }) => {
    const [current, setCurrent] = useState(null)
    const [loading, setLoading] = useState(null)

    useEffect(() => {
        getCurrentUser(false)
    }, [])

    // actions
    const loginUser = async credentials => {
        try {
            // validate
            if (!credentials.email || !credentials.password) {
                throw new Error('Please enter correct email and password')
            }

            // login user
            setLoading(true)
            const res = await api(
                `${WORDPRESS_URL}${wpRoutes.auth}`,
                'POST',
                __DEV__ ? devCredentials : credentials,
            )

            // save tokens
            await Promise.all([
                AsyncStorage.setItem(WORDPRESS_TOKEN, res.data.user.api_key),
                AsyncStorage.setItem(RENDER_API_TOKEN, res.data.user.render_api_key),
            ])

            // get user profile
            getCurrentUser()
        } catch (error) {
            __DEV__ && console.log(error)
            Alert.alert('Login failed', 'Wrong credentials')
        } finally {
            setLoading(false)
        }
    }

    const logoutUser = async () => {
        await Promise.all([
            AsyncStorage.removeItem(RENDER_API_TOKEN),
            AsyncStorage.removeItem(WORDPRESS_TOKEN),
        ])

        setCurrent(null)
    }

    const getCurrentUser = async (showError = true) => {
        try {
            const token = await AsyncStorage.getItem(WORDPRESS_TOKEN)

            if (!token) return

            const user = await api(`${WORDPRESS_URL}${wpRoutes.profile}`, 'GET', null, {
                Authorization: `Bearer ${token}`,
            })

            user && setCurrent(user)

            console.log(user)
        } catch (error) {
            __DEV__ && console.log(error)
            showError && Alert.alert('Fetching user failed', error.message)
        }
    }

    return (
        <UserContext.Provider
            value={{
                data: { current, loading },
                actions: { logoutUser, loginUser },
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

const devCredentials = {
    username: 'stefan',
    password: '9zQVzQC5WAR08aqouNGlkMAD',
}

export default UserProvider
