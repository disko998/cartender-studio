import React, { Component } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import EntypoIcon from "react-native-vector-icons/Entypo";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";

function VideoCard(props) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.cardBody}>
        <Image
          source={require("../assets/images/cardImage3.png")}
          resizeMode="cover"
          style={styles.videoThumbnail}
        ></Image>
        <View style={styles.videoInformationStack}>
          <View style={styles.videoInformation}>
            <Text style={styles.videoDetails}>
              Video Details (VIN, Stock, Short Description, etc.)
            </Text>
            <Text style={styles.videoTitle}>Video Title</Text>
          </View>
          <View style={styles.rect}>
            <EntypoIcon
              name="controller-play"
              style={styles.playIcon}
            ></EntypoIcon>
            <MaterialCommunityIconsIcon
              name="cellphone-message"
              style={styles.textIcon}
            ></MaterialCommunityIconsIcon>
            <EntypoIcon name="mail" style={styles.emailIcon}></EntypoIcon>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 5
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 3,
    overflow: "hidden",
    backgroundColor: "rgba(230, 230, 230,1)"
  },
  cardBody: {
    width: 360,
    height: 220,
    backgroundColor: "rgba(0,0,0,1)",
    margin: 0
  },
  videoThumbnail: {
    minHeight: 359,
    height: 220,
    padding: 0,
    left: 0,
    opacity: 0.5
  },
  videoInformation: {
    top: 0,
    left: 0,
    width: 332,
    height: 43,
    position: "absolute",
    flexDirection: "row"
  },
  videoDetails: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 12,
    opacity: 0.8,
    marginTop: 25
  },
  videoTitle: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 20,
    marginLeft: -259
  },
  rect: {
    width: 322,
    height: 133,
    position: "absolute",
    opacity: 0.95,
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-around",
    alignItems: "center",
    left: 3,
    top: 31
  },
  playIcon: {
    color: "rgba(255,255,255,1)",
    fontSize: 80,
    height: 89
  },
  textIcon: {
    color: "rgba(255,255,255,1)",
    fontSize: 60,
    height: 89
  },
  emailIcon: {
    color: "rgba(255,255,255,1)",
    fontSize: 60,
    height: 89
  },
  videoInformationStack: {
    top: 13,
    left: 16,
    width: 332,
    height: 164,
    position: "absolute"
  }
});

export default VideoCard;
