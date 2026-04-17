import axios from 'axios'; 


const devURL = process.env.REACT_APP_API_DEV_URL;
const prodURL = process.env.REACT_APP_API_PROD_URL;

// In CRA, env vars are baked at build time. To avoid "DEV vs PROD" misconfig,
// default to localhost only when the app is actually running on localhost.
const runtimeHost = typeof window !== 'undefined' ? window.location.hostname : '';
const isLocalRuntime = runtimeHost === 'localhost' || runtimeHost === '127.0.0.1';

// Optional build-time override (only REACT_APP_* is available in the browser bundle).
const envOverride = String(process.env.REACT_APP_ENVIRONMENT || '').toUpperCase();

const baseURL =
    envOverride === 'DEV'
        ? devURL
        : envOverride === 'PROD'
            ? prodURL
            : (isLocalRuntime ? devURL : prodURL);
const API = axios.create({ baseURL });

export const API_BASE_URL = baseURL;

export function resolveAssetUrl(input) {
    const raw = String(input || '').trim();
    if (!raw) return '';

    // Already absolute URL.
    if (/^https?:\/\//i.test(raw)) {
        // If old posts saved localhost URLs, rewrite them in production runtime.
        if (!isLocalRuntime && prodURL && raw.includes('://localhost:5000/')) {
            return raw.replace(/^https?:\/\/localhost:5000/i, prodURL.replace(/\/$/, ''));
        }
        return raw;
    }

    // Relative asset path like "/public/xxx.jpg"
    if (raw.startsWith('/')) {
        const origin = (API_BASE_URL || '').replace(/\/$/, '');
        return origin ? `${origin}${raw}` : raw;
    }

    return raw;
}

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