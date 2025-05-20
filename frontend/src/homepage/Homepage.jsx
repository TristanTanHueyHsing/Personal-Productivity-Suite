import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../sidebar/Sidebar'; // adjust the path if needed
import './Homepage.css'; // optional: for layout styles

const Homepage = () => {
    const [focus, setFocus] = useState("");
    const [mood, setMood] = useState("");
    const focusInputRef = useRef(null);
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
            <Sidebar />
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
