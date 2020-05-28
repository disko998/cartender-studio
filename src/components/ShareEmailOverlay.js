import React from 'react'
import { StyleSheet } from 'react-native'

import StyledInput from './StyledInput'
import Modal from './Modal'
import BorderInput from './BorderInput'
import PrimaryButton from './PrimaryButton'
import Color from '../constants/Colors'

const ShareEmailOverlay = ({ isVisible, toggleVisible, onSubmit }) => {
    return (
        <Modal
            isVisible={isVisible}
            toggleVisible={toggleVisible}
            title='Email Video'
        >
            <BorderInput placeholder='Recipient Email' />
            <BorderInput placeholder='Email Subject' />
            <BorderInput placeholder='Message' />
            <PrimaryButton
                style={styles.button}
                title='SEND EMAIL'
                onPress={onSubmit}
            />
        </Modal>
    )
}

const styles = StyleSheet.create({
    button: {
        width: 150,
        backgroundColor: Color.dark,
        alignSelf: 'center',
        height: 50,
        marginTop: 20,
    },
})

export default ShareEmailOverlay
