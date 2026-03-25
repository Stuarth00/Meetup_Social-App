import { useContext } from "react";
import { AppContext } from "../Context/GlobalState";

function Header() {
  const { handleUserProfileClick, handleHomeClick, handleAuthClick } =
    useContext(AppContext);
  return (
    <header className="fixed top-0 left-0 w-full bg-[#F2EDE7] text-[#2F2F2F] shadow-md z-50 ">
      <div>
        <button onClick={handleHomeClick}>Home</button>
        <button onClick={handleUserProfileClick}>Search</button>
        <button onClick={handleAuthClick}>Profile</button>
      </div>
    </header>
  );
}
export default Header;
