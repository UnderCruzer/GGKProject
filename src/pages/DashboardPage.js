import React from "react";
import DashboardTable from "../components/DashboardTable";
import { useMembers } from "../context/MembersContext";
import React from "react";
import DashboardTable from "../components/DashboardTable";
import { useMembers } from "../context/MembersContext";

const DashboardPage = () => {
  const { members, loading } = useMembers();

  if (loading) return <div>데이터 불러오는 중...</div>;
  if (loading) return <div>데이터 불러오는 중...</div>;

  return (
    <div>
      <h1>대시보드 페이지</h1>
      <DashboardTable data={members} />
    </div>
  );
  return (
    <div>
      <h1>대시보드 페이지</h1>
      <DashboardTable data={members} />
    </div>
  );
};


export default DashboardPage;