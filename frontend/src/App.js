import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login/Login';
import Homepage from './homepage/Homepage'
import Notes from './notes/Notes';
import Todo from './todo/Todo';
import Pomodoro from './pomodoro/Pomodoro';
import Journal from './journal/Journal';
import Calendar from './calendar/Calendar';
import Dashboard from './dashboard/Dashboard';
import Profile from './profile/Profile';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/pomodoro" element={<Pomodoro />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
}
export default App;
