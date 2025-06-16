// import './Notes.css';
// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { FaTrash, FaSave, FaSearch, FaPlus, FaClock, FaFileAlt, FaEye, FaCode } from 'react-icons/fa';
// import Sidebar from '../sidebar/Sidebar';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import rehypeRaw from 'rehype-raw';
// import ErrorBoundary from '../ErrorBoundary';
// import remarkHighlight from '../remarkHighlight';

// const Notes = () => {
//   const [notes, setNotes] = useState([
//     {
//       id: 1,
//       title: 'Welcome to Enhanced Notes',
//       content: `# Welcome to Your Enhanced Notes App! 🎉

// This is a powerful markdown editor with live preview and improved design.

// ## New Features
// - **Modern UI/UX** - Beautiful glassmorphism design with smooth animations
// - **Real-time preview** - See your markdown rendered instantly
// - **Enhanced search** - Find notes quickly with improved search functionality
// - **Auto-save** - Your work is automatically saved as you type
// - **Responsive design** - Works perfectly on all devices
// - **Better typography** - Using Inter font for better readability

// ## Getting Started
// 1. Click the **+ New Note** button to create a note
// 2. Edit the title by clicking on it
// 3. Write in markdown in the left panel
// 4. See the preview in the right panel

// ### Markdown Examples

// **Bold text** and *italic text*

// > This is a blockquote with some important information

// \`\`\`javascript
// // Code blocks are fully supported with syntax highlighting
// function hello() {
//   console.log('Hello, World!');
// }
// \`\`\`

// - [x] Task lists work too
// - [ ] Unchecked item
// - [ ] Another item

// ### Tables

// | Feature | Status | Priority |
// |---------|--------|----------|
// | Dark theme | ✅ | High |
// | Auto-save | ✅ | High |
// | Export | 🔄 | Medium |

// Enjoy taking notes with the enhanced experience! ✨`,
//       preview: 'Welcome to your enhanced notes app with modern design and improved functionality...',
//       lastModified: new Date(),
//       isNew: false
//     },
//     {
//       id: 2,
//       title: 'Meeting Notes - Project Alpha',
//       content: `# Team Meeting - Project Alpha

// **Date:** ${new Date().toLocaleDateString()}
// **Attendees:** Development Team

// ## Agenda
// 1. Project status update
// 2. Upcoming milestones
// 3. Resource allocation
// 4. UI/UX improvements
// 5. Next steps

// ## Discussion Points

// ### UI/UX Enhancements
// - Implemented new glassmorphism design
// - Added smooth animations and transitions
// - Improved color scheme for better accessibility
// - Enhanced typography with Inter font

// ### Technical Updates
// - React hooks optimization
// - Better state management
// - Improved performance
// - Mobile responsiveness

// ## Action Items
// - [x] Complete new design implementation
// - [ ] Add export functionality
// - [ ] Implement backend integration
// - [ ] User testing and feedback
// - [ ] Performance optimization

// ## Notes
// The new design is a significant improvement over the previous version. The glassmorphism effects and modern styling make the app feel more premium and user-friendly.

// ### Next Meeting
// Schedule for next Friday to review progress and plan next sprint.`,
//       preview: 'Team meeting notes for Project Alpha with agenda, discussion points, and action items...',
//       lastModified: new Date(Date.now() - 86400000),
//       isNew: false
//     },
//     {
//       id: 3,
//       title: 'Quick Ideas',
//       content: `# Quick Ideas & Thoughts 💡

// ## App Improvements
// - Add dark/light theme toggle
// - Implement note categories/tags
// - Add note export (PDF, HTML)
// - Implement note sharing
// - Add search filters

// ## Design Ideas
// - Floating action buttons
// - Sidebar collapse/expand
// - Note templates
// - Rich text editor option
// - Drag & drop file uploads

// ## Technical Considerations
// - Offline support
// - Sync across devices
// - Backup & restore
// - Keyboard shortcuts
// - Plugin system

// ## Random Thoughts
// Sometimes the best ideas come when you least expect them. This notes app is becoming something really special! 🚀`,
//       preview: 'Collection of ideas for app improvements, design changes, and technical considerations...',
//       lastModified: new Date(Date.now() - 172800000),
//       isNew: false
//     }
//   ]);

//   const [selectedNote, setSelectedNote] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentTitle, setCurrentTitle] = useState('');
//   const [currentContent, setCurrentContent] = useState('');
//   const [viewMode, setViewMode] = useState('split'); // 'split', 'edit', 'preview'
//   const [isSaving, setIsSaving] = useState(false);
//   const [resetKey, setResetKey] = useState(0);

//   const titleRef = useRef(null);
//   const contentRef = useRef(null);

//   // Auto-save functionality
//   const saveNote = useCallback(async () => {
//     if (!selectedNote) return;

//     setIsSaving(true);
    
//     // Simulate API call delay
//     await new Promise(resolve => setTimeout(resolve, 500));

//     const updatedNote = {
//       ...selectedNote,
//       title: currentTitle || 'Untitled Note',
//       content: currentContent,
//       preview: currentContent.slice(0, 150).replace(/[#*`]/g, '') + '...',
//       lastModified: new Date(),
//       isNew: false
//     };

//     setNotes(prev => prev.map(note => 
//       note.id === selectedNote.id ? updatedNote : note
//     ));
    
//     setSelectedNote(updatedNote);
//     setIsSaving(false);
//   }, [selectedNote, currentTitle, currentContent]);

//   const selectNote = useCallback((note) => {
//     setSelectedNote(note);
//     setCurrentTitle(note.title);
//     setCurrentContent(note.content);
//     setResetKey(prev => prev + 1);
//   }, []);

//   const createNewNote = useCallback(() => {
//     const newNote = {
//       id: Date.now(),
//       title: 'Untitled Note',
//       content: '',
//       preview: '',
//       lastModified: new Date(),
//       isNew: true
//     };
    
//     setNotes(prev => [newNote, ...prev]);
//     selectNote(newNote);
    
//     // Focus title after a short delay
//     setTimeout(() => {
//       if (titleRef.current) {
//         titleRef.current.focus();
//         titleRef.current.select();
//       }
//     }, 100);
//   }, [selectNote]);

//   // Initialize with first note
//   useEffect(() => {
//     if (notes.length > 0 && !selectedNote) {
//       selectNote(notes[0]);
//     }
//   }, [notes, selectedNote, selectNote]);

//   // Auto-save when content changes
//   useEffect(() => {
//     if (selectedNote && (currentTitle !== selectedNote.title || currentContent !== selectedNote.content)) {
//       const timeoutId = setTimeout(() => {
//         saveNote();
//       }, 1500); // Auto-save after 1.5 seconds of inactivity

//       return () => clearTimeout(timeoutId);
//     }
//   }, [currentTitle, currentContent, selectedNote, saveNote]);

//   const handleContentChange = useCallback((e) => {
//     setCurrentContent(e.target.value);
//     setResetKey(prev => prev + 1);
//   }, []);

//   const handleTitleChange = useCallback((e) => {
//     setCurrentTitle(e.target.value);
//   }, []);

//   const deleteNote = useCallback(() => {
//     if (!selectedNote || notes.length <= 1) return;
    
//     const confirmed = window.confirm('Are you sure you want to delete this note?');
//     if (!confirmed) return;

//     const noteIndex = notes.findIndex(note => note.id === selectedNote.id);
//     const newNotes = notes.filter(note => note.id !== selectedNote.id);
//     setNotes(newNotes);
    
//     // Select the next note or previous one
//     const nextNote = newNotes[noteIndex] || newNotes[noteIndex - 1] || newNotes[0];
//     if (nextNote) {
//       selectNote(nextNote);
//     } else {
//       setSelectedNote(null);
//       setCurrentTitle('');
//       setCurrentContent('');
//     }
//   }, [selectedNote, notes, selectNote]);

//   const filteredNotes = notes.filter(note => 
//     note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     note.content.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const formatDate = (date) => {
//     const now = new Date();
//     const diffTime = Math.abs(now - date);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     if (diffDays === 1) return 'Today';
//     if (diffDays === 2) return 'Yesterday';
//     if (diffDays <= 7) return `${diffDays - 1} days ago`;
//     return date.toLocaleDateString();
//   };

//   const getWordCount = (text) => {
//     return text.trim().split(/\s+/).filter(word => word.length > 0).length;
//   };

//   return (
//     <div className="app-container-notes">
//       <Sidebar />
      
//       <div className="main-content-notes">
//         {/* Left Pane - Notes List */}
//         <div className="left-pane">
//           <div className="sidebar-header">
//             <div className="sidebar-title">
//               <FaFileAlt />
//               Notes
//             </div>
            
//             <div className="search-and-button">
//               <div className="search-container">
//                 <FaSearch className="search-icon" />
//                 <input
//                   type="text"
//                   className="notes-search"
//                   placeholder="Search notes..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
              
//               <button className="new-note-btn" onClick={createNewNote}>
//                 <FaPlus />
//                 New Note
//               </button>
//             </div>
//           </div>

//           <div className="top-divider"></div>
          
