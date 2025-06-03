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

// import React, { useEffect, useCallback, useState } from 'react';
// import './Login.css';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//     const navigate = useNavigate();
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");

//     const handleLogin = useCallback(async () => {
//         if (!username || !password) {
//             setError('Please fill in all fields');
//             setTimeout(() => setError(''), 2000);
//             return;
//         }

//         try {
//             const response = await fetch("http://localhost:8000/login", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     email: username,
//                     password: password,
//                 }),
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 console.log(data.message); // "Login successful"
//                 navigate('/homepage');
//             } else {
//                 const errorData = await response.json();
//                 setError(errorData.detail || "Login failed");
//                 setTimeout(() => setError(''), 2000);
//             }
//         } catch (err) {
//             setError("Server not reachable");
//             setTimeout(() => setError(''), 2000);
//         }
//     }, [username, password, navigate]);

//     useEffect(() => {
//         const handleKeyDown = (e) => {
//             if (e.key === 'Enter') {
//                 handleLogin();
//             }
//         };
//         window.addEventListener('keydown', handleKeyDown);
//         return () => window.removeEventListener('keydown', handleKeyDown);
//     }, [handleLogin]);

//     return (
//         <div className='login-page'>
//             <div className='login-box'>
//                 <h2>Login</h2>
//                 <input
//                     type='text'
//                     placeholder='Email'
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                 />
//                 <input
//                     type='password'
//                     placeholder='Password'
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <button onClick={handleLogin}>Login</button>
//                 {error && <div className='error-popup'>{error}</div>}
//             </div>
//         </div>
//     );
// };

// export default Login;

// import React, { useEffect, useCallback, useState } from 'react';
// import './Login.css';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//     const navigate = useNavigate();
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const [isRegistering, setIsRegistering] = useState(false);
//     const [successMessage, setSuccessMessage] = useState("");

//     const handleLogin = useCallback(async () => {
//         if (!username || !password) {
//             setError('Please fill in all fields');
//             setTimeout(() => setError(''), 2000);
//             return;
//         }

//         const url = isRegistering ? "http://localhost:8000/register" : "http://localhost:8000/login";

//         try {
//             const response = await fetch(url, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     email: username,
//                     password: password,
//                 }),
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 if (isRegistering) {
//                     setSuccessMessage("Account created successfully! You can now log in.");
//                     setIsRegistering(false);
//                 } else {
//                     navigate('/homepage');
//                 }
//             } else {
//                 setError(data.detail || (isRegistering ? "Registration failed" : "Login failed"));
//                 setTimeout(() => setError(''), 2000);
//             }
//         } catch (err) {
//             setError("Server not reachable");
//             setTimeout(() => setError(''), 2000);
//         }
//     }, [username, password, isRegistering, navigate]);

//     useEffect(() => {
//         const handleKeyDown = (e) => {
//             if (e.key === 'Enter') {
//                 handleLogin();
//             }
//         };
//         window.addEventListener('keydown', handleKeyDown);
//         return () => window.removeEventListener('keydown', handleKeyDown);
//     }, [handleLogin]);

//     return (
//         <div className='login-page'>
//             <div className='login-box'>
//                 <h2>{isRegistering ? "Create Account" : "Login"}</h2>
//                 <input
//                     type='text'
//                     placeholder='Email'
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                 />
//                 <input
//                     type='password'
//                     placeholder='Password'
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <button onClick={handleLogin}>{isRegistering ? "Register" : "Login"}</button>

//                 {error && <div className='error-popup'>{error}</div>}
//                 {successMessage && <div className='success-popup'>{successMessage}</div>}

//                 <div className='toggle-option'>
//                     {isRegistering ? (
//                         <p>
//                             Already have an account?{" "}
//                             <span onClick={() => { setIsRegistering(false); setSuccessMessage(""); }}>
//                                 Log in
//                             </span>
//                         </p>
//                     ) : (
//                         <p>
//                             Don't have an account?{" "}
//                             <span onClick={() => { setIsRegistering(true); setError(""); }}>
//                                 Create one
//                             </span>
//                         </p>
//                     )}
//                 </div>
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
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState(""); // New: name field for registration
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // New: confirm password
    const [error, setError] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleLogin = useCallback(async () => {
        if (!email || !password || (isRegistering && (!username || !confirmPassword))) {
            setError('Please fill in all fields');
            setTimeout(() => setError(''), 2000);
            return;
        }

        if (isRegistering && password !== confirmPassword) {
            setError('Passwords do not match');
            setTimeout(() => setError(''), 2000);
            return;
        }

        const url = isRegistering ? "http://localhost:8000/register" : "http://localhost:8000/login";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    ...(isRegistering && { username }) // send username only if registering
                }),
            });

            const data = await response.json();

            if (response.ok) {
                if (isRegistering) {
                    setSuccessMessage("Account created successfully! You can now log in.");
                    setIsRegistering(false);
                    setTimeout(() => setSuccessMessage(""), 2000);
                } else {
                    navigate('/homepage');
                }

                setEmail("");
                setUsername("");
                setPassword("");
                setConfirmPassword("");

            } else {
                setError(data.detail || (isRegistering ? "Registration failed" : "Login failed"));
                setTimeout(() => setError(''), 2000);
            }
        } catch (err) {
            setError("Server not reachable");
            setTimeout(() => setError(''), 2000);
        }
    }, [email, password, username, confirmPassword, isRegistering, navigate]);

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

                {error && <div className='error-popup'>{error}</div>}
                {successMessage && <div className='success-popup'>{successMessage}</div>}

                <div className='toggle-option'>
                    {isRegistering ? (
                        <p>
                            Already have an account?{" "}
                            <span onClick={() => {
                                setIsRegistering(false);
                                setSuccessMessage("");
                                setError("");
                                setEmail("");
                                setUsername("");
                                setPassword("");
                                setConfirmPassword("");
                            }}>
                                Log in
                            </span>
                        </p>
                    ) : (
                        <p>
                            Don't have an account?{" "}
                            <span onClick={() => {
                                setIsRegistering(true);
                                setError("");
                                setSuccessMessage("");
                                setEmail("");
                                setUsername("");
                                setPassword("");
                                setConfirmPassword("");
                            }}>
                                Create one
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
