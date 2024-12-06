import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { FaCalendar, FaFlag, FaTags, FaPlus, FaTimes, FaCheck, FaClock, FaStar, FaRegStar } from 'react-icons/fa';
import "react-datepicker/dist/react-datepicker.css";
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('general');
  const [notes, setNotes] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [sortBy, setSortBy] = useState('date'); // 'date', 'priority', 'alphabetical'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    try {
      const response = await axios.post('http://localhost:5000/api/todos', {
        text: newTodo,
        dueDate: selectedDate,
        priority,
        category,
        notes
      });
      setTodos([response.data, ...todos]);
      resetForm();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const resetForm = () => {
    setNewTodo('');
    setSelectedDate(null);
    setPriority('medium');
    setCategory('general');
    setNotes('');
    setShowAddForm(false);
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t._id === id);
      const response = await axios.put(`http://localhost:5000/api/todos/${id}`, {
        completed: !todo.completed
      });
      setTodos(todos.map(todo => 
        todo._id === id ? response.data : todo
      ));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const sortTodos = (todosToSort) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return [...todosToSort].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      case 'alphabetical':
        return [...todosToSort].sort((a, b) => a.text.localeCompare(b.text));
      default: // 'date'
        return [...todosToSort].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  const filterAndSortTodos = () => {
    let filtered = todos;
    
    // Apply status filter
    if (filter === 'active') filtered = filtered.filter(todo => !todo.completed);
    if (filter === 'completed') filtered = filtered.filter(todo => todo.completed);
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(todo => 
        todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    return sortTodos(filtered);
  };

  const getTimeRemaining = (dueDate) => {
    if (!dueDate) return '';
    const now = new Date();
    const due = new Date(dueDate);
    const days = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `Due in ${days} days`;
  };

  return (
    <div className="App">
      <div className="container">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          ✨ Todo List
        </motion.h1>

        <motion.div className="search-sort-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="text"
            placeholder="Search todos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="alphabetical">Sort Alphabetically</option>
          </select>
        </motion.div>

        <motion.div
          className="filters"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </motion.div>

        <AnimatePresence>
          {showAddForm && (
            <motion.form
              className="todo-form expanded"
              onSubmit={addTodo}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="What needs to be done?"
                className="todo-input"
                autoFocus
              />
              <div className="form-row">
                <div className="form-group">
                  <FaCalendar />
                  <DatePicker
                    selected={selectedDate}
                    onChange={date => setSelectedDate(date)}
                    placeholderText="Due date"
                    className="date-picker"
                    minDate={new Date()}
                  />
                </div>
                <div className="form-group">
                  <FaFlag />
                  <select 
                    value={priority} 
                    onChange={(e) => setPriority(e.target.value)}
                    className="priority-select"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                <div className="form-group">
                  <FaTags />
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category"
                    className="category-input"
                  />
                </div>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes..."
                className="notes-input"
              />
              <div className="form-actions">
                <button type="button" onClick={resetForm} className="cancel-button">
                  <FaTimes /> Cancel
                </button>
                <button type="submit" className="add-button">
                  <FaCheck /> Add Todo
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {!showAddForm && (
          <motion.button
            className="add-todo-button"
            onClick={() => setShowAddForm(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus /> Add New Todo
          </motion.button>
        )}

        <motion.div className="todo-list" layout>
          <AnimatePresence>
            {filterAndSortTodos().map(todo => (
              <motion.div
                key={todo._id}
                className={`todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority}`}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -300 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="todo-content">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo._id)}
                    />
                    <motion.span
                      className="checkmark"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    ></motion.span>
                  </label>
                  <div className="todo-details">
                    <span className="todo-text">{todo.text}</span>
                    <div className="todo-meta">
                      {todo.dueDate && (
                        <span className="todo-due-date">
                          <FaClock /> {getTimeRemaining(todo.dueDate)}
                        </span>
                      )}
                      {todo.category !== 'general' && (
                        <span className="todo-category">
                          <FaTags /> {todo.category}
                        </span>
                      )}
                      <span className="todo-priority">
                        {[...Array(3)].map((_, index) => (
                          <span key={index}>
                            {index < { high: 3, medium: 2, low: 1 }[todo.priority] ? (
                              <FaStar className="star-filled" />
                            ) : (
                              <FaRegStar className="star-empty" />
                            )}
                          </span>
                        ))}
                      </span>
                    </div>
                  </div>
                </div>
                <motion.button
                  onClick={() => deleteTodo(todo._id)}
                  className="delete-button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {todos.length > 0 && (
          <motion.div
            className="todo-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span>{todos.filter(todo => !todo.completed).length} items left</span>
            <span>{todos.filter(todo => todo.completed).length} completed</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;
