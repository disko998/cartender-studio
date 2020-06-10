import React from 'react'
import {
    StyleSheet,
    View,
    ImageBackground,
    Text,
    TouchableOpacity,
} from 'react-native'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import MaterialCommunityIconsIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import Color from '../constants/Colors'

const defaultThumb = require('../assets/images/default_thumbnail.jpg')

function VideoCard({ thumbnail, title, details, onPlay, onShare, status }) {
    const src = thumbnail ? { uri: thumbnail } : defaultThumb

    const renderStatus = (
        <View style={styles.renderStatusContainer}>
            <Text style={styles.statusText}>{`${title} processing...`}</Text>
            <Text style={styles.statusText}>
                Render status:
                <Text style={styles.status}> {status}</Text>
            </Text>
        </View>
    )

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPlay}
            disabled={status !== 'finished'}
        >
            <ImageBackground
                style={{ flex: 1 }}
                source={src}
                resizeMode='cover'
            >
                <View style={styles.cardBody}>
                    {status === 'finished' ? (
                        <View style={styles.videoInformationStack}>
                            <View style={styles.videoInformation}>
                                <Text
                                    ellipsizeMode='tail'
                                    numberOfLines={1}
                                    style={styles.videoTitle}
                                >
                                    {title}
                                </Text>
                                <Text
                                    ellipsizeMode='tail'
                                    numberOfLines={1}
                                    style={styles.videoDetails}
                                >
                                    {details}
                                </Text>
                            </View>
                            <View style={styles.rect}>
                                <TouchableOpacity onPress={onPlay}>
                                    <EntypoIcon
                                        name='controller-play'
                                        size={60}
                                        color={Color.white}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={onShare}>
                                    <MaterialCommunityIconsIcon
                                        name='share'
                                        size={50}
                                        color={Color.white}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        renderStatus
                    )}
                </View>
            </ImageBackground>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        shadowColor: Color.black,
        shadowOffset: {
            width: 5,
            height: 5,
        },
        marginVertical: 8,
        marginHorizontal: 16,
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
        elevation: 3,
        overflow: 'hidden',
        backgroundColor: Color.white,
        borderRadius: 10,
        height: 200,
    },
    cardBody: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 15,
    },
    videoInformationStack: {
        flexDirection: 'column',
        flex: 1,
    },
    videoInformation: {
        flexDirection: 'column',
    },
    videoDetails: {
        fontFamily: 'roboto-regular',
        color: Color.white,
        fontSize: 12,
    },
    videoTitle: {
        fontFamily: 'roboto-regular',
        color: Color.white,
        fontSize: 20,
    },
    rect: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        flex: 1,
    },
    renderStatusContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    statusText: {
        fontFamily: 'roboto-regular',
        color: 'rgba(255,255,255,0.9)',
        fontSize: 18,
    },
    status: {
        fontFamily: 'roboto-700',
        color: Color.white,
        fontSize: 18,
    },
})

export default VideoCard
