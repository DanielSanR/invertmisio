import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from 'react-native-paper';
import InfrastructureListScreen from '../screens/InfrastructureListScreen';
import InfrastructureMapScreen from '../screens/InfrastructureMapScreen'; // We'll create this next

const Tab = createMaterialTopTabNavigator();

const InfrastructureNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceDisabled,
        tabBarIndicatorStyle: { backgroundColor: theme.colors.primary },
      }}
    >
      <Tab.Screen
        name="InfrastructureList"
        component={InfrastructureListScreen}
        options={{
          title: 'Lista',
        }}
      />
      <Tab.Screen
        name="InfrastructureMap"
        component={InfrastructureMapScreen}
        options={{
          title: 'Mapa',
        }}
      />
    </Tab.Navigator>
  );
};

export default InfrastructureNavigator;
