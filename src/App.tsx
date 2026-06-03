import { Routes, Route } from "react-router-dom";
import HomeFeed from "./Pages/HomeFeed";
import AuthorizationPage from "./Component/Authorization/Authorization";
import ProfileUser from "./Pages/UserProfile";
import "./App.css";
import { AppProvider } from "./Context/GlobalState";
import Search from "./Pages/Search";
import EditProfile from "./Component/ProfilePage/EditProfile";
import SinglePost from "./Pages/SinglePost";

function App() {
  return (
    <AppProvider>
      <div>
        <Routes>
          <Route path="/" element={<HomeFeed />} />
          <Route path="/auth" element={<AuthorizationPage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/user-profile" element={<ProfileUser />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/user/:user_id" element={<ProfileUser />} />
          <Route path="/posts/:post_id" element={<SinglePost />} />
        </Routes>
      </div>
    </AppProvider>
  );
}

export default App;
