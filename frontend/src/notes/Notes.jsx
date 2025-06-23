import './Notes.css';
import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaTrash, FaSave, FaSearch, FaPlus, FaClock, FaFileAlt, FaEye, FaCode, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import Sidebar from '../sidebar/Sidebar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ErrorBoundary from '../ErrorBoundary';
import remarkHighlight from '../remarkHighlight';
import { apiCall } from '../utils/userUtils'; // Import helper functions

// Enhanced Custom Confirmation Modal Component (keep the same)
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger"
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef(null);
  const confirmButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 100);
    } else {
      setIsAnimating(false);
      document.body.style.overflow = 'unset';
    }

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

        <div className="confirmation-modal-body">
          <h3 id="modal-title" className="confirmation-modal-title">
            {title}
          </h3>
          <p id="modal-description" className="confirmation-modal-message">
            {message}
          </p>
        </div>

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

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const titleRef = useRef(null);
  const contentRef = useRef(null);

  // Updated API functions using the helper
  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiCall('/notes');
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
      const response = await apiCall('/notes', {
        method: 'POST',
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
      const response = await fetch(`http://localhost:8000/api/notes/${noteId}`, {
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

  const deleteNoteAPI = useCallback(async (noteId) => {
    try {
      console.log('🗑️ Starting delete request for note:', noteId);
      const startTime = Date.now();

      const response = await fetch(`http://localhost:8000/api/notes/${noteId}`, {
        method: 'DELETE',
      });

      const endTime = Date.now();
      console.log(`⏱️ Delete request took ${endTime - startTime}ms`);
      console.log('📡 Delete response status:', response.status);
      console.log('📡 Delete response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`Failed to delete note: ${response.status} ${response.statusText}`);
      }

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

  // Keep all the rest of your existing functions exactly the same...
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

    console.log('Selecting note:', note.title);

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

      setCurrentTitle(newNote.title);
      setCurrentContent(newNote.content);
      setSelectedNote(newNote);

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

  const deleteNote = useCallback(async () => {
    if (!selectedNote) return;

    setNoteToDelete(selectedNote);
    setShowDeleteConfirm(true);
  }, [selectedNote]);

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
      const noteToDeleteId = noteToDelete.id;

      console.log('🔄 Calling deleteNoteAPI...');
      await deleteNoteAPI(noteToDeleteId);
      console.log('✅ Backend delete completed');

      const newNotes = notes.filter(note => note.id !== noteToDeleteId);
      console.log('📝 Filtered notes, new count:', newNotes.length);

      console.log('🧹 Clearing current selection...');
      setSelectedNote(null);
      setCurrentTitle('');
      setCurrentContent('');

      setNotes(newNotes);

      setTimeout(async () => {
        console.log('⏰ Selecting next note after delay...');

        if (newNotes.length === 0) {
          try {
            console.log('📝 Creating welcome note...');
            const newNoteData = {
              title: 'Welcome to Notes',
              content: '# Welcome! 👋\n\nStart writing your thoughts here...\n\nThis note was created automatically when you deleted your last note.',
            };

            const newNote = await createNoteAPI(newNoteData);
            setNotes([newNote]);

            setSelectedNote(newNote);
            setCurrentTitle(newNote.title);
            setCurrentContent(newNote.content);
            console.log('✅ Welcome note created and selected');

          } catch (createErr) {
            console.error('❌ Error creating welcome note:', createErr);
            setError('Failed to create welcome note. Please refresh and try again.');
          }

        } else {
          const currentIndex = notes.findIndex(note => note.id === noteToDeleteId);
          const nextNote = newNotes[currentIndex] || newNotes[currentIndex - 1] || newNotes[0];

          console.log('📌 Selecting next note:', {
            currentIndex,
            nextNoteId: nextNote?.id,
            nextNoteTitle: nextNote?.title
          });

          setSelectedNote(nextNote);
          setCurrentTitle(nextNote.title);
          setCurrentContent(nextNote.content);
          console.log('✅ Next note selected');
        }

        setTimeout(() => {
          if (titleRef.current) {
            titleRef.current.focus();
            console.log('🎯 Focus set to title input');
          }
        }, 100);

      }, 100);

      setError(null);
      console.log('✅ Delete process completed successfully');

      setShowDeleteConfirm(false);
      setNoteToDelete(null);

    } catch (err) {
      console.error('❌ Delete process failed:', err);
      setError('Failed to delete note. Please try again.');

      setShowDeleteConfirm(false);
      setNoteToDelete(null);
    }
  }, [noteToDelete, notes, createNoteAPI, deleteNoteAPI, currentTitle, currentContent]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
    setNoteToDelete(null);
  }, []);

  // Load notes on component mount
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Initialize with first note
  useEffect(() => {
    if (notes.length > 0 && !selectedNote) {
      const firstNote = notes[0];
      selectNote(firstNote);
    }
  }, [notes, selectedNote, selectNote]);

  // Auto-save when content changes
  useEffect(() => {
    if (selectedNote &&
      notes.some(note => note.id === selectedNote.id) &&
      (currentTitle !== selectedNote.title || currentContent !== selectedNote.content)) {

      const timeoutId = setTimeout(() => {
        saveNote();
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [currentTitle, currentContent, selectedNote, saveNote, notes]);

  const handleTitleChange = useCallback((e) => {
    console.log('Title changing to:', e.target.value);
    const newTitle = e.target.value;
    setCurrentTitle(newTitle);
  }, []);

  const handleContentChange = useCallback((e) => {
    console.log('Content changing, length:', e.target.value.length);
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

    const oneDay = 1000 * 60 * 60 * 24;

    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffDays = Math.floor((nowOnly - dateOnly) / oneDay);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString();
  };

  const getWordCount = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showDeleteConfirm) {
        handleCancelDelete();
      }
    };
    
    if (showDeleteConfirm) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showDeleteConfirm, handleCancelDelete]);

  if (isLoading) {
    return (
      <div className="app-container-notes">
        <Sidebar />
        <div className="main-content-notes">
          <div className="empty-state">
            <div className="loading-page" />
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
                {isSaving ? <div className="loading-icon" /> : <FaPlus />}
                {isSaving ? 'Creating...' : 'New Note'}
              </button>
            </div>
          </div>

          <div className="top-divider"></div>

          <div className="title-section">
            <div className="title-label">Recent Notes</div>
            <div className="title-content">
              {isLoading && (
                <>
                  <div className="note-item-skeleton">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-preview"></div>
                    <div className="skeleton-date"></div>
                  </div>
                  <div className="note-item-skeleton">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-preview"></div>
                    <div className="skeleton-date"></div>
                  </div>
                  <div className="note-item-skeleton">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-preview"></div>
                    <div className="skeleton-date"></div>
                  </div>
                </>
              )}

              {!isLoading && filteredNotes.map((note) => (
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

              {!isLoading && filteredNotes.length === 0 && (
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
                    title={isSaving ? "Saving..." : "Save Note"}
                    aria-label={isSaving ? "Saving" : "Save"}
                  >
                    {isSaving ? <div className="loading-icon" /> : <FaSave size={16} />}
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
                  Status: {isSaving ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div className="loading-dark" />
                      Saving...
                    </span>
                  ) : (
                    <span style={{ color: '#10B981' }}>Saved</span>
                  )}
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