// import React, { useState, useEffect, useRef } from 'react';
// import Sidebar from '../sidebar/Sidebar';
// import './Pomodoro.css';

// const Pomodoro = () => {
//     const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
//     const [isRunning, setIsRunning] = useState(false);
//     const [pomodoroCount, setPomodoroCount] = useState(0);
//     const [isBreak, setIsBreak] = useState(false);
//     const timerRef = useRef(null);

//     useEffect(() => {
//         if (isRunning) {
//             timerRef.current = setInterval(() => {
//                 setTimeLeft(prev => {
//                     if (prev <= 1) {
//                         clearInterval(timerRef.current);
//                         const completedSession = !isBreak;
//                         if (completedSession) setPomodoroCount(p => p + 1);
//                         setIsBreak(prev => !prev);
//                         setTimeLeft(!isBreak ? 5 * 60 : 25 * 60); // 5 min break, 25 min work
//                         return !isBreak ? 5 * 60 : 25 * 60;
//                     }
//                     return prev - 1;
//                 });
//             }, 1000);
//         } else {
//             clearInterval(timerRef.current);
//         }

//         return () => clearInterval(timerRef.current);
//     }, [isRunning, isBreak]);

//     const formatTime = (seconds) => {
//         const m = Math.floor(seconds / 60);
//         const s = seconds % 60;
//         return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
//     };

//     const progressPercent = 100 - (timeLeft / (isBreak ? 300 : 1500)) * 100;

//     // Dots indicator for Pomodoro sessions and breaks
//     const totalSteps = 8; // 4 focus + 3 short breaks + 1 long break
//     const currentStep = Math.min(pomodoroCount * 2 + (isBreak ? 1 : 0), totalSteps - 1);

//     const renderDots = () => {
//         const dots = [];
//         for (let i = 0; i < totalSteps; i++) {
//             const isFocusDot = i % 2 === 0;
//             const isLongBreakDot = i === totalSteps - 1;

//             let color = '#4B5563'; // gray default for upcoming

//             if (i < currentStep) {
//                 color = isFocusDot ? '#FCD34D' : (isLongBreakDot ? '#8B5CF6' : '#14B8A6');
//             } else if (i === currentStep) {
//                 color = isFocusDot ? '#FBBF24' : (isLongBreakDot ? '#A78BFA' : '#2DD4BF');
//             }

//             dots.push(
//                 <span
//                     key={i}
//                     className="pomodoro-dot"
//                     style={{ backgroundColor: color }}
//                     title={
//                         isFocusDot
//                             ? 'Focus Session'
//                             : isLongBreakDot
//                                 ? 'Long Break'
//                                 : 'Short Break'
//                     }
//                 />
//             );
//         }
//         return dots;
//     };

//     return (
//         <div className="app-container-pomodoro">
//             <Sidebar />
//             <div className="main-content-pomodoro">
//                 <h1>Pomodoro Timer</h1>

//                 <div className="timer-wrapper">
//                     <svg className="progress-ring" width="220" height="220">
//                         <circle
//                             className="progress-ring__circle-bg"
//                             stroke="#1F2937"
//                             strokeWidth="10"
//                             fill="transparent"
//                             r="100"
//                             cx="110"
//                             cy="110"
//                         />
//                         <circle
//                             className="progress-ring__circle"
//                             stroke="#FCD34D"
//                             strokeWidth="10"
//                             fill="transparent"
//                             r="100"
//                             cx="110"
//                             cy="110"
//                             strokeDasharray={2 * Math.PI * 100}
//                             strokeDashoffset={(1 - progressPercent / 100) * 2 * Math.PI * 100}
//                         />
//                     </svg>

//                     <div className="timer-display">
//                         {formatTime(timeLeft)}
//                     </div>
//                 </div>

//                 {/* Pomodoro session dots */}
//                 <div className="dots-container" aria-label="Pomodoro session progress">
//                     {renderDots()}
//                 </div>

//                 {/* Buttons */}
//                 <div className="timer-buttons">
//                     <button onClick={() => setIsRunning(true)} disabled={isRunning}>Start</button>
//                     <button onClick={() => setIsRunning(false)} disabled={!isRunning}>Pause</button>
//                     <button onClick={() => {
//                         clearInterval(timerRef.current);
//                         setIsRunning(false);
//                         setIsBreak(false);
//                         setTimeLeft(25 * 60);
//                     }}>End Session</button>
//                 </div>

//                 <div className="session-info">
//                     <p>Mode: {isBreak ? "Break" : "Focus"}</p>
//                     <p>Completed Pomodoros: {pomodoroCount}</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Pomodoro;

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import Sidebar from '../sidebar/Sidebar';
// import './Pomodoro.css';
// import alarm from '../../src/assets/alarm.mp3';

// const Pomodoro = () => {
//     // Durations in seconds for test mode
//     const FOCUS_TIME = 10;//1500
//     const SHORT_BREAK_TIME = 5;//300
//     const LONG_BREAK_TIME = 15;//900

//     // State
//     const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
//     const [isRunning, setIsRunning] = useState(false);
//     const [pomodoroCount, setPomodoroCount] = useState(0);
//     const [completedPomodoros, setCompletedPomodoros] = useState(0); // Simple counter for completed focus sessions
//     const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

//     const [mode, setMode] = useState('focus'); // 'focus' | 'shortBreak' | 'longBreak'
//     const timerRef = useRef(null);

//     // Request notification permission on component mount
//     useEffect(() => {
//         if (Notification.permission === 'default') {
//             Notification.requestPermission().then(permission => {
//                 setNotificationPermission(permission);
//             });
//         }
//     }, []);

//     // Function to show notification
//     const showNotification = useCallback((title, body) => {
//         if (notificationPermission === 'granted') {
//             const notification = new Notification(title, {
//                 body: body,
//                 icon: '/favicon.ico', // You can add a custom icon here
//                 badge: '/favicon.ico',
//                 tag: 'pomodoro-timer',
//                 requireInteraction: true // Keeps notification visible until user interacts
//             });

//             // Auto-close notification after 10 seconds
//             setTimeout(() => {
//                 notification.close();
//             }, 10000);

//             // Optional: Add click handler to focus the window
//             notification.onclick = () => {
//                 window.focus();
//                 notification.close();
//             };
//         }
//     }, [notificationPermission]);

//     // Function to play audio alert using custom alarm.mp3
//     const playAlertSound = useCallback(() => {
//         try {
//             const audio = new Audio(alarm);
//             audio.volume = 0.7; // Set volume to 70%
//             audio.play().catch(error => {
//                 console.warn('Could not play alarm sound:', error);
//                 // Fallback to beep if audio file fails
//                 fallbackBeep();
//             });
//             // Stop the audio after 2 seconds (adjust this value as needed)
//             setTimeout(() => {
//                 audio.pause();
//                 audio.currentTime = 0; // Reset to beginning for next play
//             }, 2500); // 2 seconds - change this to your desired length
//         } catch (error) {
//             console.warn('Audio file not found, using fallback beep:', error);
//             fallbackBeep();
//         }
//     }, []);

//     // Fallback beep function in case audio file doesn't work
//     const fallbackBeep = () => {
//         try {
//             const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//             const oscillator = audioContext.createOscillator();
//             const gainNode = audioContext.createGain();

//             oscillator.connect(gainNode);
//             gainNode.connect(audioContext.destination);

//             oscillator.frequency.value = 800; // Frequency in Hz
//             gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
//             gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

//             oscillator.start(audioContext.currentTime);
//             oscillator.stop(audioContext.currentTime + 1);
//         } catch (error) {
//             console.warn('Could not play any sound:', error);
//         }
//     };

//     // Determine current duration based on mode
//     const getCurrentDuration = () => {
//         if (mode === 'focus') return FOCUS_TIME;
//         if (mode === 'shortBreak') return SHORT_BREAK_TIME;
//         if (mode === 'longBreak') return LONG_BREAK_TIME;
//         return FOCUS_TIME;
//     };

//     // Effect to handle the countdown
//     useEffect(() => {
//         if (!isRunning) {
//             clearInterval(timerRef.current);
//             return;
//         }

//         timerRef.current = setInterval(() => {
//             setTimeLeft(prev => {
//                 if (prev <= 1) {
//                     // Timer has ended, stop the timer and transition to next mode
//                     setIsRunning(false);

//                     // Play sound alert
//                     playAlertSound();

//                     if (mode === 'focus') {
//                         // Finished a focus session - increment completed pomodoros
//                         setCompletedPomodoros(prev => prev + 1);

//                         // Show notification for completed focus session
//                         showNotification(
//                             '🍅 Focus Session Complete!',
//                             'Great job! Time for a break.'
//                         );

