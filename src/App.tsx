import { Routes, Route } from "react-router-dom";
import HomeFeed from "./Pages/HomeFeed";
import AuthorizationPage from "./Component/Authorization/Authorization";
import UserProfile from "./Pages/UserProfile";

import "./App.css";
import { AppProvider } from "./Context/GlobalState";

function App() {
  return (
    <AppProvider>
      <div>
        <Routes>
          <Route path="/" element={<HomeFeed />} />
          <Route path="/auth" element={<AuthorizationPage />} />
          <Route path="/user-profile" element={<UserProfile />} />
        </Routes>
      </div>
    </AppProvider>
  );
}

export default App;
