import React from "react";
import FlightTable from "../components/FlightTable";
import { useMembers } from "../context/MembersContext";

const MakeAndPack1 = () => {
  const { members, setMembers, loading } = useMembers();

  // ✅ JSON → FlightTable 매핑 (필드명 정확히 맞춤)
  const mapToFlightTableData = (item) => {
    return {
      id: item.id ?? "-",
      flight: item.flightNumber ?? "-",          // 예: "OZ 102"
      destination: item.destination ?? "-",      // 예: "NRT"
      aircraft: item.acversion ?? "-",           // 예: "OZA333E"
      departureDate: item.departuredate ?? "-",  // 예: "2025-07-04"
      departureTime: item.departuretime ?? "-",  // ✅ departuretime으로 수정
      startTime: item.arrivaltime ?? "-",        // 필요 시 유지
      bool_complete1: item.bool_complete1 ?? 0,  // 체크박스 상태
    };
  };

  // ✅ API에서 받은 members를 UI용으로 변환
  const mappedMembers = members.map(mapToFlightTableData);

  // ✅ PATCH API + Context 업데이트
  const toggleBoolComplete = async (id, step, currentValue) => {
    const newValue = currentValue === 1 ? 0 : 1;

    try {
      const res = await fetch(
        `http://211.42.159.18:8080/api/members/${id}/complete/${step}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            value: newValue // ✅ 완료일자/시간은 백엔드에서 자동 처리
          }),
        }
      );

      if (!res.ok) throw new Error("API 요청 실패");

      console.log(`✅ bool_complete${step} 업데이트 성공`);

      // ✅ Context 전역 상태 즉시 반영 → DashboardPage 자동 갱신
      setMembers((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, [`bool_complete${step}`]: newValue }
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
