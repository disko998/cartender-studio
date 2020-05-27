import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import * as React from 'react'

import TabBarIcon from '../../components/TabBarIcon'
import HomeScreen from '../../screens/HomeScreen'
import LinksScreen from '../../screens/LinksScreen'
import Login from '../screens/Login'

const BottomTab = createBottomTabNavigator()
const RooStack = createStackNavigator()

export function BottomTabNavigator({ navigation, route }) {
    return (
        <BottomTab.Navigator initialRouteName={'home'}>
            <BottomTab.Screen
                name='Home'
                component={HomeScreen}
                options={{
                    title: 'Get Started',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon focused={focused} name='md-code-working' />
                    ),
                }}
            />
            <BottomTab.Screen
                name='Links'
                component={LinksScreen}
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

export default function Navigator() {
    const user = null

    return (
        <NavigationContainer>
            <RooStack.Navigator headerMode='none'>
                {!user ? (
                    <RooStack.Screen name='login' component={Login} />
                ) : (
                    <RooStack.Screen
                        name='main'
                        component={BottomTabNavigator}
                    />
                )}
            </RooStack.Navigator>
        </NavigationContainer>
    )
}
