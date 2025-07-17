import React, { useState } from 'react';
import './FlightTable.css';

// 셀 정의 
const cellMeta = {
  flight: 'excel',
  destination: 'excel',
  aircraft: 'excel',
  departureDate: 'system',
  departureTime: 'system',
  startTime: 'auto',
  prepDays: 'auto',
  endTime: 'auto',
  completed: 'manual',
  note: 'manual',
  completeDate: 'system',
  completeTime: 'system',
};

// 셀 렌더링 방식
const renderCell = (key, value) => {
  const source = cellMeta[key];

  if (source === 'system') return <span>{value}</span>;
  if (source === 'auto') return <em>{value}</em>;
  if (source === 'excel') return <strong>{value}</strong>;
  return <input type="text" defaultValue={value} />;
};

// 상태 관리 로직
const FlightTable = ({ data, washOnly = false, toggleBoolComplete }) => {
  // 비행편, 도착지, 완료 여부를 필터링하기 위한 상태
  // 필터 입력을 바꾸면 값이 변경되면서 필터링된 데이터가 보여진다.
  const [flightFilter, setFlightFilter] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('');
  const [completedFilter, setCompletedFilter] = useState('');

  // ✅ 필터 목록용 고유 값 추출
  const uniqueFlights = [...new Set(data.map(f => f.flight))];
  const uniqueDestinations = [...new Set(data.map(f => f.destination))];

  // ✅ 필터링 로직 (bool_complete1 기준)
  const filteredData = data.filter(f =>
    (flightFilter ? f.flight === flightFilter : true) &&
    (destinationFilter ? f.destination === destinationFilter : true) &&
    (completedFilter
      ? (f.bool_complete1 === 1 ? 'Y' : 'N') === completedFilter
      : true)
  );

  return (
    <div className="flight-tablecontainer">
      {/* ✅ 필터 컨트롤 */}
      <div className="filter-controls">
        <label>
          비행편명:
          <select value={flightFilter} onChange={(e) => setFlightFilter(e.target.value)}>
            <option value="">전체</option>
            {uniqueFlights.map(flight => (
              <option key={flight} value={flight}>{flight}</option>
            ))}
          </select>
        </label>

        <label>
          목적지:
          <select value={destinationFilter} onChange={(e) => setDestinationFilter(e.target.value)}>
            <option value="">전체</option>
            {uniqueDestinations.map(dest => (
              <option key={dest} value={dest}>{dest}</option>
            ))}
          </select>
        </label>

        <label>
          완료 여부:
          <select value={completedFilter} onChange={(e) => setCompletedFilter(e.target.value)}>
            <option value="">전체</option>
            <option value="Y">✅ 완료</option>
            <option value="N">❌ 미완료</option>
          </select>
        </label>
      </div>

      {/* ✅ 테이블 */}
      <div className="table-wrapper">
        <table className="flight-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>비행편명</th>
              <th>목적지</th>
              <th>기종</th>
              {washOnly && <th>레그넘버</th>}
              <th>출발날짜</th>
              <th className="center-align">출발시간</th>
              <th className="center-align">작업시작</th>
              <th className="center-align">준비시간</th>
              <th className="center-align">작업종료</th>
              <th className="center-align">완료(bool_complete1)</th>
              <th>주석</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((f) => (
              <tr key={f.id}>
                <td data-label="ID">{f.id}</td>
                <td data-label="비행편명">{renderCell('flight', f.flight)}</td>
                <td data-label="목적지">{renderCell('destination', f.destination)}</td>
                <td data-label="기종">{renderCell('aircraft', f.aircraft)}</td>
                {washOnly && ( <td data-label="레그넘버" className="center-align"> {f.legNumber ?? '-'} </td> )}
                <td data-label="출발날짜" className="nowrap-cell">{renderCell('departureDate', f.departureDate)}</td>
                <td data-label="출발시간" className="center-align">{renderCell('departureTime', f.departureTime)}</td>
                <td data-label="작업시작" className="center-align">{renderCell('startTime', f.startTime)}</td>
                <td data-label="준비시간" className="center-align">{f.prepDays ?? -1}</td>
                <td data-label="작업종료" className="center-align">{renderCell('endTime', f.endTime)}</td>

                {/* ✅ bool_complete1 연동 체크박스 */}
                <td data-label="완료" className="center-align">
                  <input
                    type="checkbox"
                    checked={f.bool_complete1 === 1} // DB 값이 1이면 체크됨
                    onChange={() => toggleBoolComplete(f.id, 1, f.bool_complete1)}
                  />
                </td>

                <td data-label="주석">{renderCell('note', f.note)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FlightTable;
