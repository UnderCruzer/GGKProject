import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // URL 파라미터에서 redirect 값 읽기 (없으면 기본값 /dashboard)
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const handleLogin = () => {
    if (password === '1234') {
      if (onLogin) onLogin(); // 인증 상태 업데이트
      navigate(redirectPath, { replace: true }); // 로그인 후 원래 가려던 페이지로 이동
    } else {
      alert('비밀번호가 틀렸습니다');
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <h2 className="login-title">관리자 로그인</h2>
        <div className="login-box">
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-button" onClick={handleLogin}>Log in</button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;