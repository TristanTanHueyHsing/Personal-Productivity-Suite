// import './Calendar.css';
// import React, { useState } from 'react';
// import Sidebar from '../sidebar/Sidebar';

// const Calendar = () => {
//     const [selectedDate, setSelectedDate] = useState(null);
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//     const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

//     // Mock data for todos, journal, and notes
//     const dayData = {
//         todos: {
//             '2024-12-15': ['Complete project proposal', 'Review meeting notes'],
//             '2024-12-20': ['Christmas shopping', 'Family dinner prep'],
//             '2025-06-03': ['Today\'s tasks', 'Review calendar component'],
//             '2025-06-05': ['Team standup meeting', 'Code review session', 'Update documentation'],
//             '2025-06-10': ['Client presentation', 'Prepare quarterly report'],
//             '2025-06-15': ['Doctor appointment at 10 AM', 'Grocery shopping', 'Call mom'],
//             '2025-05-28': ['Memorial Day preparation', 'BBQ planning'],
//             '2025-07-04': ['Independence Day celebration', 'Fireworks viewing']
//         },
//         journal: {
//             '2024-12-15': 'Had a productive day working on the new features...',
//             '2024-12-20': 'Excited about the upcoming holidays...',
//             '2025-06-03': 'Working on an interesting calendar project today.',
//             '2025-06-05': 'Great team collaboration today. The standup meeting was very effective and we resolved several blockers. Looking forward to tomorrow\'s code review.',
//             '2025-06-10': 'Big day today with the client presentation. Feeling confident about the quarterly numbers and the progress we\'ve made.',
//             '2025-06-15': 'Had my routine checkup - everything looks good! Spent quality time with family afterward.',
//             '2025-05-28': 'Memorial Day weekend planning is in full swing. Excited to host friends and family for our annual BBQ.',
//             '2025-07-04': 'What a fantastic Independence Day! The fireworks were spectacular and the whole neighborhood came together.'
//         },
//         notes: {
//             '2024-12-15': ['Meeting with client at 2 PM', 'Call dentist'],
//             '2024-12-20': ['Gift ideas: books, gadgets', 'Recipe for cookies'],
//             '2025-06-03': ['Calendar features to implement', 'CSS styling notes'],
//             '2025-06-05': ['Review pull request #234', 'Update API documentation', 'Schedule 1:1 with Sarah'],
//             '2025-06-10': ['Quarterly metrics: 25% growth', 'New feature requests from client', 'Budget planning for Q3'],
//             '2025-06-15': ['Prescription refill needed', 'Mom\'s birthday gift ideas', 'Weekend farmers market'],
//             '2025-05-28': ['BBQ supplies: charcoal, drinks, sides', 'Weather forecast looks good', 'Invite neighbors'],
//             '2025-07-04': ['Best viewing spot: park hill', 'Bring blankets and snacks', 'Parking tips for downtown']
//         }
//     };

//     const months = [
//         'January', 'February', 'March', 'April', 'May', 'June',
//         'July', 'August', 'September', 'October', 'November', 'December'
//     ];

//     const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//     // Generate years for selection (current year ± 10 years)
//     const generateYears = () => {
//         const currentYear = new Date().getFullYear();
//         const years = [];
//         for (let i = currentYear - 10; i <= currentYear + 10; i++) {
//             years.push(i);
//         }
//         return years;
//     };

//     // Get the first day of the month and number of days
//     const getMonthData = (year, month) => {
//         const firstDay = new Date(year, month, 1);
//         const lastDay = new Date(year, month + 1, 0);
//         const daysInMonth = lastDay.getDate();
//         const startingDayOfWeek = firstDay.getDay();
        
//         return { daysInMonth, startingDayOfWeek };
//     };

//     // Format date as YYYY-MM-DD
//     const formatDate = (year, month, day) => {
//         return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
//     };

//     // Check if a date has any data
//     const hasData = (year, month, day) => {
//         const dateStr = formatDate(year, month, day);
//         return dayData.todos[dateStr] || dayData.journal[dateStr] || dayData.notes[dateStr];
//     };

//     // Handle date selection
//     const handleDateClick = (day) => {
//         const dateStr = formatDate(selectedYear, selectedMonth, day);
//         setSelectedDate(dateStr);
//     };

//     // Handle month change
//     const changeMonth = (direction) => {
//         if (direction === 'prev') {
//             if (selectedMonth === 0) {
//                 setSelectedMonth(11);
//                 setSelectedYear(selectedYear - 1);
//             } else {
//                 setSelectedMonth(selectedMonth - 1);
//             }
//         } else {
//             if (selectedMonth === 11) {
//                 setSelectedMonth(0);
//                 setSelectedYear(selectedYear + 1);
//             } else {
//                 setSelectedMonth(selectedMonth + 1);
//             }
//         }
//     };

