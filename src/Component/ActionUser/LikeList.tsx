import { useContext } from "react";
import "../../index.css";
import image_default from "../../assets/image_default.svg.png";
import { AppContext } from "../../Context/GlobalState";

interface LikeUser {
  user_id: string;
  first_name: string;
  last_name: string;
  avatar?: string;
}

interface LikeListProps {
  likesList: LikeUser[];
}

function LikeList({ likesList }: LikeListProps) {
  // Pulling navigation handler if you want clicking a like card to go to their profile
  const { handleNavigateToUserId } = useContext(AppContext);

  return (
    <div style={{ padding: "8px" }}>
      <h2
        style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "20px" }}
      >
        Liked by
      </h2>

      <div className="modal-list-container">
        {likesList.length === 0 ? (
          <div className="status-msg">
            <p style={{ fontWeight: "500" }}>No likes yet.</p>
          </div>
        ) : (
          <div className="user-list-grid">
            {likesList.map((user) => (
              <div
                key={user.user_id}
                className="user-card"
                onClick={() => handleNavigateToUserId?.(user.user_id)}
              >
                {/* Conditional Avatar rendering:
                  If avatar string exists, use the image. 
                  Otherwise, fall back to the CSS-styled initials layout.
                */}
                {user.avatar ? (
                  <img
                    src={user.avatar || image_default}
                    alt={`${user.first_name}'s avatar`}
                    className="user-avatar"
                    style={{ objectFit: "cover" }} // Overrides standard layout to ensure image doesn't distort
                  />
                ) : (
                  <div className="user-avatar">
                    {user.first_name[0]}
                    {user.last_name[0]}
                  </div>
                )}

                {/* Main Identity Info matching Search and Follow lists */}
                <div className="user-card-info">
                  <span className="user-card-name">
                    {user.first_name} {user.last_name}
                  </span>
                  <span className="user-card-handle">
                    @{user.first_name.toLowerCase()}
                  </span>
                </div>

                {/* Optional mini action button to stay consistent */}
                <button className="user-card-action-btn">View</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LikeList;
