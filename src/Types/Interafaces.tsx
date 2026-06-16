export interface State {
  users: UserProfile[];
  currentUser: UserProfile | null;
  posts: Post[];
}

export type NewUser = Omit<User, "id">;

export interface Token {
  token: string;
}

export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  password: string;
}

export interface UserProfile extends User {
  about_me?: string;
  location?: string;
  interests?: string[];
  avatar?: string;
  gender?: string;
  followers?: string[];
  following?: string[];
}

export interface Post {
  post_id?: string;
  author_id?: string;
  author_first_name?: string;
  author_last_name?: string;
  description?: string;
  media?: Media[];
  likes?: Like[];
  comments?: PostComment[];
  created_at?: string;
  is_liked?: boolean;
}

export interface PostComment {
  comment_id?: string;
  username?: string;
  user_id?: string;
  avatar?: string;
  text?: string;
}

export interface Media {
  media_id?: string;
  content_url: string;
}

export interface Like {
  user_id: string;
  first_name: string;
  last_name: string;
}

//For list of likes
export interface LikeUser {
  user_id: string;
  first_name: string;
  last_name: string;
  avatar?: string;
}
