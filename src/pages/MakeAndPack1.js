import React from "react";
import FlightTable from "../components/FlightTable";
import { useMembers } from "../context/MembersContext";

const MakeAndPack1 = () => {
  const { members, setMembers, loading } = useMembers();

  // ✅ PATCH + 완료일자/시간 포함
  const toggleBoolComplete = async (id, step, currentValue) => {
    const newValue = currentValue === 1 ? 0 : 1;

    // ✅ 완료 체크 시 현재 날짜/시간 생성
    let completeDate = null;
    let completeTime = null;

    if (newValue === 1) {
      const now = new Date();
      const rawDate = now.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      completeDate = rawDate.replace(/\./g, "/").replace(/\s/g, "").replace(/\/$/, "");
      completeTime = now.toLocaleTimeString("ko-KR", {
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
          body: JSON.stringify({
            value: newValue,
            completeDate,
            completeTime
          }),
        }
      );

      if (!res.ok) throw new Error("API 요청 실패");

      console.log(`✅ bool_complete${step} + 완료일시 업데이트 성공`);

      // ✅ Context 전역 상태 즉시 반영 → DashboardPage 자동 갱신
      setMembers((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                [`bool_complete${step}`]: newValue,
                completeDate,
                completeTime,
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
      <h2 style={{ textAlign: "center", margin: "20px 0", fontSize: "24px" }}>
        Make and Pack 1
      </h2>

      <FlightTable data={members} toggleBoolComplete={toggleBoolComplete} />
    </div>
  );
};

export default MakeAndPack1;
