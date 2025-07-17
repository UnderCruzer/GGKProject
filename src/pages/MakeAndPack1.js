import React from "react";
import FlightTable from "../components/FlightTable";
import { useMembers } from "../context/MembersContext";

// ✅ 안전한 시간 계산 함수
const calcTime = (baseDate, timeStr, offsetHours) => {
  if (!timeStr) return null;
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return null;

  const dateObj = new Date(baseDate);
  dateObj.setHours(hours);
  dateObj.setMinutes(minutes);
  dateObj.setSeconds(seconds || 0);

  // offsetHours만큼 더하거나 빼기
  dateObj.setHours(dateObj.getHours() + offsetHours);
  return dateObj;
};

// ✅ Date → HH:mm:ss
const formatTime = (dateObj) => {
  if (!dateObj) return "-";
  const h = String(dateObj.getHours()).padStart(2, "0");
  const m = String(dateObj.getMinutes()).padStart(2, "0");
  const s = String(dateObj.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const MakeAndPack1 = () => {
  const { members, setMembers, loading } = useMembers();

  // ✅ 백엔드 데이터 → 화면 표시용 데이터 변환
  const mapToFlightTableData = (item) => {
    const baseDate = new Date(item.departuredate ?? "1970-01-01");
    const departureTime = item.departuretime ?? null;

    // ✅ 작업시작 = 출발시간 - 6시간
    const startTimeObj = calcTime(baseDate, departureTime, -6);
    const startTime = formatTime(startTimeObj);

    // ✅ 작업종료 = 작업시작 + 2시간
    let endTime = "-";
    if (startTimeObj) {
      const endTimeObj = new Date(startTimeObj);
      endTimeObj.setHours(endTimeObj.getHours() + 2);
      endTime = formatTime(endTimeObj);
    }

    return {
      id: item.id ?? "-",
      flight: item.flightNumber ?? "-",
      destination: item.destination ?? "-",
      aircraft: item.acversion ?? "-",
      departureDate: item.departuredate ?? "-",
      departureTime: item.departuretime ?? "-",
      startTime: startTime,   // ✅ 출발 -6h
      endTime: endTime,       // ✅ 작업시작 +2h
      bool_complete1: item.bool_complete1 ?? 0,
      completeDate: item.completeDate ?? "-",
      completeTime: item.completeTime ?? "-"
    };
  };

  const mappedMembers = members.map(mapToFlightTableData);

  // ✅ 완료 체크 토글 (백엔드에는 bool만 전송)
  const toggleBoolComplete = async (id, step, currentValue) => {
  const newValue = currentValue === 1 ? 0 : 1;

  // UI에만 표시할 완료일자/시간
  let uiCompleteDate = "-";
  let uiCompleteTime = "-";
  if (newValue === 1) {
    const now = new Date();
    const rawDate = now.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    uiCompleteDate = rawDate.replace(/\./g, "/").replace(/\s/g, "").replace(/\/$/, "");
    uiCompleteTime = now.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  try {
    const res = await fetch(
      `http://211.42.159.18:8080/api/members/${id}/complete/${step}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: newValue }),
      }
    );

    if (!res.ok) {
      console.error("❌ API 응답 오류:", await res.text());
      alert("백엔드 업데이트 실패");
      return;
    }

    console.log(`✅ bool_complete${step} 업데이트 성공 (id=${id}, step=${step}, newValue=${newValue})`);

    // ✅ prev 검증 + 안전 업데이트
    setMembers((prev) => {
      if (!Array.isArray(prev)) {
        console.error("❌ prev가 배열이 아님:", prev);
        return prev; // 잘못된 상태면 그대로 반환
      }

      const updated = prev.map((m) => {
        if (Number(m.id) === Number(id)) {
          console.log("🔄 업데이트 대상:", m);
          return {
            ...m,
            [`bool_complete${step}`]: newValue,
            completeDate: uiCompleteDate,
            completeTime: uiCompleteTime,
          };
        }
        return m;
      });

      console.log("✅ 업데이트 후 members:", updated);
      return updated;
    });
  } catch (err) {
    console.error("❌ 네트워크/로직 오류:", err);
    alert("업데이트 실패");
  }
};

  if (loading) return <div>데이터 불러오는 중...</div>;

  return (
    <div>
      <h2 style={{ textAlign: "center", margin: "20px 0", fontSize: "24px" }}>
        Make and Pack 1
      </h2>

      <FlightTable data={mappedMembers} toggleBoolComplete={toggleBoolComplete} />
    </div>
  );
};

export default MakeAndPack1;
