import { useContext, useEffect, useState } from "react";
import type { User } from "../../Types/Interafaces";
import { AppContext } from "../../Context/GlobalState";

interface FollowListProps {
  type: "followers" | "following";
  user_id: string;
}

function FollowList({ type, user_id }: FollowListProps) {
  const { getFollowersList, getFollowingList } = useContext(AppContext);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchList = async () => {
      if (type === "followers") {
        const data = await getFollowersList(user_id, type);
        setUsers(data);
      }
      if (type === "following") {
        const data = await getFollowingList(user_id, type);
        setUsers(data);
      }
    };
    fetchList();
  }, [user_id, type]);

  return (
    <div>
      <h2>{type === "followers" ? "Followers" : "Following"}</h2>
      {users.map((user) => (
        <p key={user.user_id}>
          {user.first_name} {user.last_name}
        </p>
      ))}
    </div>
  );
}

export default FollowList;
