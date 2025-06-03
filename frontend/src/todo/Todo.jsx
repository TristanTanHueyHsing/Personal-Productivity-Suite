import React, { useState, useEffect } from 'react';
import './Todo.css';
import Sidebar from '../sidebar/Sidebar';

const Todo = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPriority, setSelectedPriority] = useState('medium');

    // Load todos from localStorage on component mount
    useEffect(() => {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            setTodos(JSON.parse(savedTodos));
        }
    }, []);

    // Save todos to localStorage whenever todos change
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = () => {
        if (newTodo.trim() === '') return;
        
        const todo = {
            id: Date.now(),
            text: newTodo.trim(),
            completed: false,
            priority: selectedPriority,
            createdAt: new Date().toISOString(),
        };
        
        setTodos([todo, ...todos]);
        setNewTodo('');
        setSelectedPriority('medium');
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const updateTodo = (id, newText) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, text: newText } : todo
        ));
    };

    const filteredTodos = todos.filter(todo => {
        const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = 
            filter === 'all' ||
            (filter === 'active' && !todo.completed) ||
            (filter === 'completed' && todo.completed);
        
        return matchesSearch && matchesFilter;
    });

    const completedCount = todos.filter(todo => todo.completed).length;
    const activeCount = todos.filter(todo => !todo.completed).length;

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    };

    return (
        <div className="app-container-todo">
            <Sidebar />
            <div className="main-content-todo">
                {/* Header */}
                <div className="todo-page-header">
                    <h1 className="todo-page-title">Todo List</h1>
                    <div className="todo-page-stats">
                        <div className="todo-stat-badge">
                            Active: {activeCount}
                        </div>
                        <div className="todo-stat-badge">
                            Completed: {completedCount}
                        </div>
                    </div>
                </div>

                {/* Add Todo Section */}
                <div className="todo-creation-section">
                    <h3 className="todo-creation-title">Add New Task</h3>
                    
                    <div className="todo-creation-form">
                        <input
                            type="text"
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="What needs to be done?"
                            className="todo-text-input"
                        />
                        
                        <select
                            value={selectedPriority}
                            onChange={(e) => setSelectedPriority(e.target.value)}
                            className="todo-priority-selector"
                        >
                            <option value="low">🟢 Low</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="high">🔴 High</option>
                        </select>
                        
                        <button onClick={addTodo} className="todo-add-button">
                            Add Task
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="todo-filter-section">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search tasks..."
                        className="todo-search-field"
                    />
                    
                    <div className="todo-filter-buttons">
                        {['all', 'active', 'completed'].map((filterType) => (
                            <button
                                key={filterType}
                                onClick={() => setFilter(filterType)}
                                className={`todo-filter-button ${filter === filterType ? 'active' : ''}`}
                            >
                                {filterType}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Todo List */}
                <div className="todo-items-container">
                    {filteredTodos.length === 0 ? (
                        <div className="todo-empty-message">
                            <h3 className="todo-empty-title">
                                {todos.length === 0 ? 'No tasks yet' : 'No matching tasks'}
                            </h3>
                            <p className="todo-empty-description">
                                {todos.length === 0 
                                    ? 'Add your first task to get started!' 
                                    : 'Try adjusting your search or filter.'}
                            </p>
                        </div>
                    ) : (
                        filteredTodos.map((todo) => (
                            <TaskCard
                                key={todo.id}
                                todo={todo}
                                onToggle={toggleTodo}
                                onDelete={deleteTodo}
                                onUpdate={updateTodo}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const TaskCard = ({ todo, onToggle, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);

    const getPriorityEmoji = (priority) => {
        switch (priority) {
            case 'high': return '🔴';
            case 'medium': return '🟡';
            case 'low': return '🟢';
            default: return '⚪';
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'high': return 'task-priority-high';
            case 'medium': return 'task-priority-medium';
            case 'low': return 'task-priority-low';
            default: return '';
        }
    };

    const handleUpdate = () => {
        if (editText.trim() !== '') {
            onUpdate(todo.id, editText.trim());
        }
        setIsEditing(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleUpdate();
        }
        if (e.key === 'Escape') {
            setEditText(todo.text);
            setIsEditing(false);
        }
    };

    return (
        <div className="task-card">
            {/* Checkbox */}
            <button
                onClick={() => onToggle(todo.id)}
                className={`task-complete-button ${todo.completed ? 'completed' : ''}`}
            >
                {todo.completed && '✓'}
            </button>

            {/* Priority Indicator */}
            <span className="task-priority-icon">
                {getPriorityEmoji(todo.priority)}
            </span>

            {/* Task Content */}
            <div className="task-content-area">
                {isEditing ? (
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        onBlur={handleUpdate}
                        autoFocus
                        className="task-edit-field"
                    />
                ) : (
                    <div>
                        <p
                            onClick={() => setIsEditing(true)}
                            className={`task-title-text ${todo.completed ? 'completed' : ''}`}
                        >
                            {todo.text}
                        </p>
                        <div className="task-metadata">
                            <span className="task-created-date">
                                {new Date(todo.createdAt).toLocaleDateString()}
                            </span>
                            <span className={`task-priority-label ${getPriorityClass(todo.priority)}`}>
                                {todo.priority}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Button */}
            <button
                onClick={() => onDelete(todo.id)}
                className="task-remove-button"
            >
                🗑️
            </button>
        </div>
    );
};

export default Todo;