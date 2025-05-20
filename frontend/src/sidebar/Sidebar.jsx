import React from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { FaUserCircle } from "react-icons/fa";

const Sidebar = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const pathToTab = {
        '/homepage': 'Homepage',
        '/notes': 'Notes',
        '/todo': 'To-Do',
        '/journal': 'Journal',
        '/pomodoro': 'Pomodoro',
        '/calendar': 'Calendar',
        '/dashboard': 'Dashboard',
        '/trash': 'Trash',
        '/profile': 'Profile',
    }

    const activeTab = pathToTab[location.pathname] || '';

    // Logout function inside Sidebar
    const logout = () => {
        // Clear auth tokens (adjust as needed)
        localStorage.removeItem("authToken");
        // Redirect to login page
        navigate("/");
    };

    return (
        <div className="sidebar">

            <div className="profile-section">
                <FaUserCircle size={24} className="icon" />
                <span className="label">Profile</span>
            </div>

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

                <Link to="/pomodoro" className={activeTab === "Calendar" ? "active" : ""}>
                    <span className="icon">📅</span>
                    <span className="label">Calendar</span>
                </Link>

                <Link to="/dashboard" className={activeTab === "Dashboard" ? "active" : ""}>
                    <span className="icon">📊</span>
                    <span className="label">Dashboard</span>
                </Link>

                <hr className="nav-separator" />

                <Link to="/trash" className={activeTab === "Trash" ? "active" : ""}>
                    <span className="icon">🗑️</span>
                    <span className="label">Trash</span>
                </Link>

                <button className="logout-button" onClick={logout}>
                    <span className="icon">🚪</span>
                    <span className="label">Logout</span>
                </button>
            </nav>
        </div>
    );
};

export default Sidebar;