//           <div className="title-section">
//             <div className="title-label">Recent Notes</div>
//             <div className="title-content">
//               {filteredNotes.map((note) => (
//                 <div
//                   key={note.id}
//                   className={`note-item fade-in ${selectedNote?.id === note.id ? 'active' : ''}`}
//                   onClick={() => selectNote(note)}
//                 >
//                   <div className="note-title">{note.title}</div>
//                   <div className="note-preview">{note.preview}</div>
//                   <div className="note-date">
//                     <FaClock />
//                     {formatDate(note.lastModified)}
//                   </div>
//                 </div>
//               ))}
              
//               {filteredNotes.length === 0 && (
//                 <div className="empty-state">
//                   <FaSearch className="empty-state-icon" />
//                   <h3>No notes found</h3>
//                   <p>Try adjusting your search terms</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="divider-line"></div>

//         {/* Right Pane - Editor */}
//         <div className="right-pane">
//           {selectedNote ? (
//             <>
//               <div className="top-bar">
//                 <input
//                   ref={titleRef}
//                   type="text"
//                   className="title-input"
//                   value={currentTitle}
//                   onChange={handleTitleChange}
//                   placeholder="Untitled Note"
//                 />
                
//                 <div className="top-buttons">
//                   <button 
//                     className="new-save-btn" 
//                     onClick={saveNote}
//                     disabled={isSaving}
//                     title="Save Note"
//                     aria-label="Save"
//                   >
//                     {isSaving ? <div className="loading" /> : <FaSave size={16} />}
//                   </button>
//                   <button 
//                     className="delete-btn" 
//                     onClick={deleteNote}
//                     disabled={notes.length <= 1}
//                     title="Delete note"
//                     aria-label="Delete"
//                   >
//                     <FaTrash size={16} />
//                   </button>
//                 </div>
//               </div>
              
//               <div className="editor-meta">
//                 <div className="meta-item">
//                   <FaClock />
//                   Last modified: {formatDate(selectedNote.lastModified)}
//                 </div>
//                 <div className="meta-item">
//                   <FaFileAlt />
//                   {getWordCount(currentContent)} words
//                 </div>
//                 <div className="meta-item">
//                   Status: {isSaving ? 'Saving...' : 'Saved'}
//                 </div>
//               </div>

//               <div className="markdown-container">
//                 {(viewMode === 'split' || viewMode === 'edit') && (
//                   <div className="editor-section">
//                     <div className="section-header">
//                       Editor
//                       <div className="view-toggle">
//                         <button 
//                           className={`toggle-btn ${viewMode === 'edit' ? 'active' : ''}`}
//                           onClick={() => setViewMode('edit')}
//                           title="Editor only"
//                         >
//                           <FaCode />
//                         </button>
//                         <button 
//                           className={`toggle-btn ${viewMode === 'split' ? 'active' : ''}`}
//                           onClick={() => setViewMode('split')}
//                           title="Split view"
//                         >
//                           Split
//                         </button>
//                         <button 
//                           className={`toggle-btn ${viewMode === 'preview' ? 'active' : ''}`}
//                           onClick={() => setViewMode('preview')}
//                           title="Preview only"
//                         >
//                           <FaEye />
//                         </button>
//                       </div>
//                     </div>
//                     <textarea
//                       ref={contentRef}
//                       className="markdown-input"
//                       value={currentContent}
//                       onChange={handleContentChange}
//                       placeholder="Start writing in Markdown..."
//                       spellCheck="false"
//                     />
//                   </div>
//                 )}

//                 {(viewMode === 'split' || viewMode === 'preview') && (
//                   <div className="preview-sections">
//                     <div className="section-header">
//                       Preview
//                       <div className="view-toggle">
//                         <button 
//                           className={`toggle-btn ${viewMode === 'edit' ? 'active' : ''}`}
//                           onClick={() => setViewMode('edit')}
//                           title="Editor only"
//                         >
//                           <FaCode />
//                         </button>
//                         <button 
//                           className={`toggle-btn ${viewMode === 'split' ? 'active' : ''}`}
//                           onClick={() => setViewMode('split')}
//                           title="Split view"
//                         >
//                           Split
//                         </button>
//                         <button 
//                           className={`toggle-btn ${viewMode === 'preview' ? 'active' : ''}`}
//                           onClick={() => setViewMode('preview')}
//                           title="Preview only"
//                         >
//                           <FaEye />
//                         </button>
//                       </div>
//                     </div>
//                     <div className="markdown-preview">
//                       <ErrorBoundary resetKey={resetKey}>
//                         <ReactMarkdown 
//                           remarkPlugins={[remarkGfm, remarkHighlight]} 
//                           rehypePlugins={[rehypeRaw]}
//                           components={{
//                             p: ({ node, ...props }) => (
//                               <p style={{ whiteSpace: 'pre-wrap' }} {...props} />
//                             ),
//                           }}
//                         >
//                           {currentContent || '*Start writing to see preview...*'}
//                         </ReactMarkdown>
//                       </ErrorBoundary>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </>
//           ) : (
//             <div className="empty-state">
//               <FaFileAlt className="empty-state-icon" />
//               <h3>Select a note to get started</h3>
//               <p>Choose a note from the sidebar or create a new one</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Notes;


// import './Notes.css';
// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { FaTrash, FaSave, FaSearch, FaPlus, FaClock, FaFileAlt, FaEye, FaCode } from 'react-icons/fa';
// import Sidebar from '../sidebar/Sidebar';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import rehypeRaw from 'rehype-raw';
// import ErrorBoundary from '../ErrorBoundary';
// import remarkHighlight from '../remarkHighlight';

// // API configuration
// const API_BASE_URL = 'http://localhost:8000/api';

// // For demo purposes, using user_id = 1. In production, get this from auth context
// const CURRENT_USER_ID = 1;

// const Notes = () => {
//   const [notes, setNotes] = useState([]);
//   const [selectedNote, setSelectedNote] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentTitle, setCurrentTitle] = useState('');
//   const [currentContent, setCurrentContent] = useState('');
//   const [viewMode, setViewMode] = useState('split');
//   const [isSaving, setIsSaving] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [resetKey, setResetKey] = useState(0);

//   const titleRef = useRef(null);
//   const contentRef = useRef(null);

//   // API functions
//   const fetchNotes = async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch(`${API_BASE_URL}/notes/${CURRENT_USER_ID}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch notes');
//       }
//       const data = await response.json();
//       setNotes(data);
//       setError(null);
//     } catch (err) {
//       setError('Failed to load notes. Please try again.');
//       console.error('Error fetching notes:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const createNoteAPI = async (noteData) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/notes/${CURRENT_USER_ID}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(noteData),
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to create note');
//       }
      
//       return await response.json();
//     } catch (err) {
//       console.error('Error creating note:', err);
//       throw err;
//     }
//   };

//   const updateNoteAPI = async (noteId, noteData) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(noteData),
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to update note');
//       }
      
//       return await response.json();
//     } catch (err) {
//       console.error('Error updating note:', err);
//       throw err;
//     }
//   };

//   const deleteNoteAPI = async (noteId) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
//         method: 'DELETE',
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to delete note');
//       }
      
//       return await response.json();
//     } catch (err) {
//       console.error('Error deleting note:', err);
//       throw err;
//     }
//   };

//   // Auto-save functionality
//   const saveNote = useCallback(async () => {
//     if (!selectedNote) return;

//     setIsSaving(true);
    
//     try {
//       const noteData = {
//         title: currentTitle || 'Untitled Note',
//         content: currentContent,
//       };

//       const updatedNote = await updateNoteAPI(selectedNote.id, noteData);
      
//       setNotes(prev => prev.map(note => 
//         note.id === selectedNote.id ? updatedNote : note
//       ));
      
//       setSelectedNote(updatedNote);
//       setError(null);
//     } catch (err) {
//       setError('Failed to save note. Please try again.');
//     } finally {
//       setIsSaving(false);
//     }
//   }, [selectedNote, currentTitle, currentContent]);

//   const selectNote = useCallback((note) => {
//     setSelectedNote(note);
//     setCurrentTitle(note.title);
//     setCurrentContent(note.content);
//     setResetKey(prev => prev + 1);
//   }, []);

//   const createNewNote = useCallback(async () => {
//     try {
//       setIsSaving(true);
//       const newNoteData = {
//         title: 'Untitled Note',
//         content: '',
//       };
      
//       const newNote = await createNoteAPI(newNoteData);
//       setNotes(prev => [newNote, ...prev]);
//       selectNote(newNote);
      
//       // Focus title after a short delay
//       setTimeout(() => {
//         if (titleRef.current) {
//           titleRef.current.focus();
//           titleRef.current.select();
//         }
//       }, 100);
      
//       setError(null);
//     } catch (err) {
//       setError('Failed to create note. Please try again.');
//     } finally {
//       setIsSaving(false);
//     }
//   }, [selectNote]);

//   // Load notes on component mount
//   useEffect(() => {
//     fetchNotes();
//   }, []);

//   // Initialize with first note
//   useEffect(() => {
//     if (notes.length > 0 && !selectedNote) {
//       selectNote(notes[0]);
//     }
//   }, [notes, selectedNote, selectNote]);

//   // Auto-save when content changes
//   useEffect(() => {
//     if (selectedNote && (currentTitle !== selectedNote.title || currentContent !== selectedNote.content)) {
//       const timeoutId = setTimeout(() => {
//         saveNote();
//       }, 1500); // Auto-save after 1.5 seconds of inactivity

//       return () => clearTimeout(timeoutId);
//     }
//   }, [currentTitle, currentContent, selectedNote, saveNote]);

