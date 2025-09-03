import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';

// Placeholder screens - we'll create these next
import HomeScreen from '../screens/HomeScreen';
import LotsScreen from '../screens/LotsScreen';
import TasksNavigator from './TasksNavigator';
import InfrastructureNavigator from './InfrastructureNavigator';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Lots"
        component={LotsScreen}
        options={{
          tabBarLabel: 'Lotes',
          tabBarIcon: ({ color, size }) => (
            <Icon name="map-marker" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksNavigator}
        options={{
          tabBarLabel: 'Tareas',
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-check" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Infrastructure"
        component={InfrastructureNavigator}
        options={{
          tabBarLabel: 'Infraestructura',
          tabBarIcon: ({ color, size }) => (
            <Icon name="office-building" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Import screens
import LotFormScreen from '../screens/LotFormScreen';
import LotDetailsScreen from '../screens/LotDetailsScreen';
import CropHistoryForm from '../screens/CropHistoryForm';
import TreatmentForm from '../screens/TreatmentForm';
import HealthRecordForm from '../screens/HealthRecordForm';
import TaskForm from '../screens/TaskForm';
import InfrastructureForm from '../screens/InfrastructureForm';
import ImageViewerScreen from '../screens/ImageViewerScreen';

const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // You might want to show a loading screen here
    return null;
  }

  return (
    <Stack.Navigator>
      {!user ? (
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="MainTabs"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LotForm"
            component={LotFormScreen}
            options={({ route }) => ({
              title: route.params?.lot ? 'Editar Lote' : 'Nuevo Lote',
            })}
          />
          <Stack.Screen
            name="LotDetails"
            component={LotDetailsScreen}
            options={({ route }) => ({
              title: 'Detalles del Lote',
            })}
          />
          <Stack.Screen
            name="CropHistoryForm"
            component={CropHistoryForm}
            options={({ route }) => ({
              title: route.params?.cropHistory ? 'Editar Cultivo' : 'Nuevo Cultivo',
            })}
          />
          <Stack.Screen
            name="TreatmentForm"
            component={TreatmentForm}
            options={({ route }) => ({
              title: route.params?.treatment ? 'Editar Tratamiento' : 'Nuevo Tratamiento',
            })}
          />
          <Stack.Screen
            name="HealthRecordForm"
            component={HealthRecordForm}
            options={({ route }) => ({
              title: route.params?.healthRecord ? 'Editar Registro Sanitario' : 'Nuevo Registro Sanitario',
            })}
          />
          <Stack.Screen
            name="TaskForm"
            component={TaskForm}
            options={({ route }) => ({
              title: route.params?.task ? 'Editar Tarea' : 'Nueva Tarea',
            })}
          />
          <Stack.Screen
            name="InfrastructureForm"
            component={InfrastructureForm}
            options={({ route }) => ({
              title: route.params?.infrastructure ? 'Editar Infraestructura' : 'Nueva Infraestructura',
            })}
          />
          <Stack.Screen
            name="ImageViewer"
            component={ImageViewerScreen}
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
