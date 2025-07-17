import { createContext, useContext, useState, useEffect, useCallback, } from "react";

const MembersContext = createContext();

export const MembersProvider = ({ children }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch 함수 분리 (버튼 · interval 둘 다 씀)
  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://211.42.159.18:8080/api/members");
      const json = await res.json();
      setMembers(json);
    } catch (err) {
      console.error("❌ 데이터 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 + 1시간마다 fetch
  useEffect(() => {
    fetchMembers(); // 최초

    const interval = setInterval(() => {
      fetchMembers(); // 1시간마다
    }, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, [fetchMembers]);

  return (
    <MembersContext.Provider
      value={{
        members,
        setMembers,
        loading,
        fetchMembers, // 버튼에서 쓸 수 있도록 전달
      }}
    >
      {children}
    </MembersContext.Provider>
  );
};

export const useMembers = () => useContext(MembersContext);