//   const handleContentChange = useCallback((e) => {
//     setCurrentContent(e.target.value);
//     setResetKey(prev => prev + 1);
//   }, []);

//   const handleTitleChange = useCallback((e) => {
//     setCurrentTitle(e.target.value);
//   }, []);

//   const deleteNote = useCallback(async () => {
//     if (!selectedNote || notes.length <= 1) return;
    
//     const confirmed = window.confirm('Are you sure you want to delete this note?');
//     if (!confirmed) return;

//     try {
//       await deleteNoteAPI(selectedNote.id);
      
//       const noteIndex = notes.findIndex(note => note.id === selectedNote.id);
//       const newNotes = notes.filter(note => note.id !== selectedNote.id);
//       setNotes(newNotes);
      
//       // Select the next note or previous one
//       const nextNote = newNotes[noteIndex] || newNotes[noteIndex - 1] || newNotes[0];
//       if (nextNote) {
//         selectNote(nextNote);
//       } else {
//         setSelectedNote(null);
//         setCurrentTitle('');
//         setCurrentContent('');
//       }
      
//       setError(null);
//     } catch (err) {
//       setError('Failed to delete note. Please try again.');
//     }
//   }, [selectedNote, notes, selectNote]);

//   const filteredNotes = notes.filter(note => 
//     note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     note.content.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now - date);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     if (diffDays === 1) return 'Today';
//     if (diffDays === 2) return 'Yesterday';
//     if (diffDays <= 7) return `${diffDays - 1} days ago`;
//     return date.toLocaleDateString();
//   };

//   const getWordCount = (text) => {
//     return text.trim().split(/\s+/).filter(word => word.length > 0).length;
//   };

//   if (isLoading) {
//     return (
//       <div className="app-container-notes">
//         <Sidebar />
//         <div className="main-content-notes">
//           <div className="empty-state">
//             <div className="loading" />
//             <h3>Loading notes...</h3>
//             <p>Please wait while we fetch your notes</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="app-container-notes">
//       <Sidebar />
      
//       <div className="main-content-notes">
//         {/* Error banner */}
//         {error && (
//           <div style={{
//             background: '#EF4444',
//             color: 'white',
//             padding: '12px 20px',
//             textAlign: 'center',
//             fontSize: '14px',
//             fontWeight: '500'
//           }}>
//             {error}
//             <button 
//               onClick={() => setError(null)}
//               style={{
//                 background: 'transparent',
//                 border: 'none',
//                 color: 'white',
//                 marginLeft: '12px',
//                 cursor: 'pointer',
//                 fontSize: '16px'
//               }}
//             >
//               ×
//             </button>
//           </div>
//         )}

//         {/* Left Pane - Notes List */}
//         <div className="left-pane">
//           <div className="sidebar-header">
//             <div className="sidebar-title">
//               <FaFileAlt />
//               Notes
//             </div>
            
//             <div className="search-and-button">
//               <div className="search-container">
//                 <FaSearch className="search-icon" />
//                 <input
//                   type="text"
//                   className="notes-search"
//                   placeholder="Search notes..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
              
//               <button className="new-note-btn" onClick={createNewNote} disabled={isSaving}>
//                 <FaPlus />
//                 New Note
//               </button>
//             </div>
//           </div>

//           <div className="top-divider"></div>
          
//           <div className="title-section">
//             <div className="title-label">Recent Notes</div>
//             <div className="title-content">
//               {filteredNotes.map((note) => (
//                 <div
//                   key={note.id}
//                   className={`note-item fade-in ${selectedNote?.id === note.id ? 'active' : ''}`}
//                   onClick={() => selectNote(note)}
//                 >
//                   <div className="note-title">{note.title}</div>
//                   <div className="note-preview">{note.preview || 'No preview available'}</div>
//                   <div className="note-date">
//                     <FaClock />
//                     {formatDate(note.last_modified)}
//                   </div>
//                 </div>
//               ))}
              
//               {filteredNotes.length === 0 && !isLoading && (
//                 <div className="empty-state">
//                   <FaSearch className="empty-state-icon" />
//                   <h3>No notes found</h3>
//                   <p>Try adjusting your search terms or create a new note</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="divider-line"></div>

//         {/* Right Pane - Editor */}
//         <div className="right-pane">
//           {selectedNote ? (
//             <>
//               <div className="top-bar">
//                 <input
//                   ref={titleRef}
//                   type="text"
//                   className="title-input"
//                   value={currentTitle}
//                   onChange={handleTitleChange}
//                   placeholder="Untitled Note"
//                 />
                
//                 <div className="top-buttons">
//                   <button 
//                     className="new-save-btn" 
//                     onClick={saveNote}
//                     disabled={isSaving}
//                     title="Save Note"
//                     aria-label="Save"
//                   >
//                     {isSaving ? <div className="loading" /> : <FaSave size={16} />}
//                   </button>
//                   <button 
//                     className="delete-btn" 
//                     onClick={deleteNote}
//                     disabled={notes.length <= 1 || isSaving}
//                     title="Delete note"
//                     aria-label="Delete"
//                   >
//                     <FaTrash size={16} />
//                   </button>
//                 </div>
//               </div>
              
//               <div className="editor-meta">
//                 <div className="meta-item">
//                   <FaClock />
//                   Last modified: {formatDate(selectedNote.last_modified)}
//                 </div>
//                 <div className="meta-item">
//                   <FaFileAlt />
//                   {getWordCount(currentContent)} words
//                 </div>
//                 <div className="meta-item">
//                   Status: {isSaving ? 'Saving...' : 'Saved'}
//                 </div>
//               </div>

//               <div className="markdown-container">
//                 {(viewMode === 'split' || viewMode === 'edit') && (
//                   <div className="editor-section">
//                     <div className="section-header">
//                       Editor
//                       <div className="view-toggle">
//                         <button 
//                           className={`toggle-btn ${viewMode === 'edit' ? 'active' : ''}`}
//                           onClick={() => setViewMode('edit')}
//                           title="Editor only"
//                         >
//                           <FaCode />
//                         </button>
//                         <button 
//                           className={`toggle-btn ${viewMode === 'split' ? 'active' : ''}`}
//                           onClick={() => setViewMode('split')}
//                           title="Split view"
//                         >
//                           Split
//                         </button>
//                         <button 
//                           className={`toggle-btn ${viewMode === 'preview' ? 'active' : ''}`}
//                           onClick={() => setViewMode('preview')}
//                           title="Preview only"
//                         >
//                           <FaEye />
//                         </button>
//                       </div>
//                     </div>
//                     <textarea
//                       ref={contentRef}
//                       className="markdown-input"
//                       value={currentContent}
//                       onChange={handleContentChange}
//                       placeholder="Start writing in Markdown..."
//                       spellCheck="false"
//                     />
//                   </div>
//                 )}

//                 {(viewMode === 'split' || viewMode === 'preview') && (
//                   <div className="preview-sections">
//                     <div className="section-header">
//                       Preview
//                       <div className="view-toggle">
//                         <button 
//                           className={`toggle-btn ${viewMode === 'edit' ? 'active' : ''}`}
//                           onClick={() => setViewMode('edit')}
//                           title="Editor only"
//                         >
//                           <FaCode />
//                         </button>
//                         <button 
//                           className={`toggle-btn ${viewMode === 'split' ? 'active' : ''}`}
//                           onClick={() => setViewMode('split')}
//                           title="Split view"
//                         >
//                           Split
//                         </button>
//                         <button 
//                           className={`toggle-btn ${viewMode === 'preview' ? 'active' : ''}`}
//                           onClick={() => setViewMode('preview')}
//                           title="Preview only"
//                         >
//                           <FaEye />
//                         </button>
//                       </div>
//                     </div>
//                     <div className="markdown-preview">
//                       <ErrorBoundary resetKey={resetKey}>
//                         <ReactMarkdown 
//                           remarkPlugins={[remarkGfm, remarkHighlight]} 
//                           rehypePlugins={[rehypeRaw]}
//                           components={{
//                             p: ({ node, ...props }) => (
//                               <p style={{ whiteSpace: 'pre-wrap' }} {...props} />
//                             ),
//                           }}
//                         >
//                           {currentContent || '*Start writing to see preview...*'}
//                         </ReactMarkdown>
//                       </ErrorBoundary>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </>
//           ) : (
//             <div className="empty-state">
//               <FaFileAlt className="empty-state-icon" />
//               <h3>Select a note to get started</h3>
//               <p>Choose a note from the sidebar or create a new one</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Notes;

// import './Notes.css';
// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { FaTrash, FaSave, FaSearch, FaPlus, FaClock, FaFileAlt, FaEye, FaCode } from 'react-icons/fa';
// import Sidebar from '../sidebar/Sidebar';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import rehypeRaw from 'rehype-raw';
// import ErrorBoundary from '../ErrorBoundary';
// import remarkHighlight from '../remarkHighlight';

// // API configuration
// const API_BASE_URL = 'http://localhost:8000/api';

// // For demo purposes, using user_id = 1. In production, get this from auth context
// const CURRENT_USER_ID = 1;

// const Notes = () => {
//   const [notes, setNotes] = useState([]);
//   const [selectedNote, setSelectedNote] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentTitle, setCurrentTitle] = useState('');
//   const [currentContent, setCurrentContent] = useState('');
//   const [viewMode, setViewMode] = useState('split');
//   const [isSaving, setIsSaving] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const titleRef = useRef(null);
//   const contentRef = useRef(null);

