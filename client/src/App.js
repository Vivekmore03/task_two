import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import EmployeeRegister from './components/EmployeeRegister';
import EmployeeLogin from './components/EmployeeLogin';
import AdminLogin from './components/AdminLogin';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <ToastContainer />
        <main className="container py-3">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<EmployeeRegister />} />
            <Route path="/employee-login" element={<EmployeeLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;