import './Dashboard.css';
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../sidebar/Sidebar';
import { getUserId } from '../utils/userUtils';

// Helper functions moved outside component to avoid dependency issues
const calculateSimpleStreak = (journals, notes, todos, pomodoroSessions) => {
    const allActivities = [
        ...journals.map(j => new Date(j.created_at).toDateString()),
        ...notes.map(n => new Date(n.created_at).toDateString()),
        ...todos.map(t => new Date(t.created_at).toDateString()),
        ...pomodoroSessions.map(p => new Date(p.session_date).toDateString())
    ];

    const uniqueDays = [...new Set(allActivities)].sort().reverse();

    let streak = 0;
    const today = new Date().toDateString();

    for (let i = 0; i < uniqueDays.length; i++) {
        const daysDiff = Math.floor((new Date(today) - new Date(uniqueDays[i])) / (1000 * 60 * 60 * 24));
        if (daysDiff === i) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
};

const calculateLongestStreak = (journals, notes, todos, pomodoroSessions) => {
    const allActivities = [
        ...journals.map(j => new Date(j.created_at).toDateString()),
        ...notes.map(n => new Date(n.created_at).toDateString()),
        ...todos.map(t => new Date(t.created_at).toDateString()),
        ...pomodoroSessions.map(p => new Date(p.session_date).toDateString())
    ];

    const uniqueDays = [...new Set(allActivities)].sort();

    if (uniqueDays.length === 0) return 0;

    let maxStreak = 0;
    let currentStreak = 1;

    for (let i = 1; i < uniqueDays.length; i++) {
        const prevDate = new Date(uniqueDays[i - 1]);
        const currentDate = new Date(uniqueDays[i]);
        const daysDiff = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
            currentStreak++;
        } else {
            maxStreak = Math.max(maxStreak, currentStreak);
            currentStreak = 1;
        }
    }

    maxStreak = Math.max(maxStreak, currentStreak);
    return maxStreak;
};

const calculateActiveDays = (journals, notes, todos, pomodoroSessions) => {
    const allActivities = [
        ...journals.map(j => new Date(j.created_at).toDateString()),
        ...notes.map(n => new Date(n.created_at).toDateString()),
        ...todos.map(t => new Date(t.created_at).toDateString()),
        ...pomodoroSessions.map(p => new Date(p.session_date).toDateString())
    ];

    return new Set(allActivities).size;
};

const calculateMonthlyTrends = (journals, notes, todos, pomodoroSessions) => {
    const trends = [];
    const now = new Date();
    const currentYear = now.getFullYear();

    for (let month = 0; month < 12; month++) {
        const monthStart = new Date(currentYear, month, 1);
        const monthEnd = new Date(currentYear, month + 1, 0);

        const journalsCount = journals.filter(j => {
            const date = new Date(j.created_at);
            return date >= monthStart && date <= monthEnd;
        }).length;

        const notesCount = notes.filter(n => {
            const date = new Date(n.created_at);
            return date >= monthStart && date <= monthEnd;
        }).length;

        const todosCount = todos.filter(t => {
            const date = new Date(t.created_at);
            return t.completed && date >= monthStart && date <= monthEnd;
        }).length;

        const focusCount = pomodoroSessions.filter(p => {
            const date = new Date(p.session_date);
            return date >= monthStart && date <= monthEnd;
        }).reduce((sum, session) => sum + session.focus_sessions_completed, 0);

        trends.push({
            month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
            journals: journalsCount,
            todos: todosCount,
            notes: notesCount,
            focus: focusCount
        });
    }

    return trends;
};