//                         // Determine break type based on current pomodoro count + 1 (the one we just completed)
//                         if ((pomodoroCount + 1) % 4 === 0) {
//                             setMode('longBreak');
//                             return LONG_BREAK_TIME;
//                         } else {
//                             setMode('shortBreak');
//                             return SHORT_BREAK_TIME;
//                         }
//                     } else {
//                         // Finished a break, start focus again
//                         // Increment pomodoro count for the cycle tracking
//                         const newCount = pomodoroCount + 1;
//                         setPomodoroCount(newCount);

//                         // Show notification for completed break
//                         const breakType = mode === 'longBreak' ? 'Long Break' : 'Short Break';
//                         showNotification(
//                             `The ☕ ${breakType} Complete!`,
//                             'Ready to focus again? Return to the app to continue.'
//                         );

//                         // If we just completed a long break (4th pomodoro), reset the cycle
//                         if (mode === 'longBreak') {
//                             setPomodoroCount(0); // Reset cycle counter for dots
//                         }

//                         setMode('focus');
//                         return FOCUS_TIME;
//                     }
//                 }
//                 return prev - 1;
//             });
//         }, 1000);

//         return () => clearInterval(timerRef.current);
//     }, [isRunning, mode, pomodoroCount, showNotification, playAlertSound]);

//     // Format seconds to mm:ss
//     const formatTime = (seconds) => {
//         const m = Math.floor(seconds / 60);
//         const s = seconds % 60;
//         return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
//     };

//     // Progress calculation (0 to 100%)
//     const progressPercent = 100 - (timeLeft / getCurrentDuration()) * 100;

//     // Calculate current step for dots display
//     // Track progress through sessions - focus sessions that have been started
//     const getCurrentStepForDots = () => {
//         if (mode === 'focus') {
//             // Currently in focus mode - show the current focus session
//             return pomodoroCount * 2;
//         } else {
//             // Currently in break mode - show the break after the focus session
//             return pomodoroCount * 2 + 1;
//         }
//     };

//     const renderDots = () => {
//         const totalSteps = 8; // 4 focus + 3 short breaks + 1 long break
//         const currentStep = Math.min(getCurrentStepForDots(), totalSteps - 1);

//         const dots = [];
//         for (let i = 0; i < totalSteps; i++) {
//             const isFocusDot = i % 2 === 0;
//             const isLongBreakDot = i === totalSteps - 1;

//             let color = '#4B5563'; // Gray default for upcoming steps

//             if (i < currentStep) {
//                 // Completed steps
//                 color = isFocusDot ? '#FCD34D' : (isLongBreakDot ? '#8B5CF6' : '#14B8A6');
//             } else if (i === currentStep) {
//                 // Current active step
//                 color = isFocusDot ? '#FBBF24' : (isLongBreakDot ? '#A78BFA' : '#2DD4BF');
//             }

//             dots.push(
//                 <span
//                     key={i}
//                     className="pomodoro-dot"
//                     style={{ backgroundColor: color }}
//                     title={
//                         isFocusDot
//                             ? 'Focus Session'
//                             : isLongBreakDot
//                                 ? 'Long Break'
//                                 : 'Short Break'
//                     }
//                 />
//             );
//         }
//         return dots;
//     };

//     // Function to request notification permission manually
//     const requestNotificationPermission = async () => {
//         const permission = await Notification.requestPermission();
//         setNotificationPermission(permission);
//     };

//     return (
//         <div className="app-container-pomodoro">
//             <Sidebar />
//             <div className="main-content-pomodoro">
//                 <h1>Pomodoro Timer</h1>

//                 {notificationPermission !== 'granted' && (
//                     <div className="notification-prompt" style={{
//                         padding: '10px',
//                         margin: '10px 0',
//                         backgroundColor: '#FEF3C7',
//                         border: '1px solid #F59E0B',
//                         borderRadius: '5px',
//                         textAlign: 'center'
//                     }}>
//                         <p>Enable notifications to get alerts when your timer ends!</p>
//                         <button
//                             onClick={requestNotificationPermission}
//                             style={{
//                                 padding: '5px 15px',
//                                 backgroundColor: '#F59E0B',
//                                 color: 'white',
//                                 border: 'none',
//                                 borderRadius: '3px',
//                                 cursor: 'pointer'
//                             }}
//                         >
//                             Enable Notifications
//                         </button>
//                     </div>
//                 )}

//                 <div className="timer-wrapper">
//                     <svg className="progress-ring" width="220" height="220">
//                         <circle
//                             className="progress-ring__circle-bg"
//                             stroke="#1F2937"
//                             strokeWidth="10"
//                             fill="transparent"
//                             r="100"
//                             cx="110"
//                             cy="110"
//                         />
//                         <circle
//                             className="progress-ring__circle"
//                             stroke="#FCD34D"
//                             strokeWidth="10"
//                             fill="transparent"
//                             r="100"
//                             cx="110"
//                             cy="110"
//                             strokeDasharray={2 * Math.PI * 100}
//                             strokeDashoffset={(1 - progressPercent / 100) * 2 * Math.PI * 100}
//                         />
//                     </svg>

//                     <div className="timer-display">{formatTime(timeLeft)}</div>
//                 </div>

//                 <div className="dots-container" aria-label="Pomodoro session progress">
//                     {renderDots()}
//                 </div>

//                 <div className="timer-buttons">
//                     <button onClick={() => setIsRunning(true)} disabled={isRunning}>Start</button>
//                     <button onClick={() => setIsRunning(false)} disabled={!isRunning}>Pause</button>
//                     <button onClick={() => {
//                         clearInterval(timerRef.current);
//                         setIsRunning(false);
//                         setPomodoroCount(0);
//                         setCompletedPomodoros(0);
//                         setMode('focus');
//                         setTimeLeft(FOCUS_TIME);
//                     }}>End Session</button>
//                 </div>

//                 <div className="session-info">
//                     <p>Mode: {mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}</p>
//                     <p>Completed Pomodoros: {completedPomodoros / 2}</p>
//                     <p>Debug - Current Step: {getCurrentStepForDots() + 1}</p>
//                     <p>Notifications: {notificationPermission === 'granted' ? '✅ Enabled' : '❌ Disabled'}</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Pomodoro;

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import Sidebar from '../sidebar/Sidebar';
// import './Pomodoro.css';
// import alarm from '../../src/assets/alarm.mp3';

// const Pomodoro = () => {
//     // Durations in seconds for test mode
//     const FOCUS_TIME = 10;//1500
//     const SHORT_BREAK_TIME = 5;//300
//     const LONG_BREAK_TIME = 15;//900

//     // State
//     const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
//     const [isRunning, setIsRunning] = useState(false);
//     const [pomodoroCount, setPomodoroCount] = useState(0);
//     const [completedPomodoros, setCompletedPomodoros] = useState(0); // Simple counter for completed focus sessions
//     const [mode, setMode] = useState('focus'); // 'focus' | 'shortBreak' | 'longBreak'
//     const timerRef = useRef(null);

//     // Function to play audio alert using custom alarm.mp3
//     const playAlertSound = useCallback(() => {
//         try {
//             const audio = new Audio(alarm);
//             audio.volume = 0.7; // Set volume to 70%
//             audio.play().catch(error => {
//                 console.warn('Could not play alarm sound:', error);
//                 // Fallback to beep if audio file fails
//                 fallbackBeep();
//             });
//             // Stop the audio after 2 seconds (adjust this value as needed)
//             setTimeout(() => {
//                 audio.pause();
//                 audio.currentTime = 0; // Reset to beginning for next play
//             }, 2500); // 2.5 seconds - change this to your desired length
//         } catch (error) {
//             console.warn('Audio file not found, using fallback beep:', error);
//             fallbackBeep();
//         }
//     }, []);

//     // Fallback beep function in case audio file doesn't work
//     const fallbackBeep = () => {
//         try {
//             const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//             const oscillator = audioContext.createOscillator();
//             const gainNode = audioContext.createGain();

//             oscillator.connect(gainNode);
//             gainNode.connect(audioContext.destination);

//             oscillator.frequency.value = 800; // Frequency in Hz
//             gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
//             gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

//             oscillator.start(audioContext.currentTime);
//             oscillator.stop(audioContext.currentTime + 1);
//         } catch (error) {
//             console.warn('Could not play any sound:', error);
//         }
//     };

//     // Determine current duration based on mode
//     const getCurrentDuration = () => {
//         if (mode === 'focus') return FOCUS_TIME;
//         if (mode === 'shortBreak') return SHORT_BREAK_TIME;
//         if (mode === 'longBreak') return LONG_BREAK_TIME;
//         return FOCUS_TIME;
//     };

//     // Effect to handle the countdown
//     useEffect(() => {
//         if (!isRunning) {
//             clearInterval(timerRef.current);
//             return;
//         }

//         timerRef.current = setInterval(() => {
//             setTimeLeft(prev => {
//                 if (prev <= 1) {
//                     // Timer has ended, stop the timer and transition to next mode
//                     setIsRunning(false);

//                     // Play sound alert
//                     playAlertSound();

