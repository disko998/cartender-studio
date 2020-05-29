import * as React from 'react'
import { View, Text, Button } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import MaterialCommunityIconsIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import Routes from '../constants/Routes'
import Color from '../constants/Colors'
import CameraButton from '../components/CameraButton'

// Screens
import Login from '../screens/Login'
import VideoList from '../screens/VideoList'
import RecordWalkaround from '../screens/RecordWalkaround'
import Playback from '../screens/Playback'
import RecordVideo from '../screens/RecordVideo'

const BottomTab = createBottomTabNavigator()
const HomeStack = createStackNavigator()
const RecordingStack = createStackNavigator()
const RooStack = createStackNavigator()

function inDevelopmentScreen({ route, navigation }) {
    return (
        <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
            <Text style={{ marginBottom: 15, color: '#000', fontSize: 20 }}>
                {`${route.name} Screen in development`}
            </Text>
            <Button onPress={() => navigation.goBack()} title='Go back' />
        </View>
    )
}

export function BottomTabNavigator({ navigation, route }) {
    // set nav options here stupid

    let tabName = 'Walkaround'
    if (route.state) {
        tabName = route.state.routeNames[route.state.index]
    }

    navigation.setOptions({
        headerTitle: `${tabName} Videos`,
    })

    return (
        <BottomTab.Navigator
            initialRouteName={'Walkaround'}
            activeColor={Color.mainBlue}
            inactiveColor={Color.darkGray}
        >
            <BottomTab.Screen
                name='Walkaround'
                component={VideoList}
                options={{
                    title: 'Walkaround',
                    tabBarIcon: ({ focused, color }) => (
                        <MaterialCommunityIconsIcon
                            name='car'
                            size={22}
                            color={color}
                        />
                    ),
                }}
            />
            <BottomTab.Screen
                name='Inspections'
                component={inDevelopmentScreen}
                options={{
                    title: 'Inspections',
                    tabBarIcon: ({ focused, color }) => (
                        <MaterialCommunityIconsIcon
                            name='wrench'
                            size={22}
                            color={color}
                        />
                    ),
                }}
            />
            <BottomTab.Screen
                name='Greetings'
                component={inDevelopmentScreen}
                options={{
                    title: 'Greetings',
                    tabBarIcon: ({ focused, color }) => (
                        <MaterialCommunityIconsIcon
                            name='account-heart'
                            size={22}
                            color={color}
                        />
                    ),
                }}
            />
        </BottomTab.Navigator>
    )
}

export function RecodingStack({ navigation }) {
    navigation.setOptions({
        headerTitle: 'Record Walkaround',
        headerRight: null,
        headerTitleAlign: 'center',
    })

    return (
        <RecordingStack.Navigator
            initialRouteName={Routes.RECORD_WALKAROUND}
            headerMode='none'
        >
            <RecordingStack.Screen
                name={Routes.RECORD_WALKAROUND}
                component={RecordWalkaround}
            />
            <HomeStack.Screen name={Routes.CAMERA} component={RecordVideo} />
        </RecordingStack.Navigator>
    )
}

export function HomeNavigation({ navigation }) {
    return (
        <HomeStack.Navigator
            initialRouteName={Routes.BottomTabNavigator}
            screenOptions={{
                headerStyle: { height: 65 },
                headerTitleStyle: {
                    fontFamily: 'roboto-700',
                    color: Color.black,
                },
                headerRight: ({ focused }) => (
                    <CameraButton
                        style={{ marginRight: 15 }}
                        onPress={() =>
                            navigation.navigate(Routes.RECORD_WALKAROUND)
                        }
                    />
                ),
            }}
        >
            <HomeStack.Screen
                name={Routes.VIDEO_LIST}
                component={BottomTabNavigator}
            />
            <HomeStack.Screen
                name={Routes.RECORD_WALKAROUND}
                component={RecodingStack}
            />

            <HomeStack.Screen name={Routes.PLAYBACK} component={Playback} />
        </HomeStack.Navigator>
    )
}

export default function Router() {
    const user = true

    return (
        <NavigationContainer>
            <RooStack.Navigator
                headerMode='none'
                initialRouteName={Routes.LOGIN}
            >
                {!user ? (
                    <RooStack.Screen name={Routes.LOGIN} component={Login} />
                ) : (
                    <RooStack.Screen
                        name={Routes.HOME}
                        component={HomeNavigation}
                    />
                )}
            </RooStack.Navigator>
        </NavigationContainer>
    )
}
