import * as React from 'react'
import { View, Text, Button } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'

import TabBarIcon from '../../components/TabBarIcon'
import Login from '../screens/Login'
import Routes from '../constants/Routes'

const BottomTab = createBottomTabNavigator()
const HomeStack = createStackNavigator()
const RooStack = createStackNavigator()

function inDevelopmentScreen({ route, navigation }) {
    return (
        <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
            <Text style={{ marginBottom: 15, color: '#000', fontSize: 20 }}>
                {`${route.name} in development`}
            </Text>
            <Button onPress={() => navigation.goBack()} title='Go back' />
        </View>
    )
}

export function BottomTabNavigator({ navigation, route }) {
    return (
        <BottomTab.Navigator initialRouteName={'home'}>
            <BottomTab.Screen
                name='Home'
                component={inDevelopmentScreen}
                options={{
                    title: 'Get Started',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon focused={focused} name='md-code-working' />
                    ),
                }}
            />
            <BottomTab.Screen
                name='Links'
                component={inDevelopmentScreen}
                options={{
                    title: 'Resources',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon focused={focused} name='md-book' />
                    ),
                }}
            />
        </BottomTab.Navigator>
    )
}

export function HomeNavigation() {
    return (
        <HomeStack.Navigator initialRouteName={Routes.VIDEO_LIST}>
            <HomeStack.Screen
                name={Routes.VIDEO_LIST}
                component={BottomTabNavigator}
            />
        </HomeStack.Navigator>
    )
}

export default function Router() {
    const user = {}

    return (
        <NavigationContainer>
            <RooStack.Navigator headerMode='none'>
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
