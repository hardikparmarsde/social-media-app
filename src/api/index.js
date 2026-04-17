import axios from 'axios'; 


const devURL = process.env.REACT_APP_API_DEV_URL;
const prodURL = process.env.REACT_APP_API_PROD_URL;

const baseURL = process.env.REACT_APP_ENVIRONMENT === 'DEV' ? devURL : prodURL;
const API = axios.create({ baseURL });

API.interceptors.request.use((req => {

    const storageToken = (() => {
        try {
            return JSON.parse(localStorage.getItem('profile') || 'null')?.token || null;
        } catch {
            return null;
        }
    })();

    const token = storageToken;
    if (token) {
        req.headers = {
            ...(req.headers || {}),
            authorization: `Bearer ${token}`,
        };
    }

    return req;
}))

export const getPosts = (params) => API.get(`/posts/getPosts`, { params });

export const createPost = (newPost) =>
  API.post(`/posts/createPost`, newPost, {
    headers: newPost instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  });

export const updatePost = (postId, post) =>
  API.patch(`/posts/updatePost/${postId}`, post, {
    headers: post instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  });

export const deletePost = (postId) => API.delete(`/posts/deletePost/${postId}`);

export const likePost = (postId) => API.patch(`/posts/likePost/${postId}`);

// New functionality (backend)
export const getTrendingPosts = (params) => API.get(`/posts/trending`, { params });
export const searchPosts = (params) => API.get(`/posts/search`, { params });
export const addComment = (postId, payload) => API.post(`/posts/${postId}/comments`, payload);
export const deleteComment = (postId, commentId) => API.delete(`/posts/${postId}/comments/${commentId}`);

export const signIn = (formData) => API.post(`/user/signin`, formData);

export const signUp = (formData) => API.post(`/user/signup`, formData);