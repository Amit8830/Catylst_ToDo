import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import MainScreen from './src/Components/MainScreen';
import AddTodoScreen from './src/Components/AddTodoScreen';

const AppNavigator = createStackNavigator(
  {
    Main: MainScreen,
    AddTodo: AddTodoScreen,
  },
  {
    initialRouteName: 'Main',
  },
);

const AppContainer = createAppContainer(AppNavigator);

export default function App() {
  return (
    <NavigationContainer>
      <AppContainer />
    </NavigationContainer>
  );
}
