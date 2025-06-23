import React, { useEffect, useCallback, useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [securityKey, setSecurityKey] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [error, setError] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
    
    // Security key popup states
    const [showSecurityKeyPopup, setShowSecurityKeyPopup] = useState(false);
    const [generatedSecurityKey, setGeneratedSecurityKey] = useState("");
    const [securityKeyConfirmed, setSecurityKeyConfirmed] = useState(false);

    const showError = (message) => {
        setError(message);
        setTimeout(() => setError(''), 3000);
    };

    const showSuccess = (message) => {
        console.log('showSuccess called with message:', message);
        setSuccessMessage(message);
        setShowSuccessAnimation(true);
        
        setTimeout(() => {
            setSuccessMessage('');
            setShowSuccessAnimation(false);
        }, 4000);
    };

    const clearForm = () => {
        setEmail("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setSecurityKey("");
        setNewPassword("");
        setConfirmNewPassword("");
        setError("");
        setSuccessMessage("");
        setShowSuccessAnimation(false);
        setShowSecurityKeyPopup(false);
        setGeneratedSecurityKey("");
        setSecurityKeyConfirmed(false);
    };

    // Generate random 16-character security key
    const generateSecurityKey = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 16; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return 'Password must be at least 8 characters long';
        }
        if (!hasUpperCase) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!hasLowerCase) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!hasNumbers) {
            return 'Password must contain at least one number';
        }
        if (!hasSpecialChar) {
            return 'Password must contain at least one special character';
        }
        return null;
    };

    const handleLogin = useCallback(async () => {
        if (!email || !password || (isRegistering && (!username || !confirmPassword))) {
            showError('Please fill in all fields');
            return;
        }

        if (isRegistering) {
            const passwordError = validatePassword(password);
            if (passwordError) {
                showError(passwordError);
                return;
            }

            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }

            // Generate and show security key before registration
            const newSecurityKey = generateSecurityKey();
            setGeneratedSecurityKey(newSecurityKey);
            setShowSecurityKeyPopup(true);
            return; // Stop here and wait for user confirmation
        }

        const url = "http://localhost:8000/login";

        try {
            console.log('Making request to:', url);
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
                console.log('Success condition met!');
                console.log('Calling showSuccess for login');
                
                // STORE USER DATA IN LOCALSTORAGE
                localStorage.setItem('user_id', data.user_id.toString());
                localStorage.setItem('username', data.username);
                localStorage.setItem('email', data.email);
                
                console.log('Stored user data:', {
                    user_id: data.user_id,
                    username: data.username,
                    email: data.email
                });
                
                showSuccess("Login successful! Redirecting...");
                setTimeout(() => {
                    navigate('/homepage');
                }, 1000);
            } else {
                console.log('Response not ok, showing error');
                showError(data.detail || "Login failed");
            }
        } catch (err) {
            console.error('Catch block error:', err);
            showError("Server not reachable");
        }
    }, [email, password, username, confirmPassword, isRegistering, navigate]);

    // Handle registration after security key confirmation
    const handleRegistrationWithSecurityKey = useCallback(async () => {
        const url = "http://localhost:8000/register";

        try {
            console.log('Making registration request with security key');
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    username: username,
                    security_key: generatedSecurityKey
                }),
            });

            console.log('Registration response status:', response.status);
            const data = await response.json();
            console.log('Registration response data:', data);

            if (response.ok) {
                console.log('Registration successful!');
                setShowSecurityKeyPopup(false);
                showSuccess("Account created successfully! You can now log in with your new credentials.");
                
                setTimeout(() => {
                    setIsRegistering(false);
                    clearForm();
                }, 2000);
            } else {
                console.log('Registration failed, showing error');
                setShowSecurityKeyPopup(false);
                showError(data.detail || "Registration failed");
            }
        } catch (err) {
            console.error('Registration error:', err);
            setShowSecurityKeyPopup(false);
            showError("Server not reachable");
        }
    }, [email, password, username, generatedSecurityKey]);

    const handlePasswordReset = useCallback(async () => {
        if (!securityKey || !newPassword || !confirmNewPassword) {
            showError('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            showError('New passwords do not match');
            return;
        }

        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            showError(passwordError);
            return;
        }

        try {
            console.log('Making password reset request');
            const response = await fetch("http://localhost:8000/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    security_key: securityKey,
                    new_password: newPassword
                }),
            });

            console.log('Password reset response status:', response.status);
            console.log('Password reset response ok:', response.ok);

            const data = await response.json();
            console.log('Password reset response data:', data);

            if (response.ok) {
                console.log('Password reset success condition met!');
                console.log('Calling showSuccess for password reset');
                showSuccess("Password reset successfully! You can now log in with your new password.");
                
                setTimeout(() => {
                    setIsResettingPassword(false);
                    clearForm();
                }, 2000);
            } else {
                console.log('Password reset response not ok, showing error');
                showError(data.detail || "Failed to reset password. Please check your security key.");
            }
        } catch (err) {
            console.error('Password reset catch block error:', err);
            showError("Server not reachable");
        }
    }, [securityKey, newPassword, confirmNewPassword]);

    const resetToLogin = () => {
        setIsRegistering(false);
        setIsResettingPassword(false);
        clearForm();
    };

    const handleSecurityKeyConfirmation = () => {
        if (securityKeyConfirmed) {
            handleRegistrationWithSecurityKey();
        } else {
            showError('Please confirm that you have copied your security key');
        }
    };

    const copySecurityKey = () => {
        navigator.clipboard.writeText(generatedSecurityKey).then(() => {
            showSuccess('Security key copied to clipboard!');
        }).catch(() => {
            showError('Failed to copy to clipboard. Please copy manually.');
        });
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter' && !showSecurityKeyPopup) {
                if (isResettingPassword) {
                    handlePasswordReset();
                } else {
                    handleLogin();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleLogin, handlePasswordReset, isResettingPassword, showSecurityKeyPopup]);

    const renderSecurityKeyPopup = () => (
        <div className="security-key-overlay">
            <div className="security-key-popup">
                <h3>⚠️ Important: Save Your Security Key</h3>
                <p className="security-key-warning">
                    This is your <strong>one-time security key</strong>. You will need this key to reset your password if you forget it.
                </p>
                <div className="security-key-display">
                    <code>{generatedSecurityKey}</code>
                    <button 
                        type="button" 
                        className="copy-button" 
                        onClick={copySecurityKey}
                        title="Copy to clipboard"
                    >
                        📋
                    </button>
                </div>
                <p className="security-key-instructions">
                    <strong>Save this key in a secure location immediately!</strong><br/>
                    This key will NOT be shown again after account creation.
                </p>
                
                <div className="security-key-confirmation">
                    <label className="checkbox-container">
                        <input 
                            type="checkbox" 
                            checked={securityKeyConfirmed}
                            onChange={(e) => setSecurityKeyConfirmed(e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        I have copied and securely saved my security key
                    </label>
                </div>

                <div className="security-key-actions">
                    <button 
                        type="button"
                        className="confirm-button" 
                        onClick={handleSecurityKeyConfirmation}
                        disabled={!securityKeyConfirmed}
                    >
                        Complete Registration
                    </button>
                    <button 
                        type="button"
                        className="cancel-button" 
                        onClick={() => setShowSecurityKeyPopup(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );

    const renderPasswordResetForm = () => (
        <>
            <h2>Reset Password</h2>

            <input
                type='password'
                placeholder='Enter your security key'
                value={securityKey}
                onChange={(e) => setSecurityKey(e.target.value)}
            />

            <input
                type='password'
                placeholder='New Password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
                type='password'
                placeholder='Confirm New Password'
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
            />

            <button onClick={handlePasswordReset} className='primary-button'>
                Reset Password
            </button>

            <div className='toggle-option'>
                <p>
                    Remember your password?{" "}<br /><br />
                    <span onClick={resetToLogin}>
                        Back to Login
                    </span>
                </p>
            </div>
        </>
    );

    const renderLoginForm = () => (
        <>
            <h2>{isRegistering ? "Create Account" : "Login"}</h2>

            {isRegistering && (
                <input
                    type='text'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            )}

            <input
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {isRegistering && (
                <input
                    type='password'
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            )}

            <button onClick={handleLogin}>{isRegistering ? "Register" : "Login"}</button>

            {!isRegistering && (
                <div className='forgot-password'>
                    <span onClick={() => setIsResettingPassword(true)}>
                        Forgot Password?
                    </span>
                </div>
            )}

            <div className='toggle-option'>
                {isRegistering ? (
                    <p>
                        Already have an account?{" "}
                        <span onClick={() => {
                            setIsRegistering(false);
                            clearForm();
                        }}>
                            Log in
                        </span>
                    </p>
                ) : (
                    <p>
                        Don't have an account?{" "}
                        <span onClick={() => {
                            setIsRegistering(true);
                            clearForm();
                        }}>
                            Create one
                        </span>
                    </p>
                )}
            </div>
        </>
    );

    return (
        <div className='login-page'>
            <div className='login-box'>
                {isResettingPassword ? renderPasswordResetForm() : renderLoginForm()}

                {error && <div className='error-popup'>{error}</div>}
                {successMessage && (
                    <div className={`success-popup ${showSuccessAnimation ? 'animate' : ''}`}>
                        {successMessage}
                    </div>
                )}
            </div>

            {showSecurityKeyPopup && renderSecurityKeyPopup()}
        </div>
    );
};

export default Login;