//     // Render calendar days
//     const renderCalendarDays = () => {
//         const { daysInMonth, startingDayOfWeek } = getMonthData(selectedYear, selectedMonth);
//         const days = [];

//         // Empty cells for days before the first day of the month
//         for (let i = 0; i < startingDayOfWeek; i++) {
//             days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
//         }

//         // Days of the month
//         for (let day = 1; day <= daysInMonth; day++) {
//             const dateStr = formatDate(selectedYear, selectedMonth, day);
//             const isToday = dateStr === formatDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
//             const isSelected = selectedDate === dateStr;
//             const hasDataForDay = hasData(selectedYear, selectedMonth, day);

//             days.push(
//                 <div
//                     key={day}
//                     className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasDataForDay ? 'has-data' : ''}`}
//                     onClick={() => handleDateClick(day)}
//                 >
//                     <span className="day-number">{day}</span>
//                     {hasDataForDay && <div className="data-indicator"></div>}
//                 </div>
//             );
//         }

//         return days;
//     };

//     // Render day preview
//     const renderDayPreview = () => {
//         if (!selectedDate) {
//             return (
//                 <div className="day-preview-placeholder">
//                     <p>Select a date to view todos, journal entries, and notes</p>
//                 </div>
//             );
//         }

//         const todos = dayData.todos[selectedDate] || [];
//         const journal = dayData.journal[selectedDate] || '';
//         const notes = dayData.notes[selectedDate] || [];

//         return (
//             <div className="day-preview">
//                 <h3>Preview for {selectedDate}</h3>
                
//                 <div className="preview-section">
//                     <h4>📝 Todos ({todos.length})</h4>
//                     {todos.length > 0 ? (
//                         <ul>
//                             {todos.map((todo, index) => (
//                                 <li key={index}>{todo}</li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <p className="no-data">No todos for this day</p>
//                     )}
//                 </div>

//                 <div className="preview-section">
//                     <h4>📖 Journal</h4>
//                     {journal ? (
//                         <p className="journal-preview">{journal}</p>
//                     ) : (
//                         <p className="no-data">No journal entry for this day</p>
//                     )}
//                 </div>

//                 <div className="preview-section">
//                     <h4>📋 Notes ({notes.length})</h4>
//                     {notes.length > 0 ? (
//                         <ul>
//                             {notes.map((note, index) => (
//                                 <li key={index}>{note}</li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <p className="no-data">No notes for this day</p>
//                     )}
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div className="app-container-calendar">
//             <Sidebar />
//             <div className="main-content-calendar">
//                 <div className="calendar-container">
//                     <div className="calendar-header">
//                         <div className="calendar-navigation">
//                             <button className="nav-button" onClick={() => changeMonth('prev')}>
//                                 &#8249;
//                             </button>
//                             <div className="date-selectors">
//                                 <select 
//                                     value={selectedMonth} 
//                                     onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//                                     className="month-selector"
//                                 >
//                                     {months.map((month, index) => (
//                                         <option key={index} value={index}>{month}</option>
//                                     ))}
//                                 </select>
//                                 <select 
//                                     value={selectedYear} 
//                                     onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//                                     className="year-selector"
//                                 >
//                                     {generateYears().map(year => (
//                                         <option key={year} value={year}>{year}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <button className="nav-button" onClick={() => changeMonth('next')}>
//                                 &#8250;
//                             </button>
//                         </div>
//                     </div>

//                     <div className="calendar-content">
//                         <div className="calendar-grid-container">
//                             <div className="calendar-weekdays">
//                                 {daysOfWeek.map(day => (
//                                     <div key={day} className="weekday-header">{day}</div>
//                                 ))}
//                             </div>
//                             <div className="calendar-grid">
//                                 {renderCalendarDays()}
//                             </div>
//                         </div>

//                         <div className="day-preview-container">
//                             {renderDayPreview()}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Calendar;

import './Calendar.css';
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../sidebar/Sidebar';

