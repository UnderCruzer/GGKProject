import React, { useState, useMemo } from "react";
import "./FlightTable.css";

const cellMeta = {
  flight: "excel",
  destination: "excel",
  aircraft: "excel",
  departureDate: "system",
  departureTime: "system",
  startTime: "auto",
  prepDays: "auto",
  endTime: "auto",
  completed: "manual",
  note: "manual",
  completeDate: "system",
  completeTime: "system",
};

const renderCell = (key, value) => {
  const source = cellMeta[key];

  if (source === "system") return <span>{value}</span>;
  if (source === "auto") return <em>{value}</em>;
  if (source === "excel") return <strong>{value}</strong>;
  return <input type="text" defaultValue={value} />;
};

/** ✅ 공통 완료 체크박스 컴포넌트 */
const CompleteToggleButton = ({ flight, mode, toggleBoolComplete }) => {
  // ✅ 현재 완료 여부 선택
  const isCompleted =
    mode === 1 ? flight.bool_complete1 === 1 :
    mode === 2 ? flight.bool_complete2 === 1 :
    mode === 3 ? flight.bool_complete3 === 1 : false;

  // ✅ 현재 값 선택
  const currentValue =
    mode === 1 ? flight.bool_complete1 :
    mode === 2 ? flight.bool_complete2 :
    mode === 3 ? flight.bool_complete3 : 0;

  const handleToggle = () => {
    toggleBoolComplete(flight.id, mode, currentValue);
  };

  return (
    <input
      type="checkbox"
      checked={isCompleted}
      onChange={handleToggle}
    />
  );
};

const FlightTable = ({
  data,
  toggleBoolComplete,
  washOnly = false,
  makeOnly = false,
  mode = 1 // ✅ 기본은 makeandpack1
}) => {
  const [flightFilter, setFlightFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const [completedFilter, setCompletedFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("today");

  const uniqueFlights = useMemo(() => [...new Set(data.map((f) => f.flight))], [data]);
  const uniqueDestinations = useMemo(() => [...new Set(data.map((f) => f.destination))], [data]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const filteredData = useMemo(() => data.filter((f) => {
    const matchFlight = flightFilter ? f.flight === flightFilter : true;
    const matchDest = destinationFilter ? f.destination === destinationFilter : true;

    // ✅ 완료 여부는 mode별로 동적 선택
    const completedValue =
      mode === 1 ? f.bool_complete1 :
      mode === 2 ? f.bool_complete2 :
      mode === 3 ? f.bool_complete3 : 0;

    const isCompleted = completedValue === 1;
    const matchCompleted = !completedFilter
      ? true
      : (completedFilter === "Y" ? isCompleted : !isCompleted);

    const depDate = f.departureDate?.slice(0,10) ?? "";
    const targetDate = dateFilter === "today" ? todayStr : tomorrowStr;
    const matchDate = dateFilter === "all" ? true : depDate === targetDate;

    return matchFlight && matchDest && matchCompleted && matchDate;
  }), [data, flightFilter, destinationFilter, completedFilter, dateFilter, todayStr, tomorrowStr, mode]);

  return (
    <div className="flight-tablecontainer">
      {/* ✅ 필터 영역 */}
      <div className="filter-controls">
        <label>
          비행편명 :
          <select
            value={flightFilter}
            onChange={(e) => setFlightFilter(e.target.value)}
          >
            <option value="">전체</option>
            {uniqueFlights.map((flight) => (
              <option key={flight} value={flight}>
                {flight}
              </option>
            ))}
          </select>
        </label>

        <label>
          목적지 :
          <select
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
          >
            <option value="">전체</option>
            {uniqueDestinations.map((dest) => (
              <option key={dest} value={dest}>
                {dest}
              </option>
            ))}
          </select>
        </label>

        <label>
          완료 여부 :
          <select
            value={completedFilter}
            onChange={(e) => setCompletedFilter(e.target.value)}
          >
            <option value="">전체</option>
            <option value="Y">✅ 완료</option>
            <option value="N">❌ 미완료</option>
          </select>
        </label>

        <label>
          날짜 :
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="today">오늘</option>
            <option value="tomorrow">내일</option>
            <option value="all">전체</option>
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
              {washOnly && <th>항공사구분</th>}
              <th>목적지</th>
              <th>기종</th>
              {washOnly && <th>레그넘버</th>}
              <th className="center-align">출발날짜</th>
              <th className="center-align">출발시간</th>
              <th className="center-align">작업시작</th>
              <th className="center-align">준비시간</th>
              <th className="center-align">작업종료</th>
              {makeOnly && <th>카트 MEAL</th>}
              {makeOnly && <th>카트 EQ</th>}
              {makeOnly && <th>카트 GLSS</th>}
              {makeOnly && <th>카트 EY</th>}
              {makeOnly && <th>카트 LINNEN</th>}
              {makeOnly && <th>카트 S/T SET</th>}
              <th className="center-align">완료</th>
              <th>주석</th>
              <th>완료일자</th>
              <th>완료시간</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((f) => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{renderCell("flight", f.flight)}</td>
                {washOnly && <td>{f.airline}</td>}
                <td>{renderCell("destination", f.destination)}</td>
                <td>{renderCell("aircraft", f.aircraft)}</td>
                {washOnly && <td>{f.regNumber}</td>}
                <td>{renderCell("departureDate", f.departureDate)}</td>
                <td>{renderCell("departureTime", f.departureTime)}</td>
                <td>{renderCell("startTime", f.startTime)}</td>
                <td>{f.prepDays ?? -1}</td>
                <td>{renderCell("endTime", f.endTime)}</td>

                {makeOnly && <td>{f.cart_meal}</td>}
                {makeOnly && <td>{f.cart_eq}</td>}
                {makeOnly && <td>{f.cart_glss}</td>}
                {makeOnly && <td>{f.cart_ey}</td>}
                {makeOnly && <td>{f.cart_linnen}</td>}
                {makeOnly && <td>{f.cart_stset}</td>}

                {/* ✅ 공통 체크박스 */}
                <td className="center-align">
                  <CompleteToggleButton
                    flight={f}
                    mode={mode}
                    toggleBoolComplete={toggleBoolComplete}
                  />
                </td>

                <td>{renderCell("note", f.note)}</td>
                <td>{f.completeDate ?? "-"}</td>
                <td>{f.completeTime ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FlightTable;
