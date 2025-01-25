import React, { useEffect, useState } from "react";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  Navigate,
  useParams,
  Outlet 
} from 'react-router-dom';
import "./App.css"
import Example from './pages/example'
import CameraApp from './pages/cameraApp'


function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Example</Link>
        <Link to="/camera">Camera App</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Example />} />
        <Route path="/camera" element={<CameraApp />} />
      </Routes>
    </Router>
  );
}

export default App;
