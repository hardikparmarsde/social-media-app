import { createAsyncThunk } from '@reduxjs/toolkit';
import * as API from '../api/index';

// Post Thunks
export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async (params, { rejectWithValue }) => {
        try {
            const { data } = await API.getPosts(params);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts');
        }
    }
);

export const createPost = createAsyncThunk(
    'posts/createPost',
    async (newPost, { rejectWithValue }) => {
        try {
            const { data } = await API.createPost(newPost);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create post');
        }
    }
);

export const updatePost = createAsyncThunk(
    'posts/updatePost',
    async ({ postId, post }, { rejectWithValue }) => {
        try {
            const { data } = await API.updatePost(postId, post);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update post');
        }
    }
);

export const deletePost = createAsyncThunk(
    'posts/deletePost',
    async (postId, { rejectWithValue }) => {
        try {
            await API.deletePost(postId);
            return postId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete post');
        }
    }
);

export const likePost = createAsyncThunk(
    'posts/likePost',
    async (postId, { rejectWithValue }) => {
        try {
            const { data } = await API.likePost(postId);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to like post');
        }
    }
);

export const fetchTrendingPosts = createAsyncThunk(
    'posts/fetchTrendingPosts',
    async (params, { rejectWithValue }) => {
        try {
            const { data } = await API.getTrendingPosts(params);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch trending posts');
        }
    }
);

export const searchPosts = createAsyncThunk(
    'posts/searchPosts',
    async (params, { rejectWithValue }) => {
        try {
            const { data } = await API.searchPosts(params);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to search posts');
        }
    }
);

export const addComment = createAsyncThunk(
    'posts/addComment',
    async ({ postId, text, name, parentId = null }, { rejectWithValue }) => {
        try {
            const { data } = await API.addComment(postId, { text, name, parentId });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
        }
    }
);

export const deleteComment = createAsyncThunk(
    'posts/deleteComment',
    async ({ postId, commentId }, { rejectWithValue }) => {
        try {
            const { data } = await API.deleteComment(postId, commentId);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
        }
    }
);

// Auth Thunks
export const signIn = createAsyncThunk(
    'auth/signIn',
    async ({ formData }, { rejectWithValue }) => {
        try {
            const { data } = await API.signIn(formData);
            localStorage.setItem('profile', JSON.stringify(data));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to sign in');
        }
    }
);

export const signUp = createAsyncThunk(
    'auth/signUp',
    async ({ formData }, { rejectWithValue }) => {
        try {
            const { data } = await API.signUp(formData);
            localStorage.setItem('profile', JSON.stringify(data));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to sign up');
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            localStorage.removeItem('profile');
            return null;
        } catch (error) {
            return rejectWithValue('Failed to logout');
        }
    }
);