// Performance Goals Calculation
const calculatePerformanceGoals = (journals, notes, todos, pomodoroSessions, customGoals = null) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Current month stats
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);

    const currentMonthJournals = journals.filter(j => {
        const date = new Date(j.created_at);
        return date >= monthStart && date <= monthEnd;
    }).length;

    const currentMonthNotes = notes.filter(n => {
        const date = new Date(n.created_at);
        return date >= monthStart && date <= monthEnd;
    }).length;

    const currentMonthTodos = todos.filter(t => {
        const date = new Date(t.created_at);
        return t.completed && date >= monthStart && date <= monthEnd;
    }).length;

    const currentMonthFocus = pomodoroSessions.filter(p => {
        const date = new Date(p.session_date);
        return date >= monthStart && date <= monthEnd;
    }).reduce((sum, session) => sum + session.focus_sessions_completed, 0);

    // Current streak
    const currentStreak = calculateSimpleStreak(journals, notes, todos, pomodoroSessions);

    // Use custom goals if provided, otherwise use defaults
    const defaultGoals = {
        journals: 20,
        todos: 50,
        notes: 30,
        focus: 100,  // Focus sessions target
        streak: 14
    };

    const goalTargets = customGoals || defaultGoals;

    // Monthly goals
    const goals = [
        {
            id: 'journals',
            name: 'Monthly Journals',
            target: goalTargets.journals,
            current: currentMonthJournals,
            type: 'journals',
            icon: '📔'
        },
        {
            id: 'todos',
            name: 'Monthly Tasks',
            target: goalTargets.todos,
            current: currentMonthTodos,
            type: 'todos',
            icon: '✅'
        },
        {
            id: 'notes',
            name: 'Monthly Notes',
            target: goalTargets.notes,
            current: currentMonthNotes,
            type: 'notes',
            icon: '📝'
        },
        {
            id: 'focus',
            name: 'Monthly Focus Sessions',
            target: goalTargets.focus,
            current: currentMonthFocus,
            type: 'focus',
            icon: '🎯'
        },
        {
            id: 'streak',
            name: 'Activity Streak',
            target: goalTargets.streak,
            current: currentStreak,
            type: 'streak',
            icon: '🔥'
        }
    ];

    // Calculate progress and status for each goal
    return goals.map(goal => {
        const progress = Math.min((goal.current / goal.target) * 100, 100);
        let status = 'on-track';

        if (progress >= 100) {
            status = 'completed';
        } else if (progress < 50) {
            status = 'behind';
        }

        return {
            ...goal,
            progress: Math.round(progress),
            status
        };
    });
};

const calculateActiveDaysForPeriod = (journals, notes, todos, pomodoroSessions, startDate, endDate) => {
    const allActivities = [
        ...journals.filter(j => {
            const date = new Date(j.created_at);
            return date >= startDate && date <= endDate;
        }).map(j => new Date(j.created_at).toDateString()),
        ...notes.filter(n => {
            const date = new Date(n.created_at);
            return date >= startDate && date <= endDate;
        }).map(n => new Date(n.created_at).toDateString()),
        ...todos.filter(t => {
            const date = new Date(t.created_at);
            return date >= startDate && date <= endDate;
        }).map(t => new Date(t.created_at).toDateString()),
        ...pomodoroSessions.filter(p => {
            const date = new Date(p.session_date);
            return date >= startDate && date <= endDate;
        }).map(p => new Date(p.session_date).toDateString())
    ];

    return new Set(allActivities).size;
};

