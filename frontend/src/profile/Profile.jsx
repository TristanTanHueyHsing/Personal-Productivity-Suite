import './Profile.css';
import React from 'react';
import Sidebar from '../sidebar/Sidebar';

const Profile = () => {
    return (
        <div className="app-container-profile">
            <Sidebar />
            <div className="main-content-profile">
                <h1>Profile</h1>
                {/* Add your Profile implementation here */}
                <p>This is the profile page.</p>
            </div>
        </div>
    );
}
export default Profile;