import React from "react";
import FlightTable from "../components/FlightTable";
import { useMembers } from "../context/MembersContext";

// ✅ 안전한 시간 계산
const calcTime = (baseDate, timeStr, offsetHours) => {
  if (!timeStr) return null;
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return null;

  const dateObj = new Date(baseDate);
  dateObj.setHours(hours);
  dateObj.setMinutes(minutes);
  dateObj.setSeconds(seconds || 0);

  dateObj.setHours(dateObj.getHours() + offsetHours);
  return dateObj;
};

// ✅ Date → HH:mm
const formatTime = (dateObj) => {
  if (!dateObj) return "-";
  const h = String(dateObj.getHours()).padStart(2, "0");
  const m = String(dateObj.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
};

const MakeAndPack1 = () => {
  const { members, setMembers, loading } = useMembers();

  const mapToFlightTableData = (item) => {
    return {
      id: item.id ?? "-",
      flight: item.flightNumber ?? "-",
      destination: item.destination ?? "-",
      aircraft: item.acversion ?? "-",
      departureDate: item.departuredate ?? "-",
      departureTime: item.departuretime ?? "-",  // ✅ departuretime 사용
      startTime: item.arrivaltime ?? "-",        // 필요시 유지
      bool_complete1: item.bool_complete1 ?? 0,
      completeDate: item.completeDate ?? "-",    // UI 표시용
      completeTime: item.completeTime ?? "-"     // UI 표시용
    };
  };

  const mappedMembers = members.map(mapToFlightTableData);

  // ✅ PATCH API + UI용 날짜/시간만 프론트에서 갱신
  const toggleBoolComplete = async (id, step, currentValue) => {
    const newValue = currentValue === 1 ? 0 : 1;

    // ✅ UI용 완료일자/시간 (백엔드로는 안 보냄)
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
      // ✅ 백엔드에는 value만 전송
      const res = await fetch(
        `http://211.42.159.18:8080/api/members/${id}/complete/${step}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: newValue })
        }
      );

      if (!res.ok) throw new Error("API 요청 실패");
      console.log(`✅ bool_complete${step} 업데이트 성공`);

      // ✅ 프론트 UI용 Context 업데이트 (날짜/시간은 프론트에서만 보임)
      setMembers((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                [`bool_complete${step}`]: newValue,
                completeDate: uiCompleteDate,
                completeTime: uiCompleteTime
              }
            : m
        )
      );
    } catch (err) {
      console.error("❌ bool_complete 업데이트 실패:", err);
      alert("업데이트 실패");
    }
  };

  if (loading) return <div>데이터 불러오는 중...</div>;

  return (
    <div>
      <h2
        style={{
          textAlign: "center",
          marginTop: "20px",
          marginBottom: "30px",
          fontSize: "24px",
        }}
      >
        Make and Pack 1
      </h2>

      {/* ✅ 변환된 데이터 + 완료 토글 함수 전달 */}
      <FlightTable data={mappedMembers} toggleBoolComplete={toggleBoolComplete} />
    </div>
  );
};

export default MakeAndPack1;