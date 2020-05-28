import React from 'react'
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    TouchableOpacity,
} from 'react-native'
import MaterialCommunityIconsIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import Color from '../constants/Colors'
import Layout from '../constants/Layout'
import ShareTextOverlay from '../components/ShareTextOverlay'
import ShareEmailOverlay from '../components/ShareEmailOverlay'
import VideoPlayer from '../components/VideoPlayer'

function Playback({ route, navigation }) {
    const [shareTextVisible, setShareTextVisible] = React.useState(false)
    const [shareEmailVisible, setShareEmailVisible] = React.useState(false)
    const { title, details, video } = route.params

    React.useEffect(() => {
        navigation.setOptions({
            headerTitle: title,
            headerRight: null,
            headerTitleAlign: 'center',
        })
    }, [])

    return (
        <ScrollView style={styles.container}>
            <VideoPlayer src={video} />

            <View style={styles.contentWrapper}>
                <Text style={styles.videoTitle}>{title}</Text>
                <Text style={styles.videoDetails}>{details}</Text>

                <View style={styles.shareContainer}>
                    <Text style={styles.shareTitle}>Share Video</Text>
                    <View style={styles.shareButtonWrapper}>
                        <TouchableOpacity
                            style={styles.shareButton}
                            onPress={() => setShareTextVisible(true)}
                        >
                            <MaterialCommunityIconsIcon
                                name='cellphone-text'
                                size={50}
                                color={Color.mainBlue}
                            />
                            <Text style={styles.shareLabel}>Text</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.shareButton}
                            onPress={() => setShareEmailVisible(true)}
                        >
                            <MaterialCommunityIconsIcon
                                name='email'
                                size={55}
                                color={Color.mainBlue}
                            />
                            <Text style={styles.shareLabel}>Email</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <ShareTextOverlay
                    isVisible={shareTextVisible}
                    toggleVisible={() => setShareTextVisible(false)}
                />
                <ShareEmailOverlay
                    isVisible={shareEmailVisible}
                    toggleVisible={() => setShareEmailVisible(false)}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white,
    },
    videoDetails: {
        fontFamily: 'roboto-regular',
        color: Color.black,
        fontSize: 14,
    },
    videoTitle: {
        fontFamily: 'roboto-700',
        color: Color.black,
        fontSize: 20,
    },
    contentWrapper: {
        flex: 1,
        padding: 15,
    },
    shareContainer: {
        width: '100%',
        height: 200,
        borderRadius: 5,
        borderColor: Color.mainBlue,
        borderWidth: 1,
        padding: 10,
        marginVertical: 20,
    },
    shareTitle: {
        fontFamily: 'roboto-700',
        color: Color.mainBlue,
        fontSize: 20,
        textAlign: 'center',
    },
    shareButton: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    shareLabel: {
        fontFamily: 'roboto-regular',
        color: Color.mainBlue,
        fontSize: 17,
        textAlign: 'center',
    },
    shareButtonWrapper: {
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
    },
})

export default Playback
