import './Journal.css';
import React, { useState } from 'react';
import Sidebar from '../sidebar/Sidebar';

const Journal = () => {
    const [entries, setEntries] = useState([
        {
            id: 1,
            title: "My First Entry",
            content: "Today was a great day! I started working on my journal app and made some good progress.",
            date: "2025-06-02",
            mood: "happy",
            tags: ["productivity", "coding"]
        },
        {
            id: 2,
            title: "Reflection on the Week",
            content: "This week has been challenging but rewarding. I learned a lot about React and improved my coding skills.",
            date: "2025-06-01",
            mood: "thoughtful",
            tags: ["reflection", "learning"]
        }
    ]);

    const [selectedEntry, setSelectedEntry] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMood, setFilterMood] = useState('all');

    const [newEntry, setNewEntry] = useState({
        title: '',
        content: '',
        mood: 'neutral',
        tags: []
    });

    const moods = [
        { value: 'happy', emoji: '😊', label: 'Happy' },
        { value: 'sad', emoji: '😢', label: 'Sad' },
        { value: 'excited', emoji: '🎉', label: 'Excited' },
        { value: 'thoughtful', emoji: '🤔', label: 'Thoughtful' },
        { value: 'grateful', emoji: '🙏', label: 'Grateful' },
        { value: 'stressed', emoji: '😰', label: 'Stressed' },
        { value: 'calm', emoji: '😌', label: 'Calm' },
        { value: 'neutral', emoji: '😐', label: 'Neutral' }
    ];

    const filteredEntries = entries.filter(entry => {
        const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            entry.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMood = filterMood === 'all' || entry.mood === filterMood;
        return matchesSearch && matchesMood;
    });

    const handleCreateEntry = () => {
        setIsCreating(true);
        setSelectedEntry(null);
    };

    const handleSaveEntry = () => {
        if (newEntry.title.trim() && newEntry.content.trim()) {
            const entry = {
                id: entries.length + 1,
                ...newEntry,
                date: new Date().toISOString().split('T')[0],
                tags: newEntry.tags.filter(tag => tag.trim() !== '')
            };
            setEntries([entry, ...entries]);
            setNewEntry({ title: '', content: '', mood: 'neutral', tags: [] });
            setIsCreating(false);
        }
    };

    const handleCancelCreate = () => {
        setIsCreating(false);
        setNewEntry({ title: '', content: '', mood: 'neutral', tags: [] });
    };

    const handleTagInput = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            e.preventDefault();
            const newTag = e.target.value.trim();
            if (!newEntry.tags.includes(newTag)) {
                setNewEntry({
                    ...newEntry,
                    tags: [...newEntry.tags, newTag]
                });
            }
            e.target.value = '';
        }
    };

    const removeTag = (tagToRemove) => {
        setNewEntry({
            ...newEntry,
            tags: newEntry.tags.filter(tag => tag !== tagToRemove)
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getMoodEmoji = (mood) => {
        const moodObj = moods.find(m => m.value === mood);
        return moodObj ? moodObj.emoji : '😐';
    };

    return (
        <div className="app-container-journal">
            <Sidebar />
            <div className="main-content-journal">
                <div className="journal-header">
                    <h1>My Journal</h1>
                    <button className="create-entry-btn" onClick={handleCreateEntry}>
                        <span>+</span> New Entry
                    </button>
                </div>

                <div className="journal-filters">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search entries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="mood-filter">
                        <select
                            value={filterMood}
                            onChange={(e) => setFilterMood(e.target.value)}
                        >
                            <option value="all">All Moods</option>
                            {moods.map(mood => (
                                <option key={mood.value} value={mood.value}>
                                    {mood.emoji} {mood.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="journal-content">
                    <div className="entries-list">
                        {isCreating && (
                            <div className="entry-card creating">
                                <div className="entry-form">
                                    <input
                                        type="text"
                                        placeholder="Entry title..."
                                        value={newEntry.title}
                                        onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                                        className="entry-title-input"
                                    />
                                    
                                    <div className="mood-selector">
                                        <label>How are you feeling?</label>
                                        <div className="mood-options">
                                            {moods.map(mood => (
                                                <button
                                                    key={mood.value}
                                                    className={`mood-btn ${newEntry.mood === mood.value ? 'selected' : ''}`}
                                                    onClick={() => setNewEntry({...newEntry, mood: mood.value})}
                                                    title={mood.label}
                                                >
                                                    {mood.emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <textarea
                                        placeholder="What's on your mind today?"
                                        value={newEntry.content}
                                        onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                                        className="entry-content-input"
                                        rows="6"
                                    ></textarea>

                                    <div className="tags-section">
                                        <label>Tags (press Enter to add)</label>
                                        <input
                                            type="text"
                                            placeholder="Add a tag..."
                                            onKeyDown={handleTagInput}
                                            className="tag-input"
                                        />
                                        <div className="tags-display">
                                            {newEntry.tags.map(tag => (
                                                <span key={tag} className="tag">
                                                    {tag}
                                                    <button onClick={() => removeTag(tag)}>×</button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="entry-actions">
                                        <button className="save-btn" onClick={handleSaveEntry}>
                                            Save Entry
                                        </button>
                                        <button className="cancel-btn" onClick={handleCancelCreate}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {filteredEntries.map(entry => (
                            <div
                                key={entry.id}
                                className={`entry-card ${selectedEntry?.id === entry.id ? 'selected' : ''}`}
                                onClick={() => setSelectedEntry(entry)}
                            >
                                <div className="entry-header">
                                    <h3>{entry.title}</h3>
                                    <div className="entry-mood">
                                        {getMoodEmoji(entry.mood)}
                                    </div>
                                </div>
                                <p className="entry-preview">
                                    {entry.content.length > 150 
                                        ? entry.content.substring(0, 150) + '...' 
                                        : entry.content
                                    }
                                </p>
                                <div className="entry-meta">
                                    <span className="entry-date">{formatDate(entry.date)}</span>
                                    {entry.tags.length > 0 && (
                                        <div className="entry-tags">
                                            {entry.tags.map(tag => (
                                                <span key={tag} className="tag-small">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {filteredEntries.length === 0 && !isCreating && (
                            <div className="empty-state">
                                <h3>No entries found</h3>
                                <p>
                                    {searchTerm || filterMood !== 'all' 
                                        ? 'Try adjusting your search or filter.'
                                        : 'Start your journaling journey by creating your first entry!'
                                    }
                                </p>
                                {!searchTerm && filterMood === 'all' && (
                                    <button className="create-first-btn" onClick={handleCreateEntry}>
                                        Create Your First Entry
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {selectedEntry && !isCreating && (
                        <div className="entry-detail">
                            <div className="detail-header">
                                <h2>{selectedEntry.title}</h2>
                                <div className="detail-mood">
                                    {getMoodEmoji(selectedEntry.mood)}
                                </div>
                            </div>
                            <div className="detail-meta">
                                <span className="detail-date">{formatDate(selectedEntry.date)}</span>
                                {selectedEntry.tags.length > 0 && (
                                    <div className="detail-tags">
                                        {selectedEntry.tags.map(tag => (
                                            <span key={tag} className="tag">{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="detail-content">
                                <p>{selectedEntry.content}</p>
                            </div>
                        </div>
                    )}

                    {!selectedEntry && !isCreating && (
                        <div className="welcome-panel">
                            <h2>Welcome to your Journal</h2>
                            <p>Select an entry from the list to read it, or create a new entry to get started.</p>
                            <div className="welcome-stats">
                                <div className="stat">
                                    <span className="stat-number">{entries.length}</span>
                                    <span className="stat-label">Total Entries</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-number">
                                        {new Set(entries.flatMap(e => e.tags)).size}
                                    </span>
                                    <span className="stat-label">Unique Tags</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Journal;