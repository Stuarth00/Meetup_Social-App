import { useContext, useEffect, useState } from "react";
import type { UserProfile } from "../../Types/Interafaces";
import { AppContext } from "../../Context/GlobalState";
import image_default from "../../assets/image_default.svg.png";
import "../../index.css";
import "../Elements/SearchAndFollow.css";

interface FollowListProps {
  type: "followers" | "following";
  user_id: string;
  onClose: () => void;
}

function FollowList({ type, user_id, onClose }: FollowListProps) {
  const { getFollowersList, getFollowingList, handleNavigateToUserId } =
    useContext(AppContext);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleClick = (userId: string) => {
    handleNavigateToUserId(userId);
    onClose();
  };

  useEffect(() => {
    const fetchList = async () => {
      try {
        setIsLoading(true);
        if (type === "followers") {
          const data = await getFollowersList(user_id, type);
          setUsers(data);
        } else if (type === "following") {
          const data = await getFollowingList(user_id, type);
          setUsers(data);
        }
      } catch (err) {
        return err;
      } finally {
        setIsLoading(false);
      }
    };
    fetchList();
  }, [user_id, type]);

  return (
    <div style={{ padding: "8px" }}>
      {/* Dynamic Header Title based on Type */}
      <h2
        style={{
          fontSize: "1.3rem",
          fontWeight: "700",
          marginBottom: "20px",
          textTransform: "capitalize",
        }}
      >
        {type}
      </h2>

      <div className="modal-list-container">
        {isLoading ? (
          <div className="status-msg">Fetching list...</div>
        ) : users.length === 0 ? (
          <div className="status-msg">
            <p style={{ fontWeight: "500" }}>No {type} yet.</p>
          </div>
        ) : (
          <div className="user-list-grid">
            {users.map((user) => (
              <div
                key={user.user_id}
                className="user-card"
                onClick={() => handleClick(user.user_id)}
              >
                {/* Visual Avatar Initials */}
                <img
                  src={user.avatar || image_default}
                  alt={user.first_name}
                  className="user-avatar"
                />

                {/* Main Identity Information */}
                <div className="user-card-info">
                  <span className="user-card-name">
                    {user.first_name} {user.last_name}
                  </span>
                  <span className="user-card-handle">
                    @{user.first_name.toLowerCase()}
                  </span>
                </div>

                {/* Call To Action Button matching Search component */}
                <button className="user-card-action-btn">View</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FollowList;
