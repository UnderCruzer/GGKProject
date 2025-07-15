import React, { useState } from 'react';
import './DashboardTable.css';

const DashboardTable = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  // 작업 키 정의
  const completeKeys = ['bool_complete1', 'bool_complete2', 'bool_complete3', 'bool_complete4', 'bool_complete5', 'bool_complete6', 'bool_complete7', 'bool_complete8'];
  // 전체 완료 상태 계산 
  const getOverrallStatus = (member) => {
    return completeKeys.every(k => member[k] === 1) ? '완료' : '미완료';
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,direction: prev.key === key && prev.direction === 'asc' ? 'desc': 'asc',
    }));
  };
  // 필터링 + 정렬 
  const filteredData = data
    .filter((item) => {
      const flightMatch = item.flight.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === 'all'
         || (statusFilter === '완료' && getOverrallStatus(item) === '완료') 
         || (statusFilter === '미완료' && getOverrallStatus(item) === '미완료');
      return flightMatch && statusMatch;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const A = (a[sortConfig.key] ?? '').toString();
      const B = (b[sortConfig.key] ?? '').toString();
      return sortConfig.direction === 'asc'
        ? A.localeCompare(B)
        : B.localeCompare(A);
    });    

  return (
    <div className="dashboard-container">
      <h2>상세 대시보드</h2>

      <div className="dashboard-controls">
        <input
          type="text"
          placeholder="비행편명 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">전체</option>
          <option value="완료">완료</option>
          <option value="미완료">미완료</option>
        </select>
      </div>

    <div className="table-wrapper">
      <table className="dashboard-table">
        <thead>
          <tr>
           <th>ID</th>
           <th onClick={() => handleSort('flight')}>비행편명</th>
           <th onClick={() => handleSort('destination')}>목적지</th>
           <th onClick={() => handleSort('aircraft')}>기종</th>

           {completeKeys.map((key) => (<th key = {key}>{key.toUpperCase()}</th>))}
        
           <th>완료 여부</th>
           <th onClick={() => handleSort('delayMinutes')}>지연시간</th>
           <th>출발일</th>
           <th>작업시작</th>
           <th>작업종료</th>
           <th>완료일</th>
           <th>완료시간</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, idx) => {
            const overallStatus = getOverrallStatus(item.tasks);
            const statusClass = overallStatus === '완료' 
            ? 'cell-complete' 
            : 'cell-incomplete';

            let delayClass = '';
            const delay = item.delayMinutes ?? 0;
            if (delay === 0) delayClass = 'delay-none';
            else if (delay <= 15) delayClass = 'delay-low';
            else if (delay <= 30) delayClass = 'delay-medium';
            else delayClass = 'delay-high';

            return (
              <tr key={idx}>
                  <td data-label="ID">{idx + 1}</td>
                  <td data-label="비행편명">{item.flight}</td>
                  <td data-label="목적지">{item.destination}</td>
                  <td data-label="기종">{item.aircraft}</td>
                  {taskKeys.map((key) => (
                    <td data-label={key.toUpperCase()} key={key}>{item.tasks?.[key] ?? 'Y'}</td>
                  ))}
                  <td data-label="완료 여부" className={statusClass}>{overallStatus}</td>
                  <td data-label="지연시간" className={delayClass}>{delay}분</td>
                  <td data-label="출발일">{item.departureDate}</td>
                  <td data-label="작업시간">{item.startTime}</td>
                  <td data-label="작업종료">{item.endTime}</td>
                  <td data-label="완료일">{item.completeDate}</td>
                  <td data-label="완료시간">{item.completeTime}</td>
                </tr>
            );
          })}
        </tbody>
      </table>  
    </div>
  </div>
  );
};

export default DashboardTable;