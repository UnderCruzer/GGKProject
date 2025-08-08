import React from "react";
import DashboardTable from "../components/DashboardTable";
import { useMembers } from "../context/MembersContext";

const DashboardPage = () => {
  const { members, loading, fetchMembers } = useMembers(); // ✅ fetchMembers 가져오기

  if (loading) return <div>데이터 불러오는 중...</div>;


  return (
    <div>
      <h1>Dashboard – Board view</h1>
      <button onClick={fetchMembers} style={{ marginLeft: '20px' }}>
        🔄 Refresh
      </button>
      <DashboardTable data={members} />
    </div>
  );
};


export default DashboardPage;