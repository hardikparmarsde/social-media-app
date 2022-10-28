import axios from 'axios'; 

const API = axios.create({ baseURL: process.env.SOCIAL_MEDIA_API_URL})

API.interceptors.request.use((req => {

    if(localStorage.getItem('profile')) {        
        req.headers = {
            'authorization' : `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`,
            'content-type': 'multipart/form-data'
        }
    }

    return req;
}))

export const getPosts = () => API.get(`/posts/getPosts`);

export const createPost = (newPost) => API.post(`/posts/createPost`,newPost);

export const updatePost = (postId, post) => API.patch(`/posts/updatePost/${postId}`, post);

export const deletePost = (postId) => API.delete(`/posts/deletePost/${postId}`);

export const likePost = (postId) => API.patch(`/posts//likePost/${postId}`);

export const signIn = (formData) => API.post(`/user/signin`, formData);

export const signUp = (formData) => API.post(`/user/signup`, formData);