const Calendar = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    
    // Database data state
    const [dayData, setDayData] = useState({
        todos: {},
        journal: {},
        notes: {}
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // API configuration - matches your backend exactly
    const API_BASE_URL = 'http://localhost:8000/api';
    const CURRENT_USER_ID = 1; // In production, get this from auth context

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Helper function to format date in local timezone (YYYY-MM-DD)
    const formatDateLocal = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // API functions that match your exact backend endpoints
    const fetchTodos = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/todos/${CURRENT_USER_ID}`);
            if (!response.ok) throw new Error('Failed to fetch to-dos');
            const data = await response.json();
            
            // Group to-dos by date (YYYY-MM-DD format) using local timezone
            const todosByDate = {};
            data.forEach(todo => {
                // Extract date from created_at timestamp using local timezone
                const date = formatDateLocal(todo.created_at);
                if (!todosByDate[date]) todosByDate[date] = [];
                todosByDate[date].push({
                    id: todo.id,
                    text: todo.text,
                    completed: todo.completed,
                    priority: todo.priority
                });
            });
            
            return todosByDate;
        } catch (err) {
            console.error('Error fetching to-dos:', err);
            throw err;
        }
    }, []);

    const fetchJournals = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/journals/${CURRENT_USER_ID}`);
            if (!response.ok) throw new Error('Failed to fetch journals');
            const data = await response.json();
            
            // Group journals by date (YYYY-MM-DD format) using local timezone
            const journalsByDate = {};
            data.forEach(journal => {
                // Extract date from created_at timestamp using local timezone
                const date = formatDateLocal(journal.created_at);
                if (!journalsByDate[date]) journalsByDate[date] = [];
                journalsByDate[date].push({
                    id: journal.id,
                    title: journal.title,
                    content: journal.content,
                    mood: journal.mood,
                    tags: journal.tags
                });
            });
            
            return journalsByDate;
        } catch (err) {
            console.error('Error fetching journals:', err);
            throw err;
        }
    }, []);

    const fetchNotes = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/notes/${CURRENT_USER_ID}`);
            if (!response.ok) throw new Error('Failed to fetch notes');
            const data = await response.json();
            
            // Group notes by date (YYYY-MM-DD format) using local timezone
            const notesByDate = {};
            data.forEach(note => {
                // Extract date from last_modified timestamp using local timezone
                const date = formatDateLocal(note.last_modified);
                if (!notesByDate[date]) notesByDate[date] = [];
                notesByDate[date].push({
                    id: note.id,
                    title: note.title,
                    preview: note.preview
                });
            });
            
            return notesByDate;
        } catch (err) {
            console.error('Error fetching notes:', err);
            throw err;
        }
    }, []);

    // Fetch all data when component mounts
    const fetchAllData = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const [todos, journals, notes] = await Promise.all([
                fetchTodos(),
                fetchJournals(),
                fetchNotes()
            ]);
            
            setDayData({
                todos,
                journal: journals,
                notes
            });
        } catch (err) {
            setError('Failed to load calendar data. Please try again.');
            console.error('Error fetching calendar data:', err);
        } finally {
            setLoading(false);
        }
    }, [fetchTodos, fetchJournals, fetchNotes]);

    // Load data when component mounts
    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    // Generate years for selection (current year ± 10 years)
    const generateYears = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear - 10; i <= currentYear + 10; i++) {
            years.push(i);
        }
        return years;
    };

    // Get the first day of the month and number of days
    const getMonthData = (year, month) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        return { daysInMonth, startingDayOfWeek };
    };

    // Format date as YYYY-MM-DD to match database format
    const formatDate = (year, month, day) => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    // Check if a date has any data
    const hasData = (year, month, day) => {
        const dateStr = formatDate(year, month, day);
        return dayData.todos[dateStr] || dayData.journal[dateStr] || dayData.notes[dateStr];
    };

    // Handle date selection
    const handleDateClick = (day) => {
        const dateStr = formatDate(selectedYear, selectedMonth, day);
        setSelectedDate(dateStr);
    };

    // Handle month change
    const changeMonth = (direction) => {
        if (direction === 'prev') {
            if (selectedMonth === 0) {
                setSelectedMonth(11);
                setSelectedYear(selectedYear - 1);
            } else {
                setSelectedMonth(selectedMonth - 1);
            }
        } else {
            if (selectedMonth === 11) {
                setSelectedMonth(0);
                setSelectedYear(selectedYear + 1);
            } else {
                setSelectedMonth(selectedMonth + 1);
            }
        }
    };

    // Get mood emoji for journal entries
    const getMoodEmoji = (mood) => {
        const moodEmojis = {
            'happy': '😊',
            'sad': '😢',
            'excited': '🎉',
            'thoughtful': '🤔',
            'grateful': '🙏',
            'stressed': '😰',
            'calm': '😌',
            'neutral': '😐'
        };
        return moodEmojis[mood] || '😐';
    };

    // Get priority emoji for to-dos
    const getPriorityEmoji = (priority) => {
        const priorityEmojis = {
            'high': '🔴',
            'medium': '🟡',
            'low': '🟢'
        };
        return priorityEmojis[priority] || '⚪';
    };

    // Render calendar days
    const renderCalendarDays = () => {
        const { daysInMonth, startingDayOfWeek } = getMonthData(selectedYear, selectedMonth);
        const days = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = formatDate(selectedYear, selectedMonth, day);
            const isToday = dateStr === formatDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
            const isSelected = selectedDate === dateStr;
            const hasDataForDay = hasData(selectedYear, selectedMonth, day);

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasDataForDay ? 'has-data' : ''}`}
                    onClick={() => handleDateClick(day)}
                >
                    <span className="day-number">{day}</span>
                    {hasDataForDay && <div className="data-indicator"></div>}
                </div>
            );
        }

        return days;
    };

    // Render day preview with real data from database
    const renderDayPreview = () => {
        if (!selectedDate) {
            return (
                <div className="day-preview-placeholder">
                    <p>Select a date to view to-dos, journal entries, and notes</p>
                </div>
            );
        }

        const todos = dayData.todos[selectedDate] || [];
        const journals = dayData.journal[selectedDate] || [];
        const notes = dayData.notes[selectedDate] || [];

        return (
            <div className="day-preview">
                <h3>Preview for {selectedDate}</h3>
                
                <div className="preview-section">
                    <h4>📝 To-Do ({todos.length})</h4>
                    {todos.length > 0 ? (
                        <div className="todos-container">
                            {todos.map((todo, index) => (
                                <div key={todo.id || index} className={`todo-item ${todo.completed ? 'completed-todo' : ''}`}>
                                    <span className="todo-priority">{getPriorityEmoji(todo.priority)}</span>
                                    <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                                        {todo.text}
                                    </span>
                                    {todo.completed && <span className="completed-mark">✓</span>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-data">No to-dos for this day</p>
                    )}
                </div>

                <div className="preview-section">
                    <h4>📖 Journal ({journals.length})</h4>
                    {journals.length > 0 ? (
                        <div className="journals-container">
                            {journals.map((journal, index) => (
                                <div key={journal.id || index} className="journal-preview">
                                    <div className="journal-header">
                                        <span className="journal-mood">{getMoodEmoji(journal.mood)}</span>
                                        <span className="journal-title">{journal.title}</span>
                                    </div>
                                    <p className="journal-content">
                                        {journal.content.length > 200 
                                            ? journal.content.substring(0, 200) + '...' 
                                            : journal.content
                                        }
                                    </p>
                                    {journal.tags && journal.tags.length > 0 && (
                                        <div className="journal-tags">
                                            {journal.tags.map((tag, tagIndex) => (
                                                <span key={tagIndex} className="journal-tag">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-data">No journal entries for this day</p>
                    )}
                </div>

                <div className="preview-section">
                    <h4>📋 Notes ({notes.length})</h4>
                    {notes.length > 0 ? (
                        <div className="notes-container">
                            {notes.map((note, index) => (
                                <div key={note.id || index} className="note-item">
                                    <div className="note-title">{note.title}</div>
                                    {note.preview && (
                                        <div className="note-preview">{note.preview}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-data">No notes for this day</p>
                    )}
                </div>
            </div>
        );
    };

    // Show loading state
    if (loading) {
        return (
            <div className="app-container-calendar">
                <Sidebar />
                <div className="main-content-calendar">
                    <div className="calendar-container">
                        <div className="loading-message">
                            <div className="loading-spinner"></div>
                            <p>Loading calendar data...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container-calendar">
            <Sidebar />
            <div className="main-content-calendar">
                {/* Error banner */}
                {error && (
                    <div className="error-banner">
                        <span>⚠️ {error}</span>
                        <button onClick={() => setError(null)}>×</button>
                    </div>
                )}

                <div className="calendar-container">
                    <div className="calendar-header">
                        <div className="calendar-navigation">
                            <button className="nav-button" onClick={() => changeMonth('prev')}>
                                &#8249;
                            </button>
                            <div className="date-selectors">
                                <select 
                                    value={selectedMonth} 
                                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                    className="month-selector"
                                >
                                    {months.map((month, index) => (
                                        <option key={index} value={index}>{month}</option>
                                    ))}
                                </select>
                                <select 
                                    value={selectedYear} 
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    className="year-selector"
                                >
                                    {generateYears().map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                            <button className="nav-button" onClick={() => changeMonth('next')}>
                                &#8250;
                            </button>
                        </div>
                        
                        {/* Refresh button to reload data */}
                        <button className="refresh-button" onClick={fetchAllData} disabled={loading}>
                            🔄 Refresh Data
                        </button>
                    </div>

                    <div className="calendar-content">
                        <div className="calendar-grid-container">
                            <div className="calendar-weekdays">
                                {daysOfWeek.map(day => (
                                    <div key={day} className="weekday-header">{day}</div>
                                ))}
                            </div>
                            <div className="calendar-grid">
                                {renderCalendarDays()}
                            </div>
                        </div>

                        <div className="day-preview-container">
                            {renderDayPreview()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;