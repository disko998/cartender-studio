import React from 'react'
import { StyleSheet, View, Image, Text } from 'react-native'

import PrimaryButton from '../components/PrimaryButton'
import StyledInput from '../components/StyledInput'
import Color from '../constants/Colors'
import Routes from '../constants/Routes'

function Login({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.logoStack}>
                <Image
                    source={require('../assets/images/logo.jpg')}
                    resizeMode='contain'
                    style={styles.logo}
                ></Image>
                <Text style={styles.salesStudio}>Sales Studio</Text>
            </View>

            <StyledInput placeholder='john@doe.com' label='Email' />
            <StyledInput
                placeholder='********'
                label='Password'
                secureTextEntry={true}
            />
            <PrimaryButton
                style={styles.loginButton}
                title='Login'
                onPress={() => navigation.navigate(Routes.HOME)}
            />

            <Text style={styles.text}>
                Need help? Email support@cartender.com
            </Text>
            <Text style={styles.poweredByCartender}>Powered by Cartender</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 237,
        height: 200,
    },
    salesStudio: {
        top: 180,
        position: 'absolute',
        fontFamily: 'roboto-700',
        color: Color.black,
        fontSize: 18,
        left: 70,
    },
    logoStack: {
        backgroundColor: 'transparent',
        marginBottom: 30,
    },
    loginButton: {
        width: 237,
        marginTop: 15,
    },
    poweredByCartender: {
        fontFamily: 'roboto-regular',
        color: Color.darkGray,
        fontSize: 12,
        textAlign: 'center',
        alignSelf: 'center',
        backgroundColor: Color.white,
        width: '100%',
        marginTop: 5,
    },
    text: {
        fontFamily: 'roboto-700',
        color: Color.darkGray,
        fontSize: 12,
        textAlign: 'center',
        alignSelf: 'center',
        marginTop: 15,
    },
})

export default Login
