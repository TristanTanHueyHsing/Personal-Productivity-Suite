// import './Journal.css';
// import React, { useState } from 'react';
// import Sidebar from '../sidebar/Sidebar';

// const Journal = () => {
//     const [entries, setEntries] = useState([
//         {
//             id: 1,
//             title: "My First Entry",
//             content: "Today was a great day! I started working on my journal app and made some good progress.",
//             date: "2025-06-02",
//             mood: "happy",
//             tags: ["productivity", "coding"]
//         },
//         {
//             id: 2,
//             title: "Reflection on the Week",
//             content: "This week has been challenging but rewarding. I learned a lot about React and improved my coding skills.",
//             date: "2025-06-01",
//             mood: "thoughtful",
//             tags: ["reflection", "learning"]
//         }
//     ]);

//     const [selectedEntry, setSelectedEntry] = useState(null);
//     const [isCreating, setIsCreating] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filterMood, setFilterMood] = useState('all');

//     const [newEntry, setNewEntry] = useState({
//         title: '',
//         content: '',
//         mood: 'neutral',
//         tags: []
//     });

//     const moods = [
//         { value: 'happy', emoji: '😊', label: 'Happy' },
//         { value: 'sad', emoji: '😢', label: 'Sad' },
//         { value: 'excited', emoji: '🎉', label: 'Excited' },
//         { value: 'thoughtful', emoji: '🤔', label: 'Thoughtful' },
//         { value: 'grateful', emoji: '🙏', label: 'Grateful' },
//         { value: 'stressed', emoji: '😰', label: 'Stressed' },
//         { value: 'calm', emoji: '😌', label: 'Calm' },
//         { value: 'neutral', emoji: '😐', label: 'Neutral' }
//     ];

//     const filteredEntries = entries.filter(entry => {
//         const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                             entry.content.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchesMood = filterMood === 'all' || entry.mood === filterMood;
//         return matchesSearch && matchesMood;
//     });

//     const handleCreateEntry = () => {
//         setIsCreating(true);
//         setSelectedEntry(null);
//     };

//     const handleSaveEntry = () => {
//         if (newEntry.title.trim() && newEntry.content.trim()) {
//             const entry = {
//                 id: entries.length + 1,
//                 ...newEntry,
//                 date: new Date().toISOString().split('T')[0],
//                 tags: newEntry.tags.filter(tag => tag.trim() !== '')
//             };
//             setEntries([entry, ...entries]);
//             setNewEntry({ title: '', content: '', mood: 'neutral', tags: [] });
//             setIsCreating(false);
//         }
//     };

//     const handleCancelCreate = () => {
//         setIsCreating(false);
//         setNewEntry({ title: '', content: '', mood: 'neutral', tags: [] });
//     };

//     const handleTagInput = (e) => {
//         if (e.key === 'Enter' && e.target.value.trim()) {
//             e.preventDefault();
//             const newTag = e.target.value.trim();
//             if (!newEntry.tags.includes(newTag)) {
//                 setNewEntry({
//                     ...newEntry,
//                     tags: [...newEntry.tags, newTag]
//                 });
//             }
//             e.target.value = '';
//         }
//     };

//     const removeTag = (tagToRemove) => {
//         setNewEntry({
//             ...newEntry,
//             tags: newEntry.tags.filter(tag => tag !== tagToRemove)
//         });
//     };

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             weekday: 'long',
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric'
//         });
//     };

//     const getMoodEmoji = (mood) => {
//         const moodObj = moods.find(m => m.value === mood);
//         return moodObj ? moodObj.emoji : '😐';
//     };

//     return (
//         <div className="app-container-journal">
//             <Sidebar />
//             <div className="main-content-journal">
//                 <div className="journal-header">
//                     <h1>My Journal</h1>
//                     <button className="create-entry-btn" onClick={handleCreateEntry}>
//                         <span>+</span> New Entry
//                     </button>
//                 </div>

//                 <div className="journal-filters">
//                     <div className="search-bar">
//                         <input
//                             type="text"
//                             placeholder="Search entries..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                     </div>
//                     <div className="mood-filter">
//                         <select
//                             value={filterMood}
//                             onChange={(e) => setFilterMood(e.target.value)}
//                         >
//                             <option value="all">All Moods</option>
//                             {moods.map(mood => (
//                                 <option key={mood.value} value={mood.value}>
//                                     {mood.emoji} {mood.label}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 {/* Full-width create form when creating */}
//                 {isCreating ? (
//                     <div className="full-width-create-form">
//                         <div className="entry-form-full">
//                             <input
//                                 type="text"
//                                 placeholder="Entry title..."
//                                 value={newEntry.title}
//                                 onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
//                                 className="entry-title-input-full"
//                             />
                            
//                             <div className="form-content-grid">
//                                 <div className="form-left">
//                                     <div className="mood-selector">
//                                         <label>How are you feeling?</label>
//                                         <div className="mood-options">
//                                             {moods.map(mood => (
//                                                 <button
//                                                     key={mood.value}
//                                                     className={`mood-btn ${newEntry.mood === mood.value ? 'selected' : ''}`}
//                                                     onClick={() => setNewEntry({...newEntry, mood: mood.value})}
//                                                     title={mood.label}
//                                                 >
//                                                     {mood.emoji}
//                                                 </button>
//                                             ))}
//                                         </div>
//                                     </div>

