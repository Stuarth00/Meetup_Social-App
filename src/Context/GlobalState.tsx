import { useNavigate } from "react-router-dom";
import type { JSX, ReactNode } from "react";
import React, { createContext, useEffect, useReducer, useState } from "react";
import {
  type User,
  type State,
  type Token,
  type Post,
  type UserProfile,
} from "../Types/Interafaces";
import { ClipLoader } from "react-spinners";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getCurrentAccount,
  editAccount,
  createPost,
  getPost,
  getAllPosts,
  getUserById,
  getPostsByUserId,
  toggleFollowing,
  type ToggleFollowResponse,
} from "./Requests";

interface AppProviderType {
  handleHomeClick: () => void;
  handleUserProfileClick: () => void;
  handleSearchClick: () => void;
  handleAuthClick: () => void;
  handleEditProfileClick: () => void;
  handleNavigateToUserId: (userId: string) => void;
  state: State;
  dispatch: React.Dispatch<Action>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  LoadingSpinner: () => JSX.Element | null | undefined;
  asyncSimulate: (callback: () => void, delay?: number) => void;
  registerUser: (userData: User) => Promise<Token>;
  loginUser: (email: string, password: string) => Promise<Token>;
  getCurrentAccount: () => Promise<User>;
  editAccount: (updates: Partial<UserProfile>) => Promise<UserProfile>;
  createPost: (description: Post) => Promise<Post>;
  getPost: () => Promise<Post[]>;
  getAllPosts: () => Promise<Post[]>;
  getAllUsers: () => Promise<User[]>;
  getUserById: (id: string) => Promise<User>;
  getPostsByUserId: (id: string) => Promise<Post[]>;
  toggleFollowing: (id: string) => Promise<ToggleFollowResponse>;
}

const initialState: State = {
  users: [],
  currentUser: null,
  posts: [],
};

type ToggleFollowPayload = {
  targetUserId: string;
  followAction?: "followed" | "unfollowed"; // add this if you need to pass intent
};

type Action =
  | { type: "SET_CURRENT_USER"; payload: User }
  | { type: "REGISTER_USER"; payload: User }
  | { type: "LOGIN_USER"; payload: User }
  | { type: "LOGOUT" }
  | { type: "CREATE_POST"; payload: Post }
  | { type: "UPDATE_PROFILE"; payload: UserProfile }
  | { type: "TOGGLE_FOLLOW"; payload: ToggleFollowPayload };

function appReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return {
        ...state,
        currentUser: action.payload,
      };
    case "REGISTER_USER":
      console.log("Reducer called with action:", action);
      console.log("Initial state:", initialState);
      return {
        ...state,
        users: [...state.users, action.payload],
        currentUser: action.payload,
      };
    case "LOGIN_USER":
      console.log("Reducer called with action:", action);
      return { ...state, currentUser: action.payload };
    case "LOGOUT":
      console.log("Reducer called with action:", action);
      return { ...state, currentUser: null };
    case "CREATE_POST":
      if (!state.currentUser) return state;

      return {
        ...state,
        posts: Array.isArray(state.posts)
          ? [...state.posts, action.payload]
          : [action.payload],
      };
    case "UPDATE_PROFILE":
      if (!state.currentUser) return state;
      return {
        ...state,
        currentUser: action.payload,
        users: state.users.map((user) =>
          user.user_id === action.payload.user_id ? action.payload : user,
        ),
      };
    case "TOGGLE_FOLLOW": {
      if (!state.currentUser) return state;
      const currentUser = state.currentUser;
      const { targetUserId, followAction } = action.payload;
      const didFollow = followAction === "followed";

      return {
        ...state,
        currentUser: {
          ...currentUser,
          following: didFollow
            ? [...(currentUser.following || []), targetUserId]
            : currentUser.following?.filter((id) => id !== targetUserId),
        },
      };
    }
    default:
      return state;
  }
}

export const AppContext = createContext<AppProviderType>({} as AppProviderType);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  //useReducer
  const KEY = "my_app_state";

  const init = (initialValue: State): State => {
    const persisted = localStorage.getItem(KEY);
    return persisted ? JSON.parse(persisted) : initialValue;
  };
  const [state, dispatch] = useReducer(appReducer, initialState, init);
  //Routes
  const navigate = useNavigate();

  //Check token validation
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        dispatch({ type: "LOGOUT" });
        navigate("/auth");
        return;
      }
      try {
        const user = await getCurrentAccount();
        dispatch({
          type: "SET_CURRENT_USER",
          payload: user,
        });
      } catch (error) {
        localStorage.removeItem("token");
        dispatch({ type: "LOGOUT" });
        navigate("/auth");
        console.log(error);
      }
    };
    checkAuth();
  }, []);

  //Storing in localStorage
  useEffect(() => {
    const stateToPersist = {
      ...state,
      users: state.users.map((user) => ({
        ...user,
        avatar: "",
      })),
    };
    const timeout = setTimeout(() => {
      localStorage.setItem(KEY, JSON.stringify(stateToPersist));
    }, 300);
    return () => clearTimeout(timeout);
  }, [state]);

  //Spinner
  const [loading, setLoading] = useState<boolean>(false);

  function LoadingSpinner(): JSX.Element | null | undefined {
    if (!loading) return null;
    return <ClipLoader color="#36d7b7" size={50} />;
  }

  const asyncSimulate = (callback: () => void, delay = 5000) => {
    setLoading(true);
    setTimeout(() => {
      callback();
      setLoading(false);
    }, delay);
  };

  const handleHomeClick = () => {
    navigate("/");
  };
  const handleUserProfileClick = () => {
    navigate("/user-profile");
  };
  const handleSearchClick = () => {
    navigate("/search");
  };
  const handleAuthClick = () => {
    navigate("/auth");
  };
  const handleEditProfileClick = () => {
    navigate("/edit-profile");
  };
  const handleNavigateToUserId = (user_id: string) => {
    navigate(`/user/${user_id}`);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        handleHomeClick,
        handleUserProfileClick,
        handleSearchClick,
        handleAuthClick,
        handleEditProfileClick,
        handleNavigateToUserId,
        LoadingSpinner,
        loading,
        setLoading,
        asyncSimulate,
        registerUser,
        loginUser,
        getCurrentAccount,
        editAccount,
        createPost,
        getPost,
        getAllPosts,
        getAllUsers,
        getUserById,
        getPostsByUserId,
        toggleFollowing,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
