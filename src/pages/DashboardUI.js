import React, { useMemo } from "react";
import "./DashboardUI.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis
} from "recharts";

import { makeAndPack1Data } from "./MakeAndPack1";
import { makeAndPack2Data } from "./MakeAndPack2";
import { makeAndPack3Data } from "./MakeAndPack3";
import { makeAndPack4Data } from "./MakeAndPack4";
import { pickAndPack1Data } from "./PickAndPack1";
import { pickAndPack2Data } from "./PickAndPack2";
import { washAndPack1Data } from "./WashAndPack1";
import { washAndPack2Data } from "./WashAndPack2";

const COLORS = ["#4caf50", "#f44336"];

// ✅ 완료/미완료 카운트 함수
const countStatus = (arr) => {
  let completed = 0;
  let notCompleted = 0;
  arr.forEach(item => {
    if (item.completed === "Y") completed++;
    else if (item.completed === "N") notCompleted++;
  });
  return { completed, notCompleted };
};

// ✅ PieChart 안전 렌더링 (데이터 없으면 메시지)
const renderPie = (data) => {
  const safeData = data || [];
  const hasData = safeData.some(d => d.value > 0);

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      {hasData ? (
        <ResponsiveContainer width="95%" height={300}>
          <PieChart>
            <Pie
              data={safeData}
              cx="50%"
              cy="50%"
              outerRadius="45%" /* ✅ 반응형 */
              dataKey="value"
              label
              labelLine={false}
            >
              {safeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={40} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div
          style={{
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#999",
            fontSize: "1.1rem",
          }}
        >
          📭 데이터 없음
        </div>
      )}
    </div>
  );
};

// ✅ BarChart 안전 렌더링 (데이터 없으면 메시지)
const renderBar = (data) => {
  const safeData = data || [];
  const hasData = safeData.some(d => (d.완료 > 0 || d.미완료 > 0));

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      {hasData ? (
        <ResponsiveContainer width="95%" height={300}>
          <BarChart data={safeData} barSize={30}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
            <Bar dataKey="완료" fill="#4caf50" />
            <Bar dataKey="미완료" fill="#f44336" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div
          style={{
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#999",
            fontSize: "1.1rem",
          }}
        >
          📭 데이터 없음
        </div>
      )}
    </div>
  );
};

function DashboardUI() {
  // ✅ 부서별 카운트
  const makeCount = useMemo(() => countStatus([
    ...makeAndPack1Data,
    ...makeAndPack2Data,
    ...makeAndPack3Data,
    ...makeAndPack4Data
  ]), []);

  const pickCount = useMemo(() => countStatus([
    ...pickAndPack1Data,
    ...pickAndPack2Data
  ]), []);

  const washCount = useMemo(() => countStatus([
    ...washAndPack1Data,
    ...washAndPack2Data
  ]), []);

  // ✅ 그래프 데이터 생성
  const makePie = [
    { name: "완료", value: makeCount.completed },
    { name: "미완료", value: makeCount.notCompleted }
  ];
  const pickPie = [
    { name: "완료", value: pickCount.completed },
    { name: "미완료", value: pickCount.notCompleted }
  ];
  const washPie = [
    { name: "완료", value: washCount.completed },
    { name: "미완료", value: washCount.notCompleted }
  ];

  const makeBar = [{ name: "Make&Pack", 완료: makeCount.completed, 미완료: makeCount.notCompleted }];
  const pickBar = [{ name: "Pick&Pack", 완료: pickCount.completed, 미완료: pickCount.notCompleted }];
  const washBar = [{ name: "Wash&Pack", 완료: washCount.completed, 미완료: washCount.notCompleted }];

  return (
    <div className="dashboard-ui-container">
      <h1>✅ 부서별 완료 현황</h1>

      <div className="department-container">
        {/* ✅ Make & Pack */}
        <div className="department-card">
          <h2>Make & Pack</h2>
          <div className="chart-wrap">
            {renderPie(makePie)}
            {renderBar(makeBar)}
          </div>
        </div>

        {/* ✅ Pick & Pack */}
        <div className="department-card">
          <h2>Pick & Pack</h2>
          <div className="chart-wrap">
            {renderPie(pickPie)}
            {renderBar(pickBar)}
          </div>
        </div>

        {/* ✅ Wash & Pack */}
        <div className="department-card">
          <h2>Wash & Pack</h2>
          <div className="chart-wrap">
            {renderPie(washPie)}
            {renderBar(washBar)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardUI;