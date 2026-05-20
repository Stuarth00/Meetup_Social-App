import type { Post, NewUser, Token, UserProfile } from "../Types/Interafaces";

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
    
    // console.log("Response Values:", data);
  return data;
}


// Sign up function to register a new user
export const registerUser = async (formData: NewUser) => {
  const response = await fetch('http://localhost:3001/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  if (response.status !== 200) throw new Error('Signup failed');
  const token: Token = await response.json();
  localStorage.setItem('token', token.token);
  return token; // returns the created user
}

// Login function to authenticate a user
export const loginUser = async (email: string, password: string) => {
    const response = await fetch('http://localhost:3001/api/auth/login', {
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
    console.log(token)
    const response = await fetch('http://localhost:3001/api/users/me', {
        method: 'GET', 
        headers: { 'Authorization': `Bearer ${token}`}, 
    });

    return handleResponse(response);
}

export const editAccount = async (updates : Partial<UserProfile>) => {
    const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3001/api/users/edit', {
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
export const createPost = async (description : Post) => { 
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3001/api/posts/create-post', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
        }, 
        body: JSON.stringify(description)
    });
    // if(!response.ok) throw new Error('Post creation failed');
    return handleResponse(response);
}

//Getting posts by user logged in
export const getPost = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3001/api/posts/me-posts', {
    method: 'GET', 
    headers: { 'Authorization': `Bearer ${token}`}, 
  });
  // if(!response.ok) throw new Error('Getting posts failed');
  return handleResponse(response);
}

export const getAllPosts = async () => { 
  const response = await fetch('http://localhost:3001/api/posts/all-posts',{ 
    method: 'GET', 
    headers: { 
      'Content-Type': 'application/json'
    }, 
  });
  // if(!response.ok) throw new Error('Getting posts failed');
  return handleResponse(response);
}

export const getAllUsers = async () => {
  const response = await fetch('http://localhost:3001/api/users/get-all-users', {
    method: 'GET', 
    headers: {
      'Content-Type': 'application/json'
    },
  });
  // if(!response.ok) throw new Error('Getting users failed');
  return handleResponse(response); 
}

export const getUserById = async (id : string) => {
  const response = await fetch(`http://localhost:3001/api/public/users/${id}`, {
    method: 'GET', 
  });
  // if(!response.ok) throw new Error('Getting user by id failed');
  return handleResponse(response); 
}

export const getPostsByUserId = async (user_id: string) => {
  const response = await fetch(
    `http://localhost:3001/api/public/posts/${user_id}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user posts");
  }
  return response.json();
}

//Following system
export const toggleFollowing = async (id: string) : Promise<ToggleFollowResponse> => { 
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3001/api/following/${id}/toggle-follow`, {
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
  const response = await fetch(`http://localhost:3001/api/public/${user_id}/follows?type=${type}`, {
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
  const response = await fetch(`http://localhost:3001/api/public/${user_id}/follows?type=${type}`, {
    method: 'GET', 
    headers: {
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}`
    }, 
  });
  return handleResponse(response);
}