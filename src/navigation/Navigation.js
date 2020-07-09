import * as React from 'react'
import { View, Text, Button } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import MaterialCommunityIconsIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import Routes from '../constants/Routes'
import Color from '../constants/Colors'
import CameraButton from '../components/CameraButton'
import { AppContext } from '../context/AppProvider'
import useProjectsData from '../hooks/useProjectsData'

// Screens
import Login from '../screens/Login'
import VideoList from '../screens/VideoList'
import RecordWalkaround from '../screens/RecordWalkaround'
import Playback from '../screens/Playback'
import RecordVideo from '../screens/RecordVideo'
import RecordInspection from '../screens/Inspection/RecordInspection'
import Inspection from '../screens/Inspection/Inspection'
import RecordGreeting from '../screens/Greeting/RecordGreeting'
import Greeting from '../screens/Greeting/Greeting'
import Settings from '../screens/Settings'

const BottomTab = createBottomTabNavigator()
const HomeStack = createStackNavigator()
const RecordingStack = createStackNavigator()
const RooStack = createStackNavigator()

function inDevelopmentScreen({ route, navigation }) {
    return (
        <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
            <Text
                style={{
                    marginBottom: 15,
                    color: '#000',
                    fontSize: 20,
                    textAlign: 'center',
                }}
            >
                {`${route.name} Screen in development`}
            </Text>
            <Button onPress={() => navigation.goBack()} title='Go back' />
        </View>
    )
}

export function RecodingStack({ navigation }) {
    navigation.setOptions({
        headerTitle: 'Record Walkaround',
        headerRight: null,
        headerTitleAlign: 'center',
        headerShown: false,
    })

    return (
        <RecordingStack.Navigator initialRouteName={Routes.RECORD_WALKAROUND}>
            <RecordingStack.Screen
                name={Routes.RECORD_WALKAROUND}
                component={RecordWalkaround}
            />
            <HomeStack.Screen name={Routes.CAMERA} component={RecordVideo} />
        </RecordingStack.Navigator>
    )
}

export function BottomTabNavigator({ navigation, route }) {
    let initialRoute = Routes.WALKAROUND
    if (route.state) {
        initialRoute = route.state.routeNames[route.state.index]
    }

    let routeName = ''

    switch (initialRoute) {
        case Routes.WALKAROUND:
            routeName = Routes.RECORD_WALKAROUND
            break
        case Routes.GREETING:
            routeName = Routes.RECORD_GREETING
            break
        case Routes.INSPECTION:
            routeName = Routes.RECORD_INSPECTION
            break
        default:
            routeName = initialRoute
            break
    }

    navigation.setOptions({
        headerTitle: `${initialRoute}`,
        headerRight: ({ focused }) =>
            initialRoute === Routes.SETTINGS ? null : (
                <CameraButton
                    style={{ marginRight: 15 }}
                    onPress={() => navigation.navigate(routeName)}
                />
            ),
    })

    return (
        <BottomTab.Navigator
            initialRouteName={initialRoute}
            activeColor={Color.mainBlue}
            inactiveColor={Color.darkGray}
        >
            <BottomTab.Screen
                name={Routes.WALKAROUND}
                component={VideoList}
                options={{
                    title: Routes.WALKAROUND,
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
                name={Routes.INSPECTION}
                component={Inspection}
                options={{
                    title: Routes.INSPECTION,
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
                name={Routes.GREETING}
                component={Greeting}
                options={{
                    title: Routes.GREETING,
                    tabBarIcon: ({ focused, color }) => (
                        <MaterialCommunityIconsIcon
                            name='account-heart'
                            size={22}
                            color={color}
                        />
                    ),
                }}
            />
            <BottomTab.Screen
                name={Routes.SETTINGS}
                component={Settings}
                options={{
                    title: Routes.SETTINGS,
                    tabBarIcon: ({ focused, color }) => (
                        <FontAwesome name='gear' size={22} color={color} />
                    ),
                }}
            />
        </BottomTab.Navigator>
    )
}

export function HomeNavigation({ navigation }) {
    useProjectsData()

    return (
        <HomeStack.Navigator
            initialRouteName={Routes.VIDEO_LIST}
            screenOptions={{
                headerStyle: { height: 65 },
                headerTitleStyle: {
                    fontFamily: 'roboto-700',
                    color: Color.black,
                },
            }}
        >
            <HomeStack.Screen
                name={Routes.VIDEO_LIST}
                component={BottomTabNavigator}
            />
            <RecordingStack.Screen
                name={Routes.RECORD_WALKAROUND}
                component={RecordWalkaround}
            />
            <RecordingStack.Screen
                name={Routes.RECORD_INSPECTION}
                component={RecordInspection}
            />

            <RecordingStack.Screen
                name={Routes.RECORD_GREETING}
                component={RecordGreeting}
            />
            <HomeStack.Screen name={Routes.CAMERA} component={RecordVideo} />
            <HomeStack.Screen name={Routes.PLAYBACK} component={Playback} />
        </HomeStack.Navigator>
    )
}

export default function Navigation() {
    const {
        data: { user },
        actions: { getCurrentUser },
    } = React.useContext(AppContext)

    React.useEffect(() => {
        ;(async () => {
            try {
                await getCurrentUser()
            } catch (error) {
                console.log(error.message)
            }
        })()
    }, [])

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