//   // API functions
//   const fetchNotes = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch(`${API_BASE_URL}/notes/${CURRENT_USER_ID}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch notes');
//       }
//       const data = await response.json();
//       setNotes(data);
//       setError(null);
//     } catch (err) {
//       setError('Failed to load notes. Please try again.');
//       console.error('Error fetching notes:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const createNoteAPI = useCallback(async (noteData) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/notes/${CURRENT_USER_ID}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(noteData),
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to create note');
//       }
      
//       return await response.json();
//     } catch (err) {
//       console.error('Error creating note:', err);
//       throw err;
//     }
//   }, []);

//   const updateNoteAPI = useCallback(async (noteId, noteData) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(noteData),
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to update note');
//       }
      
//       return await response.json();
//     } catch (err) {
//       console.error('Error updating note:', err);
//       throw err;
//     }
//   }, []);

//   const deleteNoteAPI = useCallback(async (noteId) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
//         method: 'DELETE',
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to delete note');
//       }
      
//       return await response.json();
//     } catch (err) {
//       console.error('Error deleting note:', err);
//       throw err;
//     }
//   }, []);

//   // Auto-save functionality
//   const saveNote = useCallback(async () => {
//     if (!selectedNote) return;

//     setIsSaving(true);
    
//     try {
//       const noteData = {
//         title: currentTitle || 'Untitled Note',
//         content: currentContent,
//       };

//       const updatedNote = await updateNoteAPI(selectedNote.id, noteData);
      
//       setNotes(prev => prev.map(note => 
//         note.id === selectedNote.id ? updatedNote : note
//       ));
      
//       setSelectedNote(updatedNote);
//       setError(null);
//     } catch (err) {
//       setError('Failed to save note. Please try again.');
//     } finally {
//       setIsSaving(false);
//     }
//   }, [selectedNote, currentTitle, currentContent, updateNoteAPI]);

//   const selectNote = useCallback((note) => {
//     if (!note) return;
    
//     console.log('Selecting note:', note.title); // Debug log
    
//     setSelectedNote(note);
//     setCurrentTitle(note.title || '');
//     setCurrentContent(note.content || '');
//   }, []);

//   const createNewNote = useCallback(async () => {
//     try {
//       setIsSaving(true);
//       const newNoteData = {
//         title: 'Untitled Note',
//         content: '',
//       };
      
//       const newNote = await createNoteAPI(newNoteData);
//       setNotes(prev => [newNote, ...prev]);
      
//       // Properly set the current state to match the new note
//       setCurrentTitle(newNote.title);
//       setCurrentContent(newNote.content);
//       setSelectedNote(newNote);
      
//       // Focus title after a short delay
//       setTimeout(() => {
//         if (titleRef.current) {
//           titleRef.current.focus();
//           titleRef.current.select();
//         }
//       }, 200);
      
//       setError(null);
//     } catch (err) {
//       setError('Failed to create note. Please try again.');
//     } finally {
//       setIsSaving(false);
//     }
//   }, [createNoteAPI]);

//   // Load notes on component mount
//   useEffect(() => {
//     fetchNotes();
//   }, [fetchNotes]);

//   // Initialize with first note (but ensure state is properly set)
//   useEffect(() => {
//     if (notes.length > 0 && !selectedNote) {
//       const firstNote = notes[0];
//       selectNote(firstNote);
//     }
//   }, [notes, selectedNote, selectNote]);

//   // Auto-save when content changes (with longer delay to avoid conflicts)
//   useEffect(() => {
//     if (selectedNote && (currentTitle !== selectedNote.title || currentContent !== selectedNote.content)) {
//       const timeoutId = setTimeout(() => {
//         saveNote();
//       }, 3000); // Increased to 3 seconds to avoid interference

//       return () => clearTimeout(timeoutId);
//     }
//   }, [currentTitle, currentContent, selectedNote, saveNote]);

//   const handleTitleChange = useCallback((e) => {
//     console.log('Title changing to:', e.target.value); // Debug log
//     const newTitle = e.target.value;
//     setCurrentTitle(newTitle);
//   }, []);

//   const handleContentChange = useCallback((e) => {
//     console.log('Content changing, length:', e.target.value.length); // Debug log
//     const newContent = e.target.value;
//     setCurrentContent(newContent);
//   }, []);

//   const deleteNote = useCallback(async () => {
//     if (!selectedNote) return;
    
//     const confirmed = window.confirm('Are you sure you want to delete this note?');
//     if (!confirmed) return;

//     try {
//       // Delete the note from backend
//       await deleteNoteAPI(selectedNote.id);
      
//       // Update notes list
//       const newNotes = notes.filter(note => note.id !== selectedNote.id);
//       setNotes(newNotes);
      
//       // Handle what to select next
//       if (newNotes.length === 0) {
//         // Create welcome note if no notes left
//         const newNoteData = {
//           title: 'Welcome to Notes',
//           content: '# Welcome! 👋\n\nStart writing your thoughts here...\n\nThis note was created automatically when you deleted your last note.',
//         };
        
//         const newNote = await createNoteAPI(newNoteData);
//         setNotes([newNote]);
        
//         // Use selectNote to properly set everything
//         selectNote(newNote);
        
//       } else {
//         // Select next available note
//         const currentIndex = notes.findIndex(note => note.id === selectedNote.id);
//         const nextNote = newNotes[currentIndex] || newNotes[currentIndex - 1] || newNotes[0];
        
//         // Use selectNote to properly set everything
//         selectNote(nextNote);
//       }
      
//       setError(null);
      
//     } catch (err) {
//       setError('Failed to delete note. Please try again.');
//       console.error('Delete error:', err);
//     }
//   }, [selectedNote, notes, createNoteAPI, deleteNoteAPI, selectNote]);

//   const filteredNotes = notes.filter(note => 
//     note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     note.content.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now - date);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     if (diffDays === 1) return 'Today';
//     if (diffDays === 2) return 'Yesterday';
//     if (diffDays <= 7) return `${diffDays - 1} days ago`;
//     return date.toLocaleDateString();
//   };

//   const getWordCount = (text) => {
//     return text.trim().split(/\s+/).filter(word => word.length > 0).length;
//   };

//   if (isLoading) {
//     return (
//       <div className="app-container-notes">
//         <Sidebar />
//         <div className="main-content-notes">
//           <div className="empty-state">
//             <div className="loading" />
//             <h3>Loading notes...</h3>
//             <p>Please wait while we fetch your notes</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="app-container-notes">
//       <Sidebar />
      
//       <div className="main-content-notes">
//         {/* Error banner */}
//         {error && (
//           <div style={{
//             background: '#EF4444',
//             color: 'white',
//             padding: '12px 20px',
//             textAlign: 'center',
//             fontSize: '14px',
//             fontWeight: '500'
//           }}>
//             {error}
//             <button 
//               onClick={() => setError(null)}
//               style={{
//                 background: 'transparent',
//                 border: 'none',
//                 color: 'white',
//                 marginLeft: '12px',
//                 cursor: 'pointer',
//                 fontSize: '16px'
//               }}
//             >
//               ×
//             </button>
//           </div>
//         )}

//         {/* Left Pane - Notes List */}
//         <div className="left-pane">
//           <div className="sidebar-header">
//             <div className="sidebar-title">
//               <FaFileAlt />
//               Notes
//             </div>
            
//             <div className="search-and-button">
//               <div className="search-container">
//                 <FaSearch className="search-icon" />
//                 <input
//                   type="text"
//                   className="notes-search"
//                   placeholder="Search notes..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
              
//               <button className="new-note-btn" onClick={createNewNote} disabled={isSaving}>
//                 <FaPlus />
//                 New Note
//               </button>
//             </div>
//           </div>

//           <div className="top-divider"></div>
          
//           <div className="title-section">
//             <div className="title-label">Recent Notes</div>
//             <div className="title-content">
//               {filteredNotes.map((note) => (
//                 <div
//                   key={note.id}
//                   className={`note-item fade-in ${selectedNote?.id === note.id ? 'active' : ''}`}
//                   onClick={() => selectNote(note)}
//                 >
//                   <div className="note-title">{note.title}</div>
//                   <div className="note-preview">{note.preview || 'No preview available'}</div>
//                   <div className="note-date">
//                     <FaClock />
//                     {formatDate(note.last_modified)}
//                   </div>
//                 </div>
//               ))}
              
//               {filteredNotes.length === 0 && !isLoading && (
//                 <div className="empty-state">
//                   <FaSearch className="empty-state-icon" />
//                   <h3>No notes found</h3>
//                   <p>Try adjusting your search terms or create a new note</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="divider-line"></div>

//         {/* Right Pane - Editor */}
//         <div className="right-pane">
//           {selectedNote ? (
//             <>
//               <div className="top-bar">
//                 <input
//                   ref={titleRef}
//                   type="text"
//                   className="title-input"
//                   value={currentTitle || ''}
//                   onChange={handleTitleChange}
//                   placeholder="Untitled Note"
//                   disabled={isSaving}
//                 />
                