//                     if (mode === 'focus') {
//                         // Finished a focus session - increment completed pomodoros
//                         setCompletedPomodoros(prev => prev + 1);

//                         // Determine break type based on current pomodoro count + 1 (the one we just completed)
//                         if ((pomodoroCount + 1) % 4 === 0) {
//                             setMode('longBreak');
//                             return LONG_BREAK_TIME;
//                         } else {
//                             setMode('shortBreak');
//                             return SHORT_BREAK_TIME;
//                         }
//                     } else {
//                         // Finished a break, start focus again
//                         // Increment pomodoro count for the cycle tracking
//                         const newCount = pomodoroCount + 1;
//                         setPomodoroCount(newCount);

//                         // If we just completed a long break (4th pomodoro), reset the cycle
//                         if (mode === 'longBreak') {
//                             setPomodoroCount(0); // Reset cycle counter for dots
//                         }

//                         setMode('focus');
//                         return FOCUS_TIME;
//                     }
//                 }
//                 return prev - 1;
//             });
//         }, 1000);

//         return () => clearInterval(timerRef.current);
//     }, [isRunning, mode, pomodoroCount, playAlertSound]);

//     // Format seconds to mm:ss
//     const formatTime = (seconds) => {
//         const m = Math.floor(seconds / 60);
//         const s = seconds % 60;
//         return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
//     };

//     // Progress calculation (0 to 100%)
//     const progressPercent = 100 - (timeLeft / getCurrentDuration()) * 100;

//     // Calculate current step for dots display
//     // Track progress through sessions - focus sessions that have been started
//     const getCurrentStepForDots = () => {
//         if (mode === 'focus') {
//             // Currently in focus mode - show the current focus session
//             return pomodoroCount * 2;
//         } else {
//             // Currently in break mode - show the break after the focus session
//             return pomodoroCount * 2 + 1;
//         }
//     };

//     const renderDots = () => {
//         const totalSteps = 8; // 4 focus + 3 short breaks + 1 long break
//         const currentStep = Math.min(getCurrentStepForDots(), totalSteps - 1);

//         const dots = [];
//         for (let i = 0; i < totalSteps; i++) {
//             const isFocusDot = i % 2 === 0;
//             const isLongBreakDot = i === totalSteps - 1;

//             let color = '#4B5563'; // Gray default for upcoming steps

//             if (i < currentStep) {
//                 // Completed steps
//                 color = isFocusDot ? '#FCD34D' : (isLongBreakDot ? '#8B5CF6' : '#14B8A6');
//             } else if (i === currentStep) {
//                 // Current active step
//                 color = isFocusDot ? '#FBBF24' : (isLongBreakDot ? '#A78BFA' : '#2DD4BF');
//             }

//             dots.push(
//                 <span
//                     key={i}
//                     className="pomodoro-dot"
//                     style={{ backgroundColor: color }}
//                     title={
//                         isFocusDot
//                             ? 'Focus Session'
//                             : isLongBreakDot
//                                 ? 'Long Break'
//                                 : 'Short Break'
//                     }
//                 />
//             );
//         }
//         return dots;
//     };

//     return (
//         <div className="app-container-pomodoro">
//             <Sidebar />
//             <div className="main-content-pomodoro">
//                 <h1>Pomodoro Timer</h1>

//                 <div className="timer-wrapper">
//                     <svg className="progress-ring" width="220" height="220">
//                         <circle
//                             className="progress-ring__circle-bg"
//                             stroke="#1F2937"
//                             strokeWidth="10"
//                             fill="transparent"
//                             r="100"
//                             cx="110"
//                             cy="110"
//                         />
//                         <circle
//                             className="progress-ring__circle"
//                             stroke="#FCD34D"
//                             strokeWidth="10"
//                             fill="transparent"
//                             r="100"
//                             cx="110"
//                             cy="110"
//                             strokeDasharray={2 * Math.PI * 100}
//                             strokeDashoffset={(1 - progressPercent / 100) * 2 * Math.PI * 100}
//                         />
//                     </svg>

//                     <div className="timer-display">{formatTime(timeLeft)}</div>
//                 </div>

//                 <div className="dots-container" aria-label="Pomodoro session progress">
//                     {renderDots()}
//                 </div>

//                 <div className="timer-buttons">
//                     <button onClick={() => setIsRunning(true)} disabled={isRunning}>Start</button>
//                     <button onClick={() => setIsRunning(false)} disabled={!isRunning}>Pause</button>
//                     <button onClick={() => {
//                         clearInterval(timerRef.current);
//                         setIsRunning(false);
//                         setPomodoroCount(0);
//                         setCompletedPomodoros(0);
//                         setMode('focus');
//                         setTimeLeft(FOCUS_TIME);
//                     }}>End Session</button>
//                 </div>

//                 <div className="session-info">
//                     <p>Mode: {mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}</p>
//                     <p>Completed Pomodoros: {completedPomodoros / 2}</p>
//                     <p>Debug - Current Step: {getCurrentStepForDots() + 1}</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Pomodoro;

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import Sidebar from '../sidebar/Sidebar';
// import './Pomodoro.css';
// import alarm from '../../src/assets/alarm.mp3';

// const Pomodoro = () => {
//     // Durations in seconds for test mode
//     const FOCUS_TIME = 10;//1500
//     const SHORT_BREAK_TIME = 5;//300
//     const LONG_BREAK_TIME = 15;//900

//     // State
//     const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
//     const [isRunning, setIsRunning] = useState(false);
//     const [pomodoroCount, setPomodoroCount] = useState(0);
//     const [completedPomodoros, setCompletedPomodoros] = useState(0); // Simple counter for completed focus sessions
//     const [mode, setMode] = useState('focus'); // 'focus' | 'shortBreak' | 'longBreak'
//     const [showNotification, setShowNotification] = useState(false);
//     const [notificationData, setNotificationData] = useState({
//         title: '',
//         message: '',
//         type: 'focus' // 'focus' | 'break'
//     });
//     const timerRef = useRef(null);

//     // Function to show custom popup notification
//     const showCustomNotification = useCallback((title, message, type) => {
//         setNotificationData({ title, message, type });
//         setShowNotification(true);
//     }, []);

//     // Function to close notification
//     const closeNotification = useCallback(() => {
//         setShowNotification(false);
//     }, []);

//     // Function to play audio alert using custom alarm.mp3
//     const playAlertSound = useCallback(() => {
//         try {
//             const audio = new Audio(alarm);
//             audio.volume = 0.7; // Set volume to 70%
//             audio.play().catch(error => {
//                 console.warn('Could not play alarm sound:', error);
//                 // Fallback to beep if audio file fails
//                 fallbackBeep();
//             });
//             // Stop the audio after 2 seconds (adjust this value as needed)
//             setTimeout(() => {
//                 audio.pause();
//                 audio.currentTime = 0; // Reset to beginning for next play
//             }, 2500); // 2.5 seconds - change this to your desired length
//         } catch (error) {
//             console.warn('Audio file not found, using fallback beep:', error);
//             fallbackBeep();
//         }
//     }, []);

//     // Fallback beep function in case audio file doesn't work
//     const fallbackBeep = () => {
//         try {
//             const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//             const oscillator = audioContext.createOscillator();
//             const gainNode = audioContext.createGain();

//             oscillator.connect(gainNode);
//             gainNode.connect(audioContext.destination);

//             oscillator.frequency.value = 800; // Frequency in Hz
//             gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
//             gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

//             oscillator.start(audioContext.currentTime);
//             oscillator.stop(audioContext.currentTime + 1);
//         } catch (error) {
//             console.warn('Could not play any sound:', error);
//         }
//     };

//     // Determine current duration based on mode
//     const getCurrentDuration = () => {
//         if (mode === 'focus') return FOCUS_TIME;
//         if (mode === 'shortBreak') return SHORT_BREAK_TIME;
//         if (mode === 'longBreak') return LONG_BREAK_TIME;
//         return FOCUS_TIME;
//     };

//     // Effect to handle the countdown
//     useEffect(() => {
//         if (!isRunning) {
//             clearInterval(timerRef.current);
//             return;
//         }

//         timerRef.current = setInterval(() => {
//             setTimeLeft(prev => {
//                 if (prev <= 1) {
//                     // Timer has ended, stop the timer and transition to next mode
//                     setIsRunning(false);

//                     // Play sound alert
//                     playAlertSound();

//                     if (mode === 'focus') {
//                         // Finished a focus session - increment completed pomodoros
//                         setCompletedPomodoros(prev => prev + 1);

//                         // Show custom notification for completed focus session
//                         showCustomNotification(
//                             '🍅 Focus Session Complete!',
//                             'Great job! You\'ve completed a focus session. Time for a well-deserved break.',
//                             'focus'
//                         );

