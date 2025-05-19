import './Notes.css';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { FaUserCircle } from "react-icons/fa";
import focusflowLogo from './images/focusflow.png';
import { BsLayoutSidebar } from 'react-icons/bs';

const Notes = () => {
    const [showSettingsPopup, setShowSettingsPopup] = useState(false);
    const [activeTab, setActiveTab] = useState("Notes");
    const [, setAnimateSnapshots] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

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
        <div className="app-container-notes">
            {/* Sidebar */}
            {isSidebarVisible && (
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <BsLayoutSidebar
                            size={24}
                            className="toggle-icon"
                            onClick={() => setIsSidebarVisible(false)}
                            color="#14B8A6"
                        />
                    </div>
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
            )}
            {!isSidebarVisible && (
                <BsLayoutSidebar
                    size={28}
                    className="toggle-icon-closed"
                    onClick={() => setIsSidebarVisible(true)}
                    aria-label="Open sidebar"
                    role="button"
                />
            )}
            {/* Main content wrapper */}
            <div className="main-content-notes">
                <div className="left-pane">
                    {/* Left area before the vertical line */}
                    <p>Left area (e.g., notes list)</p>
                </div>

                {/* Vertical line */}
                <div className="divider-line"></div>

                <div className="right-pane">
                    {/* Right area after the vertical line */}
                    <p>Right area (e.g., note editor)</p>
                </div>
            </div>
        </div>
    );
}

export default Notes;
