export interface User {
  id: string;
  userName: string;
  email: string;
  avatar?: string;
  genre: string;
  DateOfBirth: Date;
  password: string;
}

export interface Post {
  id: number;
  authorId: string;
  content: {
    type: string;
    url: string;
  };
  likes: string[];
  comments: string[];
}