//                         // Determine break type based on current pomodoro count + 1 (the one we just completed)
//                         if ((pomodoroCount + 1) % 4 === 0) {
//                             setMode('longBreak');
//                             return LONG_BREAK_TIME;
//                         } else {
//                             setMode('shortBreak');
//                             return SHORT_BREAK_TIME;
//                         }
//                     } else {
//                         // Finished a break, start focus again
//                         // Increment pomodoro count for the cycle tracking
//                         const newCount = pomodoroCount + 1;
//                         setPomodoroCount(newCount);

//                         // Show custom notification for completed break
//                         const breakType = mode === 'longBreak' ? 'Long Break' : 'Short Break';
//                         showCustomNotification(
//                             `☕ ${breakType} Complete!`,
//                             'Break time is over! Ready to focus again? Click continue when you\'re ready.',
//                             'break'
//                         );

//                         // If we just completed a long break (4th pomodoro), reset the cycle
//                         if (mode === 'longBreak') {
//                             setPomodoroCount(0); // Reset cycle counter for dots
//                         }

//                         setMode('focus');
//                         return FOCUS_TIME;
//                     }
//                 }
//                 return prev - 1;
//             });
//         }, 1000);

//         return () => clearInterval(timerRef.current);
//     }, [isRunning, mode, pomodoroCount, playAlertSound, showCustomNotification]);

//     // Format seconds to mm:ss
//     const formatTime = (seconds) => {
//         const m = Math.floor(seconds / 60);
//         const s = seconds % 60;
//         return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
//     };

//     // Progress calculation (0 to 100%)
//     const progressPercent = 100 - (timeLeft / getCurrentDuration()) * 100;

//     // Calculate current step for dots display
//     // Track progress through sessions - focus sessions that have been started
//     const getCurrentStepForDots = () => {
//         if (mode === 'focus') {
//             // Currently in focus mode - show the current focus session
//             return pomodoroCount * 2;
//         } else {
//             // Currently in break mode - show the break after the focus session
//             return pomodoroCount * 2 + 1;
//         }
//     };

//     const renderDots = () => {
//         const totalSteps = 8; // 4 focus + 3 short breaks + 1 long break
//         const currentStep = Math.min(getCurrentStepForDots(), totalSteps - 1);

//         const dots = [];
//         for (let i = 0; i < totalSteps; i++) {
//             const isFocusDot = i % 2 === 0;
//             const isLongBreakDot = i === totalSteps - 1;

//             let color = '#4B5563'; // Gray default for upcoming steps

//             if (i < currentStep) {
//                 // Completed steps
//                 color = isFocusDot ? '#FCD34D' : (isLongBreakDot ? '#8B5CF6' : '#14B8A6');
//             } else if (i === currentStep) {
//                 // Current active step
//                 color = isFocusDot ? '#FBBF24' : (isLongBreakDot ? '#A78BFA' : '#2DD4BF');
//             }

//             dots.push(
//                 <span
//                     key={i}
//                     className="pomodoro-dot"
//                     style={{ backgroundColor: color }}
//                     title={
//                         isFocusDot
//                             ? 'Focus Session'
//                             : isLongBreakDot
//                                 ? 'Long Break'
//                                 : 'Short Break'
//                     }
//                 />
//             );
//         }
//         return dots;
//     };

//     // Custom Notification Modal Component
//     const NotificationModal = () => {
//         if (!showNotification) return null;

//         const isBreakComplete = notificationData.type === 'break';
//         const bgColor = isBreakComplete ? '#3B82F6' : '#10B981';
//         const accentColor = isBreakComplete ? '#2563EB' : '#059669';

//         return (
//             <div className="notification-overlay" style={{
//                 position: 'fixed',
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 backgroundColor: 'rgba(0, 0, 0, 0.7)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 zIndex: 1000,
//                 animation: 'fadeIn 0.3s ease-out'
//             }}>
//                 <div className="notification-modal" style={{
//                     backgroundColor: 'white',
//                     borderRadius: '12px',
//                     padding: '2rem',
//                     maxWidth: '400px',
//                     width: '90%',
//                     textAlign: 'center',
//                     boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
//                     transform: 'scale(1)',
//                     animation: 'slideIn 0.3s ease-out'
//                 }}>
//                     <div style={{
//                         fontSize: '3rem',
//                         marginBottom: '1rem'
//                     }}>
//                         {notificationData.type === 'focus' ? '🍅' : '☕'}
//                     </div>

//                     <h2 style={{
//                         fontSize: '1.5rem',
//                         fontWeight: 'bold',
//                         marginBottom: '1rem',
//                         color: '#1F2937'
//                     }}>
//                         {notificationData.title}
//                     </h2>

//                     <p style={{
//                         fontSize: '1rem',
//                         color: '#6B7280',
//                         marginBottom: '2rem',
//                         lineHeight: '1.5'
//                     }}>
//                         {notificationData.message}
//                     </p>

//                     <button
//                         onClick={closeNotification}
//                         style={{
//                             backgroundColor: bgColor,
//                             color: 'white',
//                             border: 'none',
//                             borderRadius: '8px',
//                             padding: '12px 24px',
//                             fontSize: '1rem',
//                             fontWeight: '600',
//                             cursor: 'pointer',
//                             transition: 'background-color 0.2s',
//                             minWidth: '120px'
//                         }}
//                         onMouseOver={(e) => {
//                             e.target.style.backgroundColor = accentColor;
//                         }}
//                         onMouseOut={(e) => {
//                             e.target.style.backgroundColor = bgColor;
//                         }}
//                     >
//                         Continue
//                     </button>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div className="app-container-pomodoro">
//             <Sidebar />
//             <div className="main-content-pomodoro">
//                 <h1>Pomodoro Timer</h1>

//                 <div className="timer-wrapper">
//                     <svg className="progress-ring" width="220" height="220">
//                         <circle
//                             className="progress-ring__circle-bg"
//                             stroke="#1F2937"
//                             strokeWidth="10"
//                             fill="transparent"
//                             r="100"
//                             cx="110"
//                             cy="110"
//                         />
//                         <circle
//                             className="progress-ring__circle"
//                             stroke="#FCD34D"
//                             strokeWidth="10"
//                             fill="transparent"
//                             r="100"
//                             cx="110"
//                             cy="110"
//                             strokeDasharray={2 * Math.PI * 100}
//                             strokeDashoffset={(1 - progressPercent / 100) * 2 * Math.PI * 100}
//                         />
//                     </svg>

//                     <div className="timer-display">{formatTime(timeLeft)}</div>
//                 </div>

//                 <div className="dots-container" aria-label="Pomodoro session progress">
//                     {renderDots()}
//                 </div>

//                 <div className="timer-buttons">
//                     <button onClick={() => setIsRunning(true)} disabled={isRunning}>Start</button>
//                     <button onClick={() => setIsRunning(false)} disabled={!isRunning}>Pause</button>
//                     <button onClick={() => {
//                         clearInterval(timerRef.current);
//                         setIsRunning(false);
//                         setPomodoroCount(0);
//                         setCompletedPomodoros(0);
//                         setMode('focus');
//                         setTimeLeft(FOCUS_TIME);
//                     }}>End Session</button>
//                 </div>

//                 <div className="session-info">
//                     <p>Mode: {mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}</p>
//                     <p>Completed Pomodoros: {completedPomodoros / 2}</p>
//                     <p>Debug - Current Step: {getCurrentStepForDots() + 1}</p>
//                 </div>
//             </div>

//             {/* Custom Notification Modal */}
//             <NotificationModal />

//             {/* CSS Animations */}
//             <style jsx>{`
//                 @keyframes fadeIn {
//                     from { opacity: 0; }
//                     to { opacity: 1; }
//                 }

//                 @keyframes slideIn {
//                     from { 
//                         transform: scale(0.8) translateY(-20px);
//                         opacity: 0;
//                     }
//                     to { 
//                         transform: scale(1) translateY(0);
//                         opacity: 1;
//                     }
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default Pomodoro;

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import Sidebar from '../sidebar/Sidebar';
// import './Pomodoro.css';
// import alarm from '../../src/assets/alarm.mp3';

// const Pomodoro = () => {
//     // Durations in seconds for test mode
//     const FOCUS_TIME = 10;//1500
//     const SHORT_BREAK_TIME = 5;//300
//     const LONG_BREAK_TIME = 15;//900

//     // State
//     const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
//     const [isRunning, setIsRunning] = useState(false);
//     const [pomodoroCount, setPomodoroCount] = useState(0);
//     const [completedPomodoros, setCompletedPomodoros] = useState(0); // Simple counter for completed focus sessions
//     const [mode, setMode] = useState('focus'); // 'focus' | 'shortBreak' | 'longBreak'
//     const [showNotification, setShowNotification] = useState(false);
//     const [notificationData, setNotificationData] = useState({
//         title: '',
//         message: '',
//         type: 'focus' // 'focus' | 'break'
//     });
//     const timerRef = useRef(null);

//     // Function to show custom popup notification
//     const showCustomNotification = useCallback((title, message, type) => {
//         setNotificationData({ title, message, type });
//         setShowNotification(true);
//     }, []);

