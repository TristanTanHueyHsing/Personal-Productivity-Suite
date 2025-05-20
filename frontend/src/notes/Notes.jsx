import './Notes.css';
import React, { useEffect, useState } from "react";
import Sidebar from '../sidebar/Sidebar';

const Notes = () => {
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
        <div className="app-container-notes">
            <Sidebar />
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
