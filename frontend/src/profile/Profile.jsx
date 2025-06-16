// import './Profile.css';
// import React, { useState } from 'react';
// import Sidebar from '../sidebar/Sidebar';

// const Profile = () => {
//     const [isEditing, setIsEditing] = useState(false);
//     const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//     const [profileData, setProfileData] = useState({
//         name: 'John Doe',
//         email: 'john.doe@example.com'
//     });

//     const [editData, setEditData] = useState({ ...profileData });
    
//     const [passwordData, setPasswordData] = useState({
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//     });

//     const handleEdit = () => {
//         setIsEditing(true);
//         setEditData({ ...profileData });
//         setPasswordData({
//             currentPassword: '',
//             newPassword: '',
//             confirmPassword: ''
//         });
//     };

//     const handleSave = () => {
//         setProfileData({ ...editData });
//         setIsEditing(false);
//         setPasswordData({
//             currentPassword: '',
//             newPassword: '',
//             confirmPassword: ''
//         });
//     };

//     const handleCancel = () => {
//         setEditData({ ...profileData });
//         setIsEditing(false);
//         setPasswordData({
//             currentPassword: '',
//             newPassword: '',
//             confirmPassword: ''
//         });
//     };

//     const handleInputChange = (field, value) => {
//         setEditData(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     const handlePasswordChange = (field, value) => {
//         setPasswordData(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     const handlePasswordSave = () => {
//         if (passwordData.newPassword !== passwordData.confirmPassword) {
//             alert('New passwords do not match!');
//             return;
//         }
//         if (passwordData.newPassword.length < 8) {
//             alert('Password must be at least 8 characters long!');
//             return;
//         }
//         // Here you would typically call an API to change the password
//         console.log('Password changed successfully');
//         setPasswordData({
//             currentPassword: '',
//             newPassword: '',
//             confirmPassword: ''
//         });
//         alert('Password changed successfully!');
//     };

//     const handleDeleteProfile = () => {
//         // Here you would typically call an API to delete the profile
//         console.log('Profile deleted');
//         setShowDeleteConfirm(false);
//         // Reset to default or redirect user
//     };

//     return (
//         <div className="app-container-profile">
//             <Sidebar />
//             <div className="main-content-profile">
//                 <div className="profile-header">
//                     <h1>Profile Settings</h1>
//                     {!isEditing && (
//                         <div className="profile-actions">
//                             <button className="edit-profile-btn" onClick={handleEdit}>
//                                 <span>✏️</span>
//                                 Edit Profile
//                             </button>
//                             <button 
//                                 className="delete-profile-btn" 
//                                 onClick={() => setShowDeleteConfirm(true)}
//                             >
//                                 <span>🗑️</span>
//                                 Delete Profile
//                             </button>
//                         </div>
//                     )}
//                 </div>

//                 {!isEditing ? (
//                     <div className="profile-view">
//                         <div className="profile-card">
//                             <div className="profile-avatar">
//                                 <div className="avatar-circle">
//                                     {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
//                                 </div>
//                             </div>
                            
//                             <div className="profile-info">
//                                 <div className="info-section">
//                                     <label>Name</label>
//                                     <div className="info-value">{profileData.name}</div>
//                                 </div>
                                
//                                 <div className="info-section">
//                                     <label>Email</label>
//                                     <div className="info-value">{profileData.email}</div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="profile-edit">
//                         <div className="edit-form">
//                             <h3>Profile Information</h3>
//                             <div className="form-section">
//                                 <label>Name</label>
//                                 <input
//                                     type="text"
//                                     className="profile-input"
//                                     value={editData.name}
//                                     onChange={(e) => handleInputChange('name', e.target.value)}
//                                     placeholder="Enter your name"
//                                 />
//                             </div>
                            
//                             <div className="form-section">
//                                 <label>Email</label>
//                                 <input
//                                     type="email"
//                                     className="profile-input"
//                                     value={editData.email}
//                                     onChange={(e) => handleInputChange('email', e.target.value)}
//                                     placeholder="Enter your email"
//                                 />
//                             </div>
                            
