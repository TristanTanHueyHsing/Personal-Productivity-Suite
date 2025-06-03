import './Trash.css';
import React, { useState } from 'react';
import Sidebar from '../sidebar/Sidebar';

const Trash = () => {
    // Sample trash items - replace with your actual data source
    const [trashedItems, setTrashedItems] = useState([
        {
            id: 1,
            name: 'Old Document.pdf',
            type: 'file',
            deletedDate: '2024-05-15',
            size: '2.3 MB',
            originalLocation: '/Documents'
        },
        {
            id: 2,
            name: 'Vacation Photos',
            type: 'folder',
            deletedDate: '2024-05-10',
            size: '156 MB',
            originalLocation: '/Pictures'
        },
        {
            id: 3,
            name: 'Draft Email.txt',
            type: 'file',
            deletedDate: '2024-05-08',
            size: '1.2 KB',
            originalLocation: '/Desktop'
        }
    ]);

    const [selectedItems, setSelectedItems] = useState([]);

    const handleSelectItem = (itemId) => {
        setSelectedItems(prev => 
            prev.includes(itemId) 
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === trashedItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(trashedItems.map(item => item.id));
        }
    };

    const handleRestore = () => {
        if (selectedItems.length === 0) return;
        
        // Filter out restored items
        setTrashedItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
        setSelectedItems([]);
        
        // Here you would typically make an API call to restore the items
        console.log('Restoring items:', selectedItems);
    };

    const handlePermanentDelete = () => {
        if (selectedItems.length === 0) return;
        
        if (window.confirm('Are you sure you want to permanently delete these items? This action cannot be undone.')) {
            setTrashedItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
            setSelectedItems([]);
            
            // Here you would typically make an API call to permanently delete the items
            console.log('Permanently deleting items:', selectedItems);
        }
    };

    const handleEmptyTrash = () => {
        if (trashedItems.length === 0) return;
        
        if (window.confirm('Are you sure you want to empty the trash? This will permanently delete all items and cannot be undone.')) {
            setTrashedItems([]);
            setSelectedItems([]);
            
            // Here you would typically make an API call to empty the trash
            console.log('Emptying trash');
        }
    };

    const getFileIcon = (type) => {
        return type === 'folder' ? '📁' : '📄';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="app-container-trash">
            <Sidebar />
            <div className="main-content-trash">
                <div className="trash-header">
                    <h1 className="trash-page-title">Trash</h1>
                    <div className="trash-stats">
                        <div className="trash-stat-badge">
                            {trashedItems.length} items
                        </div>
                        {selectedItems.length > 0 && (
                            <div className="trash-stat-badge">
                                {selectedItems.length} selected
                            </div>
                        )}
                    </div>
                </div>

                <div className="trash-actions-section">
                    <div className="trash-controls">
                        <label className="select-all-checkbox">
                            <input
                                type="checkbox"
                                checked={selectedItems.length === trashedItems.length && trashedItems.length > 0}
                                onChange={handleSelectAll}
                            />
                            <span>Select All</span>
                        </label>
                    </div>
                    <div className="trash-action-buttons">
                        {selectedItems.length > 0 && (
                            <>
                                <button 
                                    className="trash-btn trash-btn-restore"
                                    onClick={handleRestore}
                                >
                                    Restore ({selectedItems.length})
                                </button>
                                <button 
                                    className="trash-btn trash-btn-delete"
                                    onClick={handlePermanentDelete}
                                >
                                    Delete Permanently
                                </button>
                            </>
                        )}
                        <button 
                            className="trash-btn trash-btn-empty"
                            onClick={handleEmptyTrash}
                            disabled={trashedItems.length === 0}
                        >
                            Empty Trash
                        </button>
                    </div>
                </div>

                {trashedItems.length === 0 ? (
                    <div className="trash-empty">
                        <div className="trash-empty-icon">🗑️</div>
                        <h3 className="trash-empty-title">Trash is empty</h3>
                        <p className="trash-empty-description">Items you delete will appear here</p>
                    </div>
                ) : (
                    <div className="trash-items-container">
                        {trashedItems.map(item => (
                            <div 
                                key={item.id} 
                                className={`trash-item-card ${selectedItems.includes(item.id) ? 'selected' : ''}`}
                            >
                                <label className="item-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.id)}
                                        onChange={() => handleSelectItem(item.id)}
                                    />
                                </label>
                                
                                <div className="item-icon">
                                    {getFileIcon(item.type)}
                                </div>
                                
                                <div className="item-details">
                                    <div className="item-name">{item.name}</div>
                                    <div className="item-metadata">
                                        <span className="item-location">From: {item.originalLocation}</span>
                                        <span className="item-size">{item.size}</span>
                                        <span className="item-deleted-date">Deleted: {formatDate(item.deletedDate)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Trash;