//                 <div className="top-buttons">
//                   <button 
//                     className="new-save-btn" 
//                     onClick={saveNote}
//                     disabled={isSaving}
//                     title="Save Note"
//                     aria-label="Save"
//                   >
//                     {isSaving ? <div className="loading" /> : <FaSave size={16} />}
//                   </button>
//                   <button 
//                     className="delete-btn" 
//                     onClick={deleteNote}
//                     disabled={isSaving}
//                     title="Delete note"
//                     aria-label="Delete"
//                   >
//                     <FaTrash size={16} />
//                   </button>
//                 </div>
//               </div>
              
//               <div className="editor-meta">
//                 <div className="meta-item">
//                   <FaClock />
//                   Last modified: {formatDate(selectedNote.last_modified)}
//                 </div>
//                 <div className="meta-item">
//                   <FaFileAlt />
//                   {getWordCount(currentContent)} words
//                 </div>
//                 <div className="meta-item">
//                   Status: {isSaving ? 'Saving...' : 'Saved'}
//                 </div>
//               </div>

//               <div className="markdown-container">
//                 {(viewMode === 'split' || viewMode === 'edit') && (
//                   <div className="editor-section">
//                     <div className="section-header">
//                       Editor
//                       <div className="view-toggle">
//                         <button 
//                           className={`toggle-btn ${viewMode === 'edit' ? 'active' : ''}`}
//                           onClick={() => setViewMode('edit')}
//                           title="Editor only"
//                         >
//                           <FaCode />
//                         </button>
//                         <button 
//                           className={`toggle-btn ${viewMode === 'split' ? 'active' : ''}`}
//                           onClick={() => setViewMode('split')}
//                           title="Split view"
//                         >
//                           Split
//                         </button>
//                         <button 
//                           className={`toggle-btn ${viewMode === 'preview' ? 'active' : ''}`}
//                           onClick={() => setViewMode('preview')}
//                           title="Preview only"
//                         >
//                           <FaEye />
//                         </button>
//                       </div>
//                     </div>
//                     <textarea
//                       ref={contentRef}
//                       className="markdown-input"
//                       value={currentContent || ''}
//                       onChange={handleContentChange}
//                       placeholder="Start writing in Markdown..."
//                       spellCheck="false"
//                       disabled={isSaving}
//                     />
//                   </div>
//                 )}

//                 {(viewMode === 'split' || viewMode === 'preview') && (
//                   <div className="preview-sections">
//                     <div className="section-header">
//                       Preview
//                       <div className="view-toggle">
//                         <button 
//                           className={`toggle-btn ${viewMode === 'edit' ? 'active' : ''}`}
//                           onClick={() => setViewMode('edit')}
//                           title="Editor only"
//                         >
//                           <FaCode />
//                         </button>
//                         <button 
//                           className={`toggle-btn ${viewMode === 'split' ? 'active' : ''}`}
//                           onClick={() => setViewMode('split')}
//                           title="Split view"
//                         >
//                           Split
//                         </button>
//                         <button 
//                           className={`toggle-btn ${viewMode === 'preview' ? 'active' : ''}`}
//                           onClick={() => setViewMode('preview')}
//                           title="Preview only"
//                         >
//                           <FaEye />
//                         </button>
//                       </div>
//                     </div>
//                     <div className="markdown-preview">
//                       <ErrorBoundary>
//                         <ReactMarkdown 
//                           remarkPlugins={[remarkGfm, remarkHighlight]} 
//                           rehypePlugins={[rehypeRaw]}
//                           components={{
//                             p: ({ node, ...props }) => (
//                               <p style={{ whiteSpace: 'pre-wrap' }} {...props} />
//                             ),
//                           }}
//                         >
//                           {currentContent || '*Start writing to see preview...*'}
//                         </ReactMarkdown>
//                       </ErrorBoundary>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </>
//           ) : (
//             <div className="empty-state">
//               <FaFileAlt className="empty-state-icon" />
//               <h3>Select a note to get started</h3>
//               <p>Choose a note from the sidebar or create a new one</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Notes;

// import './Notes.css';
// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { FaTrash, FaSave, FaSearch, FaPlus, FaClock, FaFileAlt, FaEye, FaCode } from 'react-icons/fa';
// import Sidebar from '../sidebar/Sidebar';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import rehypeRaw from 'rehype-raw';
// import ErrorBoundary from '../ErrorBoundary';
// import remarkHighlight from '../remarkHighlight';

// // API configuration
// const API_BASE_URL = 'http://localhost:8000/api';

// // For demo purposes, using user_id = 1. In production, get this from auth context
// const CURRENT_USER_ID = 1;

// const Notes = () => {
//   const [notes, setNotes] = useState([]);
//   const [selectedNote, setSelectedNote] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentTitle, setCurrentTitle] = useState('');
//   const [currentContent, setCurrentContent] = useState('');
//   const [viewMode, setViewMode] = useState('split');
//   const [isSaving, setIsSaving] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const titleRef = useRef(null);
//   const contentRef = useRef(null);

//   // API functions
//   const fetchNotes = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch(`${API_BASE_URL}/notes/${CURRENT_USER_ID}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch notes');
//       }
//       const data = await response.json();
//       setNotes(data);
//       setError(null);
//     } catch (err) {
//       setError('Failed to load notes. Please try again.');
//       console.error('Error fetching notes:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const createNoteAPI = useCallback(async (noteData) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/notes/${CURRENT_USER_ID}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(noteData),
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to create note');
//       }
      
//       return await response.json();
//     } catch (err) {
//       console.error('Error creating note:', err);
//       throw err;
//     }
//   }, []);

//   const updateNoteAPI = useCallback(async (noteId, noteData) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(noteData),
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to update note');
//       }
      
//       return await response.json();
//     } catch (err) {
//       console.error('Error updating note:', err);
//       throw err;
//     }
//   }, []);

//   // Enhanced deleteNoteAPI with debugging
//   const deleteNoteAPI = useCallback(async (noteId) => {
//     try {
//       console.log('🗑️ Starting delete request for note:', noteId);
//       const startTime = Date.now();
      
//       const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
//         method: 'DELETE',
//       });
      
//       const endTime = Date.now();
//       console.log(`⏱️ Delete request took ${endTime - startTime}ms`);
//       console.log('📡 Delete response status:', response.status);
//       console.log('📡 Delete response ok:', response.ok);
      
//       if (!response.ok) {
//         throw new Error(`Failed to delete note: ${response.status} ${response.statusText}`);
//       }
      
//       // Some backends return empty response for DELETE, others return JSON
//       let result;
//       const contentType = response.headers.get('content-type');
      
//       if (contentType && contentType.includes('application/json')) {
//         result = await response.json();
//         console.log('✅ Delete response data:', result);
//       } else {
//         console.log('✅ Delete successful (no JSON response)');
//         result = { success: true };
//       }
      
//       return result;
      
//     } catch (err) {
//       console.error('❌ Delete API error:', err);
//       console.error('❌ Error details:', {
//         message: err.message,
//         stack: err.stack
//       });
//       throw err;
//     }
//   }, []);

//   // Auto-save functionality
//   const saveNote = useCallback(async () => {
//     if (!selectedNote) return;

//     setIsSaving(true);
    
//     try {
//       const noteData = {
//         title: currentTitle || 'Untitled Note',
//         content: currentContent,
//       };

//       const updatedNote = await updateNoteAPI(selectedNote.id, noteData);
      
//       setNotes(prev => prev.map(note => 
//         note.id === selectedNote.id ? updatedNote : note
//       ));
      
//       setSelectedNote(updatedNote);
//       setError(null);
//     } catch (err) {
//       setError('Failed to save note. Please try again.');
//     } finally {
//       setIsSaving(false);
//     }
//   }, [selectedNote, currentTitle, currentContent, updateNoteAPI]);

//   const selectNote = useCallback((note) => {
//     if (!note) return;
    
//     console.log('Selecting note:', note.title); // Debug log
    
//     setSelectedNote(note);
//     setCurrentTitle(note.title || '');
//     setCurrentContent(note.content || '');
//   }, []);

//   const createNewNote = useCallback(async () => {
//     try {
//       setIsSaving(true);
//       const newNoteData = {
//         title: 'Untitled Note',
//         content: '',
//       };
      
//       const newNote = await createNoteAPI(newNoteData);
//       setNotes(prev => [newNote, ...prev]);
      
//       // Properly set the current state to match the new note
//       setCurrentTitle(newNote.title);
//       setCurrentContent(newNote.content);
//       setSelectedNote(newNote);
      
//       // Focus title after a short delay
//       setTimeout(() => {
//         if (titleRef.current) {
//           titleRef.current.focus();
//           titleRef.current.select();
//         }
//       }, 200);
      
//       setError(null);
//     } catch (err) {
//       setError('Failed to create note. Please try again.');
//     } finally {
//       setIsSaving(false);
//     }
//   }, [createNoteAPI]);

//   // Fixed deleteNote function with debugging
//   const deleteNote = useCallback(async () => {
//     if (!selectedNote) return;
    
//     const confirmed = window.confirm('Are you sure you want to delete this note?');
//     if (!confirmed) return;

//     console.log('🚀 Starting delete process for note:', selectedNote.id);
//     console.log('📊 Current state before delete:', {
//       selectedNoteId: selectedNote.id,
//       notesCount: notes.length,
//       currentTitle,
//       currentContent: currentContent.substring(0, 50) + '...'
//     });

