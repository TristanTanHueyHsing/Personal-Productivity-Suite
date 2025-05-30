import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import './Todo.css';
import { FiSettings } from 'react-icons/fi';
import { FaUserCircle } from "react-icons/fa";

const Todo = () => {
    const [showSettingsPopup, setShowSettingsPopup] = useState(false);
    const [activeTab, setActiveTab] = useState("To-Do");
    const [, setAnimateSnapshots] = useState(false);

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

    return (
        <div className="app-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <nav>
                    <ul className="nav-links">
                        <li className={activeTab === "Homepage" ? "active" : ""} onClick={() => setActiveTab("Homepage")}><Link to="/homepage" onClick={() => setActiveTab("Homepage")}>Home</Link></li>
                        <li className={activeTab === "Notes" ? "active" : ""} ><Link to="/notes" onClick={() => setActiveTab("Notes")}>Notes</Link></li>
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
        </div>
    );
};

export default Todo;
