/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import React, {useState} from 'react';
import {View, Text, TextInput, Button, GestureResponderEvent} from 'react-native';

interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

const AddTodoScreen = ({navigation, route}) => {
  const [newTodoText, setNewTodoText] = useState('');

  const handleAddTodo = (event: GestureResponderEvent) => {
    const newTodo = {
      id: Math.random(),
      title: newTodoText,
      completed: false,
    };
    route?.params?.addTodo(newTodo);
    navigation.navigate('Main');
  };

  return (
    <View>
      <Text>Add a New TODO</Text>
      <TextInput
        placeholder="Enter your TODO"
        value={newTodoText}
        onChangeText={text => setNewTodoText(text)}
      />
      <Button title="Add" onPress={handleAddTodo} />
    </View>
  );
};

export default AddTodoScreen;
