import { useParams } from "react-router-dom";
import Layout from "../Component/Layout";
import PostProfile from "../Component/Post/PostProfile";
import ProfilePage from "../Component/ProfilePage/profilePage";
import { useContext, useEffect, useState } from "react";
import type { UserProfile } from "../Types/Interafaces";
import Authorization from "../Component/Authorization/Authorization";
import { AppContext } from "../Context/GlobalState";

function ProfileUser() {
  const { user_id } = useParams<{ user_id: string }>();
  const { state, getUserById } = useContext(AppContext);
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user_id) {
      const fetchProfile = async () => {
        const data = await getUserById(user_id);
        setProfileUser(data);
      };
      fetchProfile();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfileUser(state.currentUser);
    }
  }, [user_id]);

  if (!user_id && !state.currentUser) return <Authorization />;

  const isOwnProfile = !user_id || state.currentUser?.user_id === user_id;

  return (
    <div>
      <Layout>
        <ProfilePage profileUser={profileUser} isOwnProfile={isOwnProfile}>
          {profileUser && (
            <PostProfile
              user_id={profileUser.user_id}
              isOwnProfile={isOwnProfile}
            />
          )}
        </ProfilePage>
      </Layout>
    </div>
  );
}

export default ProfileUser;
