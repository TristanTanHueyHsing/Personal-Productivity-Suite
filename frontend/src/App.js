// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Homepage from './Homepage'
import Notes from './Notes';
import Todo from './Todo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/todo" element={<Todo />} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
    // <div className="App">
    //   <header className="App-header"> 
        
    //   </header>
    // </div>
  );
}
export default App;
