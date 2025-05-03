LoginPage;
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";

// Example Page Components
import HomePage from "./Pages/Home";
import AboutUsPage from "./Pages/AboutUs";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
