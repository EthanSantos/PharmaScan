import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";

import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import CameraApp from "./pages/cameraApp";
import CompareMedicinePage from "./pages/match";
import PillCounter from "./pages/count";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/main" element={<CameraApp />} />
        <Route path="/compare" element={<CompareMedicinePage />} />
        <Route path="/counter" element={<PillCounter />} />
      </Routes>
    </Router>
  );
}

export default App;
