import './Profile.css';
import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';
import ApiService from '../../src/services/api'; 
import { getUserId, getUsername, getEmail } from '../utils/userUtils';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true); // New state for initial load
    const [error, setError] = useState('');
    const [profileData, setProfileData] = useState({
        name: '',
        email: ''
    });

    const [editData, setEditData] = useState({ ...profileData });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Custom alert state
    const [alert, setAlert] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'success'
    });

    // Auto-clear error messages after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 2000); // Clear error after 2 seconds

            // Cleanup function to clear timeout if component unmounts or error changes
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Function to show custom alert
    const showAlert = (title, message, type = 'success') => {
        setAlert({
            isOpen: true,
            title,
            message,
            type
        });
    };

    // Function to close custom alert
    const closeAlert = () => {
        setAlert({
            ...alert,
            isOpen: false
        });
    };

    // Fetch profile data on component mount
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        setError('');
        try {
            // First, try to get data from localStorage (immediate)
            const userId = getUserId();
            const username = getUsername();
            const email = getEmail();
            
            if (userId && username && email) {
                console.log('📱 Using localStorage data for profile');
                setProfileData({
                    name: username,
                    email: email
                });
                setEditData({
                    name: username,
                    email: email
                });
                setInitialLoading(false);
                setLoading(false);
                return; // Success with localStorage data
            }
            
            // If localStorage data is missing, try API
            console.log('🌐 Fetching from API...');
            const data = await ApiService.getProfile();
            console.log('✅ API data received:', data);
            
            setProfileData({
                name: data.name,
                email: data.email
            });
            setEditData({
                name: data.name,
                email: data.email
            });
            
        } catch (err) {
            console.error('❌ Profile error:', err);
            
            // Try localStorage as final fallback
            const username = getUsername();
            const email = getEmail();
            
            if (username && email) {
                console.log('🔄 Using localStorage fallback');
                setProfileData({
                    name: username,
                    email: email
                });
                setEditData({
                    name: username,
                    email: email
                });
            } else {
                setError('Failed to load profile data. Please try logging in again.');
                // Redirect to login after a delay
                setTimeout(() => {
                    localStorage.clear();
                    window.location.href = '/';
                }, 3000);
            }
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    };

    // Password validation function
    const validatePassword = (password) => {
        const minLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password);

        return {
            isValid: minLength && hasUpperCase && hasNumber && hasSymbol,
            errors: {
                minLength,
                hasUpperCase,
                hasNumber,
                hasSymbol
            }
        };
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditData({ ...profileData });
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setError('');
    };

    const handleSave = async () => {
        setLoading(true);
        setError('');

        try {
            await ApiService.updateProfile(editData);
            setProfileData({ ...editData });
            setIsEditing(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            showAlert('Success!', 'Profile updated successfully!', 'success');
        } catch (err) {
            setError(err.message);
            console.error('Error updating profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditData({ ...profileData });
        setIsEditing(false);
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setError('');
    };

    const handleInputChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePasswordChange = (field, value) => {
        setPasswordData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePasswordSave = async () => {
        // Check if current password is provided
        if (!passwordData.currentPassword.trim()) {
            setError('Please enter your current password!');
            return;
        }

        // Validate new password
        const validation = validatePassword(passwordData.newPassword);
        if (!validation.isValid) {
            let errorMessage = 'Password must meet the following requirements:\n';
            if (!validation.errors.minLength) errorMessage += '• At least 8 characters\n';
            if (!validation.errors.hasUpperCase) errorMessage += '• At least 1 uppercase letter\n';
            if (!validation.errors.hasNumber) errorMessage += '• At least 1 number\n';
            if (!validation.errors.hasSymbol) errorMessage += '• At least 1 symbol (!@#$%^&*)\n';

            setError(errorMessage);
            return;
        }

        // Check if new passwords match
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match!');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await ApiService.changePassword({
                current_password: passwordData.currentPassword,
                new_password: passwordData.newPassword
            });

            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setIsEditing(false); // Exit edit mode and return to profile view
            showAlert('Password Changed!', 'Your password has been changed successfully!', 'success');
        } catch (err) {
            setError(err.message);
            console.error('Error changing password:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProfile = async () => {
        setLoading(true);
        setError('');

        try {
            await ApiService.deleteProfile();
            setShowDeleteConfirm(false);
            showAlert('Profile Deleted!', 'Your profile has been deleted successfully!', 'success');
            // Redirect to login or home page after a short delay
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (err) {
            setError(err.message);
            console.error('Error deleting profile:', err);
        } finally {
            setLoading(false);
        }
    };

    // Get password validation for real-time feedback
    const passwordValidation = validatePassword(passwordData.newPassword);

    // Show loading screen during initial fetch
    if (initialLoading) {
        return (
            <div className="loading">
                <div className="loading-text">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="app-container-profile">
            <Sidebar />
            <div className="main-content-profile">
                <div className="profile-header">
                    <h1>Profile Settings</h1>
                    {!isEditing && (
                        <div className="profile-actions">
                            <button className="edit-profile-btn" onClick={handleEdit} disabled={loading}>
                                <span>✏️</span>
                                Edit Profile
                            </button>
                            <button
                                className="delete-profile-btn"
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={loading}
                            >
                                <span>🗑️</span>
                                Delete Profile
                            </button>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="error-message" style={{
                        backgroundColor: '#fee',
                        color: '#c33',
                        padding: '10px',
                        borderRadius: '4px',
                        marginBottom: '20px',
                        border: '1px solid #fcc'
                    }}>
                        {error}
                    </div>
                )}

                {!isEditing ? (
                    <div className="profile-view">
                        <div className="profile-card">
                            <div className="profile-avatar">
                                <div className="avatar-circle">
                                    {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                            </div>

                            <div className="profile-info">
                                <div className="info-section">
                                    <label>Name</label>
                                    <div className="info-value">{profileData.name}</div>
                                </div>

                                <div className="info-section">
                                    <label>Email</label>
                                    <div className="info-value">{profileData.email}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="profile-edit">
                        <div className="edit-form">
                            <h3>Profile Information</h3>
                            <div className="form-section">
                                <label>Name</label>
                                <input
                                    type="text"
                                    className="profile-input"
                                    value={editData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Enter your name"
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-section">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="profile-input"
                                    value={editData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="Enter your email"
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-actions">
                                <button
                                    className="save-profile-btn"
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    className="cancel-profile-btn"
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>

                        <div className="password-form">
                            <h2>Change Password</h2>
                            <div className="form-section">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    className="profile-input"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                    placeholder="Enter current password"
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-section">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    className="profile-input"
                                    value={passwordData.newPassword}
                                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                    placeholder="Enter new password"
                                    disabled={loading}
                                />
                                {passwordData.newPassword && (
                                    <div className="password-requirements">
                                        <div className={`requirement ${passwordValidation.errors.minLength ? 'valid' : 'invalid'}`}>
                                            {passwordValidation.errors.minLength ? '✓' : '✗'} At least 8 characters
                                        </div>
                                        <div className={`requirement ${passwordValidation.errors.hasUpperCase ? 'valid' : 'invalid'}`}>
                                            {passwordValidation.errors.hasUpperCase ? '✓' : '✗'} At least 1 uppercase letter
                                        </div>
                                        <div className={`requirement ${passwordValidation.errors.hasNumber ? 'valid' : 'invalid'}`}>
                                            {passwordValidation.errors.hasNumber ? '✓' : '✗'} At least 1 number
                                        </div>
                                        <div className={`requirement ${passwordValidation.errors.hasSymbol ? 'valid' : 'invalid'}`}>
                                            {passwordValidation.errors.hasSymbol ? '✓' : '✗'} At least 1 symbol (!@#$%^&*)
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="form-section">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    className="profile-input"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                    placeholder="Confirm new password"
                                    disabled={loading}
                                />
                                {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                                    <div className="password-mismatch">
                                        ✗ Passwords do not match
                                    </div>
                                )}
                            </div>

                            <div className="password-actions">
                                <button
                                    className="save-password-btn"
                                    onClick={handlePasswordSave}
                                    disabled={
                                        loading ||
                                        !passwordValidation.isValid ||
                                        passwordData.newPassword !== passwordData.confirmPassword ||
                                        !passwordData.currentPassword
                                    }
                                >
                                    {loading ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showDeleteConfirm && (
                    <div className="delete-modal-overlay">
                        <div className="delete-modal">
                            <div className="modal-header">
                                <h3>Delete Profile</h3>
                            </div>
                            <div className="modal-content">
                                <p>Are you sure you want to delete your profile? This action cannot be undone and will permanently delete all your tasks, projects, and productivity data.</p>
                            </div>
                            <div className="modal-actions">
                                <button
                                    className="confirm-delete-btn"
                                    onClick={handleDeleteProfile}
                                    disabled={loading}
                                >
                                    {loading ? 'Deleting...' : 'Yes, Delete Profile'}
                                </button>
                                <button
                                    className="cancel-delete-btn"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Custom Alert Modal - Integrated directly in Profile component */}
                {alert.isOpen && (
                    <div className="custom-alert-overlay" onClick={closeAlert}>
                        <div
                            className="custom-alert-modal"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="custom-alert-header">
                                <div className={`custom-alert-icon ${alert.type}`}>
                                    {alert.type === 'success' && '✅'}
                                    {alert.type === 'error' && '❌'}
                                    {alert.type === 'warning' && '⚠️'}
                                    {alert.type === 'info' && 'ℹ️'}
                                </div>
                                <h3>{alert.title}</h3>
                            </div>

                            <div className="custom-alert-content">
                                <p>{alert.message}</p>
                            </div>

                            <div className="custom-alert-actions">
                                <button
                                    className={`custom-alert-button ${alert.type}`}
                                    onClick={closeAlert}
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;