//     // Function to close notification
//     const closeNotification = useCallback(() => {
//         setShowNotification(false);
//     }, []);

//     // Function to play audio alert using custom alarm.mp3
//     const playAlertSound = useCallback(() => {
//         try {
//             const audio = new Audio(alarm);
//             audio.volume = 0.7; // Set volume to 70%
//             audio.play().catch(error => {
//                 console.warn('Could not play alarm sound:', error);
//                 // Fallback to beep if audio file fails
//                 fallbackBeep();
//             });
//             // Stop the audio after 2 seconds (adjust this value as needed)
//             setTimeout(() => {
//                 audio.pause();
//                 audio.currentTime = 0; // Reset to beginning for next play
//             }, 2500); // 2.5 seconds - change this to your desired length
//         } catch (error) {
//             console.warn('Audio file not found, using fallback beep:', error);
//             fallbackBeep();
//         }
//     }, []);

//     // Fallback beep function in case audio file doesn't work
//     const fallbackBeep = () => {
//         try {
//             const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//             const oscillator = audioContext.createOscillator();
//             const gainNode = audioContext.createGain();

//             oscillator.connect(gainNode);
//             gainNode.connect(audioContext.destination);

//             oscillator.frequency.value = 800; // Frequency in Hz
//             gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
//             gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

//             oscillator.start(audioContext.currentTime);
//             oscillator.stop(audioContext.currentTime + 1);
//         } catch (error) {
//             console.warn('Could not play any sound:', error);
//         }
//     };

//     // Determine current duration based on mode
//     const getCurrentDuration = () => {
//         if (mode === 'focus') return FOCUS_TIME;
//         if (mode === 'shortBreak') return SHORT_BREAK_TIME;
//         if (mode === 'longBreak') return LONG_BREAK_TIME;
//         return FOCUS_TIME;
//     };

//     // Effect to handle the countdown
//     useEffect(() => {
//         if (!isRunning) {
//             clearInterval(timerRef.current);
//             return;
//         }

//         timerRef.current = setInterval(() => {
//             setTimeLeft(prev => {
//                 if (prev <= 1) {
//                     // Timer has ended, stop the timer and transition to next mode
//                     setIsRunning(false);

//                     // Play sound alert
//                     playAlertSound();

//                     if (mode === 'focus') {
//                         // Finished a focus session - increment completed pomodoros
//                         setCompletedPomodoros(prev => prev + 1);

//                         // Show custom notification for completed focus session
//                         showCustomNotification(
//                             '🍅 Focus Session Complete!',
//                             'Great job! You\'ve completed a focus session. Time for a well-deserved break.',
//                             'focus'
//                         );

//                         // Determine break type based on current pomodoro count + 1 (the one we just completed)
//                         if ((pomodoroCount + 1) % 4 === 0) {
//                             setMode('longBreak');
//                             return LONG_BREAK_TIME;
//                         } else {
//                             setMode('shortBreak');
//                             return SHORT_BREAK_TIME;
//                         }
//                     } else {
//                         // Finished a break, start focus again
//                         // Increment pomodoro count for the cycle tracking
//                         const newCount = pomodoroCount + 1;
//                         setPomodoroCount(newCount);

//                         // Show custom notification for completed break
//                         const breakType = mode === 'longBreak' ? 'Long Break' : 'Short Break';
//                         showCustomNotification(
//                             `☕ ${breakType} Complete!`,
//                             'Break time is over! Ready to focus again? Click continue when you\'re ready.',
//                             'break'
//                         );

//                         // If we just completed a long break (4th pomodoro), reset the cycle
//                         if (mode === 'longBreak') {
//                             setPomodoroCount(0); // Reset cycle counter for dots
//                         }

//                         setMode('focus');
//                         return FOCUS_TIME;
//                     }
//                 }
//                 return prev - 1;
//             });
//         }, 1000);

//         return () => clearInterval(timerRef.current);
//     }, [isRunning, mode, pomodoroCount, playAlertSound, showCustomNotification]);

//     // Format seconds to mm:ss
//     const formatTime = (seconds) => {
//         const m = Math.floor(seconds / 60);
//         const s = seconds % 60;
//         return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
//     };

//     // Progress calculation (0 to 100%)
//     const progressPercent = 100 - (timeLeft / getCurrentDuration()) * 100;

//     // Calculate current step for dots display
//     // Track progress through sessions - focus sessions that have been started
//     const getCurrentStepForDots = () => {
//         if (mode === 'focus') {
//             // Currently in focus mode - show the current focus session
//             return pomodoroCount * 2;
//         } else {
//             // Currently in break mode - show the break after the focus session
//             return pomodoroCount * 2 + 1;
//         }
//     };

//     const renderDots = () => {
//         const totalSteps = 8; // 4 focus + 3 short breaks + 1 long break
//         const currentStep = Math.min(getCurrentStepForDots(), totalSteps - 1);

//         const dots = [];
//         for (let i = 0; i < totalSteps; i++) {
//             const isFocusDot = i % 2 === 0;
//             const isLongBreakDot = i === totalSteps - 1;

//             let color = '#4B5563'; // Gray default for upcoming steps

//             if (i < currentStep) {
//                 // Completed steps
//                 color = isFocusDot ? '#FCD34D' : (isLongBreakDot ? '#8B5CF6' : '#14B8A6');
//             } else if (i === currentStep) {
//                 // Current active step
//                 color = isFocusDot ? '#FBBF24' : (isLongBreakDot ? '#A78BFA' : '#2DD4BF');
//             }

//             dots.push(
//                 <div
//                     key={i}
//                     className="dot"
//                     style={{ backgroundColor: color }}
//                 />
//             );
//         }
//         return dots;
//     };

//     // Custom Notification Modal Component
//     const NotificationModal = () => {
//         if (!showNotification) return null;

//         const isBreakComplete = notificationData.type === 'break';
//         const bgColor = isBreakComplete ? '#3B82F6' : '#10B981';

//         return (
//             <div className="notification-overlay">
//                 <div 
//                     className="notification-modal"
//                     style={{ backgroundColor: bgColor }}
//                 >
//                     <div className="notification-content">
//                         <div className="notification-icon">
//                             {notificationData.type === 'focus' ? '🍅' : '☕'}
//                         </div>

//                         <h2 className="notification-title">
//                             {notificationData.title}
//                         </h2>

//                         <p className="notification-message">
//                             {notificationData.message}
//                         </p>

//                         <button
//                             className="notification-btn"
//                             onClick={closeNotification}
//                         >
//                             Continue
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div className="pomodoro-container">
//             <Sidebar />

//             <div className="pomodoro-main">
//                 <h1 className="pomodoro-title">Pomodoro Timer</h1>

//                 <div className="timer-section">
//                     <div className="progress-container">
//                         <svg className="progress-bg" viewBox="0 0 120 120">
//                             <circle
//                                 className="progress-circle"
//                                 cx="60"
//                                 cy="60"
//                                 r="50"
//                             />
//                             <circle
//                                 className="progress-bar"
//                                 cx="60"
//                                 cy="60"
//                                 r="50"
//                                 strokeDasharray={`${progressPercent * 3.14159} 314.159`}
//                             />
//                         </svg>

//                         <div className={`timer-display ${isRunning ? 'running' : ''}`}>
//                             {formatTime(timeLeft)}
//                         </div>
//                     </div>
//                 </div>

//                 <div className="dots-container">
//                     {renderDots()}
//                 </div>

//                 <div className="controls">
//                     <button 
//                         className="btn btn-start"
//                         onClick={() => setIsRunning(true)} 
//                         disabled={isRunning}
//                     >
//                         Start
//                     </button>
//                     <button 
//                         className="btn btn-pause"
//                         onClick={() => setIsRunning(false)} 
//                         disabled={!isRunning}
//                     >
//                         Pause
//                     </button>
//                     <button 
//                         className="btn btn-end"
//                         onClick={() => {
//                             clearInterval(timerRef.current);
//                             setIsRunning(false);
//                             setPomodoroCount(0);
//                             setCompletedPomodoros(0);
//                             setMode('focus');
//                             setTimeLeft(FOCUS_TIME);
//                         }}
//                     >
//                         End Session
//                     </button>
//                 </div>

//                 <div className="info-section">
//                     <p className="info-item">
//                         Mode: {mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
//                     </p>
//                     <p className="info-item">
//                         Completed Pomodoros: {completedPomodoros}
//                     </p>
//                     <p className="info-item">
//                         Debug - Current Step: {getCurrentStepForDots() + 1}
//                     </p>
//                 </div>
//             </div>

//             {/* Custom Notification Modal */}
//             <NotificationModal />
//         </div>
//     );
// };

// export default Pomodoro;

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import Sidebar from '../sidebar/Sidebar';
// import './Pomodoro.css';
// import alarm from '../../src/assets/alarm.mp3';

