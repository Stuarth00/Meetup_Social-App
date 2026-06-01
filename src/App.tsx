import { Routes, Route } from "react-router-dom";
import HomeFeed from "./Pages/HomeFeed";
import AuthorizationPage from "./Component/Authorization/Authorization";
import ProfileUser from "./Pages/UserProfile";
import "./App.css";
import { AppProvider } from "./Context/GlobalState";
import Search from "./Pages/Search";
import EditProfile from "./Component/ProfilePage/EditProfile";

function App() {
  console.log("Current port:", window.location.port);
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
        </Routes>
      </div>
    </AppProvider>
  );
}

export default App;