// Performance Metrics Calculation
const calculatePerformanceMetrics = (journals, notes, todos, pomodoroSessions) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // This month
    const thisMonthStart = new Date(currentYear, currentMonth, 1);
    const thisMonthEnd = new Date(currentYear, currentMonth + 1, 0);

    // Last month
    const lastMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const lastMonthEnd = new Date(currentYear, currentMonth, 0);

    // Calculate this month's activities
    const thisMonthTotal = journals.filter(j => {
        const date = new Date(j.created_at);
        return date >= thisMonthStart && date <= thisMonthEnd;
    }).length + notes.filter(n => {
        const date = new Date(n.created_at);
        return date >= thisMonthStart && date <= thisMonthEnd;
    }).length + todos.filter(t => {
        const date = new Date(t.created_at);
        return t.completed && date >= thisMonthStart && date <= thisMonthEnd;
    }).length + pomodoroSessions.filter(p => {
        const date = new Date(p.session_date);
        return date >= thisMonthStart && date <= thisMonthEnd;
    }).reduce((sum, session) => sum + session.focus_sessions_completed, 0);

    // Calculate last month's activities
    const lastMonthTotal = journals.filter(j => {
        const date = new Date(j.created_at);
        return date >= lastMonthStart && date <= lastMonthEnd;
    }).length + notes.filter(n => {
        const date = new Date(n.created_at);
        return date >= lastMonthStart && date <= lastMonthEnd;
    }).length + todos.filter(t => {
        const date = new Date(t.created_at);
        return t.completed && date >= lastMonthStart && date <= lastMonthEnd;
    }).length + pomodoroSessions.filter(p => {
        const date = new Date(p.session_date);
        return date >= lastMonthStart && date <= lastMonthEnd;
    }).reduce((sum, session) => sum + session.focus_sessions_completed, 0);

    // Calculate monthly growth
    const monthlyGrowth = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100) : 0;

    // Calculate completion rate
    const totalTodos = todos.length;
    const completedTodos = todos.filter(t => t.completed).length;
    const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

    // Calculate previous completion rate (for trend)
    const lastMonthTodos = todos.filter(t => {
        const date = new Date(t.created_at);
        return date >= lastMonthStart && date <= lastMonthEnd;
    });
    const lastMonthCompletedTodos = lastMonthTodos.filter(t => t.completed);
    const lastMonthCompletionRate = lastMonthTodos.length > 0 ?
        Math.round((lastMonthCompletedTodos.length / lastMonthTodos.length) * 100) : 0;
    const completionRateChange = completionRate - lastMonthCompletionRate;

    // Calculate weekly average including focus sessions
    const totalFocusSessions = pomodoroSessions.reduce((sum, session) => sum + session.focus_sessions_completed, 0);
    const totalActivities = journals.length + notes.length + completedTodos + totalFocusSessions;
    const activeDays = calculateActiveDays(journals, notes, todos, pomodoroSessions);
    const weeklyAverage = activeDays > 0 ? Math.round((totalActivities / activeDays) * 7) : 0;

    // Calculate previous weekly average (using last month's data)
    const lastMonthActiveDays = calculateActiveDaysForPeriod(journals, notes, todos, pomodoroSessions, lastMonthStart, lastMonthEnd);
    const lastMonthActivities = lastMonthTodos.length + journals.filter(j => {
        const date = new Date(j.created_at);
        return date >= lastMonthStart && date <= lastMonthEnd;
    }).length + notes.filter(n => {
        const date = new Date(n.created_at);
        return date >= lastMonthStart && date <= lastMonthEnd;
    }).length + pomodoroSessions.filter(p => {
        const date = new Date(p.session_date);
        return date >= lastMonthStart && date <= lastMonthEnd;
    }).reduce((sum, session) => sum + session.focus_sessions_completed, 0);

    const lastMonthWeeklyAverage = lastMonthActiveDays > 0 ? Math.round((lastMonthActivities / lastMonthActiveDays) * 7) : 0;
    const weeklyAverageChange = weeklyAverage - lastMonthWeeklyAverage;

    // Total focus time in hours
    const totalFocusTime = Math.round((totalFocusSessions * 25) / 60);
    const lastMonthFocusTime = Math.round((pomodoroSessions.filter(p => {
        const date = new Date(p.session_date);
        return date >= lastMonthStart && date <= lastMonthEnd;
    }).reduce((sum, session) => sum + session.focus_sessions_completed, 0) * 25) / 60);
    const focusTimeChange = totalFocusTime - lastMonthFocusTime;

    return {
        totalActivities: totalActivities,
        monthlyGrowth: monthlyGrowth,
        completionRate: completionRate,
        completionRateChange: completionRateChange,
        weeklyAverage: weeklyAverage,
        weeklyAverageChange: weeklyAverageChange,
        activeDays: activeDays,
        totalFocusTime: totalFocusTime,
        focusTimeChange: focusTimeChange
    };
};

