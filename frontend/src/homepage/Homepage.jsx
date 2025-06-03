import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../sidebar/Sidebar';
import './Homepage.css';

const Homepage = () => {
    const [focus, setFocus] = useState("");
    const [mood, setMood] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [greeting, setGreeting] = useState('');
    const focusInputRef = useRef(null);
    const [animateSnapshots, setAnimateSnapshots] = useState(false);

    // Sample data - replace with your actual data sources
    const [homepageData] = useState({
        user: {
            name: "Alex",
            todayDate: "Thursday, April 17th"
        },
        todos: {
            completed: 2,
            total: 5,
            nextTask: "Finish lab report",
            overdueCount: 1
        },
        journal: {
            hasEntryToday: false,
            prompt: "What am I avoiding and why?",
            lastEntry: "April 15 - Mental Reset"
        },
        pomodoro: {
            lastSession: "1 hour ago",
            completedSessions: 3,
            breakTime: "16 min idle"
        },
        recentActivity: [
            { id: 1, action: "Edited Note", item: "Final Exam Topics.md", icon: "✏️", type: "notes", time: "2 hours ago" },
            { id: 2, action: "Completed Task", item: "Revise slides", icon: "✅", type: "todo", time: "3 hours ago" },
            { id: 3, action: "Started Timer", item: "25-min focus session", icon: "🍅", type: "pomodoro", time: "4 hours ago" },
            { id: 4, action: "Journal Entry", item: "Morning reflection", icon: "📔", type: "journal", time: "1 day ago" },
            { id: 5, action: "Created Note", item: "Project ideas brainstorm", icon: "📝", type: "notes", time: "1 day ago" }
        ],
        quote: "Start where you are. Use what you have. Do what you can."
    });

    useEffect(() => {
        const timeout = setTimeout(() => {
            setAnimateSnapshots(true);
        }, 200);
        return () => clearTimeout(timeout);
    }, []);

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

    useEffect(() => {
        const textarea = document.querySelector('.focus-input');
        if (textarea) {
            const handleInput = () => {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            };
            textarea.addEventListener('input', handleInput);
            return () => textarea.removeEventListener('input', handleInput);
        }
    }, []);

    const handleMoodChange = (newMood) => {
        setMood(newMood);
    };

    const formatTime = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getMoodIcon = (moodType) => {
        const moods = {
            'Happy': '😊',
            'Neutral': '😐',
            'Sad': '😔',
            'Stressed': '😵‍💫'
        };
        return moods[moodType] || '😊';
    };

    return (
        <div className="app-container-homepage">
            <Sidebar />
            <main className="main-content-homepage">
                {/* Greeting Section */}
                <section className={`homepage-card greeting-card ${animateSnapshots ? 'snapshot-animated' : ''}`}>
                    <div className="greeting-content">
                        <h1 className="greeting-title">🌤️ {greeting}, {homepageData.user.name}!</h1>
                        <p className="greeting-date">{formatTime(currentTime)}</p>
                        <blockquote className="daily-quote">"{homepageData.quote}"</blockquote>
                    </div>
                </section>

                {/* Focus Section */}
                <div className="section-wrapper">
                    <p className="section-header">Today's Focus</p>
                    <section className={`homepage-card focus-card ${animateSnapshots ? 'snapshot-animated' : ''}`}>
                        <h2 className="card-title">🎯 Main Focus Today</h2>
                        <textarea
                            ref={focusInputRef}
                            value={focus}
                            onChange={(e) => {
                                setFocus(e.target.value);
                                if (focusInputRef.current) {
                                    focusInputRef.current.style.height = "auto";
                                    focusInputRef.current.style.height = focusInputRef.current.scrollHeight + "px";
                                }
                            }}
                            placeholder="Write it here to stay mindful..."
                            rows={1}
                            className="focus-input"
                        />
                    </section>
                </div>

                {/* Snapshot Section */}
                <div className="section-wrapper">
                    <p className="section-header">Snapshot</p>
                    <section className={`homepage-card snapshot-card ${animateSnapshots ? 'snapshot-animated' : ''}`}>
                        <h2 className="card-title">🧾 Today's Snapshot</h2>
                        
                        <div className="snapshot-grid">
                            <div className="snapshot-block todos-block">
                                <h3 className="snapshot-title">✅ To-Do</h3>
                                <ul className="snapshot-list">
                                    <li className="snapshot-item todo-item">
                                        Completed {homepageData.todos.completed} out of {homepageData.todos.total} tasks
                                    </li>
                                    <li className="snapshot-item todo-item">
                                        Next Task: "{homepageData.todos.nextTask}"
                                    </li>
                                    <li className="snapshot-item todo-item overdue">
                                        ⚠️ {homepageData.todos.overdueCount} overdue task from yesterday
                                    </li>
                                </ul>
                            </div>

                            <div className="snapshot-block journal-block">
                                <h3 className="snapshot-title">📓 Journal</h3>
                                <ul className="snapshot-list">
                                    <li className="snapshot-item journal-item">
                                        {homepageData.journal.hasEntryToday ? "Entry completed for today" : "No entry for today"}
                                    </li>
                                    <li className="snapshot-item journal-item">
                                        Prompt: "{homepageData.journal.prompt}"
                                    </li>
                                    <li className="snapshot-item journal-item">
                                        Last Entry: "{homepageData.journal.lastEntry}"
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Pomodoro Section */}
                <div className="section-wrapper">
                    <p className="section-header">Timer</p>
                    <section className={`homepage-card pomodoro-card ${animateSnapshots ? 'snapshot-animated' : ''}`}>
                        <h2 className="card-title">⏱️ Pomodoro Timer</h2>
                        <ul className="pomodoro-list">
                            <li className="pomodoro-item">
                                Last session: {homepageData.pomodoro.lastSession}
                            </li>
                            <li className="pomodoro-item">
                                Completed {homepageData.pomodoro.completedSessions} focus sessions
                            </li>
                            <li className="pomodoro-item break-mode">
                                ⏸ Break mode: {homepageData.pomodoro.breakTime}
                            </li>
                        </ul>
                    </section>
                </div>

                {/* Recent Activity */}
                <div className="section-wrapper">
                    <p className="section-header">Activities</p>
                    <section className={`homepage-card activity-card ${animateSnapshots ? 'snapshot-animated' : ''}`}>
                        <h2 className="card-title">🗂️ Recent Activity</h2>
                        <div className="activity-feed">
                            {homepageData.recentActivity.map((activity, index) => (
                                <div key={activity.id} className={`activity-feed-item ${activity.type}-activity`}>
                                    <div className="activity-feed-icon">
                                        {activity.icon}
                                    </div>
                                    <div className="activity-feed-content">
                                        <div className="activity-feed-header">
                                            <span className="activity-feed-action">{activity.action}</span>
                                            <span className="activity-feed-time">{activity.time}</span>
                                        </div>
                                        <div className="activity-feed-item-name">"{activity.item}"</div>
                                        <div className="activity-feed-type">{activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Mood Check */}
                <div className="section-wrapper">
                    <p className="section-header">Mood Check</p>
                    <section className={`homepage-card mood-card ${animateSnapshots ? 'snapshot-animated' : ''}`}>
                        <h2 className="card-title">🧠 How are you feeling today?</h2>
                        <div className="mood-options">
                            {['Happy', 'Neutral', 'Sad', 'Stressed'].map(moodType => (
                                <button
                                    key={moodType}
                                    className={`mood-btn ${mood.includes(moodType) ? 'selected' : ''}`}
                                    onClick={() => handleMoodChange(`${getMoodIcon(moodType)} ${moodType}`)}
                                >
                                    {getMoodIcon(moodType)} {moodType}
                                </button>
                            ))}
                        </div>
                        {mood && (
                            <div className="selected-mood">
                                <span className="mood-label">You selected:</span>
                                <strong className="mood-value">{mood}</strong>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Homepage;