//                             <div className="form-actions">
//                                 <button className="save-profile-btn" onClick={handleSave}>
//                                     Save Changes
//                                 </button>
//                                 <button className="cancel-profile-btn" onClick={handleCancel}>
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>
                        
//                         <div className="password-form">
//                             <h2>Change Password</h2>
//                             <div className="form-section">
//                                 <label>Current Password</label>
//                                 <input
//                                     type="password"
//                                     className="profile-input"
//                                     value={passwordData.currentPassword}
//                                     onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
//                                     placeholder="Enter current password"
//                                 />
//                             </div>
                            
//                             <div className="form-section">
//                                 <label>New Password</label>
//                                 <input
//                                     type="password"
//                                     className="profile-input"
//                                     value={passwordData.newPassword}
//                                     onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
//                                     placeholder="Enter new password (min 8 characters)"
//                                 />
//                             </div>
                            
//                             <div className="form-section">
//                                 <label>Confirm New Password</label>
//                                 <input
//                                     type="password"
//                                     className="profile-input"
//                                     value={passwordData.confirmPassword}
//                                     onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
//                                     placeholder="Confirm new password"
//                                 />
//                             </div>
                            
//                             <div className="password-actions">
//                                 <button className="save-password-btn" onClick={handlePasswordSave}>
//                                     Change Password
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {showDeleteConfirm && (
//                     <div className="delete-modal-overlay">
//                         <div className="delete-modal">
//                             <div className="modal-header">
//                                 <h3>Delete Profile</h3>
//                             </div>
//                             <div className="modal-content">
//                                 <p>Are you sure you want to delete your profile? This action cannot be undone and will permanently delete all your tasks, projects, and productivity data.</p>
//                             </div>
//                             <div className="modal-actions">
//                                 <button 
//                                     className="confirm-delete-btn" 
//                                     onClick={handleDeleteProfile}
//                                 >
//                                     Yes, Delete Profile
//                                 </button>
//                                 <button 
//                                     className="cancel-delete-btn" 
//                                     onClick={() => setShowDeleteConfirm(false)}
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Profile;

import './Profile.css';
import React, { useState } from 'react';
import Sidebar from '../sidebar/Sidebar';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [profileData, setProfileData] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com'
    });

    const [editData, setEditData] = useState({ ...profileData });
    
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

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
    };

    const handleSave = () => {
        setProfileData({ ...editData });
        setIsEditing(false);
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    const handleCancel = () => {
        setEditData({ ...profileData });
        setIsEditing(false);
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
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

    const handlePasswordSave = () => {
        // Check if current password is provided
        if (!passwordData.currentPassword.trim()) {
            alert('Please enter your current password!');
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
            
            alert(errorMessage);
            return;
        }

        // Check if new passwords match
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New passwords do not match!');
            return;
        }

        // Here you would typically call an API to change the password
        console.log('Password changed successfully');
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        alert('Password changed successfully!');
    };

    const handleDeleteProfile = () => {
        // Here you would typically call an API to delete the profile
        console.log('Profile deleted');
        setShowDeleteConfirm(false);
        // Reset to default or redirect user
    };

    // Get password validation for real-time feedback
    const passwordValidation = validatePassword(passwordData.newPassword);

    return (
        <div className="app-container-profile">
            <Sidebar />
            <div className="main-content-profile">
                <div className="profile-header">
                    <h1>Profile Settings</h1>
                    {!isEditing && (
                        <div className="profile-actions">
                            <button className="edit-profile-btn" onClick={handleEdit}>
                                <span>✏️</span>
                                Edit Profile
                            </button>
                            <button 
                                className="delete-profile-btn" 
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                <span>🗑️</span>
                                Delete Profile
                            </button>
                        </div>
                    )}
                </div>

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
                                />
                            </div>
                            
                            <div className="form-actions">
                                <button className="save-profile-btn" onClick={handleSave}>
                                    Save Changes
                                </button>
                                <button className="cancel-profile-btn" onClick={handleCancel}>
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
                                    disabled={!passwordValidation.isValid || passwordData.newPassword !== passwordData.confirmPassword || !passwordData.currentPassword}
                                >
                                    Change Password
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
                                >
                                    Yes, Delete Profile
                                </button>
                                <button 
                                    className="cancel-delete-btn" 
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
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