// Calculate dashboard statistics from raw data
const calculateDashboardStats = (journals, notes, todos, pomodoroSessions, customGoals = null) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayString = today.toDateString();

    // Basic totals
    const totalJournals = journals.length;
    const totalNotes = notes.length;
    const completedTodos = todos.filter(todo => todo.completed).length;
    const totalFocusSessions = pomodoroSessions.reduce((sum, session) => sum + session.focus_sessions_completed, 0);

    // Today's activity
    const journalsToday = journals.filter(item =>
        new Date(item.created_at) >= today
    ).length;

    const notesToday = notes.filter(item =>
        new Date(item.created_at) >= today
    ).length;

    const todosToday = todos.filter(item =>
        item.completed && new Date(item.created_at) >= today
    ).length;

    const focusToday = pomodoroSessions.filter(session => {
        const sessionDate = new Date(session.session_date).toDateString();
        return sessionDate === todayString;
    }).reduce((sum, session) => sum + session.focus_sessions_completed, 0);

    // Simple streak calculation (days with any activity)
    const streakDays = calculateSimpleStreak(journals, notes, todos, pomodoroSessions);

    // 12-month trends
    const productivityTrends = calculateMonthlyTrends(journals, notes, todos, pomodoroSessions);

    // Performance goals and metrics
    const performanceGoals = calculatePerformanceGoals(journals, notes, todos, pomodoroSessions, customGoals);
    const performanceMetrics = calculatePerformanceMetrics(journals, notes, todos, pomodoroSessions);

    return {
        totals: {
            journals: totalJournals,
            todos: completedTodos,
            notes: totalNotes,
            focus: totalFocusSessions
        },
        todayStats: {
            journalsWritten: journalsToday,
            todosCompleted: todosToday,
            notesCreated: notesToday,
            focusCompleted: focusToday,
            streakDays: streakDays
        },
        productivityTrends: productivityTrends,
        productivityHistory: {
            currentStreak: streakDays,
            longestStreak: calculateLongestStreak(journals, notes, todos, pomodoroSessions),
            totalActivedays: calculateActiveDays(journals, notes, todos, pomodoroSessions),
            averageScore: 78
        },
        performanceGoals: performanceGoals,
        performanceMetrics: performanceMetrics
    };
};

