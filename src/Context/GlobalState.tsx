import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { createContext } from "react";

interface AppProviderType {
  handleHomeClick: () => void;
  handleUserProfileClick: () => void;
  handleAuthClick: () => void;
  isModalOpen: boolean;
  handleCloseModal: () => void;
  handleOpenModal: () => void;
}
export const AppContext = createContext<AppProviderType>({} as AppProviderType);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  //Routes
  const navigate = useNavigate();
  //   const location = useLocation();

  const handleHomeClick = () => {
    navigate("/");
  };
  const handleUserProfileClick = () => {
    navigate("/user-profile");
  };
  const handleAuthClick = () => {
    navigate("/auth");
  };

  //Modal Login-Signin
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        handleHomeClick,
        handleUserProfileClick,
        handleAuthClick,
        isModalOpen,
        handleCloseModal,
        handleOpenModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