//     try {
//       // Store the current note ID before deletion
//       const noteToDeleteId = selectedNote.id;
      
//       // Delete the note from backend first
//       console.log('🔄 Calling deleteNoteAPI...');
//       await deleteNoteAPI(noteToDeleteId);
//       console.log('✅ Backend delete completed');
      
//       // Update notes list
//       const newNotes = notes.filter(note => note.id !== noteToDeleteId);
//       console.log('📝 Filtered notes, new count:', newNotes.length);
      
//       // Clear current selection immediately to prevent auto-save conflicts
//       console.log('🧹 Clearing current selection...');
//       setSelectedNote(null);
//       setCurrentTitle('');
//       setCurrentContent('');
      
//       // Update the notes list
//       setNotes(newNotes);
      
//       // Handle what to select next after a short delay to ensure state is clean
//       setTimeout(async () => {
//         console.log('⏰ Selecting next note after delay...');
        
//         if (newNotes.length === 0) {
//           // Create welcome note if no notes left
//           try {
//             console.log('📝 Creating welcome note...');
//             const newNoteData = {
//               title: 'Welcome to Notes',
//               content: '# Welcome! 👋\n\nStart writing your thoughts here...\n\nThis note was created automatically when you deleted your last note.',
//             };
            
//             const newNote = await createNoteAPI(newNoteData);
//             setNotes([newNote]);
            
//             // Set the new note as selected with proper state
//             setSelectedNote(newNote);
//             setCurrentTitle(newNote.title);
//             setCurrentContent(newNote.content);
//             console.log('✅ Welcome note created and selected');
            
//           } catch (createErr) {
//             console.error('❌ Error creating welcome note:', createErr);
//             setError('Failed to create welcome note. Please refresh and try again.');
//           }
          
//         } else {
//           // Select next available note
//           const currentIndex = notes.findIndex(note => note.id === noteToDeleteId);
//           const nextNote = newNotes[currentIndex] || newNotes[currentIndex - 1] || newNotes[0];
          
//           console.log('📌 Selecting next note:', { 
//             currentIndex, 
//             nextNoteId: nextNote?.id,
//             nextNoteTitle: nextNote?.title 
//           });
          
//           // Set the next note as selected with proper state
//           setSelectedNote(nextNote);
//           setCurrentTitle(nextNote.title);
//           setCurrentContent(nextNote.content);
//           console.log('✅ Next note selected');
//         }
        
//         // Focus the title input after selection
//         setTimeout(() => {
//           if (titleRef.current) {
//             titleRef.current.focus();
//             console.log('🎯 Focus set to title input');
//           }
//         }, 100);
        
//       }, 100); // Small delay to ensure state updates are processed
      
//       setError(null);
//       console.log('✅ Delete process completed successfully');
      
//     } catch (err) {
//       console.error('❌ Delete process failed:', err);
//       setError('Failed to delete note. Please try again.');
//     }
//   }, [selectedNote, notes, createNoteAPI, deleteNoteAPI, currentTitle, currentContent]);

//   // Load notes on component mount
//   useEffect(() => {
//     fetchNotes();
//   }, [fetchNotes]);

//   // Initialize with first note (but ensure state is properly set)
//   useEffect(() => {
//     if (notes.length > 0 && !selectedNote) {
//       const firstNote = notes[0];
//       selectNote(firstNote);
//     }
//   }, [notes, selectedNote, selectNote]);

//   // Updated auto-save when content changes with better guards
//   useEffect(() => {
//     // Only auto-save if we have a selected note that still exists in the notes array
//     if (selectedNote && 
//         notes.some(note => note.id === selectedNote.id) && 
//         (currentTitle !== selectedNote.title || currentContent !== selectedNote.content)) {
      
//       const timeoutId = setTimeout(() => {
//         saveNote();
//       }, 3000);

//       return () => clearTimeout(timeoutId);
//     }
//   }, [currentTitle, currentContent, selectedNote, saveNote, notes]); // Added 'notes' dependency

//   const handleTitleChange = useCallback((e) => {
//     console.log('Title changing to:', e.target.value); // Debug log
//     const newTitle = e.target.value;
//     setCurrentTitle(newTitle);
//   }, []);

//   const handleContentChange = useCallback((e) => {
//     console.log('Content changing, length:', e.target.value.length); // Debug log
//     const newContent = e.target.value;
//     setCurrentContent(newContent);
//   }, []);

//   const filteredNotes = notes.filter(note => 
//     note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     note.content.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now - date);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     if (diffDays === 1) return 'Today';
//     if (diffDays === 2) return 'Yesterday';
//     if (diffDays <= 7) return `${diffDays - 1} days ago`;
//     return date.toLocaleDateString();
//   };

//   const getWordCount = (text) => {
//     return text.trim().split(/\s+/).filter(word => word.length > 0).length;
//   };

//   if (isLoading) {
//     return (
//       <div className="app-container-notes">
//         <Sidebar />
//         <div className="main-content-notes">
//           <div className="empty-state">
//             <div className="loading" />
//             <h3>Loading notes...</h3>
//             <p>Please wait while we fetch your notes</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="app-container-notes">
//       <Sidebar />
      
//       <div className="main-content-notes">
//         {/* Error banner */}
//         {error && (
//           <div style={{
//             background: '#EF4444',
//             color: 'white',
//             padding: '12px 20px',
//             textAlign: 'center',
//             fontSize: '14px',
//             fontWeight: '500'
//           }}>
//             {error}
//             <button 
//               onClick={() => setError(null)}
//               style={{
//                 background: 'transparent',
//                 border: 'none',
//                 color: 'white',
//                 marginLeft: '12px',
//                 cursor: 'pointer',
//                 fontSize: '16px'
//               }}
//             >
//               ×
//             </button>
//           </div>
//         )}

//         {/* Left Pane - Notes List */}
//         <div className="left-pane">
//           <div className="sidebar-header">
//             <div className="sidebar-title">
//               <FaFileAlt />
//               Notes
//             </div>
            
//             <div className="search-and-button">
//               <div className="search-container">
//                 <FaSearch className="search-icon" />
//                 <input
//                   type="text"
//                   className="notes-search"
//                   placeholder="Search notes..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
              
//               <button className="new-note-btn" onClick={createNewNote} disabled={isSaving}>
//                 <FaPlus />
//                 New Note
//               </button>
//             </div>
//           </div>

//           <div className="top-divider"></div>
          
//           <div className="title-section">
//             <div className="title-label">Recent Notes</div>
//             <div className="title-content">
//               {filteredNotes.map((note) => (
//                 <div
//                   key={note.id}
//                   className={`note-item fade-in ${selectedNote?.id === note.id ? 'active' : ''}`}
//                   onClick={() => selectNote(note)}
//                 >
//                   <div className="note-title">{note.title}</div>
//                   <div className="note-preview">{note.preview || 'No preview available'}</div>
//                   <div className="note-date">
//                     <FaClock />
//                     {formatDate(note.last_modified)}
//                   </div>
//                 </div>
//               ))}
              
//               {filteredNotes.length === 0 && !isLoading && (
//                 <div className="empty-state">
//                   <FaSearch className="empty-state-icon" />
//                   <h3>No notes found</h3>
//                   <p>Try adjusting your search terms or create a new note</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="divider-line"></div>

//         {/* Right Pane - Editor */}
//         <div className="right-pane">
//           {selectedNote ? (
//             <>
//               <div className="top-bar">
//                 <input
//                   ref={titleRef}
//                   type="text"
//                   className="title-input"
//                   value={currentTitle || ''}
//                   onChange={handleTitleChange}
//                   placeholder="Untitled Note"
//                   disabled={isSaving}
//                 />
                
//                 <div className="top-buttons">
//                   <button 
//                     className="new-save-btn" 
//                     onClick={saveNote}
//                     disabled={isSaving}
//                     title="Save Note"
//                     aria-label="Save"
//                   >
//                     {isSaving ? <div className="loading" /> : <FaSave size={16} />}
//                   </button>
//                   <button 
//                     className="delete-btn" 
//                     onClick={deleteNote}
//                     disabled={isSaving}
//                     title="Delete note"
//                     aria-label="Delete"
//                   >
//                     <FaTrash size={16} />
//                   </button>
//                 </div>
//               </div>
              
//               <div className="editor-meta">
//                 <div className="meta-item">
//                   <FaClock />
//                   Last modified: {formatDate(selectedNote.last_modified)}
//                 </div>
//                 <div className="meta-item">
//                   <FaFileAlt />
//                   {getWordCount(currentContent)} words
//                 </div>
//                 <div className="meta-item">
//                   Status: {isSaving ? 'Saving...' : 'Saved'}
//                 </div>
//               </div>

//               <div className="markdown-container">
//                 {(viewMode === 'split' || viewMode === 'edit') && (
//                   <div className="editor-section">
//                     <div className="section-header">
//                       Editor
//                       <div className="view-toggle">
//                         <button 
//                           className={`toggle-btn ${viewMode === 'edit' ? 'active' : ''}`}
//                           onClick={() => setViewMode('edit')}
//                           title="Editor only"
//                         >
//                           <FaCode />
//                         </button>
//                         <button 
//                           className={`toggle-btn ${viewMode === 'split' ? 'active' : ''}`}
//                           onClick={() => setViewMode('split')}
//                           title="Split view"
//                         >
//                           Split
//                         </button>
//                         <button 
//                           className={`toggle-btn ${viewMode === 'preview' ? 'active' : ''}`}
//                           onClick={() => setViewMode('preview')}
//                           title="Preview only"
//                         >
//                           <FaEye />
//                         </button>
//                       </div>
//                     </div>
//                     <textarea
//                       ref={contentRef}
//                       className="markdown-input"
//                       value={currentContent || ''}
//                       onChange={handleContentChange}
//                       placeholder="Start writing in Markdown..."
//                       spellCheck="false"
//                       disabled={isSaving}
//                     />
//                   </div>
//                 )}