const Dashboard = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [greeting, setGreeting] = useState('');
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [goalTargets, setGoalTargets] = useState({
        journals: 20,
        todos: 50,
        notes: 30,
        focus: 100,
        streak: 14
    });
    const [tempGoalTargets, setTempGoalTargets] = useState({
        journals: 20,
        todos: 50,
        notes: 30,
        focus: 100,
        streak: 14
    });

    const userId = getUserId();

    // Fetch dashboard data from existing APIs
    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);

            // Fetch all data from existing endpoints including pomodoro
            const [journalsRes, notesRes, todosRes, pomodoroRes] = await Promise.all([
                fetch(`http://localhost:8000/api/journals/${userId}`),
                fetch(`http://localhost:8000/api/notes/${userId}`),
                fetch(`http://localhost:8000/api/todos/${userId}`),
                fetch(`http://localhost:8000/api/pomodoro/history/${userId}?limit=365`) // Get full year of data
            ]);

            if (!journalsRes.ok || !notesRes.ok || !todosRes.ok || !pomodoroRes.ok) {
                throw new Error('Failed to fetch data');
            }

            const journals = await journalsRes.json();
            const notes = await notesRes.json();
            const todos = await todosRes.json();
            const pomodoroSessions = await pomodoroRes.json();

            // Calculate dashboard stats with current goal targets
            const dashboardStats = calculateDashboardStats(journals, notes, todos, pomodoroSessions, goalTargets);
            setDashboardData(dashboardStats);
            setError(null);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [userId, goalTargets]);

    useEffect(() => {
        fetchDashboardData();
    }, [userId, fetchDashboardData]);

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
            month: 'long',
            day: 'numeric'
        });
    };

    const getProgressFillClass = (type) => {
        switch (type) {
            case 'journals': return 'journal-fill';
            case 'todos': return 'todo-fill';
            case 'notes': return 'note-fill';
            case 'focus': return 'focus-fill';
            case 'streak': return 'streak-fill';
            default: return 'journal-fill';
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'on-track': return 'status-on-track';
            case 'behind': return 'status-behind';
            case 'completed': return 'status-completed';
            default: return 'status-on-track';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'on-track': return 'On Track';
            case 'behind': return 'Behind';
            case 'completed': return 'Completed';
            default: return 'On Track';
        }
    };

    const getTrendClass = (value) => {
        if (value > 5) return 'trend-up';
        if (value < -5) return 'trend-down';
        return 'trend-stable';
    };

    const getTrendText = (value) => {
        if (value > 5) return `↗ Growing (+${value.toFixed(1)}%)`;
        if (value < -5) return `↘ Regressing (${value.toFixed(1)}%)`;
        if (value > 0) return `→ Consistent (+${value.toFixed(1)}%)`;
        if (value < 0) return `→ Consistent (${value.toFixed(1)}%)`;
        return '→ Consistent';
    };

    const handleSetNewGoals = () => {
        setTempGoalTargets({ ...goalTargets });
        setShowGoalModal(true);
    };

    const handleSaveGoals = async () => {
        try {
            // You can add API call here to save goals to backend
            // For now, we'll just update local state
            setGoalTargets({ ...tempGoalTargets });
            setShowGoalModal(false);

            // Optionally refresh dashboard data with new goals
            await fetchDashboardData();
        } catch (err) {
            console.error('Error saving goals:', err);
            // Handle error - maybe show a toast notification
        }
    };

    const handleCancelGoals = () => {
        setTempGoalTargets({ ...goalTargets });
        setShowGoalModal(false);
    };

    // Loading state
    if (loading) {
        return (
            <div className="app-container-dashboard">
                <Sidebar />
                <div className="main-content-dashboard">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading dashboard data...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="app-container-dashboard">
                <Sidebar />
                <div className="main-content-dashboard">
                    <div className="error-container">
                        <h2>Error Loading Dashboard</h2>
                        <p>{error}</p>
                        <button onClick={fetchDashboardData} className="retry-button">
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container-dashboard">
            <Sidebar />
            <div className="main-content-dashboard">
                {/* Header */}
                <div className="dashboard-header">
                    <div className="welcome-section">
                        <h1 className="dashboard-title">{greeting}!</h1>
                        <p className="dashboard-subtitle">Track your productivity and stay motivated</p>
                    </div>
                    <div className="time-section">
                        <div className="current-time">{formatTime(currentTime)}</div>
                        <div className="current-date">{formatDate(currentTime)}</div>
                    </div>
                </div>

                {/* Overall Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📔</div>
                        <div className="stat-content">
                            <h3 className="stat-number">{dashboardData.totals.journals}</h3>
                            <p className="stat-label">Total Journals</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-content">
                            <h3 className="stat-number">{dashboardData.totals.todos}</h3>
                            <p className="stat-label">Completed To-Do</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">📝</div>
                        <div className="stat-content">
                            <h3 className="stat-number">{dashboardData.totals.notes}</h3>
                            <p className="stat-label">Total Notes</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">🎯</div>
                        <div className="stat-content">
                            <h3 className="stat-number">{dashboardData.totals.focus}</h3>
                            <p className="stat-label">Focus Sessions</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="dashboard-grid">
                    {/* Today's Activity */}
                    <div className="dashboard-card today-card">
                        <div className="card-header">
                            <h2 className="card-title">Today's Activity</h2>
                            <div className="today-badge">Live Updates</div>
                        </div>
                        <div className="today-stats">
                            <div className="today-item">
                                <div className="today-icon">📔</div>
                                <div className="today-content">
                                    <div className="today-number">{dashboardData.todayStats.journalsWritten}</div>
                                    <div className="today-label">Journals</div>
                                </div>
                            </div>

                            <div className="today-item">
                                <div className="today-icon">✅</div>
                                <div className="today-content">
                                    <div className="today-number">{dashboardData.todayStats.todosCompleted}</div>
                                    <div className="today-label">Tasks Done</div>
                                </div>
                            </div>

                            <div className="today-item">
                                <div className="today-icon">📝</div>
                                <div className="today-content">
                                    <div className="today-number">{dashboardData.todayStats.notesCreated}</div>
                                    <div className="today-label">Notes</div>
                                </div>
                            </div>

                            <div className="today-item">
                                <div className="today-icon">🎯</div>
                                <div className="today-content">
                                    <div className="today-number">{dashboardData.todayStats.focusCompleted}</div>
                                    <div className="today-label">Focus Sessions</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Streak Tracking Only */}
                    <div className="dashboard-card streak-tracking-card">
                        <div className="card-header">
                            <h2 className="card-title">Productivity Tracking</h2>
                            <div className="tracking-badge">Advanced Analytics</div>
                        </div>

                        {/* Streak and Performance Overview */}
                        <div className="tracking-overview">
                            <div className="performance-dashboard">
                                <div className="streak-container">
                                    <div className="streak-circle">
                                        <div className="streak-inner">
                                            <div className="streak-number">{dashboardData.productivityHistory.currentStreak}</div>
                                            <div className="streak-label">Day Streak</div>
                                        </div>
                                        <svg className="streak-progress" viewBox="0 0 120 120">
                                            <circle
                                                cx="60"
                                                cy="60"
                                                r="54"
                                                fill="none"
                                                stroke="rgba(71, 85, 105, 0.3)"
                                                strokeWidth="4"
                                            />
                                            <circle
                                                cx="60"
                                                cy="60"
                                                r="54"
                                                fill="none"
                                                stroke="#40E0D0"
                                                strokeWidth="4"
                                                strokeDasharray={`${2 * Math.PI * 54}`}
                                                strokeDashoffset={`${2 * Math.PI * 54 * (1 - (dashboardData.productivityHistory.currentStreak / 30))}`}
                                                strokeLinecap="round"
                                                transform="rotate(-90 60 60)"
                                                className="streak-circle-progress"
                                            />
                                        </svg>
                                    </div>
                                    <div className="streak-details">
                                        <div className="streak-stat-item">
                                            <span className="stat-icon">🔥</span>
                                            <div className="stat-content">
                                                <span className="stat-number">{dashboardData.productivityHistory.longestStreak}</span>
                                                <span className="stat-text">Best Streak</span>
                                            </div>
                                        </div>
                                        <div className="streak-stat-item">
                                            <span className="stat-icon">📅</span>
                                            <div className="stat-content">
                                                <span className="stat-number">{dashboardData.productivityHistory.totalActivedays}</span>
                                                <span className="stat-text">Active Days</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Overall Productivity Line Chart */}
                    <div className="dashboard-card graph-card">
                        <h2 className="card-title">Productivity Trends (Last 12 Months)</h2>
                        <div className="productivity-graph">
                            <div className="line-chart-container">
                                <svg className="line-chart" viewBox="0 0 800 220" preserveAspectRatio="xMidYMid meet">
                                    {/* Grid lines */}
                                    <defs>
                                        <pattern id="grid" width="60" height="40" patternUnits="userSpaceOnUse">
                                            <path d="M 60 0 L 0 0 0 40" fill="none" stroke="rgba(71, 85, 105, 0.2)" strokeWidth="0.5" />
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#grid)" />

                                    {/* Y-axis title */}
                                    <text x="15" y="90" className="axis-title" textAnchor="middle" transform="rotate(-90, 15, 90)">
                                        Items Completed
                                    </text>

                                    {/* Y-axis labels */}
                                    <g className="y-axis">
                                        <text x="45" y="35" className="axis-label">100</text>
                                        <text x="45" y="75" className="axis-label">75</text>
                                        <text x="45" y="115" className="axis-label">50</text>
                                        <text x="45" y="155" className="axis-label">25</text>
                                        <text x="45" y="195" className="axis-label">0</text>
                                    </g>

                                    {/* Chart background */}
                                    <rect
                                        x="60"
                                        y="30"
                                        width="720"
                                        height="130"
                                        fill="rgba(15, 23, 42, 0.3)"
                                        rx="4"
                                        ry="4"
                                    />

                                    {/* Horizontal grid lines */}
                                    <line x1="60" y1="35" x2="780" y2="35" stroke="rgba(71, 85, 105, 0.3)" strokeWidth="1" strokeDasharray="4,4" />
                                    <line x1="60" y1="75" x2="780" y2="75" stroke="rgba(71, 85, 105, 0.3)" strokeWidth="1" strokeDasharray="4,4" />
                                    <line x1="60" y1="115" x2="780" y2="115" stroke="rgba(71, 85, 105, 0.3)" strokeWidth="1" strokeDasharray="4,4" />
                                    <line x1="60" y1="155" x2="780" y2="155" stroke="rgba(71, 85, 105, 0.3)" strokeWidth="1" strokeDasharray="4,4" />

                                    {/* Trend lines */}
                                    <polyline
                                        className="trend-line journals-line"
                                        fill="none"
                                        stroke="#F59E0B"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        points={dashboardData.productivityTrends.map((item, index) =>
                                            `${70 + index * 60},${160 - (item.journals / 100) * 120}`
                                        ).join(' ')}
                                    />

                                    <polyline
                                        className="trend-line todos-line"
                                        fill="none"
                                        stroke="#059669"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        points={dashboardData.productivityTrends.map((item, index) =>
                                            `${70 + index * 60},${160 - (item.todos / 100) * 120}`
                                        ).join(' ')}
                                    />

                                    <polyline
                                        className="trend-line notes-line"
                                        fill="none"
                                        stroke="#3B82F6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        points={dashboardData.productivityTrends.map((item, index) =>
                                            `${70 + index * 60},${160 - (item.notes / 100) * 120}`
                                        ).join(' ')}
                                    />

                                    <polyline
                                        className="trend-line focus-line"
                                        fill="none"
                                        stroke="#06B6D4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        points={dashboardData.productivityTrends.map((item, index) =>
                                            `${70 + index * 60},${160 - (item.focus / 100) * 120}`
                                        ).join(' ')}
                                    />

                                    {/* Data points */}
                                    {dashboardData.productivityTrends.map((item, index) => (
                                        <g key={`points-${index}`}>
                                            <circle
                                                className="data-point journals-point"
                                                cx={70 + index * 60}
                                                cy={160 - (item.journals / 100) * 120}
                                                fill="#F59E0B"
                                                stroke="#0F172A"
                                            >
                                                <title>{`${item.month}: ${item.journals} Journals`}</title>
                                            </circle>
                                            <circle
                                                className="data-point todos-point"
                                                cx={70 + index * 60}
                                                cy={160 - (item.todos / 100) * 120}
                                                fill="#059669"
                                                stroke="#0F172A"
                                            >
                                                <title>{`${item.month}: ${item.todos} To-Do Lists`}</title>
                                            </circle>
                                            <circle
                                                className="data-point notes-point"
                                                cx={70 + index * 60}
                                                cy={160 - (item.notes / 100) * 120}
                                                fill="#3B82F6"
                                                stroke="#0F172A"
                                            >
                                                <title>{`${item.month}: ${item.notes} Notes`}</title>
                                            </circle>
                                            <circle
                                                className="data-point focus-point"
                                                cx={70 + index * 60}
                                                cy={160 - (item.focus / 100) * 120}
                                                fill="#06B6D4"
                                                stroke="#0F172A"
                                            >
                                                <title>{`${item.month}: ${item.focus} Focus Sessions`}</title>
                                            </circle>
                                        </g>
                                    ))}

                                    {/* X-axis labels */}
                                    {dashboardData.productivityTrends.map((item, index) => (
                                        <text
                                            key={`label-${index}`}
                                            x={70 + index * 60}
                                            y="185"
                                            className="axis-label month-label"
                                            textAnchor="middle"
                                        >
                                            {item.month}
                                        </text>
                                    ))}

                                    {/* X-axis title */}
                                    <text x="400" y="205" className="axis-title" textAnchor="middle">
                                        Months
                                    </text>
                                </svg>
                            </div>
                            <div className="graph-legend">
                                <div className="legend-item">
                                    <div className="legend-dot journals-dot"></div>
                                    <span>Journals</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-dot todos-dot"></div>
                                    <span>To-Do</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-dot notes-dot"></div>
                                    <span>Notes</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-dot focus-dot"></div>
                                    <span>Focus Sessions</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Dashboard with Goals */}
                    <div className="dashboard-card performance-goals-card">
                        <div className="performance-header">
                            <h3 className="performance-title">Performance Dashboard</h3>
                            <span className="performance-subtitle">Track your goals and achievements across all activities</span>
                        </div>

                        <div className="performance-overview">
                            {/* Goals Section */}
                            <div className="performance-section">
                                <div className="section-header">
                                    <h4 className="section-title">Monthly Goals</h4>
                                    <div className="section-badge">Progress Tracking</div>
                                </div>

                                <div className="goals-grid">
                                    {dashboardData.performanceGoals.map((goal) => (
                                        <div key={goal.id} className="goal-item">
                                            <div className="goal-header">
                                                <h5 className="goal-name">
                                                    {goal.icon} {goal.name}
                                                </h5>
                                                <div className={`goal-status ${getStatusClass(goal.status)}`}>
                                                    {getStatusText(goal.status)}
                                                </div>
                                            </div>

                                            <div className="goal-progress">
                                                <div className="progress-header">
                                                    <span className="progress-text">Progress</span>
                                                    <span className="progress-percentage">{goal.progress}%</span>
                                                </div>
                                                <div className="progress-bar">
                                                    <div
                                                        className={`progress-fill ${getProgressFillClass(goal.type)}`}
                                                        style={{ width: `${goal.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div className="goal-stats">
                                                <span className="current-value">{goal.current}</span>
                                                <span className="target-value">/ {goal.target} target</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Performance Metrics */}
                            <div className="performance-section">
                                <div className="section-header">
                                    <h4 className="section-title">Performance Metrics</h4>
                                    <div className="section-badge">Analytics</div>
                                </div>

                                <div className="performance-metrics">
                                    <div className="metric-card">
                                        <span className="metric-icon">📊</span>
                                        <div className="metric-value">{dashboardData.performanceMetrics.totalActivities}</div>
                                        <div className="metric-label">Total Activities</div>
                                        <div className={`metric-trend ${getTrendClass(dashboardData.performanceMetrics.monthlyGrowth)}`}>
                                            {getTrendText(dashboardData.performanceMetrics.monthlyGrowth)}
                                        </div>
                                    </div>

                                    <div className="metric-card">
                                        <span className="metric-icon">✅</span>
                                        <div className="metric-value">{dashboardData.performanceMetrics.completionRate}%</div>
                                        <div className="metric-label">Completion Rate</div>
                                        <div className={`metric-trend ${getTrendClass(dashboardData.performanceMetrics.completionRateChange)}`}>
                                            {getTrendText(dashboardData.performanceMetrics.completionRateChange)}
                                        </div>
                                    </div>

                                    <div className="metric-card">
                                        <span className="metric-icon">📈</span>
                                        <div className="metric-value">{dashboardData.performanceMetrics.weeklyAverage}</div>
                                        <div className="metric-label">Weekly Average</div>
                                        <div className={`metric-trend ${getTrendClass(dashboardData.performanceMetrics.weeklyAverageChange)}`}>
                                            {getTrendText(dashboardData.performanceMetrics.weeklyAverageChange)}
                                        </div>
                                    </div>

                                    <div className="metric-card">
                                        <span className="metric-icon">🎯</span>
                                        <div className="metric-value">{dashboardData.performanceMetrics.totalFocusTime}</div>
                                        <div className="metric-label">Focus Hours</div>
                                        <div className={`metric-trend ${getTrendClass(dashboardData.performanceMetrics.focusTimeChange)}`}>
                                            {getTrendText(dashboardData.performanceMetrics.focusTimeChange)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Goal Setting Actions */}
                        <div className="goal-actions">
                            <button className="action-button primary" onClick={handleSetNewGoals}>
                                🎯 Set New Goals
                            </button>
                        </div>
                    </div>
                </div>

                {/* Goal Setting Modal */}
                {showGoalModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>🎯 Set New Monthly Goals</h3>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>📔 Monthly Journals Target</label>
                                    <input
                                        type="number"
                                        value={tempGoalTargets.journals}
                                        onChange={(e) => setTempGoalTargets(prev => ({
                                            ...prev,
                                            journals: parseInt(e.target.value) || 0
                                        }))}
                                        min="1"
                                        max="100"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>✅ Monthly Tasks Target</label>
                                    <input
                                        type="number"
                                        value={tempGoalTargets.todos}
                                        onChange={(e) => setTempGoalTargets(prev => ({
                                            ...prev,
                                            todos: parseInt(e.target.value) || 0
                                        }))}
                                        min="1"
                                        max="200"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>📝 Monthly Notes Target</label>
                                    <input
                                        type="number"
                                        value={tempGoalTargets.notes}
                                        onChange={(e) => setTempGoalTargets(prev => ({
                                            ...prev,
                                            notes: parseInt(e.target.value) || 0
                                        }))}
                                        min="1"
                                        max="150"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>🎯 Monthly Focus Sessions Target</label>
                                    <input
                                        type="number"
                                        value={tempGoalTargets.focus}
                                        onChange={(e) => setTempGoalTargets(prev => ({
                                            ...prev,
                                            focus: parseInt(e.target.value) || 0
                                        }))}
                                        min="1"
                                        max="300"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>🔥 Activity Streak Target (Days)</label>
                                    <input
                                        type="number"
                                        value={tempGoalTargets.streak}
                                        onChange={(e) => setTempGoalTargets(prev => ({
                                            ...prev,
                                            streak: parseInt(e.target.value) || 0
                                        }))}
                                        min="1"
                                        max="365"
                                    />
                                </div>
                            </div>

                            <div className="button-group">
                                <button
                                    onClick={handleCancelGoals}
                                    className="action-button"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveGoals}
                                    className="action-button primary"
                                >
                                    Save Goals
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;