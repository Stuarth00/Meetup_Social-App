import Layout from "../Component/Layout";
import ProfilePage from "../Component/ProfilePage/profilePage";

function UserProfile() {
  return (
    <div>
      <Layout>
        <ProfilePage children={undefined} />
      </Layout>
    </div>
  );
}

export default UserProfile;
