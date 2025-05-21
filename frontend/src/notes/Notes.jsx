import './Notes.css';
import React, { useEffect, useState } from "react";
import { FaPen, FaTrash } from 'react-icons/fa';
import Sidebar from '../sidebar/Sidebar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ErrorBoundary from '../ErrorBoundary';

const Notes = () => {
    const [, setAnimateSnapshots] = useState(false);
    const [markdown, setMarkdown] = useState('');

    useEffect(() => {
        const timeout = setTimeout(() => {
            setAnimateSnapshots(true);
        }, 200);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="app-container-notes">
            <Sidebar />
            {/* Main content wrapper */}
            <div className="main-content-notes">

                <div className="left-pane">
                    <div className="search-and-button">
                        <input
                            type="text"
                            className="notes-search"
                            placeholder="Search notes..."
                        />
                        <button className="new-note-btn">+</button>
                    </div>
                    <div className="top-divider"></div>
                    {/* Title section */}
                    <div className="title-section">
                        <p className="title-label">Title</p>
                        <div className='bottom-divider-title'></div>
                        <p className="title-content">Here will be the note's title</p>
                    </div>
                    <p>Below divider (left)</p>
                </div>

                <div className="divider-line"></div>

                <div className="right-pane">
                    {/* Wrap text and buttons in a flex container */}
                    <div className="top-bar">
                        <p className="top-bar-title">Title</p>
                        <div className="top-buttons">
                            <button className="edit-btn" aria-label='Edit'><FaPen size={16} /></button>
                            <button className="delete-btn" aria-label='Delete'><FaTrash size={16} /></button>
                        </div>
                    </div>

                    <div className="top-divider"></div>
                    <div className="markdown-container">
                        <textarea
                            className="markdown-input"
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            placeholder="Write your note in Markdown..."
                        />
                        <div className="markdown-preview">
                            <ErrorBoundary>
                                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={{
                                    p: ({ node, ...props }) => <p style={{ whiteSpace: 'pre-wrap' }} {...props} />
                                }}>{markdown}</ReactMarkdown>
                            </ErrorBoundary>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}

export default Notes;