// const Pomodoro = () => {
//     // Durations in seconds for test mode
//     const FOCUS_TIME = 10;//1500
//     const SHORT_BREAK_TIME = 5;//300
//     const LONG_BREAK_TIME = 15;//900

//     // State
//     const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
//     const [isRunning, setIsRunning] = useState(false);
//     const [pomodoroCount, setPomodoroCount] = useState(0);
//     const [completedPomodoros, setCompletedPomodoros] = useState(0);
//     const [mode, setMode] = useState('focus'); // 'focus' | 'shortBreak' | 'longBreak'
//     const [showNotification, setShowNotification] = useState(false);
//     const [notificationData, setNotificationData] = useState({
//         title: '',
//         message: '',
//         type: 'focus' // 'focus' | 'break'
//     });
//     const timerRef = useRef(null);

//     // Function to show custom popup notification
//     const showCustomNotification = useCallback((title, message, type) => {
//         setNotificationData({ title, message, type });
//         setShowNotification(true);
//     }, []);

//     // Function to close notification
//     const closeNotification = useCallback(() => {
//         setShowNotification(false);
//     }, []);

//     // Update favicon based on timer state and progress
//     const updateFavicon = useCallback((isActive = false, progress = 0) => {
//         try {
//             const favicon = document.querySelector("link[rel*='icon']") || document.createElement('link');
//             favicon.type = 'image/x-icon';
//             favicon.rel = 'shortcut icon';
            
//             // Different colors based on state
//             let emoji = '🍅'; // Default tomato
//             if (mode === 'shortBreak') emoji = '☕';
//             else if (mode === 'longBreak') emoji = '🛌';
            
//             // Add visual indicator for running state
//             if (isActive) {
//                 // Create SVG with progress ring
//                 const progressDegrees = progress * 360;
//                 favicon.href = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
//                     <circle cx="50" cy="50" r="45" fill="none" stroke="${isActive ? '#ef4444' : '#6b7280'}" stroke-width="8" stroke-dasharray="${progressDegrees} 360" transform="rotate(-90 50 50)"/>
//                     <text x="50" y="65" font-size="40" text-anchor="middle">${emoji}</text>
//                 </svg>`;
//             } else {
//                 // Static emoji when paused
//                 favicon.href = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${emoji}</text></svg>`;
//             }
            
//             document.getElementsByTagName('head')[0].appendChild(favicon);
//         } catch (error) {
//             console.warn('Could not update favicon:', error);
//         }
//     }, [mode]);

//     // Fallback beep function
//     const fallbackBeep = useCallback(() => {
//         try {
//             const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//             const oscillator = audioContext.createOscillator();
//             const gainNode = audioContext.createGain();

//             oscillator.connect(gainNode);
//             gainNode.connect(audioContext.destination);

//             oscillator.frequency.value = 800;
//             gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
//             gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

//             oscillator.start(audioContext.currentTime);
//             oscillator.stop(audioContext.currentTime + 1);
//         } catch (error) {
//             console.warn('Could not play any sound:', error);
//         }
//     }, []);

//     // Play alert sound
//     const playAlertSound = useCallback(() => {
//         try {
//             const audio = new Audio(alarm);
//             audio.volume = 0.7;
//             audio.play().catch(error => {
//                 console.warn('Could not play alarm sound:', error);
//                 fallbackBeep();
//             });

//             setTimeout(() => {
//                 audio.pause();
//                 audio.currentTime = 0;
//             }, 2500);
//         } catch (error) {
//             console.warn('Audio file not found, using fallback beep:', error);
//             fallbackBeep();
//         }
//     }, [fallbackBeep]);

//     // Determine current duration based on mode
//     const getCurrentDuration = useCallback(() => {
//         if (mode === 'focus') return FOCUS_TIME;
//         if (mode === 'shortBreak') return SHORT_BREAK_TIME;
//         if (mode === 'longBreak') return LONG_BREAK_TIME;
//         return FOCUS_TIME;
//     }, [mode, FOCUS_TIME, SHORT_BREAK_TIME, LONG_BREAK_TIME]);

//     // Progress calculation (0 to 100%)
//     const progressPercent = 100 - (timeLeft / getCurrentDuration()) * 100;

//     // Update favicon when timer state changes
//     useEffect(() => {
//         const progress = progressPercent / 100;
//         updateFavicon(isRunning, progress);
//     }, [isRunning, progressPercent, updateFavicon]);

//     // Effect to handle the countdown
//     useEffect(() => {
//         if (!isRunning) {
//             clearInterval(timerRef.current);
//             return;
//         }

//         timerRef.current = setInterval(() => {
//             setTimeLeft(prev => {
//                 if (prev <= 1) {
//                     // Timer has ended, stop the timer and transition to next mode
//                     setIsRunning(false);

//                     // Play sound alert
//                     playAlertSound();

//                     if (mode === 'focus') {
//                         // Finished a focus session - increment completed pomodoros
//                         setCompletedPomodoros(prev => prev + 1);

//                         // Show custom notification for completed focus session
//                         showCustomNotification(
//                             '🍅 Focus Session Complete!',
//                             'Great job! You\'ve completed a focus session. Time for a well-deserved break.',
//                             'focus'
//                         );

//                         // Determine break type based on current pomodoro count + 1 (the one we just completed)
//                         if ((pomodoroCount + 1) % 4 === 0) {
//                             setMode('longBreak');
//                             return LONG_BREAK_TIME;
//                         } else {
//                             setMode('shortBreak');
//                             return SHORT_BREAK_TIME;
//                         }
//                     } else {
//                         // Finished a break, start focus again
//                         // Increment pomodoro count for the cycle tracking
//                         const newCount = pomodoroCount + 1;
//                         setPomodoroCount(newCount);

//                         // Show custom notification for completed break
//                         const breakType = mode === 'longBreak' ? 'Long Break' : 'Short Break';
//                         showCustomNotification(
//                             `☕ ${breakType} Complete!`,
//                             'Break time is over! Ready to focus again? Click continue when you\'re ready.',
//                             'break'
//                         );

//                         // If we just completed a long break (4th pomodoro), reset the cycle
//                         if (mode === 'longBreak') {
//                             setPomodoroCount(0); // Reset cycle counter for dots
//                         }

//                         setMode('focus');
//                         return FOCUS_TIME;
//                     }
//                 }
//                 return prev - 1;
//             });
//         }, 1000);

//         return () => clearInterval(timerRef.current);
//     }, [isRunning, mode, pomodoroCount, playAlertSound, showCustomNotification, FOCUS_TIME, SHORT_BREAK_TIME, LONG_BREAK_TIME]);

//     // Format seconds to mm:ss
//     const formatTime = useCallback((seconds) => {
//         const m = Math.floor(seconds / 60);
//         const s = seconds % 60;
//         return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
//     }, []);

//     // Calculate current step for dots display
//     const getCurrentStepForDots = useCallback(() => {
//         if (mode === 'focus') {
//             // Currently in focus mode - show the current focus session
//             return pomodoroCount * 2;
//         } else {
//             // Currently in break mode - show the break after the focus session
//             return pomodoroCount * 2 + 1;
//         }
//     }, [mode, pomodoroCount]);

//     const renderDots = useCallback(() => {
//         const totalSteps = 8; // 4 focus + 3 short breaks + 1 long break
//         const currentStep = Math.min(getCurrentStepForDots(), totalSteps - 1);

//         const dots = [];
//         for (let i = 0; i < totalSteps; i++) {
//             const isFocusDot = i % 2 === 0;
//             const isLongBreakDot = i === totalSteps - 1;

//             let color = '#4B5563'; // Gray default for upcoming steps

//             if (i < currentStep) {
//                 // Completed steps
//                 color = isFocusDot ? '#FCD34D' : (isLongBreakDot ? '#8B5CF6' : '#14B8A6');
//             } else if (i === currentStep) {
//                 // Current active step
//                 color = isFocusDot ? '#FBBF24' : (isLongBreakDot ? '#A78BFA' : '#2DD4BF');
//             }

//             dots.push(
//                 <span
//                     key={i}
//                     className="pomodoro-dot"
//                     style={{ backgroundColor: color }}
//                     title={
//                         isFocusDot
//                             ? 'Focus Session'
//                             : isLongBreakDot
//                                 ? 'Long Break'
//                                 : 'Short Break'
//                     }
//                 />
//             );
//         }
//         return dots;
//     }, [getCurrentStepForDots]);

//     // Reset function
//     const resetSession = useCallback(() => {
//         clearInterval(timerRef.current);
//         setIsRunning(false);
//         setPomodoroCount(0);
//         setCompletedPomodoros(0);
//         setMode('focus');
//         setTimeLeft(FOCUS_TIME);
//     }, [FOCUS_TIME]);

//     // Custom Notification Modal Component
//     const NotificationModal = useCallback(() => {
//         if (!showNotification) return null;

//         const isBreakComplete = notificationData.type === 'break';
//         const bgColor = isBreakComplete ? '#3B82F6' : '#10B981';
//         const accentColor = isBreakComplete ? '#2563EB' : '#059669';

