import React, { useEffect, useCallback } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");

    // Memoize handleLogin with useCallback
    const handleLogin = useCallback(() => {
        if (!username || !password) {
            setError('Please fill in all fields');
            setTimeout(() => setError(''), 2000); // Clear error after 2 seconds
        } else if (username === 'user' && password === 'pass') {
            navigate('/homepage');
        } else {
            setError('Wrong login!');
            setTimeout(() => setError(''), 2000); // Clear error after 2 seconds
        }
    }, [username, password, navigate]); // Ensure dependencies are correct

    // Add global "Enter" key event 
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                handleLogin();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleLogin]); // useMemo ensures the function isn't redefined on each render

    return (
        <div className='login-page'>
            <div className='login-box'>
                <h2>Login</h2>
                <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <button onClick={handleLogin}>Login</button>

                {/* This is the error message that will be displayed if the login fails */}
                {error && <div className='error-popup'>{error}</div>}
            </div>
        </div>
    );
};

export default Login;
