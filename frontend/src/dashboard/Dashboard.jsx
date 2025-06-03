import './Dashboard.css';
import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';

const Dashboard = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [greeting, setGreeting] = useState('');

    // Sample data - replace with your actual data sources
    const [dashboardData] = useState({
        journal: {
            totalEntries: 28,
            todayEntry: false,
            currentStreak: 5,
            lastEntry: '2 days ago',
            recentMood: 'productive'
        },
        todos: {
            total: 24,
            completed: 18,
            pending: 6,
            todayAdded: 3,
            todayCompleted: 5,
            highPriority: 2
        },
        notes: {
            total: 47,
            recentNotes: 8,
            categories: 5,
            lastUpdated: '3 hours ago',
            favorited: 12
        },
        pomodoro: {
            sessionsToday: 4,
            totalFocusTime: 180, // minutes
            avgSessionLength: 25,
            completionRate: 85,
            weeklyGoal: 25,
            weeklyCompleted: 18
        },
        recentActivity: [
            { id: 1, type: 'pomodoro', action: 'completed session', item: 'Focus Session #4', time: '1 hour ago', icon: '🍅' },
            { id: 2, type: 'todo', action: 'completed', item: 'Review project proposal', time: '2 hours ago', icon: '✅' },
            { id: 3, type: 'notes', action: 'updated', item: 'Meeting Notes - Q1 Planning', time: '3 hours ago', icon: '📝' },
            { id: 4, type: 'journal', action: 'created entry', item: 'Daily Reflection', time: '1 day ago', icon: '📔' },
            { id: 5, type: 'todo', action: 'added', item: 'Schedule team meeting', time: '1 day ago', icon: '➕' }
        ]
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const hour = currentTime.getHours();
        if (hour < 12) {
            setGreeting('Good Morning');
        } else if (hour < 18) {
            setGreeting('Good Afternoon');
        } else {
            setGreeting('Good Evening');
        }
    }, [currentTime]);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleQuickAction = (action) => {
        console.log(`Quick action: ${action}`);
        // Here you would typically navigate to the respective page
    };

    return (
        <div className="app-container-dashboard">
            <Sidebar />
            <div className="main-content-dashboard">
                {/* Welcome Header */}
                <div className="dashboard-header">
                    <div className="welcome-section">
                        <h1 className="dashboard-title">{greeting}!</h1>
                        <p className="dashboard-subtitle">Ready to make today productive? Here's your workspace overview</p>
                    </div>
                    <div className="time-section">
                        <div className="current-time">{formatTime(currentTime)}</div>
                        <div className="current-date">{formatDate(currentTime)}</div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="stats-grid">
                    <div className="stat-card journal-stat">
                        <div className="stat-icon">📔</div>
                        <div className="stat-content">
                            <h3 className="stat-number">{dashboardData.journal.totalEntries}</h3>
                            <p className="stat-label">Journal Entries</p>
                            <span className="stat-change">{dashboardData.journal.currentStreak} day streak</span>
                        </div>
                    </div>

                    <div className="stat-card todo-stat">
                        <div className="stat-icon">✅</div>
                        <div className="stat-content">
                            <h3 className="stat-number">{dashboardData.todos.todayCompleted}</h3>
                            <p className="stat-label">Tasks Today</p>
                            <span className="stat-change">{dashboardData.todos.pending} pending</span>
                        </div>
                    </div>

                    <div className="stat-card notes-stat">
                        <div className="stat-icon">📝</div>
                        <div className="stat-content">
                            <h3 className="stat-number">{dashboardData.notes.total}</h3>
                            <p className="stat-label">Total Notes</p>
                            <span className="stat-change">{dashboardData.notes.favorited} favorited</span>
                        </div>
                    </div>

                    <div className="stat-card pomodoro-stat">
                        <div className="stat-icon">🍅</div>
                        <div className="stat-content">
                            <h3 className="stat-number">{dashboardData.pomodoro.sessionsToday}</h3>
                            <p className="stat-label">Pomodoro Sessions</p>
                            <span className="stat-change">{dashboardData.pomodoro.totalFocusTime}min focused</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="dashboard-grid">
                    {/* Quick Actions */}
                    <div className="dashboard-card quick-actions-card">
                        <h2 className="card-title">Quick Actions</h2>
                        <div className="quick-actions-grid">
                            <button
                                className="quick-action-btn journal-action"
                                onClick={() => handleQuickAction('journal')}
                            >
                                <span className="action-icon">📔</span>
                                <span className="action-title">New Journal Entry</span>
                                {!dashboardData.journal.todayEntry && <span className="action-badge">Today</span>}
                            </button>
                            <button
                                className="quick-action-btn todo-action"
                                onClick={() => handleQuickAction('todo')}
                            >
                                <span className="action-icon">➕</span>
                                <span className="action-title">Add Todo</span>
                                {dashboardData.todos.highPriority > 0 && (
                                    <span className="action-badge urgent">{dashboardData.todos.highPriority} high priority</span>
                                )}
                            </button>
                            <button
                                className="quick-action-btn notes-action"
                                onClick={() => handleQuickAction('notes')}
                            >
                                <span className="action-icon">📝</span>
                                <span className="action-title">Create Note</span>
                            </button>
                            <button
                                className="quick-action-btn pomodoro-action"
                                onClick={() => handleQuickAction('pomodoro')}
                            >
                                <span className="action-icon">🍅</span>
                                <span className="action-title">Start Pomodoro</span>
                            </button>
                        </div>
                    </div>



                    {/* Journal Overview */}
                    <div className="dashboard-card journal-card">
                        <h2 className="card-title">📔 Journal Insights</h2>
                        <div className="journal-overview">
                            <div className="journal-header">
                                <div className="journal-streak-display">
                                    <div className="streak-circle">
                                        <span className="streak-number">{dashboardData.journal.currentStreak}</span>
                                        <span className="streak-unit">days</span>
                                    </div>
                                    <div className="streak-info">
                                        <h3 className="streak-title">Writing Streak</h3>
                                        <p className="streak-description">Keep the momentum going!</p>
                                    </div>
                                </div>
                                
                                {!dashboardData.journal.todayEntry && (
                                    <div className="journal-today-reminder">
                                        <div className="reminder-icon">✍️</div>
                                        <div className="reminder-content">
                                            <span className="reminder-title">Today's Entry</span>
                                            <span className="reminder-subtitle">Haven't written yet</span>
                                        </div>
                                        <button className="journal-write-btn" onClick={() => handleQuickAction('journal')}>
                                            Write Now
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="journal-stats-grid">
                                <div className="journal-stat-item">
                                    <div className="stat-icon-small">📚</div>
                                    <div className="stat-details">
                                        <span className="stat-number-small">{dashboardData.journal.totalEntries}</span>
                                        <span className="stat-label-small">Total Entries</span>
                                    </div>
                                </div>
                                
                                <div className="journal-stat-item">
                                    <div className="stat-icon-small">📅</div>
                                    <div className="stat-details">
                                        <span className="stat-number-small">{dashboardData.journal.lastEntry}</span>
                                        <span className="stat-label-small">Last Entry</span>
                                    </div>
                                </div>
                                
                                <div className="journal-stat-item">
                                    <div className="stat-icon-small">😊</div>
                                    <div className="stat-details">
                                        <span className="stat-number-small mood-indicator">{dashboardData.journal.recentMood}</span>
                                        <span className="stat-label-small">Recent Mood</span>
                                    </div>
                                </div>
                                
                                <div className="journal-stat-item">
                                    <div className="stat-icon-small">📈</div>
                                    <div className="stat-details">
                                        <span className="stat-number-small">
                                            {Math.round((dashboardData.journal.currentStreak / 30) * 100)}%
                                        </span>
                                        <span className="stat-label-small">Monthly Goal</span>
                                    </div>
                                </div>
                            </div>

                            <div className="journal-progress">
                                <div className="progress-header">
                                    <span className="progress-title">Monthly Writing Progress</span>
                                    <span className="progress-count">{dashboardData.journal.currentStreak}/30 days</span>
                                </div>
                                <div className="journal-progress-bar">
                                    <div 
                                        className="journal-progress-fill"
                                        style={{ width: `${Math.min((dashboardData.journal.currentStreak / 30) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <div className="progress-milestones">
                                    <span className="milestone">Week 1</span>
                                    <span className="milestone">Week 2</span>
                                    <span className="milestone">Week 3</span>
                                    <span className="milestone">Week 4</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="dashboard-card activity-card">
                        <h2 className="card-title">Recent Activity</h2>
                        <div className="activity-list">
                            {dashboardData.recentActivity.map(activity => (
                                <div key={activity.id} className={`activity-item ${activity.type}-activity`}>
                                    <div className="activity-icon">
                                        {activity.icon}
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-description">
                                            <span className="activity-action">{activity.action}</span> 
                                            <span className="activity-item-name">"{activity.item}"</span>
                                        </div>
                                        <div className="activity-time">{activity.time}</div>
                                    </div>
                                    <div className="activity-type-badge">{activity.type}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes & Todo Summary */}
                    <div className="dashboard-card summary-card">
                        <h2 className="card-title">Notes & Tasks Summary</h2>
                        <div className="summary-grid">
                            <div className="summary-section notes-summary">
                                <h3 className="summary-title">📝 Notes</h3>
                                <div className="summary-stats">
                                    <div className="summary-stat">
                                        <span className="summary-number">{dashboardData.notes.total}</span>
                                        <span className="summary-label">Total Notes</span>
                                    </div>
                                    <div className="summary-stat">
                                        <span className="summary-number">{dashboardData.notes.categories}</span>
                                        <span className="summary-label">Categories</span>
                                    </div>
                                    <div className="summary-meta">
                                        Last updated: {dashboardData.notes.lastUpdated}
                                    </div>
                                </div>
                            </div>
                            <div className="summary-section todos-summary">
                                <h3 className="summary-title">✅ Tasks</h3>
                                <div className="summary-stats">
                                    <div className="summary-stat">
                                        <span className="summary-number">{dashboardData.todos.completed}</span>
                                        <span className="summary-label">Completed</span>
                                    </div>
                                    <div className="summary-stat">
                                        <span className="summary-number">{dashboardData.todos.pending}</span>
                                        <span className="summary-label">Pending</span>
                                    </div>
                                    <div className="completion-rate">
                                        <span className="completion-label">Completion Rate</span>
                                        <div className="completion-bar">
                                            <div 
                                                className="completion-fill"
                                                style={{ width: `${(dashboardData.todos.completed / dashboardData.todos.total) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="completion-percentage">
                                            {Math.round((dashboardData.todos.completed / dashboardData.todos.total) * 100)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;