//         return (
//             <div className="notification-overlay" style={{
//                 position: 'fixed',
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 backgroundColor: 'rgba(0, 0, 0, 0.7)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 zIndex: 1000,
//                 animation: 'fadeIn 0.3s ease-out'
//             }}>
//                 <div className="notification-modal" style={{
//                     backgroundColor: 'white',
//                     borderRadius: '12px',
//                     padding: '2rem',
//                     maxWidth: '400px',
//                     width: '90%',
//                     textAlign: 'center',
//                     boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
//                     animation: 'slideIn 0.3s ease-out'
//                 }}>
//                     <div style={{
//                         fontSize: '3rem',
//                         marginBottom: '1rem',
//                         animation: 'bounceEmoji 1s infinite'
//                     }}>
//                         {notificationData.type === 'focus' ? '🍅' : '☕'}
//                     </div>

//                     <h2 style={{
//                         fontSize: '1.5rem',
//                         fontWeight: 'bold',
//                         marginBottom: '1rem',
//                         color: '#1F2937'
//                     }}>
//                         {notificationData.title}
//                     </h2>

//                     <p style={{
//                         fontSize: '1rem',
//                         color: '#6B7280',
//                         marginBottom: '2rem',
//                         lineHeight: '1.5'
//                     }}>
//                         {notificationData.message}
//                     </p>

//                     <button
//                         onClick={closeNotification}
//                         style={{
//                             backgroundColor: bgColor,
//                             color: 'white',
//                             border: 'none',
//                             borderRadius: '8px',
//                             padding: '12px 24px',
//                             fontSize: '1rem',
//                             fontWeight: '600',
//                             cursor: 'pointer',
//                             transition: 'background-color 0.2s',
//                             minWidth: '120px'
//                         }}
//                         onMouseOver={(e) => {
//                             e.target.style.backgroundColor = accentColor;
//                         }}
//                         onMouseOut={(e) => {
//                             e.target.style.backgroundColor = bgColor;
//                         }}
//                     >
//                         Continue
//                     </button>
//                 </div>
//             </div>
//         );
//     }, [showNotification, notificationData, closeNotification]);

//     return (
//         <div className="app-container-pomodoro">
//             <Sidebar />
//             <div className="main-content-pomodoro">
//                 <h1>Pomodoro Timer</h1>

//                 <div className="timer-wrapper">
//                     <svg className="progress-ring" width="220" height="220">
//                         <circle
//                             className="progress-ring__circle-bg"
//                             stroke="#1F2937"
//                             strokeWidth="10"
//                             fill="transparent"
//                             r="100"
//                             cx="110"
//                             cy="110"
//                         />
//                         <circle
//                             className="progress-ring__circle"
//                             stroke="#FCD34D"
//                             strokeWidth="10"
//                             fill="transparent"
//                             r="100"
//                             cx="110"
//                             cy="110"
//                             strokeDasharray={2 * Math.PI * 100}
//                             strokeDashoffset={(1 - progressPercent / 100) * 2 * Math.PI * 100}
//                         />
//                     </svg>

//                     <div className="timer-display">{formatTime(timeLeft)}</div>
//                 </div>

//                 <div className="dots-container" aria-label="Pomodoro session progress">
//                     {renderDots()}
//                 </div>

//                 <div className="timer-buttons">
//                     <button onClick={() => setIsRunning(true)} disabled={isRunning}>Start</button>
//                     <button onClick={() => setIsRunning(false)} disabled={!isRunning}>Pause</button>
//                     <button onClick={resetSession}>End Session</button>
//                 </div>

//                 <div className="session-info">
//                     <p>Mode: {mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}</p>
//                     <p>Completed Pomodoros: {completedPomodoros / 2}</p>
//                 </div>
//             </div>

//             {/* Custom Notification Modal */}
//             <NotificationModal />

//             {/* CSS Animations */}
//             <style jsx>{`
//                 @keyframes fadeIn {
//                     from { opacity: 0; }
//                     to { opacity: 1; }
//                 }
                
//                 @keyframes slideIn {
//                     from { 
//                         transform: scale(0.8) translateY(-20px);
//                         opacity: 0;
//                     }
//                     to { 
//                         transform: scale(1) translateY(0);
//                         opacity: 1;
//                     }
//                 }

//                 @keyframes bounceEmoji {
//                     0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
//                     40% { transform: translateY(-10px); }
//                     60% { transform: translateY(-5px); }
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default Pomodoro;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from '../sidebar/Sidebar';
import './Pomodoro.css';
import alarm from '../../src/assets/alarm.mp3';

