import "../../index.css";

interface LikeUser {
  user_id: string;
  first_name: string;
  last_name: string;
  avatar?: string;
}
function LikeList({ likesList }: { likesList: LikeUser[] }) {
  return (
    <div>
      <div className="modal-list-container">
        <p>List of users who liked, will be here</p>
        {likesList.map((user) => (
          <div key={user.user_id} className="like-user-item">
            <img
              src={user.avatar}
              alt="Avatar.png"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span>
              {user.first_name} {user.last_name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LikeList;
