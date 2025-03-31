import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <nav className="navbar">
          <Link to="/" className="navbar-brand">
            <i className="fas fa-building"></i>
            Acrylic Solution
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link active">
              Home
            </Link>
            <Link to="/about" className="nav-link">
              About
            </Link>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
            <Link to="/admin-login" className="btn btn-primary">
              Admin Login
            </Link>
            <Link to="/employee-login" className="btn btn-outline">
              Employee Login
            </Link>
          </div>
        </nav>
      </header>

      <main className="home-main">
        <section className="hero-section">
          <h1 className="hero-title">Welcome to Acrylic Solution</h1>
          <p className="hero-subtitle">
            Streamline your employee management process with our comprehensive solution.
            Efficient, secure, and user-friendly platform for both administrators and employees.
          </p>
          <div className="hero-buttons">
            <Link to="/admin-login" className="btn btn-primary">
              <i className="fas fa-user-shield"></i>
              Admin Portal
            </Link>
            <Link to="/employee-login" className="btn btn-outline">
              <i className="fas fa-user"></i>
              Employee Portal
            </Link>
          </div>
        </section>

        <section className="features-section">
          <div className="feature-card">
            <i className="fas fa-users feature-icon"></i>
            <h3 className="feature-title">Employee Management</h3>
            <p className="feature-description">
              Efficiently manage employee information, roles, and permissions with our intuitive interface.
            </p>
          </div>
          <div className="feature-card">
            <i className="fas fa-tasks feature-icon"></i>
            <h3 className="feature-title">Task Management</h3>
            <p className="feature-description">
              Assign, track, and manage tasks seamlessly with our comprehensive task management system.
            </p>
          </div>
          <div className="feature-card">
            <i className="fas fa-shield-alt feature-icon"></i>
            <h3 className="feature-title">Secure Access</h3>
            <p className="feature-description">
              Role-based access control ensures secure and appropriate access to system features.
            </p>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="footer-content">
          <p className="footer-text">
            © 2024 Acrylic Solution. All rights reserved.
          </p>
          <div className="footer-links">
            <Link to="/privacy" className="footer-link">
              Privacy Policy
            </Link>
            <Link to="/terms" className="footer-link">
              Terms of Service
            </Link>
            <Link to="/contact" className="footer-link">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 