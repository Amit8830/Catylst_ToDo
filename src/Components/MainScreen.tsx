/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, Button, TextInput} from 'react-native';
import axios from 'axios';

// Define an interface for the TODO item
interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

const MainScreen = ({navigation}) => {
  // const [todos, setTodos] = useState<TodoItem[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [newTodoText, setNewTodoText] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'recent' | 'id'>('recent');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'done'>(
    'all',
  );

  const fetchTodos = async (page: any) => {
    try {
      setIsLoading(true);

      // Fetch data from the API for the specified page
      const response = await axios.get<TodoItem[]>(
        `https://jsonplaceholder.typicode.com/todos?_page=${page}&_limit=10`,
      );

      // Update the state with the new data
      setTodos([...todos, ...response.data]);

      // Update the total number of pages from the API response headers
      const totalPagesHeader = response.headers['x-total-pages'];
      setTotalPages(parseInt(totalPagesHeader, 10));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos(currentPage);
  }, []);

  useEffect(() => {
    axios
      .get<TodoItem[]>('https://jsonplaceholder.typicode.com/todos')
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  // Sort by 'recent' (created_at) or 'id'
  const sortedTodos = [...todos].sort((a, b) => {
    if (sortOrder === 'recent') {
      // return b.created_at.getTime() - a.created_at.getTime();
    } else {
      return a.id - b.id;
    }
  });

  const filteredTodos = todos.filter(todo => {
    if (filterType === 'active') {
      return !todo.completed;
    } else if (filterType === 'done') {
      return todo.completed;
    }
    return true; // 'all' - no filter
  });

  const handleTodoDelete = (id: number) => {
    // Implement delete functionality
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
  };

  const handleTodoComplete = (id: number) => {
    // Implement mark as complete functionality
    const updatedTodos = todos.map(todo =>
      todo.id === id ? {...todo, completed: true} : todo,
    );
    setTodos(updatedTodos);
  };

  const handleAddTodos = (newTodo: TodoItem) => {
    newTodo.created_at = new Date(); // Set the created_at date
    setTodos([...todos, newTodo]);
  };

  const handleEndReached = () => {
    if (currentPage < totalPages && !isLoading) {
      const nextPage = currentPage + 1;
      fetchTodos(nextPage);
      setCurrentPage(nextPage);
    }
  };

  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;

  return (
    <View>
      {/* <Button title="Add Todo" onPress={() => navigation.navigate('AddTodo')} /> */}
      {/* <Button
        title="Add Todo"
        onPress={() => navigation.navigate('AddTodo', {addTodo: handleAddTodo})}
      /> */}
      <Button
        title="Add Todo"
        onPress={() =>
          navigation.navigate('AddTodo', {
            addTodo: handleAddTodos, // Pass the correct function
            updateTotalTodos: totalTodos, // Pass the totalTodos count
          })
        }
      />

      <Text>Total Todos: {totalTodos}</Text>
      <Text>Completed Todos: {completedTodos}</Text>

      {/* <FlatList
        data={todos}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View>
            <Text>{item.title}</Text>
            <Button
              title="Complete"
              onPress={() => handleTodoComplete(item.id)}
            />
            <Button title="Delete" onPress={() => handleTodoDelete(item.id)} />
          </View>
        )}
      /> */}

      <FlatList
        data={
          filterType === 'all'
            ? sortOrder === 'recent'
              ? sortedTodos
              : todos
            : filterType === 'active'
            ? todos.filter(todo => !todo.completed)
            : todos.filter(todo => todo.completed)
        }
        keyExtractor={item => item.id.toString()}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        renderItem={({item}) => (
          <View>
            <Text>{item.title}</Text>
            <Button
              title="Complete"
              onPress={() => handleTodoComplete(item.id)}
            />
            <Button title="Delete" onPress={() => handleTodoDelete(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

export default MainScreen;
