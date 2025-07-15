import React, { useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = ({ onLogin, redirectTo = "/dashboard" }) => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate() ;

  const handleLogin = () => {
    if (password === '1234') {
      onLogin();
      navigate(redirectTo);
    } else {
    alert('비밀번호가 틀렸습니다');
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <h2 className="login-title">관리자 로그인</h2>
        <div className="login-box">
          <input type="password" placeholder="Password" className="login-input" 
          value={password} onChange={(e) => setPassword(e.target.value)}/>
          <button className="login-button" onClick={handleLogin}>Log in</button>
        </div>
      </div>
    </div>
  ); 
};

export default AdminLogin;