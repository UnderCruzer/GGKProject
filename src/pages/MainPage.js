import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1 className="main-title">GGK Checklist 메인 페이지</h1>
        <div className="department-sections">
          <div className="department-column">
            <h2>Make and Pack 부서 페이지</h2>
            <button className="department-button" onClick={() => navigate('/make-pack1')}>메이크앤팩1</button>
            <button className="department-button" onClick={() => navigate('/make-pack2')}>메이크앤팩2</button>
            <button className="department-button" onClick={() => navigate('/make-pack3')}>메이크앤팩3</button>
            <button className="department-button" onClick={() => navigate('/make-pack4')}>메이크앤팩4</button>
          </div>
          <div className="department-column">
            <h2>Pick and Pack 부서 페이지</h2>
            <button className="department-button" onClick={() => navigate('/pick-pack1')}>픽앤팩1</button>
            <button className="department-button" onClick={() => navigate('/pick-pack2')}>픽앤팩2</button>
          </div>
            <div className="department-column">
              <h2>Wash and Pack 부서 페이지</h2>
              <button className="department-button" onClick={() => navigate('/wash-pack1')}>워시앤드팩1</button>
              <button className="department-button" onClick={() => navigate('/wash-pack2')}>워시앤드팩2</button>
          </div>
      </div>

      <hr className="separator" />

      <div className="admin-section">
        <h2>관리자 화면</h2>
        <div className="admin-buttons-container">
          <button className="admin-button" onClick={() => navigate('/dashboard')}>대시보드 게시판형</button>
          <button className="admin-button">대시보드 UI형</button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;