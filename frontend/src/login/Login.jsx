// import React, { useEffect, useCallback, useState } from 'react';
// import './Login.css';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//     const navigate = useNavigate();
//     const [username, setUsername] = React.useState("");
//     const [password, setPassword] = React.useState("");
//     const [error, setError] = React.useState("");

//     // Memoize handleLogin with useCallback
//     const handleLogin = useCallback(() => {
//         if (!username || !password) {
//             setError('Please fill in all fields');
//             setTimeout(() => setError(''), 2000); // Clear error after 2 seconds
//         } else if (username === 'user' && password === 'pass') {
//             navigate('/homepage');
//         } else {
//             setError('Wrong login!');
//             setTimeout(() => setError(''), 2000); // Clear error after 2 seconds
//         }
//     }, [username, password, navigate]); // Ensure dependencies are correct

//     // Add global "Enter" key event 
//     useEffect(() => {
//         const handleKeyDown = (e) => {
//             if (e.key === 'Enter') {
//                 handleLogin();
//             }
//         };
//         window.addEventListener('keydown', handleKeyDown);
//         return () => {
//             window.removeEventListener('keydown', handleKeyDown);
//         };
//     }, [handleLogin]); // useMemo ensures the function isn't redefined on each render

//     return (
//         <div className='login-page'>
//             <div className='login-box'>
//                 <h2>Login</h2>
//                 <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
//                 <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
//                 <button onClick={handleLogin}>Login</button>

//                 {/* This is the error message that will be displayed if the login fails */}
//                 {error && <div className='error-popup'>{error}</div>}
//             </div>
//         </div>
//     );
// };

// export default Login;

import React, { useEffect, useCallback, useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = useCallback(async () => {
        if (!username || !password) {
            setError('Please fill in all fields');
            setTimeout(() => setError(''), 2000);
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: username,
                    password: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message); // "Login successful"
                navigate('/homepage');
            } else {
                const errorData = await response.json();
                setError(errorData.detail || "Login failed");
                setTimeout(() => setError(''), 2000);
            }
        } catch (err) {
            setError("Server not reachable");
            setTimeout(() => setError(''), 2000);
        }
    }, [username, password, navigate]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                handleLogin();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleLogin]);

    return (
        <div className='login-page'>
            <div className='login-box'>
                <h2>Login</h2>
                <input
                    type='text'
                    placeholder='Email'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
                {error && <div className='error-popup'>{error}</div>}
            </div>
        </div>
    );
};

export default Login;

