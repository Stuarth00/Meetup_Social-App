import type { Post, NewUser, Token, UserProfile } from "../Types/Interafaces";


// Sign up function to register a new user
export const registerUser = async (formData: NewUser) => {
  const response = await fetch('http://localhost:3001/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  if (response.status !== 200) throw new Error('Signup failed');
  const token: Token = await response.json();
  localStorage.setItem('token', 'token');
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
    const { token } = await response.json();
    localStorage.setItem('token', token);
    return token; 
}

// Getting current account 
export const getCurrentAccount = async () => {
    const token = localStorage.getItem('token');
    console.log(token)
    const response = await fetch('http://localhost:3001/api/users/me', {
        method: 'GET', 
        headers: { 'Authorization': `Bearer ${token}`}, 
    })
    if(response.status !== 200) throw new Error('Invalid token');
    return response.json();
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
  if(!response.ok) throw new Error('Edit failed');
  return response.json(); 
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
    if(!response.ok) throw new Error('Post creation failed');
    return response.json();
}

//Getting posts by user logged in
export const getPost = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3001/api/posts/me-posts', {
    method: 'GET', 
    headers: { 'Authorization': `Bearer ${token}`}, 
  });
  if(!response.ok) throw new Error('Getting posts failed');
  return response.json();
}