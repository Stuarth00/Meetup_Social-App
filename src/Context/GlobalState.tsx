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
  getFollowersList,
  getFollowingList,
  toggleLike,
  getLikesByPostId,
  addComment,
  getPostById,
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
  createPost: (description: string, image_base64: string) => Promise<Post>;
  getPost: () => Promise<Post[]>;
  getAllPosts: () => Promise<Post[]>;
  getAllUsers: () => Promise<User[]>;
  getUserById: (id: string) => Promise<User>;
  getPostsByUserId: (id: string) => Promise<Post[]>;
  toggleFollowing: (id: string) => Promise<ToggleFollowResponse>;
  getFollowersList: (
    id: string,
    type: "followers" | "following",
  ) => Promise<User[]>;
  getFollowingList: (
    id: string,
    type: "followers" | "following",
  ) => Promise<User[]>;
  toggleLike: (post_id: string) => Promise<{
    success: boolean;
    action: "liked" | "unliked";
    is_liked: boolean;
    likesCount: number;
  }>;
  getLikesByPostId: (post_id: string) => Promise<
    {
      user_id: string;
      first_name: string;
      last_name: string;
      avatar?: string;
    }[]
  >;
  addComment: (
    post_id: string,
    text: string,
  ) => Promise<{
    comment: {
      post_id: string;
      text: string;
    };
  }>;
  getPostById: (post_id: string) => Promise<Post>;
}

const initialState: State = {
  users: [],
  currentUser: null,
  posts: [],
};

type ToggleFollowPayload = {
  targetUserId: string;
  followAction?: "followed" | "unfollowed";
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
    case "LOGOUT":
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
  const [state, dispatch] = useReducer(appReducer, initialState);
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
        getFollowersList,
        getFollowingList,
        toggleLike,
        getLikesByPostId,
        addComment,
        getPostById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
