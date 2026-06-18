const API_URL = import.meta.env.VITE_API_URL;
import type { NewUser, Token, UserProfile } from "../Types/Interafaces";

export interface ToggleFollowResponse {
  action: 'followed' | 'unfollowed';
  result: { follower_id: string; following_id: string }[];
}

const handleResponse = async (response: Response) => {
if(response.status === 401) {
   localStorage.removeItem("token");
   throw new Error("UNAUTHORIZED");
}
  if(!response.ok) throw new Error('Request failed');
  const data = await response.json();
    
  return data;
}


// Sign up function to register a new user
export const registerUser = async (formData: NewUser) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  if(response.status === 409) {
  throw new Error('Email already in use');
}
  if(!response.ok) throw new Error('Signup failed');
  
  const { token } = await response.json();
  localStorage.setItem('token', token); 
  return token;
}

// Login function to authenticate a user
export const loginUser = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json'}, 
        body: JSON.stringify({ email, password })
    })
    if (response.status !== 200) throw new Error('Login failed');
    const token : Token  = await response.json();
    localStorage.setItem('token', token.token);
    return token; 
}

// Getting current account 
export const getCurrentAccount = async () => {
    const token  = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/me`, {
        method: 'GET', 
        headers: { 'Authorization': `Bearer ${token}`}, 
    });

    return handleResponse(response);
}

export const editAccount = async (updates : Partial<UserProfile>) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/users/edit`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });
  // if(!response.ok) throw new Error('Edit failed');
  return handleResponse(response); 
}

//Creating Posts
export const createPost = async (
  description: string,
  media: string[]
) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_URL}/posts/create-post`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        description,
        media,
      }),
    }
  );
  return handleResponse(response);
};

//Editing a post
export const editPost = async (post_id: string, description: string, media: string[]) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/posts/${post_id}/edit-post`, {
    method: "PUT", 
    headers: {
      "Content-Type": "application/json", 
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      post_id,
      description, 
      media,
    }), 
  });
  return handleResponse(response);
}

//Getting posts by user logged in
export const getPost = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/posts/me-posts`, {
    method: 'GET', 
    headers: { 'Authorization': `Bearer ${token}`}, 
  });
  return handleResponse(response);
}

export const getAllPosts = async () => { 
  const response = await fetch(`${API_URL}/public/all-posts`,{ 
    method: 'GET', 
    headers: { 
      'Content-Type': 'application/json'
    }, 
  });
  return handleResponse(response);
}

export const getAllUsers = async () => {
  const response = await fetch(`${API_URL}/public/get-all-users`, {
    method: 'GET', 
    headers: {
      'Content-Type': 'application/json'
    },
  });
  // if(!response.ok) throw new Error('Getting users failed');
  return handleResponse(response); 
}

export const getUserById = async (id : string) => {
  const response = await fetch(`${API_URL}/public/users/${id}`, {
    method: 'GET', 
  });
  return handleResponse(response); 
}

export const getPostsByUserId = async (user_id: string) => {
  const response = await fetch(
    `${API_URL}/public/users/${user_id}/posts`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user posts");
  }
    return handleResponse(response); 
}

//Following system
export const toggleFollowing = async (id: string) : Promise<ToggleFollowResponse> => { 
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/following/${id}/toggle-follow`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
        }, 
    });
    return handleResponse(response); 
}

export const getFollowersList = async (user_id: string, type: "followers" | "following") => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/public/${user_id}/follows?type=${type}`, {
    method: 'GET', 
    headers: {
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}`
    }, 
  });
  return handleResponse(response); 
}

export const getFollowingList = async (user_id : string, type: "followers" | "following") => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/public/${user_id}/follows?type=${type}`, {
    method: 'GET', 
    headers: {
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}`
    }, 
  });
  return handleResponse(response);
}

export const toggleLike = async (post_id: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/like/${post_id}/toggle-like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  return handleResponse(response);
}

export const getLikesByPostId = async (post_id: string) => {
  // const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/public/${post_id}/likes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`
    },
  });
  return handleResponse(response);
}

export const addComment = async (post_id: string, comment: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/comments/${post_id}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ comment })
  });
  return handleResponse(response);
}

//Get one post by post id
export const getPostById = async (post_id: string) => {
  const response = await fetch(`${API_URL}/public/posts/${post_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
}

//Deletion of post
export const deletePost = async (post_id: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/posts/delete/${post_id}/post`, {
    method: 'DELETE', 
    headers: {
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}`
    }, 
  });
  return handleResponse(response);
}

//Deletion of users
export const deleteUser = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/users/delete/me`, {
    method: 'DELETE', 
    headers: {
      'Content-Type' : 'application/json', 
      'Authorization': `Bearer ${token}`
    },
  });
  return handleResponse(response);
  }