//                                     <div className="tags-section">
//                                         <label>Tags (press Enter to add)</label>
//                                         <input
//                                             type="text"
//                                             placeholder="Add a tag..."
//                                             onKeyDown={handleTagInput}
//                                             className="tag-input"
//                                         />
//                                         <div className="tags-display">
//                                             {newEntry.tags.map(tag => (
//                                                 <span key={tag} className="tag">
//                                                     {tag}
//                                                     <button onClick={() => removeTag(tag)}>×</button>
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="form-right">
//                                     <div className="content-section">
//                                         <label>What's on your mind today?</label>
//                                         <textarea
//                                             placeholder="Write your thoughts here..."
//                                             value={newEntry.content}
//                                             onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
//                                             className="entry-content-input-full"
//                                             rows="12"
//                                         ></textarea>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="entry-actions-full">
//                                 <button className="save-btn" onClick={handleSaveEntry}>
//                                     Save Entry
//                                 </button>
//                                 <button className="cancel-btn" onClick={handleCancelCreate}>
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 ) : (
//                     /* Normal two-column layout when not creating */
//                     <div className="journal-content">
//                         <div className="entries-list">
//                             {filteredEntries.map(entry => (
//                                 <div
//                                     key={entry.id}
//                                     className={`entry-card ${selectedEntry?.id === entry.id ? 'selected' : ''}`}
//                                     onClick={() => setSelectedEntry(entry)}
//                                 >
//                                     <div className="entry-header">
//                                         <h3>{entry.title}</h3>
//                                         <div className="entry-mood">
//                                             {getMoodEmoji(entry.mood)}
//                                         </div>
//                                     </div>
//                                     <p className="entry-preview">
//                                         {entry.content.length > 150 
//                                             ? entry.content.substring(0, 150) + '...' 
//                                             : entry.content
//                                         }
//                                     </p>
//                                     <div className="entry-meta">
//                                         <span className="entry-date">{formatDate(entry.date)}</span>
//                                         {entry.tags.length > 0 && (
//                                             <div className="entry-tags">
//                                                 {entry.tags.map(tag => (
//                                                     <span key={tag} className="tag-small">{tag}</span>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             ))}

//                             {filteredEntries.length === 0 && (
//                                 <div className="empty-state">
//                                     <h3>No entries found</h3>
//                                     <p>
//                                         {searchTerm || filterMood !== 'all' 
//                                             ? 'Try adjusting your search or filter.'
//                                             : 'Start your journaling journey by creating your first entry!'
//                                         }
//                                     </p>
//                                     {!searchTerm && filterMood === 'all' && (
//                                         <button className="create-first-btn" onClick={handleCreateEntry}>
//                                             Create Your First Entry
//                                         </button>
//                                     )}
//                                 </div>
//                             )}
//                         </div>

//                         {selectedEntry && (
//                             <div className="entry-detail">
//                                 <div className="detail-header">
//                                     <h2>{selectedEntry.title}</h2>
//                                     <div className="detail-mood">
//                                         {getMoodEmoji(selectedEntry.mood)}
//                                     </div>
//                                 </div>
//                                 <div className="detail-meta">
//                                     <span className="detail-date">{formatDate(selectedEntry.date)}</span>
//                                     {selectedEntry.tags.length > 0 && (
//                                         <div className="detail-tags">
//                                             {selectedEntry.tags.map(tag => (
//                                                 <span key={tag} className="tag">{tag}</span>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                                 <div className="detail-content">
//                                     <p>{selectedEntry.content}</p>
//                                 </div>
//                             </div>
//                         )}

//                         {!selectedEntry && (
//                             <div className="welcome-panel">
//                                 <h2>Welcome to your Journal</h2>
//                                 <p>Select an entry from the list to read it, or create a new entry to get started.</p>
//                                 <div className="welcome-stats">
//                                     <div className="stat">
//                                         <span className="stat-number">{entries.length}</span>
//                                         <span className="stat-label">Total Entries</span>
//                                     </div>
//                                     <div className="stat">
//                                         <span className="stat-number">
//                                             {new Set(entries.flatMap(e => e.tags)).size}
//                                         </span>
//                                         <span className="stat-label">Unique Tags</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Journal;

// import './Journal.css';
// import React, { useState, useEffect } from 'react';
// import Sidebar from '../sidebar/Sidebar';

// const API_BASE_URL = 'http://localhost:8000/api';

// const Journal = () => {
//     const [entries, setEntries] = useState([]);
//     const [selectedEntry, setSelectedEntry] = useState(null);
//     const [isCreating, setIsCreating] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filterMood, setFilterMood] = useState('all');
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [submitting, setSubmitting] = useState(false);

//     // For demonstration, using user_id = 1
//     // In a real app, you'd get this from authentication
//     const userId = 1;

//     const [newEntry, setNewEntry] = useState({
//         title: '',
//         content: '',
//         mood: 'neutral',
//         tags: []
//     });

//     const moods = [
//         { value: 'happy', emoji: '😊', label: 'Happy' },
//         { value: 'sad', emoji: '😢', label: 'Sad' },
//         { value: 'excited', emoji: '🎉', label: 'Excited' },
//         { value: 'thoughtful', emoji: '🤔', label: 'Thoughtful' },
//         { value: 'grateful', emoji: '🙏', label: 'Grateful' },
//         { value: 'stressed', emoji: '😰', label: 'Stressed' },
//         { value: 'calm', emoji: '😌', label: 'Calm' },
//         { value: 'neutral', emoji: '😐', label: 'Neutral' }
//     ];

//     // Fetch journal entries from backend
//     const fetchEntries = async () => {
//         try {
//             setLoading(true);
//             const response = await fetch(`${API_BASE_URL}/journals/${userId}`);
//             if (response.ok) {
//                 const data = await response.json();
//                 // Transform backend data to match frontend format
//                 const transformedEntries = data.map(entry => ({
//                     id: entry.id,
//                     title: entry.title,
//                     content: entry.content,
//                     mood: entry.mood,
//                     tags: entry.tags || [],
//                     date: entry.created_at.split('T')[0], // Convert datetime to date
//                     createdAt: entry.created_at
//                 }));
//                 setEntries(transformedEntries);
//                 setError(null);
//             } else {
//                 setError('Failed to fetch journal entries');
//             }
//         } catch (err) {
//             setError('Error connecting to server');
//             console.error('Error fetching entries:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Load entries on component mount
//     useEffect(() => {
//         fetchEntries();
//     }, []);

//     const filteredEntries = entries.filter(entry => {
//         const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                             entry.content.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchesMood = filterMood === 'all' || entry.mood === filterMood;
//         return matchesSearch && matchesMood;
//     });

//     const handleCreateEntry = () => {
//         setIsCreating(true);
//         setSelectedEntry(null);
//     };

//     const handleSaveEntry = async () => {
//         if (newEntry.title.trim() && newEntry.content.trim()) {
//             try {
//                 setSubmitting(true);
//                 const response = await fetch(`${API_BASE_URL}/journals/${userId}`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                         title: newEntry.title.trim(),
//                         content: newEntry.content.trim(),
//                         mood: newEntry.mood,
//                         tags: newEntry.tags.filter(tag => tag.trim() !== '')
//                     })
//                 });

//                 if (response.ok) {
//                     const savedEntry = await response.json();
//                     const transformedEntry = {
//                         id: savedEntry.id,
//                         title: savedEntry.title,
//                         content: savedEntry.content,
//                         mood: savedEntry.mood,
//                         tags: savedEntry.tags || [],
//                         date: savedEntry.created_at.split('T')[0],
//                         createdAt: savedEntry.created_at
//                     };
//                     setEntries([transformedEntry, ...entries]);
//                     setNewEntry({ title: '', content: '', mood: 'neutral', tags: [] });
//                     setIsCreating(false);
//                     setError(null);
//                 } else {
//                     setError('Failed to save journal entry');
//                 }
//             } catch (err) {
//                 setError('Error saving journal entry');
//                 console.error('Error saving entry:', err);
//             } finally {
//                 setSubmitting(false);
//             }
//         }
//     };

//     const handleCancelCreate = () => {
//         setIsCreating(false);
//         setNewEntry({ title: '', content: '', mood: 'neutral', tags: [] });
//     };

//     const handleTagInput = (e) => {
//         if (e.key === 'Enter' && e.target.value.trim()) {
//             e.preventDefault();
//             const newTag = e.target.value.trim();
//             if (!newEntry.tags.includes(newTag)) {
//                 setNewEntry({
//                     ...newEntry,
//                     tags: [...newEntry.tags, newTag]
//                 });
//             }
//             e.target.value = '';
//         }
//     };

//     const removeTag = (tagToRemove) => {
//         setNewEntry({
//             ...newEntry,
//             tags: newEntry.tags.filter(tag => tag !== tagToRemove)
//         });
//     };

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             weekday: 'long',
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric'
//         });
//     };

//     const getMoodEmoji = (mood) => {
//         const moodObj = moods.find(m => m.value === mood);
//         return moodObj ? moodObj.emoji : '😐';
//     };

//     // Clear error after 5 seconds
//     useEffect(() => {
//         if (error) {
//             const timer = setTimeout(() => setError(null), 5000);
//             return () => clearTimeout(timer);
//         }
//     }, [error]);

//     return (
//         <div className="app-container-journal">
//             <Sidebar />
//             <div className="main-content-journal">
//                 {/* Error Message */}
//                 {error && (
//                     <div className="error-message">
//                         <span>⚠️ {error}</span>
//                         <button onClick={() => setError(null)}>×</button>
//                     </div>
//                 )}

//                 {/* Loading State */}
//                 {loading && (
//                     <div className="loading-message">
//                         <span>Loading journal entries...</span>
//                     </div>
//                 )}

//                 <div className="journal-header">
//                     <h1>My Journal</h1>
//                     <button 
//                         className="create-entry-btn" 
//                         onClick={handleCreateEntry}
//                         disabled={loading || submitting}
//                     >
//                         <span>+</span> New Entry
//                     </button>
//                 </div>

//                 <div className="journal-filters">
//                     <div className="search-bar">
//                         <input
//                             type="text"
//                             placeholder="Search entries..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                     </div>
//                     <div className="mood-filter">
//                         <select
//                             value={filterMood}
//                             onChange={(e) => setFilterMood(e.target.value)}
//                         >
//                             <option value="all">All Moods</option>
//                             {moods.map(mood => (
//                                 <option key={mood.value} value={mood.value}>
//                                     {mood.emoji} {mood.label}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 {/* Full-width create form when creating */}
//                 {isCreating ? (
//                     <div className="full-width-create-form">
//                         <div className="entry-form-full">
//                             <input
//                                 type="text"
//                                 placeholder="Entry title..."
//                                 value={newEntry.title}
//                                 onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
//                                 className="entry-title-input-full"
//                                 disabled={submitting}
//                             />
                            
//                             <div className="form-content-grid">
//                                 <div className="form-left">
//                                     <div className="mood-selector">
//                                         <label>How are you feeling?</label>
//                                         <div className="mood-options">
//                                             {moods.map(mood => (
//                                                 <button
//                                                     key={mood.value}
//                                                     className={`mood-btn ${newEntry.mood === mood.value ? 'selected' : ''}`}
//                                                     onClick={() => setNewEntry({...newEntry, mood: mood.value})}
//                                                     title={mood.label}
//                                                     disabled={submitting}
//                                                 >
//                                                     {mood.emoji}
//                                                 </button>
//                                             ))}
//                                         </div>
//                                     </div>

//                                     <div className="tags-section">
//                                         <label>Tags (press Enter to add)</label>
//                                         <input
//                                             type="text"
//                                             placeholder="Add a tag..."
//                                             onKeyDown={handleTagInput}
//                                             className="tag-input"
//                                             disabled={submitting}
//                                         />
//                                         <div className="tags-display">
//                                             {newEntry.tags.map(tag => (
//                                                 <span key={tag} className="tag">
//                                                     {tag}
//                                                     <button 
//                                                         onClick={() => removeTag(tag)}
//                                                         disabled={submitting}
//                                                     >
//                                                         ×
//                                                     </button>
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="form-right">
//                                     <div className="content-section">
//                                         <label>What's on your mind today?</label>
//                                         <textarea
//                                             placeholder="Write your thoughts here..."
//                                             value={newEntry.content}
//                                             onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
//                                             className="entry-content-input-full"
//                                             rows="12"
//                                             disabled={submitting}
//                                         ></textarea>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="entry-actions-full">
//                                 <button 
//                                     className="save-btn" 
//                                     onClick={handleSaveEntry}
//                                     disabled={submitting}
//                                 >
//                                     {submitting ? 'Saving...' : 'Save Entry'}
//                                 </button>
//                                 <button 
//                                     className="cancel-btn" 
//                                     onClick={handleCancelCreate}
//                                     disabled={submitting}
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 ) : (
//                     /* Normal two-column layout when not creating */
//                     <div className="journal-content">
//                         <div className="entries-list">
//                             {filteredEntries.map(entry => (
//                                 <div
//                                     key={entry.id}
//                                     className={`entry-card ${selectedEntry?.id === entry.id ? 'selected' : ''}`}
//                                     onClick={() => setSelectedEntry(entry)}
//                                 >
//                                     <div className="entry-header">
//                                         <h3>{entry.title}</h3>
//                                         <div className="entry-mood">
//                                             {getMoodEmoji(entry.mood)}
//                                         </div>
//                                     </div>
//                                     <p className="entry-preview">
//                                         {entry.content.length > 150 
//                                             ? entry.content.substring(0, 150) + '...' 
//                                             : entry.content
//                                         }
//                                     </p>
//                                     <div className="entry-meta">
//                                         <span className="entry-date">{formatDate(entry.date)}</span>
//                                         {entry.tags.length > 0 && (
//                                             <div className="entry-tags">
//                                                 {entry.tags.map(tag => (
//                                                     <span key={tag} className="tag-small">{tag}</span>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             ))}

//                             {filteredEntries.length === 0 && !loading ? (
//                                 <div className="empty-state">
//                                     <h3>No entries found</h3>
//                                     <p>
//                                         {searchTerm || filterMood !== 'all' 
//                                             ? 'Try adjusting your search or filter.'
//                                             : 'Start your journaling journey by creating your first entry!'
//                                         }
//                                     </p>
//                                     {!searchTerm && filterMood === 'all' && (
//                                         <button className="create-first-btn" onClick={handleCreateEntry}>
//                                             Create Your First Entry
//                                         </button>
//                                     )}
//                                 </div>
//                             ) : null}
//                         </div>

//                         {selectedEntry && (
//                             <div className="entry-detail">
//                                 <div className="detail-header">
//                                     <h2>{selectedEntry.title}</h2>
//                                     <div className="detail-mood">
//                                         {getMoodEmoji(selectedEntry.mood)}
//                                     </div>
//                                 </div>
//                                 <div className="detail-meta">
//                                     <span className="detail-date">{formatDate(selectedEntry.date)}</span>
//                                     {selectedEntry.tags.length > 0 && (
//                                         <div className="detail-tags">
//                                             {selectedEntry.tags.map(tag => (
//                                                 <span key={tag} className="tag">{tag}</span>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                                 <div className="detail-content">
//                                     <p>{selectedEntry.content}</p>
//                                 </div>
//                             </div>
//                         )}

//                         {!selectedEntry && (
//                             <div className="welcome-panel">
//                                 <h2>Welcome to your Journal</h2>
//                                 <p>Select an entry from the list to read it, or create a new entry to get started.</p>
//                                 <div className="welcome-stats">
//                                     <div className="stat">
//                                         <span className="stat-number">{entries.length}</span>
//                                         <span className="stat-label">Total Entries</span>
//                                     </div>
//                                     <div className="stat">
//                                         <span className="stat-number">
//                                             {new Set(entries.flatMap(e => e.tags)).size}
//                                         </span>
//                                         <span className="stat-label">Unique Tags</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Journal;

// import './Journal.css';
// import React, { useState, useEffect } from 'react';
// import Sidebar from '../sidebar/Sidebar';

// const API_BASE_URL = 'http://localhost:8000/api';

// const Journal = () => {
//     const [entries, setEntries] = useState([]);
//     const [selectedEntry, setSelectedEntry] = useState(null);
//     const [isCreating, setIsCreating] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filterMood, setFilterMood] = useState('all');
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [submitting, setSubmitting] = useState(false);

//     // For demonstration, using user_id = 1
//     // In a real app, you'd get this from authentication
//     const userId = 1;

//     const [newEntry, setNewEntry] = useState({
//         title: '',
//         content: '',
//         mood: 'neutral',
//         tags: []
//     });

//     const moods = [
//         { value: 'happy', emoji: '😊', label: 'Happy' },
//         { value: 'sad', emoji: '😢', label: 'Sad' },
//         { value: 'excited', emoji: '🎉', label: 'Excited' },
//         { value: 'thoughtful', emoji: '🤔', label: 'Thoughtful' },
//         { value: 'grateful', emoji: '🙏', label: 'Grateful' },
//         { value: 'stressed', emoji: '😰', label: 'Stressed' },
//         { value: 'calm', emoji: '😌', label: 'Calm' },
//         { value: 'neutral', emoji: '😐', label: 'Neutral' }
//     ];

//     // Fetch journal entries from backend
//     const fetchEntries = async () => {
//         try {
//             setLoading(true);
//             const response = await fetch(`${API_BASE_URL}/journals/${userId}`);
//             if (response.ok) {
//                 const data = await response.json();
//                 // Transform backend data to match frontend format
//                 const transformedEntries = data.map(entry => ({
//                     id: entry.id,
//                     title: entry.title,
//                     content: entry.content,
//                     mood: entry.mood,
//                     tags: entry.tags || [],
//                     date: entry.created_at.split('T')[0], // Convert datetime to date
//                     createdAt: entry.created_at
//                 }));
//                 setEntries(transformedEntries);
//                 setError(null);
//             } else {
//                 setError('Failed to fetch journal entries');
//             }
//         } catch (err) {
//             setError('Error connecting to server');
//             console.error('Error fetching entries:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Load entries on component mount
//     useEffect(() => {
//         fetchEntries();
//     }, []);

//     const filteredEntries = entries.filter(entry => {
//         const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                             entry.content.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchesMood = filterMood === 'all' || entry.mood === filterMood;
//         return matchesSearch && matchesMood;
//     });

//     const handleCreateEntry = () => {
//         setIsCreating(true);
//         setSelectedEntry(null);
//     };

//     const handleSaveEntry = async () => {
//         if (newEntry.title.trim() && newEntry.content.trim()) {
//             try {
//                 setSubmitting(true);
//                 const response = await fetch(`${API_BASE_URL}/journals/${userId}`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                         title: newEntry.title.trim(),
//                         content: newEntry.content.trim(),
//                         mood: newEntry.mood,
//                         tags: newEntry.tags.filter(tag => tag.trim() !== '')
//                     })
//                 });

//                 if (response.ok) {
//                     const savedEntry = await response.json();
//                     const transformedEntry = {
//                         id: savedEntry.id,
//                         title: savedEntry.title,
//                         content: savedEntry.content,
//                         mood: savedEntry.mood,
//                         tags: savedEntry.tags || [],
//                         date: savedEntry.created_at.split('T')[0],
//                         createdAt: savedEntry.created_at
//                     };
//                     setEntries([transformedEntry, ...entries]);
//                     setNewEntry({ title: '', content: '', mood: 'neutral', tags: [] });
//                     setIsCreating(false);
//                     setError(null);
//                 } else {
//                     setError('Failed to save journal entry');
//                 }
//             } catch (err) {
//                 setError('Error saving journal entry');
//                 console.error('Error saving entry:', err);
//             } finally {
//                 setSubmitting(false);
//             }
//         }
//     };

//     const handleCancelCreate = () => {
//         setIsCreating(false);
//         setNewEntry({ title: '', content: '', mood: 'neutral', tags: [] });
//     };

//     const handleTagInput = (e) => {
//         if (e.key === 'Enter' && e.target.value.trim()) {
//             e.preventDefault();
//             const newTag = e.target.value.trim();
//             if (!newEntry.tags.includes(newTag)) {
//                 setNewEntry({
//                     ...newEntry,
//                     tags: [...newEntry.tags, newTag]
//                 });
//             }
//             e.target.value = '';
//         }
//     };

//     const removeTag = (tagToRemove) => {
//         setNewEntry({
//             ...newEntry,
//             tags: newEntry.tags.filter(tag => tag !== tagToRemove)
//         });
//     };

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             weekday: 'long',
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric'
//         });
//     };

//     const getMoodEmoji = (mood) => {
//         const moodObj = moods.find(m => m.value === mood);
//         return moodObj ? moodObj.emoji : '😐';
//     };

//     // Clear error after 5 seconds
//     useEffect(() => {
//         if (error) {
//             const timer = setTimeout(() => setError(null), 5000);
//             return () => clearTimeout(timer);
//         }
//     }, [error]);

//     return (
//         <div className="app-container-journal">
//             <Sidebar />
//             <div className="main-content-journal">
//                 {/* Error Message */}
//                 {error && (
//                     <div className="error-message">
//                         <span>⚠️ {error}</span>
//                         <button onClick={() => setError(null)}>×</button>
//                     </div>
//                 )}

//                 {/* Loading State */}
//                 {loading && (
//                     <div className="loading-message">
//                         <span>Loading journal entries...</span>
//                     </div>
//                 )}

//                 <div className="journal-header">
//                     <h1>My Journal</h1>
//                     <button 
//                         className="create-entry-btn" 
//                         onClick={handleCreateEntry}
//                         disabled={loading || submitting}
//                     >
//                         <span>+</span> New Entry
//                     </button>
//                 </div>

//                 <div className="journal-filters">
//                     <div className="search-bar">
//                         <input
//                             type="text"
//                             placeholder="Search entries..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                     </div>
//                     <div className="mood-filter">
//                         <select
//                             value={filterMood}
//                             onChange={(e) => setFilterMood(e.target.value)}
//                         >
//                             <option value="all">All Moods</option>
//                             {moods.map(mood => (
//                                 <option key={mood.value} value={mood.value}>
//                                     {mood.emoji} {mood.label}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 {/* Full-width create form when creating */}
//                 {isCreating ? (
//                     <div className="full-width-create-form">
//                         <div className="entry-form-full">
//                             <input
//                                 type="text"
//                                 placeholder="Entry title..."
//                                 value={newEntry.title}
//                                 onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
//                                 className="entry-title-input-full"
//                                 disabled={submitting}
//                             />
                            
//                             <div className="form-content-grid">
//                                 <div className="form-left">
//                                     <div className="mood-selector">
//                                         <label>How are you feeling?</label>
//                                         <div className="mood-options">
//                                             {moods.map(mood => (
//                                                 <button
//                                                     key={mood.value}
//                                                     className={`mood-btn ${newEntry.mood === mood.value ? 'selected' : ''}`}
//                                                     onClick={() => setNewEntry({...newEntry, mood: mood.value})}
//                                                     title={mood.label}
//                                                     disabled={submitting}
//                                                 >
//                                                     {mood.emoji}
//                                                 </button>
//                                             ))}
//                                         </div>
//                                     </div>

//                                     <div className="tags-section">
//                                         <label>Tags (press Enter to add)</label>
//                                         <input
//                                             type="text"
//                                             placeholder="Add a tag..."
//                                             onKeyDown={handleTagInput}
//                                             className="tag-input"
//                                             disabled={submitting}
//                                         />
//                                         <div className="tags-display">
//                                             {newEntry.tags.map(tag => (
//                                                 <span key={tag} className="tag">
//                                                     {tag}
//                                                     <button 
//                                                         onClick={() => removeTag(tag)}
//                                                         disabled={submitting}
//                                                     >
//                                                         ×
//                                                     </button>
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="form-right">
//                                     <div className="content-section">
//                                         <label>What's on your mind today?</label>
//                                         <textarea
//                                             placeholder="Write your thoughts here..."
//                                             value={newEntry.content}
//                                             onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
//                                             className="entry-content-input-full"
//                                             rows="12"
//                                             disabled={submitting}
//                                         ></textarea>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="entry-actions-full">
//                                 <button 
//                                     className="save-btn" 
//                                     onClick={handleSaveEntry}
//                                     disabled={submitting}
//                                 >
//                                     {submitting ? 'Saving...' : 'Save Entry'}
//                                 </button>
//                                 <button 
//                                     className="cancel-btn" 
//                                     onClick={handleCancelCreate}
//                                     disabled={submitting}
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 ) : (
//                     /* Normal two-column layout when not creating */
//                     <div className="journal-content">
//                         <div className="entries-list">
//                             {filteredEntries.map(entry => (
//                                 <div
//                                     key={entry.id}
//                                     className={`entry-card ${selectedEntry?.id === entry.id ? 'selected' : ''}`}
//                                     onClick={() => setSelectedEntry(entry)}
//                                 >
//                                     <div className="entry-header">
//                                         <h3>{entry.title}</h3>
//                                         <div className="entry-mood">
//                                             {getMoodEmoji(entry.mood)}
//                                         </div>
//                                     </div>
//                                     <p className="entry-preview">
//                                         {entry.content.length > 150 
//                                             ? entry.content.substring(0, 150) + '...' 
//                                             : entry.content
//                                         }
//                                     </p>
//                                     <div className="entry-meta">
//                                         <span className="entry-date">{formatDate(entry.date)}</span>
//                                         {entry.tags.length > 0 && (
//                                             <div className="entry-tags">
//                                                 {entry.tags.map(tag => (
//                                                     <span key={tag} className="tag-small">{tag}</span>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             ))}

//                             {filteredEntries.length === 0 && !loading ? (
//                                 <div className="empty-state">
//                                     <h3>No entries found</h3>
//                                     <p>
//                                         {searchTerm || filterMood !== 'all' 
//                                             ? 'Try adjusting your search or filter.'
//                                             : 'Start your journaling journey by creating your first entry!'
//                                         }
//                                     </p>

//                                 </div>
//                             ) : null}
//                         </div>

//                         {selectedEntry && (
//                             <div className="entry-detail">
//                                 <div className="detail-header">
//                                     <h2>{selectedEntry.title}</h2>
//                                     <div className="detail-mood">
//                                         {getMoodEmoji(selectedEntry.mood)}
//                                     </div>
//                                 </div>
//                                 <div className="detail-meta">
//                                     <span className="detail-date">{formatDate(selectedEntry.date)}</span>
//                                     {selectedEntry.tags.length > 0 && (
//                                         <div className="detail-tags">
//                                             {selectedEntry.tags.map(tag => (
//                                                 <span key={tag} className="tag">{tag}</span>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                                 <div className="detail-content">
//                                     <p>{selectedEntry.content}</p>
//                                 </div>
//                             </div>
//                         )}

//                         {!selectedEntry && (
//                             <div className="welcome-panel">
//                                 <h2>Welcome to your Journal</h2>
//                                 <p>Select an entry from the list to read it, or create a new entry to get started.</p>
//                                 <div className="welcome-stats">
//                                     <div className="stat">
//                                         <span className="stat-number">{entries.length}</span>
//                                         <span className="stat-label">Total Entries</span>
//                                     </div>
//                                     <div className="stat">
//                                         <span className="stat-number">
//                                             {new Set(entries.flatMap(e => e.tags)).size}
//                                         </span>
//                                         <span className="stat-label">Unique Tags</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Journal;

import './Journal.css';
import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';

const API_BASE_URL = 'http://localhost:8000/api';

const Journal = () => {
    const [entries, setEntries] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMood, setFilterMood] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ show: false, entry: null });
    const [deleting, setDeleting] = useState(false);

    const userId = 1;

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

    // Fetch journal entries from backend
    const fetchEntries = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/journals/${userId}`);
            if (response.ok) {
                const data = await response.json();
                const transformedEntries = data.map(entry => ({
                    id: entry.id,
                    title: entry.title,
                    content: entry.content,
                    mood: entry.mood,
                    tags: entry.tags || [],
                    date: entry.created_at.split('T')[0],
                    createdAt: entry.created_at
                }));
                setEntries(transformedEntries);
                setError(null);
            } else {
                setError('Failed to fetch journal entries');
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error('Error fetching entries:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const filteredEntries = entries.filter(entry => {
        const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            entry.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMood = filterMood === 'all' || entry.mood === filterMood;
        return matchesSearch && matchesMood;
    });

    const handleCreateEntry = () => {
        setIsCreating(true);
        setIsEditing(false);
        setSelectedEntry(null);
        setEditingEntry(null);
    };

    const handleEditEntry = (entry) => {
        setIsEditing(true);
        setIsCreating(false);
        setEditingEntry({
            ...entry,
            tags: [...entry.tags]
        });
        setSelectedEntry(null);
    };

    const handleSaveEntry = async () => {
        const entryData = isEditing ? editingEntry : newEntry;
        
        if (entryData.title.trim() && entryData.content.trim()) {
            try {
                setSubmitting(true);
                const url = isEditing 
                    ? `${API_BASE_URL}/journals/entry/${editingEntry.id}`
                    : `${API_BASE_URL}/journals/${userId}`;
                
                const method = isEditing ? 'PUT' : 'POST';
                
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: entryData.title.trim(),
                        content: entryData.content.trim(),
                        mood: entryData.mood,
                        tags: entryData.tags.filter(tag => tag.trim() !== '')
                    })
                });

                if (response.ok) {
                    const savedEntry = await response.json();
                    const transformedEntry = {
                        id: savedEntry.id,
                        title: savedEntry.title,
                        content: savedEntry.content,
                        mood: savedEntry.mood,
                        tags: savedEntry.tags || [],
                        date: savedEntry.created_at ? savedEntry.created_at.split('T')[0] : editingEntry.date,
                        createdAt: savedEntry.created_at || editingEntry.createdAt
                    };

                    if (isEditing) {
                        setEntries(entries.map(entry => 
                            entry.id === editingEntry.id ? transformedEntry : entry
                        ));
                        setSelectedEntry(transformedEntry);
                    } else {
                        setEntries([transformedEntry, ...entries]);
                    }

                    setNewEntry({ title: '', content: '', mood: 'neutral', tags: [] });
                    setEditingEntry(null);
                    setIsCreating(false);
                    setIsEditing(false);
                    setError(null);
                } else {
                    setError(`Failed to ${isEditing ? 'update' : 'save'} journal entry`);
                }
            } catch (err) {
                setError(`Error ${isEditing ? 'updating' : 'saving'} journal entry`);
                console.error(`Error ${isEditing ? 'updating' : 'saving'} entry:`, err);
            } finally {
                setSubmitting(false);
            }
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setIsCreating(false);
        setEditingEntry(null);
        setNewEntry({ title: '', content: '', mood: 'neutral', tags: [] });
    };

    const handleDeleteEntry = async (entryId) => {
        try {
            setDeleting(true);
            const response = await fetch(`${API_BASE_URL}/journals/entry/${entryId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setEntries(entries.filter(entry => entry.id !== entryId));
                if (selectedEntry?.id === entryId) {
                    setSelectedEntry(null);
                }
                setError(null);
                setDeleteModal({ show: false, entry: null });
            } else {
                setError('Failed to delete journal entry');
            }
        } catch (err) {
            setError('Error deleting journal entry');
            console.error('Error deleting entry:', err);
        } finally {
            setDeleting(false);
        }
    };

    const openDeleteModal = (entry) => {
        setDeleteModal({ show: true, entry });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ show: false, entry: null });
    };

    const confirmDelete = () => {
        if (deleteModal.entry) {
            handleDeleteEntry(deleteModal.entry.id);
        }
    };

    const handleTagInput = (e, isEditMode = false) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            e.preventDefault();
            const newTag = e.target.value.trim();
            
            if (isEditMode) {
                if (!editingEntry.tags.includes(newTag)) {
                    setEditingEntry({
                        ...editingEntry,
                        tags: [...editingEntry.tags, newTag]
                    });
                }
            } else {
                if (!newEntry.tags.includes(newTag)) {
                    setNewEntry({
                        ...newEntry,
                        tags: [...newEntry.tags, newTag]
                    });
                }
            }
            e.target.value = '';
        }
    };

    const removeTag = (tagToRemove, isEditMode = false) => {
        if (isEditMode) {
            setEditingEntry({
                ...editingEntry,
                tags: editingEntry.tags.filter(tag => tag !== tagToRemove)
            });
        } else {
            setNewEntry({
                ...newEntry,
                tags: newEntry.tags.filter(tag => tag !== tagToRemove)
            });
        }
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

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && deleteModal.show) {
                closeDeleteModal();
            }
        };
        
        if (deleteModal.show) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [deleteModal.show]);

    const getCurrentFormData = () => {
        return isEditing ? editingEntry : newEntry;
    };

    const updateCurrentFormData = (updates) => {
        if (isEditing) {
            setEditingEntry({ ...editingEntry, ...updates });
        } else {
            setNewEntry({ ...newEntry, ...updates });
        }
    };

    return (
        <div className="app-container-journal">
            <Sidebar />
            <div className="main-content-journal">
                {error && (
                    <div className="error-message">
                        <span>⚠️ {error}</span>
                        <button onClick={() => setError(null)}>×</button>
                    </div>
                )}

                {loading && (
                    <div className="loading-message">
                        <span>Loading journal entries...</span>
                    </div>
                )}

                <div className="journal-header">
                    <h1>My Journal</h1>
                    <button 
                        className="create-entry-btn" 
                        onClick={handleCreateEntry}
                        disabled={loading || submitting}
                    >
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

                {(isCreating || isEditing) ? (
                    <div className="full-width-create-form">
                        <div className="entry-form-full">
                            <div className="form-header">
                                <h2>{isEditing ? 'Edit Journal Entry' : 'Create New Entry'}</h2>
                            </div>
                            
                            <input
                                type="text"
                                placeholder="Entry title..."
                                value={getCurrentFormData()?.title || ''}
                                onChange={(e) => updateCurrentFormData({ title: e.target.value })}
                                className="entry-title-input-full"
                                disabled={submitting}
                            />
                            
                            <div className="form-content-grid">
                                <div className="form-left">
                                    <div className="mood-selector">
                                        <label>How are you feeling?</label>
                                        <div className="mood-options">
                                            {moods.map(mood => (
                                                <button
                                                    key={mood.value}
                                                    className={`mood-btn ${getCurrentFormData()?.mood === mood.value ? 'selected' : ''}`}
                                                    onClick={() => updateCurrentFormData({ mood: mood.value })}
                                                    title={mood.label}
                                                    disabled={submitting}
                                                >
                                                    {mood.emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="tags-section">
                                        <label>Tags (press Enter to add)</label>
                                        <input
                                            type="text"
                                            placeholder="Add a tag..."
                                            onKeyDown={(e) => handleTagInput(e, isEditing)}
                                            className="tag-input"
                                            disabled={submitting}
                                        />
                                        <div className="tags-display">
                                            {(getCurrentFormData()?.tags || []).map(tag => (
                                                <span key={tag} className="tag">
                                                    {tag}
                                                    <button 
                                                        onClick={() => removeTag(tag, isEditing)}
                                                        disabled={submitting}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-right">
                                    <div className="content-section">
                                        <label>What's on your mind today?</label>
                                        <textarea
                                            placeholder="Write your thoughts here..."
                                            value={getCurrentFormData()?.content || ''}
                                            onChange={(e) => updateCurrentFormData({ content: e.target.value })}
                                            className="entry-content-input-full"
                                            rows="12"
                                            disabled={submitting}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="entry-actions-full">
                                <button 
                                    className="save-btn" 
                                    onClick={handleSaveEntry}
                                    disabled={submitting}
                                >
                                    {submitting ? (isEditing ? 'Updating...' : 'Saving...') : (isEditing ? 'Update Entry' : 'Save Entry')}
                                </button>
                                <button 
                                    className="cancel-btn" 
                                    onClick={handleCancelEdit}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="journal-content">
                        <div className="entries-list">
                            {filteredEntries.map(entry => (
                                <div
                                    key={entry.id}
                                    className={`entry-card ${selectedEntry?.id === entry.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedEntry(entry)}
                                >
                                    <div className="entry-actions-overlay">
                                        <button
                                            className="edit-entry-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditEntry(entry);
                                            }}
                                            title="Edit this journal entry"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                            </svg>
                                        </button>
                                        <button
                                            className="delete-entry-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openDeleteModal(entry);
                                            }}
                                            title="Delete this journal entry"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="entry-card-content">
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
                                </div>
                            ))}

                            {filteredEntries.length === 0 && !loading ? (
                                <div className="empty-state">
                                    <h3>No entries found</h3>
                                    <p>
                                        {searchTerm || filterMood !== 'all' 
                                            ? 'Try adjusting your search or filter.'
                                            : 'Start your journaling journey by creating your first entry!'
                                        }
                                    </p>
                                </div>
                            ) : null}
                        </div>

                        {selectedEntry && (
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
                                <div className="detail-actions">
                                    <button
                                        className="edit-entry-btn-large"
                                        onClick={() => handleEditEntry(selectedEntry)}
                                        title="Edit this entry"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                        </svg>
                                        Edit Entry
                                    </button>
                                    <button
                                        className="delete-entry-btn-large"
                                        onClick={() => openDeleteModal(selectedEntry)}
                                        title="Delete this entry"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                        Delete Entry
                                    </button>
                                </div>
                            </div>
                        )}

                        {!selectedEntry && (
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
                )}

                {deleteModal.show && (
                    <div className="delete-modal-overlay" onClick={closeDeleteModal}>
                        <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="delete-modal-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            
                            <div className="delete-modal-content">
                                <h3>Delete Journal Entry</h3>
                                <p>Are you sure you want to delete <strong>"{deleteModal.entry?.title}"</strong>?</p>
                                <p className="delete-warning">This action cannot be undone. Your journal entry will be permanently removed.</p>
                                
                                {deleteModal.entry && (
                                    <div className="entry-preview-modal">
                                        <div className="preview-header">
                                            <span className="preview-mood">{getMoodEmoji(deleteModal.entry.mood)}</span>
                                            <span className="preview-date">{formatDate(deleteModal.entry.date)}</span>
                                        </div>
                                        <div className="preview-content">
                                            {deleteModal.entry.content.length > 100 
                                                ? deleteModal.entry.content.substring(0, 100) + '...' 
                                                : deleteModal.entry.content
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="delete-modal-actions">
                                <button 
                                    className="modal-cancel-btn" 
                                    onClick={closeDeleteModal}
                                    disabled={deleting}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="modal-delete-btn" 
                                    onClick={confirmDelete}
                                    disabled={deleting}
                                >
                                    {deleting ? (
                                        <>
                                            <span className="loading-spinner"></span>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                                            Delete Entry
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Journal;