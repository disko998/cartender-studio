import React from 'react'
import { StyleSheet, View, ImageBackground, Text } from 'react-native'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import MaterialCommunityIconsIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import Color from '../constants/Colors'
import { TouchableOpacity } from 'react-native-gesture-handler'

function VideoCard({
    thumbnail,
    title,
    details,
    onPlay,
    onTextMessage,
    onEmail,
}) {
    return (
        <ImageBackground
            style={styles.container}
            source={{ uri: thumbnail }}
            resizeMode='cover'
        >
            <View style={styles.cardBody}>
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
                        <TouchableOpacity onPress={onTextMessage}>
                            <MaterialCommunityIconsIcon
                                name='share'
                                size={50}
                                color={Color.white}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ImageBackground>
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
})

export default VideoCard
