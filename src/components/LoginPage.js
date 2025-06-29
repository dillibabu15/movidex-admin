import React, { useState } from 'react';
import Cookies from 'js-cookie';
import './Loginpage.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username required';
    if (!password || password.length < 12) newErrors.password = 'Min 12 chars';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        const user = data.user;
        const token = data.token;
        if (user.role !== 'admin') {
          setErrors({ general: 'You are not an admin.' });
          sessionStorage.removeItem('sessionToken');
          sessionStorage.removeItem('user');
          setLoading(false);
          return;
        }
        sessionStorage.setItem('sessionToken', token);
        sessionStorage.setItem('user', JSON.stringify(user));
        Cookies.set('username', user.username, { expires: 7, path: '/' });
        Cookies.set('isLoggedIn', 'true', { expires: 7, path: '/' });
        if (onLogin) onLogin(user);
        navigate('/admin/dashboard');
      } else {
        setErrors({ general: data.message || 'Invalid credentials' });
      }
    } catch (err) {
      setErrors({ general: 'Server error' });
    }
    setLoading(false);
  };

  return (
    <div className="page-container">
      <div className="login-box">
        <img src="/logo.png" alt="Logo" className="logo" />
        <h2 className="page-title">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">Username</label>
            <input
              className="text-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            {errors.username && <div className="message-box message-error">{errors.username}</div>}
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="text-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {errors.password && <div className="message-box message-error">{errors.password}</div>}
          </div>
          {errors.general && <div className="message-box message-error">{errors.general}</div>}
          <div className="button-group">
            <button className="btn btn-submit" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
            <button className="btn btn-reset" type="button" onClick={() => {
              setUsername('');
              setPassword('');
              setErrors({});
            }}>Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;