const Pomodoro = () => {
    // Durations in seconds for test mode
    const FOCUS_TIME = 10;//1500
    const SHORT_BREAK_TIME = 5;//300
    const LONG_BREAK_TIME = 15;//900

    // State
    const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
    const [isRunning, setIsRunning] = useState(false);
    const [pomodoroCount, setPomodoroCount] = useState(0);
    const [completedPomodoros, setCompletedPomodoros] = useState(0);
    const [mode, setMode] = useState('focus'); // 'focus' | 'shortBreak' | 'longBreak'
    const [showNotification, setShowNotification] = useState(false);
    const [notificationData, setNotificationData] = useState({
        title: '',
        message: '',
        type: 'focus' // 'focus' | 'break'
    });
    const [notificationPermission, setNotificationPermission] = useState('default');
    const timerRef = useRef(null);

    // Request notification permission on component mount
    useEffect(() => {
        const requestNotificationPermission = async () => {
            if ('Notification' in window) {
                const permission = await Notification.requestPermission();
                setNotificationPermission(permission);
            }
        };
        
        requestNotificationPermission();
    }, []);

    // Function to show native Windows notification
    const showWindowsNotification = useCallback((title, body, type) => {
        if ('Notification' in window && notificationPermission === 'granted') {
            try {
                // Choose appropriate icon based on type
                const icon = type === 'focus' 
                    ? 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍅</text></svg>'
                    : 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">☕</text></svg>';

                const notification = new Notification(title, {
                    body: body,
                    icon: icon,
                    badge: icon,
                    tag: 'pomodoro-timer', // This prevents multiple notifications from stacking
                    requireInteraction: true, // Keeps notification visible until user interacts
                    silent: false, // Allow notification sound (in addition to our custom alarm)
                    appName: 'Personal Productivity Suite'
                });

                // Auto-close notification after 10 seconds if user doesn't interact
                setTimeout(() => {
                    notification.close();
                }, 10000);

                // Optional: Handle notification click to focus the window
                notification.onclick = () => {
                    window.focus();
                    notification.close();
                };

            } catch (error) {
                console.warn('Could not show Windows notification:', error);
            }
        } else if (notificationPermission === 'denied') {
            console.warn('Notifications are blocked. Please enable them in your browser settings.');
        }
    }, [notificationPermission]);

    // Function to show custom popup notification
    const showCustomNotification = useCallback((title, message, type) => {
        setNotificationData({ title, message, type });
        setShowNotification(true);
        
        // Also show Windows notification
        showWindowsNotification(title, message, type);
    }, [showWindowsNotification]);

    // Function to close notification
    const closeNotification = useCallback(() => {
        setShowNotification(false);
    }, []);

    // Update favicon based on timer state and progress
    const updateFavicon = useCallback((isActive = false, progress = 0) => {
        try {
            const favicon = document.querySelector("link[rel*='icon']") || document.createElement('link');
            favicon.type = 'image/x-icon';
            favicon.rel = 'shortcut icon';
            
            // Different colors based on state
            let emoji = '🍅'; // Default tomato
            if (mode === 'shortBreak') emoji = '☕';
            else if (mode === 'longBreak') emoji = '🛌';
            
            // Add visual indicator for running state
            if (isActive) {
                // Create SVG with progress ring
                const progressDegrees = progress * 360;
                favicon.href = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="${isActive ? '#ef4444' : '#6b7280'}" stroke-width="8" stroke-dasharray="${progressDegrees} 360" transform="rotate(-90 50 50)"/>
                    <text x="50" y="65" font-size="40" text-anchor="middle">${emoji}</text>
                </svg>`;
            } else {
                // Static emoji when paused
                favicon.href = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${emoji}</text></svg>`;
            }
            
            document.getElementsByTagName('head')[0].appendChild(favicon);
        } catch (error) {
            console.warn('Could not update favicon:', error);
        }
    }, [mode]);

    // Fallback beep function
    const fallbackBeep = useCallback(() => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
        } catch (error) {
            console.warn('Could not play any sound:', error);
        }
    }, []);

    // Play alert sound
    const playAlertSound = useCallback(() => {
        try {
            const audio = new Audio(alarm);
            audio.volume = 0.7;
            audio.play().catch(error => {
                console.warn('Could not play alarm sound:', error);
                fallbackBeep();
            });

            setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
            }, 2500);
        } catch (error) {
            console.warn('Audio file not found, using fallback beep:', error);
            fallbackBeep();
        }
    }, [fallbackBeep]);

    // Determine current duration based on mode
    const getCurrentDuration = useCallback(() => {
        if (mode === 'focus') return FOCUS_TIME;
        if (mode === 'shortBreak') return SHORT_BREAK_TIME;
        if (mode === 'longBreak') return LONG_BREAK_TIME;
        return FOCUS_TIME;
    }, [mode, FOCUS_TIME, SHORT_BREAK_TIME, LONG_BREAK_TIME]);

    // Progress calculation (0 to 100%)
    const progressPercent = 100 - (timeLeft / getCurrentDuration()) * 100;

    // Update favicon when timer state changes
    useEffect(() => {
        const progress = progressPercent / 100;
        updateFavicon(isRunning, progress);
    }, [isRunning, progressPercent, updateFavicon]);

    // Effect to handle the countdown
    useEffect(() => {
        if (!isRunning) {
            clearInterval(timerRef.current);
            return;
        }

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // Timer has ended, stop the timer and transition to next mode
                    setIsRunning(false);

                    // Play sound alert
                    playAlertSound();

                    if (mode === 'focus') {
                        // Finished a focus session - increment completed pomodoros
                        setCompletedPomodoros(prev => prev + 1);

                        // Show custom notification for completed focus session
                        showCustomNotification(
                            '🍅 Focus Session Complete!',
                            'Great job! You\'ve completed a focus session. Time for a well-deserved break.',
                            'focus'
                        );

                        // Determine break type based on current pomodoro count + 1 (the one we just completed)
                        if ((pomodoroCount + 1) % 4 === 0) {
                            setMode('longBreak');
                            return LONG_BREAK_TIME;
                        } else {
                            setMode('shortBreak');
                            return SHORT_BREAK_TIME;
                        }
                    } else {
                        // Finished a break, start focus again
                        // Increment pomodoro count for the cycle tracking
                        const newCount = pomodoroCount + 1;
                        setPomodoroCount(newCount);

                        // Show custom notification for completed break
                        const breakType = mode === 'longBreak' ? 'Long Break' : 'Short Break';
                        showCustomNotification(
                            `☕ ${breakType} Complete!`,
                            'Break time is over! Ready to focus again? Click continue when you\'re ready.',
                            'break'
                        );

                        // If we just completed a long break (4th pomodoro), reset the cycle
                        if (mode === 'longBreak') {
                            setPomodoroCount(0); // Reset cycle counter for dots
                        }

                        setMode('focus');
                        return FOCUS_TIME;
                    }
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [isRunning, mode, pomodoroCount, playAlertSound, showCustomNotification, FOCUS_TIME, SHORT_BREAK_TIME, LONG_BREAK_TIME]);

    // Format seconds to mm:ss
    const formatTime = useCallback((seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }, []);

    // Calculate current step for dots display
    const getCurrentStepForDots = useCallback(() => {
        if (mode === 'focus') {
            // Currently in focus mode - show the current focus session
            return pomodoroCount * 2;
        } else {
            // Currently in break mode - show the break after the focus session
            return pomodoroCount * 2 + 1;
        }
    }, [mode, pomodoroCount]);

    const renderDots = useCallback(() => {
        const totalSteps = 8; // 4 focus + 3 short breaks + 1 long break
        const currentStep = Math.min(getCurrentStepForDots(), totalSteps - 1);

        const dots = [];
        for (let i = 0; i < totalSteps; i++) {
            const isFocusDot = i % 2 === 0;
            const isLongBreakDot = i === totalSteps - 1;

            let color = '#4B5563'; // Gray default for upcoming steps

            if (i < currentStep) {
                // Completed steps
                color = isFocusDot ? '#FCD34D' : (isLongBreakDot ? '#8B5CF6' : '#14B8A6');
            } else if (i === currentStep) {
                // Current active step
                color = isFocusDot ? '#FBBF24' : (isLongBreakDot ? '#A78BFA' : '#2DD4BF');
            }

            dots.push(
                <span
                    key={i}
                    className="pomodoro-dot"
                    style={{ backgroundColor: color }}
                    title={
                        isFocusDot
                            ? 'Focus Session'
                            : isLongBreakDot
                                ? 'Long Break'
                                : 'Short Break'
                    }
                />
            );
        }
        return dots;
    }, [getCurrentStepForDots]);

    // Reset function
    const resetSession = useCallback(() => {
        clearInterval(timerRef.current);
        setIsRunning(false);
        setPomodoroCount(0);
        setCompletedPomodoros(0);
        setMode('focus');
        setTimeLeft(FOCUS_TIME);
    }, [FOCUS_TIME]);

    // Function to manually request notification permission
    const requestNotificationPermission = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);
        }
    };

    // Custom Notification Modal Component
    const NotificationModal = useCallback(() => {
        if (!showNotification) return null;

        const isBreakComplete = notificationData.type === 'break';
        const bgColor = isBreakComplete ? '#3B82F6' : '#10B981';
        const accentColor = isBreakComplete ? '#2563EB' : '#059669';

        return (
            <div className="notification-overlay" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                animation: 'fadeIn 0.3s ease-out'
            }}>
                <div className="notification-modal" style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '2rem',
                    maxWidth: '400px',
                    width: '90%',
                    textAlign: 'center',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    animation: 'slideIn 0.3s ease-out'
                }}>
                    <div style={{
                        fontSize: '3rem',
                        marginBottom: '1rem',
                        animation: 'bounceEmoji 1s infinite'
                    }}>
                        {notificationData.type === 'focus' ? '🍅' : '☕'}
                    </div>

                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        marginBottom: '1rem',
                        color: '#1F2937'
                    }}>
                        {notificationData.title}
                    </h2>

                    <p style={{
                        fontSize: '1rem',
                        color: '#6B7280',
                        marginBottom: '2rem',
                        lineHeight: '1.5'
                    }}>
                        {notificationData.message}
                    </p>

                    <button
                        onClick={closeNotification}
                        style={{
                            backgroundColor: bgColor,
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '12px 24px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            minWidth: '120px'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = accentColor;
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = bgColor;
                        }}
                    >
                        Continue
                    </button>
                </div>
            </div>
        );
    }, [showNotification, notificationData, closeNotification]);

    return (
        <div className="app-container-pomodoro">
            <Sidebar />
            <div className="main-content-pomodoro">
                <h1>Pomodoro Timer</h1>

                {/* Notification Permission Status */}
                {notificationPermission !== 'granted' && (
                    <div style={{
                        backgroundColor: '#FEF3C7',
                        border: '1px solid #F59E0B',
                        borderRadius: '8px',
                        padding: '12px',
                        margin: '16px 0',
                        textAlign: 'center'
                    }}>
                        <p style={{ margin: '0 0 8px 0', color: '#92400E' }}>
                            Enable notifications to get Windows alerts when your timer completes!
                        </p>
                        {notificationPermission === 'default' && (
                            <button
                                onClick={requestNotificationPermission}
                                style={{
                                    backgroundColor: '#F59E0B',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '6px 12px',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Enable Notifications
                            </button>
                        )}
                        {notificationPermission === 'denied' && (
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#92400E' }}>
                                Notifications are blocked. Please enable them in your browser settings.
                            </p>
                        )}
                    </div>
                )}

                <div className="timer-wrapper">
                    <svg className="progress-ring" width="220" height="220">
                        <circle
                            className="progress-ring__circle-bg"
                            stroke="#1F2937"
                            strokeWidth="10"
                            fill="transparent"
                            r="100"
                            cx="110"
                            cy="110"
                        />
                        <circle
                            className="progress-ring__circle"
                            stroke="#FCD34D"
                            strokeWidth="10"
                            fill="transparent"
                            r="100"
                            cx="110"
                            cy="110"
                            strokeDasharray={2 * Math.PI * 100}
                            strokeDashoffset={(1 - progressPercent / 100) * 2 * Math.PI * 100}
                        />
                    </svg>

                    <div className="timer-display">{formatTime(timeLeft)}</div>
                </div>

                <div className="dots-container" aria-label="Pomodoro session progress">
                    {renderDots()}
                </div>

                <div className="timer-buttons">
                    <button onClick={() => setIsRunning(true)} disabled={isRunning}>Start</button>
                    <button onClick={() => setIsRunning(false)} disabled={!isRunning}>Pause</button>
                    <button onClick={resetSession}>End Session</button>
                </div>

                <div className="session-info">
                    <p>Mode: {mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}</p>
                    <p>Completed Pomodoros: {completedPomodoros / 2}</p>
                </div>
            </div>

            {/* Custom Notification Modal */}
            <NotificationModal />

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideIn {
                    from { 
                        transform: scale(0.8) translateY(-20px);
                        opacity: 0;
                    }
                    to { 
                        transform: scale(1) translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes bounceEmoji {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                }
            `}</style>
        </div>
    );
};

export default Pomodoro;