//                 {(viewMode === 'split' || viewMode === 'preview') && (
//                   <div className="preview-sections">
//                     <div className="section-header">
//                       Preview
//                       <div className="view-toggle">
//                         <button 
//                           className={`toggle-btn ${viewMode === 'edit' ? 'active' : ''}`}
//                           onClick={() => setViewMode('edit')}
//                           title="Editor only"
//                         >
//                           <FaCode />
//                         </button>
//                         <button 
//                           className={`toggle-btn ${viewMode === 'split' ? 'active' : ''}`}
//                           onClick={() => setViewMode('split')}
//                           title="Split view"
//                         >
//                           Split
//                         </button>
//                         <button 
//                           className={`toggle-btn ${viewMode === 'preview' ? 'active' : ''}`}
//                           onClick={() => setViewMode('preview')}
//                           title="Preview only"
//                         >
//                           <FaEye />
//                         </button>
//                       </div>
//                     </div>
//                     <div className="markdown-preview">
//                       <ErrorBoundary>
//                         <ReactMarkdown 
//                           remarkPlugins={[remarkGfm, remarkHighlight]} 
//                           rehypePlugins={[rehypeRaw]}
//                           components={{
//                             p: ({ node, ...props }) => (
//                               <p style={{ whiteSpace: 'pre-wrap' }} {...props} />
//                             ),
//                           }}
//                         >
//                           {currentContent || '*Start writing to see preview...*'}
//                         </ReactMarkdown>
//                       </ErrorBoundary>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </>
//           ) : (
//             <div className="empty-state">
//               <FaFileAlt className="empty-state-icon" />
//               <h3>Select a note to get started</h3>
//               <p>Choose a note from the sidebar or create a new one</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Notes;

import './Notes.css';
import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaTrash, FaSave, FaSearch, FaPlus, FaClock, FaFileAlt, FaEye, FaCode, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import Sidebar from '../sidebar/Sidebar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ErrorBoundary from '../ErrorBoundary';
import remarkHighlight from '../remarkHighlight';

// API configuration
const API_BASE_URL = 'http://localhost:8000/api';

// For demo purposes, using user_id = 1. In production, get this from auth context
const CURRENT_USER_ID = 1;

