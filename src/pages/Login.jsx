import React, { useState } from 'react';
// Core React imports: useState for managing form inputs and active tabs

import { Link, useNavigate } from 'react-router-dom';
// Link for internal navigation, useNavigate for programmatic redirects after login

import { FaUserCheck } from 'react-icons/fa';
// Icon for the guest sign-in button

import { useToast } from '../components/Toast';
// Custom hook to trigger toast alert popups

import { loginUser } from '../api';
// API function to authenticate or register user

export default function Login() {
  const navigate = useNavigate(); // Page redirect helper
  const { addToast } = useToast(); // Toast notification trigger

  // Reads current logged-in user profile from localStorage
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('quizmaster_user') || 'null'));
  
  // activeTab: Tracks whether the 'Sign In' or 'Create Account' tab is selected
  const [activeTab, setActiveTab] = useState('login');

  // Controlled form state for Sign In
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Controlled form state for Create Account
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPass, setSignupPass] = useState('');

  // Logs in instantly as a guest without entering a password
  const handleGuestLogin = async () => {
    const guest = await loginUser('guest@campus.edu', 'guest', 'Guest Learner');
    setUser(guest);
    addToast('Signed in as Guest Learner!', 'info');
    setTimeout(() => navigate('/'), 500); // Redirect to home page
  };

  // Handles standard student account sign-in
  const handleLogin = async (e) => {
    e.preventDefault();
    const loggedIn = await loginUser(loginEmail, loginPass);
    setUser(loggedIn);
    addToast(`Welcome back, ${loggedIn.name}!`, 'success');
    setTimeout(() => navigate('/'), 500); // Redirect to home page
  };

  // Handles new student registration
  const handleSignup = async (e) => {
    e.preventDefault();
    const registered = await loginUser(signupEmail, signupPass, signupName);
    setUser(registered);
    addToast(`Account created! Welcome, ${registered.name}!`, 'success');
    setTimeout(() => navigate('/'), 500); // Redirect to home page
  };

  // Logs out user by clearing storage and resetting state
  const handleLogout = () => {
    localStorage.removeItem('quizmaster_user');
    setUser(null);
    addToast('Logged out successfully.', 'info');
  };

  return (
    <main className="auth-wrapper" style={{ maxWidth: '480px' }}>
      <div className="card" style={{ padding: '2rem' }}>
        {user && user.name ? (
          /* Logged In Dashboard State: Shown if user is already signed in */
          <div style={{ textAlign: 'center' }}>
            <div className="player-avatar" style={{ width: '54px', height: '54px', fontSize: '1.5rem', margin: '0 auto 1rem' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 style={{ marginBottom: '0.3rem' }}>Welcome, {user.name}!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {user.email || 'student@campus.edu'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/quiz" className="btn btn-primary">Start a New Quiz →</Link>
              <Link to="/history" className="btn btn-outline">View My Quiz History</Link>
              <button type="button" className="btn btn-outline" onClick={handleLogout}>Log Out</button>
            </div>
          </div>
        ) : (
          /* Authentication Forms: Shown if user is not signed in */
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.5rem' }}>Campus Student Access</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Sign in with an account or continue instantly as guest
              </p>
            </div>

            {/* Instant One-Click Guest Login */}
            <div style={{ marginBottom: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.75rem' }}
                onClick={handleGuestLogin}
              >
                <FaUserCheck style={{ color: 'var(--primary)' }} /> Continue as Guest Learner
              </button>
              <div style={{ display: 'flex', alignItems: 'center', margin: '1.2rem 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                <span style={{ padding: '0 0.75rem' }}>OR SIGN IN WITH ACCOUNT</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              </div>
            </div>

            {/* Tabs for switching between Sign In and Create Account */}
            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => setActiveTab('login')}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
                onClick={() => setActiveTab('signup')}
              >
                Create Account
              </button>
            </div>

            {/* Sign In Form */}
            {activeTab === 'login' ? (
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="loginEmail">Email Address or Username</label>
                  <input
                    type="text"
                    id="loginEmail"
                    className="form-control"
                    placeholder="e.g. aarav@campus.edu"
                    required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="loginPassword">Password</label>
                  <input
                    type="password"
                    id="loginPassword"
                    className="form-control"
                    placeholder="Enter password (default: 123)"
                    required
                    value={loginPass}
                    onChange={e => setLoginPass(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <input type="checkbox" defaultChecked /> Remember me
                  </label>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Default pass: 123</span>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Sign In to Dashboard →</button>

                {/* Pre-seeded demo student accounts list */}
                <div style={{ marginTop: '1rem', padding: '0.6rem 0.8rem', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  <strong>Sample Initial Accounts (Pass: 123):</strong><br />
                  aarav@campus.edu &bull; diya@campus.edu &bull; rohan@campus.edu &bull; ananya@campus.edu
                </div>
              </form>
            ) : (
              /* Create Account Form */
              <form onSubmit={handleSignup}>
                <div className="form-group">
                  <label htmlFor="signupName">Full Name</label>
                  <input
                    type="text"
                    id="signupName"
                    className="form-control"
                    placeholder="e.g. Priya Sharma"
                    required
                    value={signupName}
                    onChange={e => setSignupName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signupEmail">College / Personal Email</label>
                  <input
                    type="email"
                    id="signupEmail"
                    className="form-control"
                    placeholder="e.g. priya@campus.edu"
                    required
                    value={signupEmail}
                    onChange={e => setSignupEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signupPassword">Create Password</label>
                  <input
                    type="password"
                    id="signupPassword"
                    className="form-control"
                    placeholder="Min. 6 characters"
                    required
                    value={signupPass}
                    onChange={e => setSignupPass(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Student Account →</button>
              </form>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
