import React from "react";
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { FaUserCircle } from "react-icons/fa";
import { logout } from '../utils/userUtils'; // Import the logout function

const Sidebar = () => {
    const location = useLocation();

    const pathToTab = {
        '/homepage': 'Homepage',
        '/notes': 'Notes',
        '/todo': 'To-Do',
        '/journal': 'Journal',
        '/pomodoro': 'Pomodoro',
        '/calendar': 'Calendar',
        '/dashboard': 'Dashboard',
    }

    const activeTab = pathToTab[location.pathname] || '';

    // Updated logout function using the utility
    const handleLogout = () => {
        logout(); // This will clear localStorage and redirect to login
    };

    return (
        <div className="sidebar">
            <Link to="/profile" className={`profile-section ${activeTab === "Profile" ? "active" : ""}`}>
                <FaUserCircle size={24} className="icon" />
                <span className="label">Profile</span>
            </Link>

            <nav className="nav-links">
                <Link to="/homepage" className={activeTab === "Homepage" ? "active" : ""}>
                    <span className="icon">🏠</span>
                    <span className="label">Homepage</span>
                </Link>

                <Link to="/notes" className={activeTab === "Notes" ? "active" : ""}>
                    <span className="icon">📝</span>
                    <span className="label">Notes</span>
                </Link>

                <Link to="/todo" className={activeTab === "To-Do" ? "active" : ""}>
                    <span className="icon">✅</span>
                    <span className="label">To-Do</span>
                </Link>

                <Link to="/journal" className={activeTab === "Journal" ? "active" : ""}>
                    <span className="icon">📓</span>
                    <span className="label">Journal</span>
                </Link>

                <Link to="/pomodoro" className={activeTab === "Pomodoro" ? "active" : ""}>
                    <span className="icon">⏱️</span>
                    <span className="label">Pomodoro</span>
                </Link>

                <Link to="/calendar" className={activeTab === "Calendar" ? "active" : ""}>
                    <span className="icon">📅</span>
                    <span className="label">Calendar</span>
                </Link>

                <Link to="/dashboard" className={activeTab === "Dashboard" ? "active" : ""}>
                    <span className="icon">📊</span>
                    <span className="label">Dashboard</span>
                </Link>

                <hr className="nav-separator" />

                <button className="logout-button" onClick={handleLogout}>
                    <span className="icon">🚪</span>
                    <span className="label">Logout</span>
                </button>
            </nav>
        </div>
    );
};

export default Sidebar;