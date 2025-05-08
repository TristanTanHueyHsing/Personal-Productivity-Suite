import React, { useEffect, useState, useRef } from "react";
import {Link} from 'react-router-dom';
import './Homepage.css';
import { FiSettings } from 'react-icons/fi';
import { FaUserCircle } from "react-icons/fa";
import focusflowLogo from './images/focusflow.png';

const Homepage = () => {
    const [focus, setFocus] = useState("");
    const [mood, setMood] = useState("");
    const [showSettingsPopup, setShowSettingsPopup] = useState(false);
    const focusInputRef = useRef(null);
    const [activeTab, setActiveTab] = useState("Homepage");
    const [animateSnapshots, setAnimateSnapshots] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setAnimateSnapshots(true);
        }, 200);
        return () => clearTimeout(timeout);
    }, []);

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

    return (
        <div className="app-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <img src={focusflowLogo} alt="FocusFlow" width={150} height={150} style={{ display: 'block', margin: '-30px 0 0 0' }} />
                <nav>
                    <ul className="nav-links">
                        <li className={activeTab === "Homepage" ? "active" : ""} onClick={() => setActiveTab("Homepage")}><Link to="/homepage" onClick={() => setActiveTab("Homepage")}>Home</Link></li>
                        <li className={activeTab === "Notes" ? "active" : ""} onClick={() => setActiveTab("Notes")}><Link to="/notes" onClick={() => setActiveTab("Notes")}>Notes</Link></li>
                        <li className={activeTab === "To-Do" ? "active" : ""} onClick={() => setActiveTab("To-Do")}><Link to="/todo" onClick={() => setActiveTab("To-Do")}>To-Do</Link></li>
                        <li className={activeTab === "Journal" ? "active" : ""} onClick={() => setActiveTab("Journal")}><Link to="/journal" onClick={() => setActiveTab("Journal")}>Journal</Link></li>
                        <li className={activeTab === "Pomodoro" ? "active" : ""} onClick={() => setActiveTab("Pomodoro")}><Link to="/pomodoro" onClick={() => setActiveTab("Pomodoro")}>Pomodoro</Link></li>
                        <li className={activeTab === "Dashboard" ? "active" : ""} onClick={() => setActiveTab("Dashboard")}><Link to="/dashboard" onClick={() => setActiveTab("Dashboard")}>Dashboard</Link></li>
                    </ul>
                    <div className="spacer"></div>
                    <hr className="separator" />
                    <ul className="nav-links">
                        <li className={activeTab === "Trash" ? "active" : ""} onClick={() => setActiveTab("Trash")}><Link to="/trash" onClick={() => setActiveTab("Trash")}>Trash</Link></li>
                    </ul>
                </nav>
                <div className="sidebar-bottom">
                    <div className="user-info">
                        <FaUserCircle className="user-icon" />
                        <p className="username"><b>John Doe</b></p>
                        <div className="settings-container" style={{ position: 'relative' }}>
                            <FiSettings className="settings-icon" onClick={() => setShowSettingsPopup(prev => !prev)} />
                            {showSettingsPopup && (
                                <div className="settings-popup">
                                    <ul>
                                        <li>Profile</li>
                                        <li>Account Settings</li>
                                        <li>Logout</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Greeting Section */}
                <section className={`card ${animateSnapshots ? 'snapshot-animated' : ''}`}>
                    <h1>🌤️ Good Morning, Alex!</h1>
                    <p>It's Thursday, April 17th</p>
                    <blockquote>"Start where you are. Use what you have. Do what you can."</blockquote>
                </section>

                {/* Focus Section */}
                <div className="section-wrapper">
                    <p className="section-header">Today's Focus</p>
                    <section className={`card ${animateSnapshots ? 'snapshot-animated' : ''}`}>
                        <h2>🎯 Main Focus Today</h2>
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
                            placeholder="Write it here to stay mindful"
                            rows={1}
                            className="focus-input"
                        />
                    </section>
                </div>

                {/* Snapshot Section */}
                <div className="section-wrapper">
                    <p className="section-header">Snapshot</p>
                    <section className={`card ${animateSnapshots ? 'snapshot-animated' : ''}`}>
                        <h2>🧾 Today's Snapshot</h2>
                        <div className="snapshot-block">
                            <h3>✅ To-Do</h3>
                            <ul>
                                <li className="todo-item">Completed 2 out of 5 tasks</li>
                                <li className="todo-item">Next Task: "Finish lab report"</li>
                                <li className="todo-item">⚠️ 1 overdue task from yesterday</li>
                            </ul>
                        </div>
                        <div className="snapshot-block">
                            <h3>📓 Journal</h3>
                            <ul>
                                <li className="journal-item">No entry for today</li>
                                <li className="journal-item">Prompt: "What am I avoiding and why?"</li>
                                <li className="journal-item">Last Entry: "April 15 - Mental Reset"</li>
                            </ul>
                        </div>
                    </section>
                </div>

                {/* Pomodoro Section */}
                <div className="section-wrapper">
                    <p className="section-header">Timer</p>
                    <section className={`card ${animateSnapshots ? 'snapshot-animated' : ''}`}>
                        <h2>⏱️ Pomodoro Timer</h2>
                        <ul>
                            <li className="pomodoro-item">Last session: 1 hour ago</li>
                            <li className="pomodoro-item">Completed 3 focus sessions</li>
                            <li className="pomodoro-item">⏸ Break mode: 16 min idle</li>
                        </ul>
                    </section>
                </div>

                {/* Recent Activity */}
                <div className="section-wrapper">
                    <p className="section-header">Activities</p>
                    <section className={`card ${animateSnapshots ? 'snapshot-animated' : ''}`}>
                        <h2>🗂️ Recent Activity</h2>
                        <ul>
                            <li className="recent-item">✏️ Edited Note: Final Exam Topics.md</li>
                            <li className="recent-item">🗒️ Checked Task: “Revise slides”</li>
                            <li className="recent-item">🕒 Used Timer: 25-min session at 9:30 AM</li>
                        </ul>
                    </section>
                </div>

                {/* Mood Check */}
                <div className="section-wrapper">
                    <p className="section-header">Mood Check</p>
                    <section className={`card ${animateSnapshots ? 'snapshot-animated' : ''}`}>
                        <h2>🧠 How are you feeling today?</h2>
                        <div className="mood-options">
                            <button onClick={() => handleMoodChange("😊 Happy")}>😊 Happy</button>
                            <button onClick={() => handleMoodChange("😐 Neutral")}>😐 Neutral</button>
                            <button onClick={() => handleMoodChange("😔 Sad")}>😔 Sad</button>
                            <button onClick={() => handleMoodChange("😵‍💫 Stressed")}>😵‍💫 Stressed</button>
                        </div>
                        {mood && (
                            <p className="selected-mood">
                                You selected: <strong>{mood}</strong>
                            </p>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Homepage;
