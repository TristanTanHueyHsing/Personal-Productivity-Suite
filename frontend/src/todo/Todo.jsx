import React, { useState, useEffect } from 'react';
import './Todo.css';
import Sidebar from '../sidebar/Sidebar';
import { getUserId } from '../utils/userUtils'; // Import helper

const API_BASE_URL = 'http://localhost:8000/api';

const Todo = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPriority, setSelectedPriority] = useState('medium');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);

    // Get user ID from localStorage instead of hardcoded value
    const userId = getUserId();

    // Fetch todos from backend
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/todos/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    const transformedTodos = data.map(todo => ({
                        id: todo.id,
                        text: todo.text,
                        completed: todo.completed,
                        priority: todo.priority,
                        createdAt: todo.created_at
                    }));
                    setTodos(transformedTodos);
                    setError(null);
                } else {
                    setError('Failed to fetch todos');
                }
            } catch (err) {
                setError('Error connecting to server');
                console.error('Error fetching todos:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTodos();
    }, [userId]);

    const addTodo = async () => {
        if (newTodo.trim() === '') return;

        try {
            const response = await fetch(`${API_BASE_URL}/todos/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: newTodo.trim(),
                    priority: selectedPriority
                })
            });

            if (response.ok) {
                const newTodoFromServer = await response.json();
                const transformedTodo = {
                    id: newTodoFromServer.id,
                    text: newTodoFromServer.text,
                    completed: newTodoFromServer.completed,
                    priority: newTodoFromServer.priority,
                    createdAt: newTodoFromServer.created_at
                };
                setTodos([transformedTodo, ...todos]);
                setNewTodo('');
                setSelectedPriority('medium');
                setError(null);
            } else {
                setError('Failed to add todo');
            }
        } catch (err) {
            setError('Error adding todo');
            console.error('Error adding todo:', err);
        }
    };

    const toggleTodo = async (id) => {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        try {
            const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    completed: !todo.completed
                })
            });

            if (response.ok) {
                setTodos(todos.map(todo =>
                    todo.id === id ? { ...todo, completed: !todo.completed } : todo
                ));
                setError(null);
            } else {
                setError('Failed to update todo');
            }
        } catch (err) {
            setError('Error updating todo');
            console.error('Error updating todo:', err);
        }
    };

    const deleteTodo = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setTodos(todos.filter(todo => todo.id !== id));
                setError(null);
                setDeleteConfirmation(null);
            } else {
                setError('Failed to delete todo');
            }
        } catch (err) {
            setError('Error deleting todo');
            console.error('Error deleting todo:', err);
        }
    };

    const handleDeleteRequest = (todo) => {
        setDeleteConfirmation(todo);
    };

    const handleConfirmDelete = () => {
        if (deleteConfirmation) {
            deleteTodo(deleteConfirmation.id);
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirmation(null);
    };

    const updateTodo = async (id, updates) => {
        try {
            const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates)
            });

            if (response.ok) {
                setTodos(todos.map(todo =>
                    todo.id === id ? { ...todo, ...updates } : todo
                ));
                setError(null);
                return true;
            } else {
                setError('Failed to update todo');
                return false;
            }
        } catch (err) {
            setError('Error updating todo');
            console.error('Error updating todo:', err);
            return false;
        }
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

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <div className="app-container-todo">
            <Sidebar />
            <div className="main-content-todo">
                {error && (
                    <div className="error-message">
                        <span>⚠️ {error}</span>
                        <button onClick={() => setError(null)}>×</button>
                    </div>
                )}

                {loading && (
                    <div className="loading-message">
                        <span>Loading todos...</span>
                    </div>
                )}

                <div className="todo-page-header">
                    <h1 className="todo-page-title">To-Do List</h1>
                    <div className="todo-page-stats">
                        <div className="todo-stat-badge">
                            Active: {activeCount}
                        </div>
                        <div className="todo-stat-badge">
                            Completed: {completedCount}
                        </div>
                    </div>
                </div>

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
                            disabled={loading}
                        />

                        <select
                            value={selectedPriority}
                            onChange={(e) => setSelectedPriority(e.target.value)}
                            className="todo-priority-selector"
                            disabled={loading}
                        >
                            <option value="low">🟢 Low</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="high">🔴 High</option>
                        </select>

                        <button
                            onClick={addTodo}
                            className="todo-add-button"
                            disabled={loading}
                        >
                            Add Task
                        </button>
                    </div>
                </div>

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

                <div className="todo-items-container">
                    {filteredTodos.length === 0 && !loading ? (
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
                                onDeleteRequest={handleDeleteRequest}
                                onUpdate={updateTodo}
                            />
                        ))
                    )}
                </div>
            </div>

            {deleteConfirmation && (
                <div className="delete-confirmation-overlay">
                    <div className="delete-confirmation-modal">
                        <div className="delete-confirmation-body">
                            <div className="delete-confirmation-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            <div className="delete-modal-content">
                                <h3>Delete Task</h3>
                                <p>Are you sure you want to delete <strong>{deleteConfirmation.text.length > 30 ? deleteConfirmation.text.substring(0, 30) + '...' : deleteConfirmation.text}</strong></p>
                                <p className="delete-warning">This action cannot be undone. Your task will be permanently removed.</p>

                                <div className="task-preview-modal">
                                    <div className="preview-header">
                                        <span className="preview-priority">
                                            {deleteConfirmation.priority === 'high' ? '🔴' :
                                                deleteConfirmation.priority === 'medium' ? '🟡' : '🟢'}
                                            {deleteConfirmation.priority}
                                        </span>
                                        <span className="preview-date">
                                            {new Date(deleteConfirmation.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="preview-content">
                                        {deleteConfirmation.text.length > 80 ? deleteConfirmation.text.substring(0, 80) + '...' : deleteConfirmation.text}
                                    </div>
                                    <div className="preview-status">
                                        Status: {deleteConfirmation.completed ? 'Completed' : 'Active'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="delete-modal-actions">
                            <button
                                className="modal-cancel-btn"
                                onClick={handleCancelDelete}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-delete-btn"
                                onClick={handleConfirmDelete}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        Delete Task
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const TaskCard = ({ todo, onToggle, onDeleteRequest, onUpdate }) => {
    const [isEditingText, setIsEditingText] = useState(false);
    const [isEditingPriority, setIsEditingPriority] = useState(false);
    const [editText, setEditText] = useState(todo.text);
    const [editPriority, setEditPriority] = useState(todo.priority);
    const [updating, setUpdating] = useState(false);

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

    const handleTextUpdate = async () => {
        if (editText.trim() !== '' && editText.trim() !== todo.text) {
            setUpdating(true);
            const success = await onUpdate(todo.id, { text: editText.trim() });
            if (success) {
                setIsEditingText(false);
            } else {
                setEditText(todo.text);
            }
            setUpdating(false);
        } else {
            setIsEditingText(false);
            setEditText(todo.text);
        }
    };

    const handlePriorityUpdate = async (newPriority) => {
        if (newPriority !== todo.priority) {
            setUpdating(true);
            const success = await onUpdate(todo.id, { priority: newPriority });
            if (success) {
                setEditPriority(newPriority);
                setIsEditingPriority(false);
            } else {
                setEditPriority(todo.priority);
            }
            setUpdating(false);
        } else {
            setIsEditingPriority(false);
        }
    };

    const handleTextKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleTextUpdate();
        }
        if (e.key === 'Escape') {
            setEditText(todo.text);
            setIsEditingText(false);
        }
    };

    const startTextEdit = () => {
        if (!todo.completed) {
            setIsEditingText(true);
            setEditText(todo.text);
        }
    };

    const startPriorityEdit = () => {
        setIsEditingPriority(true);
        setEditPriority(todo.priority);
    };

    const handleDeleteClick = () => {
        onDeleteRequest(todo);
    };

    return (
        <div className={`task-card ${updating ? 'updating' : ''}`}>
            <button
                onClick={() => onToggle(todo.id)}
                className={`task-complete-button ${todo.completed ? 'completed' : ''}`}
                disabled={updating}
            >
                {todo.completed && '✓'}
            </button>

            <div className="task-priority-container">
                {isEditingPriority ? (
                    <select
                        value={editPriority}
                        onChange={(e) => handlePriorityUpdate(e.target.value)}
                        onBlur={() => setIsEditingPriority(false)}
                        autoFocus
                        className="task-priority-edit"
                        disabled={updating}
                    >
                        <option value="low">🟢 Low</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="high">🔴 High</option>
                    </select>
                ) : (
                    <button
                        onClick={startPriorityEdit}
                        className="task-priority-button"
                        title="Click to change priority"
                        disabled={updating || todo.completed}
                    >
                        <span className="task-priority-icon">
                            {getPriorityEmoji(todo.priority)}
                        </span>
                    </button>
                )}
            </div>

            <div className="task-content-area">
                {isEditingText ? (
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={handleTextKeyPress}
                        onBlur={handleTextUpdate}
                        autoFocus
                        className="task-edit-field"
                        disabled={updating}
                    />
                ) : (
                    <div>
                        <p className={`task-title-text ${todo.completed ? 'completed' : ''}`}>
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

            <div className="task-actions">
                {!isEditingText && !isEditingPriority && (
                    <>
                        <button
                            onClick={startTextEdit}
                            className="task-edit-button"
                            title="Edit task"
                            disabled={updating || todo.completed}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            className="task-remove-button"
                            title="Delete task"
                            disabled={updating}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {updating && (
                <div className="task-updating-indicator">
                    <div className="updating-spinner"></div>
                </div>
            )}
        </div>
    );
};

export default Todo;