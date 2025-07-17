import React, { createContext, useContext, useState, useEffect } from "react";

const MembersContext = createContext();

export const MembersProvider = ({ children }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Provider에서 넘기기 전에 값 확인
  console.log("DEBUG >> MembersProvider rendering:", {
    membersType: typeof members,
    setMembersType: typeof setMembers,
    setMembersValue: setMembers,
    loading
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://211.42.159.18:8080/api/members");
        const json = await res.json();
        setMembers(json);
      } catch (err) {
        console.error("❌ 데이터 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <MembersContext.Provider value={{ members, setMembers, loading }}>
      {children}
    </MembersContext.Provider>
  );
};

export const useMembers = () => useContext(MembersContext);
