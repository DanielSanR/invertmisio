import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from 'react-native-paper';
import TaskListScreen from '../screens/TaskListScreen';
import TaskCalendarScreen from '../screens/TaskCalendarScreen';

const Tab = createMaterialTopTabNavigator();

const TasksNavigator = () => {
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
        name="TaskList"
        component={TaskListScreen}
        options={{
          title: 'Lista',
        }}
      />
      <Tab.Screen
        name="TaskCalendar"
        component={TaskCalendarScreen}
        options={{
          title: 'Calendario',
        }}
      />
    </Tab.Navigator>
  );
};

export default TasksNavigator;
