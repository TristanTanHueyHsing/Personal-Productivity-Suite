import './Dashboard.css';
import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';

const Dashboard = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [greeting, setGreeting] = useState('');

    // Clean data structure for productivity tracking
    const [dashboardData] = useState({
        // Basic totals
        totals: {
            journals: 156,
            todos: 245,
            notes: 189,
            focusSessions: 890
        },
        
        // Today's activity and quick stats
        todayStats: {
            journalsWritten: 1,
            todosCompleted: 3,
            notesCreated: 2,
            focusMinutes: 90,
            streakDays: 5
        },

        // Overall productivity trends (last 6 weeks)
        productivityTrends: [
            { week: 'W1', journals: 3, todos: 8, notes: 5, focus: 12 },
            { week: 'W2', journals: 5, todos: 12, notes: 7, focus: 20 },
            { week: 'W3', journals: 4, todos: 15, notes: 6, focus: 18 },
            { week: 'W4', journals: 6, todos: 10, notes: 9, focus: 22 },
            { week: 'W5', journals: 7, todos: 14, notes: 8, focus: 25 },
            { week: 'W6', journals: 4, todos: 12, notes: 6, focus: 18 }
        ],

        // Productivity tracking over time
        productivityHistory: {
            currentStreak: 12,
            longestStreak: 23,
            totalActivedays: 156,
            averageScore: 78,
            weeklyGoals: {
                journals: { target: 5, completed: 4 },
                todos: { target: 15, completed: 12 },
                notes: { target: 8, completed: 6 },
                focus: { target: 20, completed: 18 }
            },
            monthlyProgress: [
                { month: 'Jan', score: 72, tasks: 45, focus: 180 },
                { month: 'Feb', score: 78, tasks: 52, focus: 210 },
                { month: 'Mar', score: 81, tasks: 58, focus: 240 },
                { month: 'Apr', score: 75, tasks: 48, focus: 195 },
                { month: 'May', score: 83, tasks: 62, focus: 275 },
                { month: 'Jun', score: 79, tasks: 55, focus: 230 }
            ],
            timeDistribution: {
                journals: 25,
                todos: 40,
                notes: 20,
                focus: 15
            }
        }
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

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
                            <p className="stat-label">Completed Todos</p>
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
                        <div className="stat-icon">🍅</div>
                        <div className="stat-content">
                            <h3 className="stat-number">{dashboardData.totals.focusSessions}</h3>
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
                                <div className="today-icon">🔥</div>
                                <div className="today-content">
                                    <div className="today-number">{dashboardData.todayStats.streakDays}</div>
                                    <div className="today-label">Day Streak</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="focus-time">
                            <div className="focus-header">
                                <span className="focus-icon">⏱️</span>
                                <span className="focus-title">Today's Focus Time</span>
                            </div>
                            <div className="focus-display">
                                <span className="focus-minutes">{dashboardData.todayStats.focusMinutes}</span>
                                <span className="focus-unit">minutes</span>
                            </div>
                        </div>
                    </div>

                    {/* Overall Productivity Graph */}
                    <div className="dashboard-card graph-card">
                        <h2 className="card-title">Productivity Trends (Last 6 Weeks)</h2>
                        <div className="productivity-graph">
                            <div className="graph-container">
                                {dashboardData.productivityTrends.map((week, index) => (
                                    <div key={index} className="graph-week">
                                        <div className="graph-bars">
                                            <div 
                                                className="graph-bar journals-bar"
                                                style={{ height: `${Math.max((week.journals / 10) * 100, 5)}%` }}
                                                title={`${week.journals} journals`}
                                            ></div>
                                            <div 
                                                className="graph-bar todos-bar"
                                                style={{ height: `${Math.max((week.todos / 20) * 100, 5)}%` }}
                                                title={`${week.todos} todos`}
                                            ></div>
                                            <div 
                                                className="graph-bar notes-bar"
                                                style={{ height: `${Math.max((week.notes / 15) * 100, 5)}%` }}
                                                title={`${week.notes} notes`}
                                            ></div>
                                            <div 
                                                className="graph-bar focus-bar"
                                                style={{ height: `${Math.max((week.focus / 30) * 100, 5)}%` }}
                                                title={`${week.focus} focus sessions`}
                                            ></div>
                                        </div>
                                        <div className="graph-label">{week.week}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="graph-legend">
                                <div className="legend-item">
                                    <div className="legend-dot journals-dot"></div>
                                    <span>Journals</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-dot todos-dot"></div>
                                    <span>Todos</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-dot notes-dot"></div>
                                    <span>Notes</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-dot focus-dot"></div>
                                    <span>Focus</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Productivity Tracking Over Time */}
                    <div className="dashboard-card productivity-tracking-card">
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

                        {/* Monthly Progress Chart */}
                        <div className="monthly-section-enhanced">
                            <div className="section-header">
                                <h3 className="section-title">6-Month Progress</h3>
                                <span className="section-subtitle">Performance trends over time</span>
                            </div>
                            <div className="chart-container-enhanced">
                                <div className="chart-grid">
                                    {dashboardData.productivityHistory.monthlyProgress.map((month, index) => (
                                        <div key={index} className="month-column-enhanced">
                                            <div className="month-data">
                                                <div className="data-point score-point">
                                                    <span className="data-value">{month.score}%</span>
                                                    <span className="data-label">Score</span>
                                                </div>
                                                <div className="data-bars">
                                                    <div 
                                                        className="data-bar score-bar-enhanced"
                                                        style={{ 
                                                            height: `${(month.score / 100) * 100}px`,
                                                            animationDelay: `${index * 0.1}s`
                                                        }}
                                                        title={`Score: ${month.score}%`}
                                                    ></div>
                                                    <div 
                                                        className="data-bar tasks-bar-enhanced"
                                                        style={{ 
                                                            height: `${(month.tasks / 70) * 100}px`,
                                                            animationDelay: `${index * 0.1 + 0.05}s`
                                                        }}
                                                        title={`Tasks: ${month.tasks}`}
                                                    ></div>
                                                    <div 
                                                        className="data-bar focus-bar-enhanced"
                                                        style={{ 
                                                            height: `${(month.focus / 300) * 100}px`,
                                                            animationDelay: `${index * 0.1 + 0.1}s`
                                                        }}
                                                        title={`Focus: ${month.focus}h`}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="month-label-enhanced">{month.month}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="chart-legend-enhanced">
                                    <div className="legend-group">
                                        <div className="legend-item-enhanced">
                                            <div className="legend-indicator score-indicator"></div>
                                            <span>Productivity Score</span>
                                        </div>
                                        <div className="legend-item-enhanced">
                                            <div className="legend-indicator tasks-indicator"></div>
                                            <span>Tasks Completed</span>
                                        </div>
                                        <div className="legend-item-enhanced">
                                            <div className="legend-indicator focus-indicator"></div>
                                            <span>Focus Hours</span>
                                        </div>
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