// Enhanced Custom Confirmation Modal Component
const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger" // danger, warning, info
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef(null);
  const confirmButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Focus the modal for accessibility
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 100);
    } else {
      setIsAnimating(false);
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleConfirm = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onConfirm();
      onClose();
    }, 200);
  };

  const handleCancel = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Tab') {
      // Trap focus within modal
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  if (!isOpen) return null;

  const getIconColor = () => {
    switch (type) {
      case 'danger': return '#EF4444';
      case 'warning': return '#F59E0B';
      case 'info': return '#3B82F6';
      default: return '#EF4444';
    }
  };

  const getIconBackground = () => {
    switch (type) {
      case 'danger': return '#FEF2F2';
      case 'warning': return '#FFFBEB';
      case 'info': return '#EFF6FF';
      default: return '#FEF2F2';
    }
  };

  return (
    <div 
      className={`confirmation-modal-overlay ${isAnimating ? 'modal-opening' : 'modal-closing'}`}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div 
        ref={modalRef}
        className={`confirmation-modal-content ${isAnimating ? 'modal-content-opening' : 'modal-content-closing'}`}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Modal Header */}
        <div className="confirmation-modal-header">
          <div 
            className="confirmation-modal-icon"
            style={{ backgroundColor: getIconBackground() }}
          >
            <FaExclamationTriangle 
              size={24} 
              color={getIconColor()}
            />
          </div>
          <button
            onClick={handleCancel}
            className="confirmation-modal-close"
            aria-label="Close modal"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="confirmation-modal-body">
          <h3 id="modal-title" className="confirmation-modal-title">
            {title}
          </h3>
          <p id="modal-description" className="confirmation-modal-message">
            {message}
          </p>
        </div>

        {/* Modal Footer */}
        <div className="confirmation-modal-footer">
          <button
            onClick={handleCancel}
            className="confirmation-modal-button confirmation-modal-cancel"
          >
            {cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            onClick={handleConfirm}
            className={`confirmation-modal-button confirmation-modal-confirm confirmation-modal-${type}`}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [viewMode, setViewMode] = useState('split');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Custom confirmation modal state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const titleRef = useRef(null);
  const contentRef = useRef(null);

  // API functions
  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/notes/${CURRENT_USER_ID}`);
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      const data = await response.json();
      setNotes(data);
      setError(null);
    } catch (err) {
      setError('Failed to load notes. Please try again.');
      console.error('Error fetching notes:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createNoteAPI = useCallback(async (noteData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${CURRENT_USER_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create note');
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error creating note:', err);
      throw err;
    }
  }, []);

  const updateNoteAPI = useCallback(async (noteId, noteData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update note');
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error updating note:', err);
      throw err;
    }
  }, []);

  // Enhanced deleteNoteAPI with debugging
  const deleteNoteAPI = useCallback(async (noteId) => {
    try {
      console.log('🗑️ Starting delete request for note:', noteId);
      const startTime = Date.now();
      
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
        method: 'DELETE',
      });
      
      const endTime = Date.now();
      console.log(`⏱️ Delete request took ${endTime - startTime}ms`);
      console.log('📡 Delete response status:', response.status);
      console.log('📡 Delete response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`Failed to delete note: ${response.status} ${response.statusText}`);
      }
      
      // Some backends return empty response for DELETE, others return JSON
      let result;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
        console.log('✅ Delete response data:', result);
      } else {
        console.log('✅ Delete successful (no JSON response)');
        result = { success: true };
      }
      
      return result;
      
    } catch (err) {
      console.error('❌ Delete API error:', err);
      console.error('❌ Error details:', {
        message: err.message,
        stack: err.stack
      });
      throw err;
    }
  }, []);

  // Auto-save functionality
  const saveNote = useCallback(async () => {
    if (!selectedNote) return;

    setIsSaving(true);
    
    try {
      const noteData = {
        title: currentTitle || 'Untitled Note',
        content: currentContent,
      };

      const updatedNote = await updateNoteAPI(selectedNote.id, noteData);
      
      setNotes(prev => prev.map(note => 
        note.id === selectedNote.id ? updatedNote : note
      ));
      
      setSelectedNote(updatedNote);
      setError(null);
    } catch (err) {
      setError('Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [selectedNote, currentTitle, currentContent, updateNoteAPI]);

  const selectNote = useCallback((note) => {
    if (!note) return;
    
    console.log('Selecting note:', note.title); // Debug log
    
    setSelectedNote(note);
    setCurrentTitle(note.title || '');
    setCurrentContent(note.content || '');
  }, []);

  const createNewNote = useCallback(async () => {
    try {
      setIsSaving(true);
      const newNoteData = {
        title: 'Untitled Note',
        content: '',
      };
      
      const newNote = await createNoteAPI(newNoteData);
      setNotes(prev => [newNote, ...prev]);
      
      // Properly set the current state to match the new note
      setCurrentTitle(newNote.title);
      setCurrentContent(newNote.content);
      setSelectedNote(newNote);
      
      // Focus title after a short delay
      setTimeout(() => {
        if (titleRef.current) {
          titleRef.current.focus();
          titleRef.current.select();
        }
      }, 200);
      
      setError(null);
    } catch (err) {
      setError('Failed to create note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [createNoteAPI]);

  // Updated deleteNote function to use custom confirmation
  const deleteNote = useCallback(async () => {
    if (!selectedNote) return;
    
    // Instead of window.confirm, set up the custom modal
    setNoteToDelete(selectedNote);
    setShowDeleteConfirm(true);
  }, [selectedNote]);

  // Handle confirmation from custom modal
  const handleConfirmDelete = useCallback(async () => {
    if (!noteToDelete) return;

    console.log('🚀 Starting delete process for note:', noteToDelete.id);
    console.log('📊 Current state before delete:', {
      selectedNoteId: noteToDelete.id,
      notesCount: notes.length,
      currentTitle,
      currentContent: currentContent.substring(0, 50) + '...'
    });

    try {
      // Store the current note ID before deletion
      const noteToDeleteId = noteToDelete.id;
      
      // Delete the note from backend first
      console.log('🔄 Calling deleteNoteAPI...');
      await deleteNoteAPI(noteToDeleteId);
      console.log('✅ Backend delete completed');
      
      // Update notes list
      const newNotes = notes.filter(note => note.id !== noteToDeleteId);
      console.log('📝 Filtered notes, new count:', newNotes.length);
      
      // Clear current selection immediately to prevent auto-save conflicts
      console.log('🧹 Clearing current selection...');
      setSelectedNote(null);
      setCurrentTitle('');
      setCurrentContent('');
      
      // Update the notes list
      setNotes(newNotes);
      
      // Handle what to select next after a short delay to ensure state is clean
      setTimeout(async () => {
        console.log('⏰ Selecting next note after delay...');
        
        if (newNotes.length === 0) {
          // Create welcome note if no notes left
          try {
            console.log('📝 Creating welcome note...');
            const newNoteData = {
              title: 'Welcome to Notes',
              content: '# Welcome! 👋\n\nStart writing your thoughts here...\n\nThis note was created automatically when you deleted your last note.',
            };
            
            const newNote = await createNoteAPI(newNoteData);
            setNotes([newNote]);
            
            // Set the new note as selected with proper state
            setSelectedNote(newNote);
            setCurrentTitle(newNote.title);
            setCurrentContent(newNote.content);
            console.log('✅ Welcome note created and selected');
            
          } catch (createErr) {
            console.error('❌ Error creating welcome note:', createErr);
            setError('Failed to create welcome note. Please refresh and try again.');
          }
          
        } else {
          // Select next available note
          const currentIndex = notes.findIndex(note => note.id === noteToDeleteId);
          const nextNote = newNotes[currentIndex] || newNotes[currentIndex - 1] || newNotes[0];
          
          console.log('📌 Selecting next note:', { 
            currentIndex, 
            nextNoteId: nextNote?.id,
            nextNoteTitle: nextNote?.title 
          });
          
          // Set the next note as selected with proper state
          setSelectedNote(nextNote);
          setCurrentTitle(nextNote.title);
          setCurrentContent(nextNote.content);
          console.log('✅ Next note selected');
        }
        
        // Focus the title input after selection
        setTimeout(() => {
          if (titleRef.current) {
            titleRef.current.focus();
            console.log('🎯 Focus set to title input');
          }
        }, 100);
        
      }, 100); // Small delay to ensure state updates are processed
      
      setError(null);
      console.log('✅ Delete process completed successfully');
      
      // Close the confirmation modal
      setShowDeleteConfirm(false);
      setNoteToDelete(null);
      
    } catch (err) {
      console.error('❌ Delete process failed:', err);
      setError('Failed to delete note. Please try again.');
      
      // Close the confirmation modal even if delete failed
      setShowDeleteConfirm(false);
      setNoteToDelete(null);
    }
  }, [noteToDelete, notes, createNoteAPI, deleteNoteAPI, currentTitle, currentContent]);

  // Handle cancel from custom modal
  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
    setNoteToDelete(null);
  }, []);

  // Load notes on component mount
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Initialize with first note (but ensure state is properly set)
  useEffect(() => {
    if (notes.length > 0 && !selectedNote) {
      const firstNote = notes[0];
      selectNote(firstNote);
    }
  }, [notes, selectedNote, selectNote]);

  // Updated auto-save when content changes with better guards
  useEffect(() => {
    // Only auto-save if we have a selected note that still exists in the notes array
    if (selectedNote && 
        notes.some(note => note.id === selectedNote.id) && 
        (currentTitle !== selectedNote.title || currentContent !== selectedNote.content)) {
      
      const timeoutId = setTimeout(() => {
        saveNote();
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [currentTitle, currentContent, selectedNote, saveNote, notes]); // Added 'notes' dependency

  const handleTitleChange = useCallback((e) => {
    console.log('Title changing to:', e.target.value); // Debug log
    const newTitle = e.target.value;
    setCurrentTitle(newTitle);
  }, []);

  const handleContentChange = useCallback((e) => {
    console.log('Content changing, length:', e.target.value.length); // Debug log
    const newContent = e.target.value;
    setCurrentContent(newContent);
  }, []);

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const getWordCount = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  if (isLoading) {
    return (
      <div className="app-container-notes">
        <Sidebar />
        <div className="main-content-notes">
          <div className="empty-state">
            <div className="loading" />
            <h3>Loading notes...</h3>
            <p>Please wait while we fetch your notes</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container-notes">
      <Sidebar />
      
      <div className="main-content-notes">
        {/* Error banner */}
        {error && (
          <div style={{
            background: '#EF4444',
            color: 'white',
            padding: '12px 20px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {error}
            <button 
              onClick={() => setError(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                marginLeft: '12px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Left Pane - Notes List */}
        <div className="left-pane">
          <div className="sidebar-header">
            <div className="sidebar-title">
              <FaFileAlt />
              Notes
            </div>
            
            <div className="search-and-button">
              <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  className="notes-search"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button className="new-note-btn" onClick={createNewNote} disabled={isSaving}>
                <FaPlus />
                New Note
              </button>
            </div>
          </div>

          <div className="top-divider"></div>
          
          <div className="title-section">
            <div className="title-label">Recent Notes</div>
            <div className="title-content">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`note-item fade-in ${selectedNote?.id === note.id ? 'active' : ''}`}
                  onClick={() => selectNote(note)}
                >
                  <div className="note-title">{note.title}</div>
                  <div className="note-preview">{note.preview || 'No preview available'}</div>
                  <div className="note-date">
                    <FaClock />
                    {formatDate(note.last_modified)}
                  </div>
                </div>
              ))}
              
              {filteredNotes.length === 0 && !isLoading && (
                <div className="empty-state">
                  <FaSearch className="empty-state-icon" />
                  <h3>No notes found</h3>
                  <p>Try adjusting your search terms or create a new note</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="divider-line"></div>

        {/* Right Pane - Editor */}
        <div className="right-pane">
          {selectedNote ? (
            <>
              <div className="top-bar">
                <input
                  ref={titleRef}
                  type="text"
                  className="title-input"
                  value={currentTitle || ''}
                  onChange={handleTitleChange}
                  placeholder="Untitled Note"
                  disabled={isSaving}
                />
                
                <div className="top-buttons">
                  <button 
                    className="new-save-btn" 
                    onClick={saveNote}
                    disabled={isSaving}
                    title="Save Note"
                    aria-label="Save"
                  >
                    {isSaving ? <div className="loading" /> : <FaSave size={16} />}
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={deleteNote}
                    disabled={isSaving}
                    title="Delete note"
                    aria-label="Delete"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
              
              <div className="editor-meta">
                <div className="meta-item">
                  <FaClock />
                  Last modified: {formatDate(selectedNote.last_modified)}
                </div>
                <div className="meta-item">
                  <FaFileAlt />
                  {getWordCount(currentContent)} words
                </div>
                <div className="meta-item">
                  Status: {isSaving ? 'Saving...' : 'Saved'}
                </div>
              </div>

              <div className="markdown-container">
                {(viewMode === 'split' || viewMode === 'edit') && (
                  <div className="editor-section">
                    <div className="section-header">
                      Editor
                      <div className="view-toggle">
                        <button 
                          className={`toggle-btn ${viewMode === 'edit' ? 'active' : ''}`}
                          onClick={() => setViewMode('edit')}
                          title="Editor only"
                        >
                          <FaCode />
                        </button>
                        <button 
                          className={`toggle-btn ${viewMode === 'split' ? 'active' : ''}`}
                          onClick={() => setViewMode('split')}
                          title="Split view"
                        >
                          Split
                        </button>
                        <button 
                          className={`toggle-btn ${viewMode === 'preview' ? 'active' : ''}`}
                          onClick={() => setViewMode('preview')}
                          title="Preview only"
                        >
                          <FaEye />
                        </button>
                      </div>
                    </div>
                    <textarea
                      ref={contentRef}
                      className="markdown-input"
                      value={currentContent || ''}
                      onChange={handleContentChange}
                      placeholder="Start writing in Markdown..."
                      spellCheck="false"
                      disabled={isSaving}
                    />
                  </div>
                )}

                {(viewMode === 'split' || viewMode === 'preview') && (
                  <div className="preview-sections">
                    <div className="section-header">
                      Preview
                      <div className="view-toggle">
                        <button 
                          className={`toggle-btn ${viewMode === 'edit' ? 'active' : ''}`}
                          onClick={() => setViewMode('edit')}
                          title="Editor only"
                        >
                          <FaCode />
                        </button>
                        <button 
                          className={`toggle-btn ${viewMode === 'split' ? 'active' : ''}`}
                          onClick={() => setViewMode('split')}
                          title="Split view"
                        >
                          Split
                        </button>
                        <button 
                          className={`toggle-btn ${viewMode === 'preview' ? 'active' : ''}`}
                          onClick={() => setViewMode('preview')}
                          title="Preview only"
                        >
                          <FaEye />
                        </button>
                      </div>
                    </div>
                    <div className="markdown-preview">
                      <ErrorBoundary>
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm, remarkHighlight]} 
                          rehypePlugins={[rehypeRaw]}
                          components={{
                            p: ({ node, ...props }) => (
                              <p style={{ whiteSpace: 'pre-wrap' }} {...props} />
                            ),
                          }}
                        >
                          {currentContent || '*Start writing to see preview...*'}
                        </ReactMarkdown>
                      </ErrorBoundary>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <FaFileAlt className="empty-state-icon" />
              <h3>Select a note to get started</h3>
              <p>Choose a note from the sidebar or create a new one</p>
            </div>
          )}
        </div>

        {/* Enhanced Custom Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Note"
          message={`Are you sure you want to delete "${noteToDelete?.title}"? This action cannot be undone.`}
          confirmText="Delete Note"
          cancelText="Cancel"
          type="danger"
        />
      </div>
    </div>
  );
};

export default Notes;