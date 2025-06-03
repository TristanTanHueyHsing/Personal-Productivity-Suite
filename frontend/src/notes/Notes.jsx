import './Notes.css';
import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaPen, FaTrash, FaSave, FaSearch, FaPlus, FaClock, FaFileAlt, FaEye, FaCode } from 'react-icons/fa';
import Sidebar from '../sidebar/Sidebar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ErrorBoundary from '../ErrorBoundary';
import remarkHighlight from '../remarkHighlight';

const Notes = () => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Welcome to Enhanced Notes',
      content: `# Welcome to Your Enhanced Notes App! 🎉

This is a powerful markdown editor with live preview and improved design.

## New Features
- **Modern UI/UX** - Beautiful glassmorphism design with smooth animations
- **Real-time preview** - See your markdown rendered instantly
- **Enhanced search** - Find notes quickly with improved search functionality
- **Auto-save** - Your work is automatically saved as you type
- **Responsive design** - Works perfectly on all devices
- **Better typography** - Using Inter font for better readability

## Getting Started
1. Click the **+ New Note** button to create a note
2. Edit the title by clicking on it
3. Write in markdown in the left panel
4. See the preview in the right panel

### Markdown Examples

**Bold text** and *italic text*

> This is a blockquote with some important information

\`\`\`javascript
// Code blocks are fully supported with syntax highlighting
function hello() {
  console.log('Hello, World!');
}
\`\`\`

- [x] Task lists work too
- [ ] Unchecked item
- [ ] Another item

### Tables

| Feature | Status | Priority |
|---------|--------|----------|
| Dark theme | ✅ | High |
| Auto-save | ✅ | High |
| Export | 🔄 | Medium |

Enjoy taking notes with the enhanced experience! ✨`,
      preview: 'Welcome to your enhanced notes app with modern design and improved functionality...',
      lastModified: new Date(),
      isNew: false
    },
    {
      id: 2,
      title: 'Meeting Notes - Project Alpha',
      content: `# Team Meeting - Project Alpha

**Date:** ${new Date().toLocaleDateString()}
**Attendees:** Development Team

## Agenda
1. Project status update
2. Upcoming milestones
3. Resource allocation
4. UI/UX improvements
5. Next steps

## Discussion Points

### UI/UX Enhancements
- Implemented new glassmorphism design
- Added smooth animations and transitions
- Improved color scheme for better accessibility
- Enhanced typography with Inter font

### Technical Updates
- React hooks optimization
- Better state management
- Improved performance
- Mobile responsiveness

## Action Items
- [x] Complete new design implementation
- [ ] Add export functionality
- [ ] Implement backend integration
- [ ] User testing and feedback
- [ ] Performance optimization

## Notes
The new design is a significant improvement over the previous version. The glassmorphism effects and modern styling make the app feel more premium and user-friendly.

### Next Meeting
Schedule for next Friday to review progress and plan next sprint.`,
      preview: 'Team meeting notes for Project Alpha with agenda, discussion points, and action items...',
      lastModified: new Date(Date.now() - 86400000),
      isNew: false
    },
    {
      id: 3,
      title: 'Quick Ideas',
      content: `# Quick Ideas & Thoughts 💡

## App Improvements
- Add dark/light theme toggle
- Implement note categories/tags
- Add note export (PDF, HTML)
- Implement note sharing
- Add search filters

## Design Ideas
- Floating action buttons
- Sidebar collapse/expand
- Note templates
- Rich text editor option
- Drag & drop file uploads

## Technical Considerations
- Offline support
- Sync across devices
- Backup & restore
- Keyboard shortcuts
- Plugin system

## Random Thoughts
Sometimes the best ideas come when you least expect them. This notes app is becoming something really special! 🚀`,
      preview: 'Collection of ideas for app improvements, design changes, and technical considerations...',
      lastModified: new Date(Date.now() - 172800000),
      isNew: false
    }
  ]);

  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [viewMode, setViewMode] = useState('split'); // 'split', 'edit', 'preview'
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const titleRef = useRef(null);
  const contentRef = useRef(null);

  // Auto-save functionality
  const saveNote = useCallback(async () => {
    if (!selectedNote) return;

    setIsSaving(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedNote = {
      ...selectedNote,
      title: currentTitle || 'Untitled Note',
      content: currentContent,
      preview: currentContent.slice(0, 150).replace(/[#*`]/g, '') + '...',
      lastModified: new Date(),
      isNew: false
    };

    setNotes(prev => prev.map(note => 
      note.id === selectedNote.id ? updatedNote : note
    ));
    
    setSelectedNote(updatedNote);
    setIsSaving(false);
  }, [selectedNote, currentTitle, currentContent]);

  const selectNote = useCallback((note) => {
    setSelectedNote(note);
    setCurrentTitle(note.title);
    setCurrentContent(note.content);
    setIsEditing(false);
    setResetKey(prev => prev + 1);
  }, []);

  const createNewNote = useCallback(() => {
    const newNote = {
      id: Date.now(),
      title: 'Untitled Note',
      content: '',
      preview: '',
      lastModified: new Date(),
      isNew: true
    };
    
    setNotes(prev => [newNote, ...prev]);
    selectNote(newNote);
    setIsEditing(true);
    
    // Focus title after a short delay
    setTimeout(() => {
      if (titleRef.current) {
        titleRef.current.focus();
        titleRef.current.select();
      }
    }, 100);
  }, [selectNote]);

  // Initialize with first note
  useEffect(() => {
    if (notes.length > 0 && !selectedNote) {
      selectNote(notes[0]);
    }
  }, [notes, selectedNote, selectNote]);

  // Auto-save when content changes
  useEffect(() => {
    if (selectedNote && (currentTitle !== selectedNote.title || currentContent !== selectedNote.content)) {
      const timeoutId = setTimeout(() => {
        saveNote();
      }, 1500); // Auto-save after 1.5 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [currentTitle, currentContent, selectedNote, saveNote]);

  const handleContentChange = useCallback((e) => {
    setCurrentContent(e.target.value);
    setResetKey(prev => prev + 1);
  }, []);

  const handleTitleChange = useCallback((e) => {
    setCurrentTitle(e.target.value);
  }, []);

  const toggleEditMode = useCallback(() => {
    setIsEditing(!isEditing);
    if (!isEditing && titleRef.current) {
      setTimeout(() => titleRef.current.focus(), 100);
    }
  }, [isEditing]);

  const deleteNote = useCallback(() => {
    if (!selectedNote || notes.length <= 1) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this note?');
    if (!confirmed) return;

    const noteIndex = notes.findIndex(note => note.id === selectedNote.id);
    const newNotes = notes.filter(note => note.id !== selectedNote.id);
    setNotes(newNotes);
    
    // Select the next note or previous one
    const nextNote = newNotes[noteIndex] || newNotes[noteIndex - 1] || newNotes[0];
    if (nextNote) {
      selectNote(nextNote);
    } else {
      setSelectedNote(null);
      setCurrentTitle('');
      setCurrentContent('');
    }
  }, [selectedNote, notes, selectNote]);

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date) => {
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

  return (
    <div className="app-container-notes">
      <Sidebar />
      
      <div className="main-content-notes">
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
              
              <button className="new-note-btn" onClick={createNewNote}>
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
                  <div className="note-preview">{note.preview}</div>
                  <div className="note-date">
                    <FaClock />
                    {formatDate(note.lastModified)}
                  </div>
                </div>
              ))}
              
              {filteredNotes.length === 0 && (
                <div className="empty-state">
                  <FaSearch className="empty-state-icon" />
                  <h3>No notes found</h3>
                  <p>Try adjusting your search terms</p>
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
                  value={currentTitle}
                  onChange={handleTitleChange}
                  placeholder="Untitled Note"
                  readOnly={!isEditing}
                  style={{ 
                    cursor: isEditing ? 'text' : 'pointer',
                    background: isEditing ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                  }}
                  onClick={() => !isEditing && toggleEditMode()}
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
                    className="edit-btn" 
                    onClick={toggleEditMode}
                    title={isEditing ? "Stop editing" : "Edit title"}
                    aria-label="Edit"
                  >
                    <FaPen size={16} />
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={deleteNote}
                    disabled={notes.length <= 1}
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
                  Last modified: {formatDate(selectedNote.lastModified)}
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
                      value={currentContent}
                      onChange={handleContentChange}
                      placeholder="Start writing in Markdown..."
                      spellCheck="false"
                    />
                  </div>
                )}

                {(viewMode === 'split' || viewMode === 'preview') && (
                  <div className="preview-section">
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
                      <ErrorBoundary resetKey={resetKey}>
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
      </div>
    </div>
  );
};

export default Notes;