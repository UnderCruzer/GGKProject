import React, { useEffect, useState } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('https://211.42.159.18/:8080/api/users') // 스프링부트 서버의 사용자 목록 API 주소로 수정
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  function User({ user }) {
  return (
    <div>
      <b>{user.username}</b> <span>({user.email})</span>
    </div>
  );
}

return (
    <div>
      {users.map((user) => (
        <User key={user.id} user={user} />
      ))}
    </div>
  );
}

export default UserList;