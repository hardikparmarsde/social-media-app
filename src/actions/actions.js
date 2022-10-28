import * as API  from '../api/index';

export const fetchPosts = () => async (dispatch) => {
    const { data } = await API.getPosts();
    dispatch({type: 'posts/fetchingPosts', payload: data});
}
  
export const createPost = (newPost) => async (dispatch) => {
    const {data}  = await API.createPost(newPost);
    dispatch({ type: 'posts/postCreated', payload: data });    
}

export const updatePost = (currentId, post) => async (dispatch) => {
    const { data } = await API.updatePost(currentId, post);
    dispatch({ type: 'posts/postUpdated', payload: data });
}

export const deletePost = (postId) => async (dispatch) => {
    await API.deletePost(postId);
    dispatch({ type: 'posts/postDeleted', payload: postId });    
}

export const likePost = (postId) => async (dispatch) => {
    const { data } = await API.likePost(postId);
    dispatch({ type: 'posts/postLiked', payload: data });
}

export const signIn = (formData, navigateTo) => async (dispatch) => {
    try {
        const {data} = await API.signIn(formData);
        dispatch({ type: 'auth/userLoggedIn', payload:data });
        navigateTo('/post');    
    } catch (error) {
        console.log(error);
    }
}
 
export const signUp = (formData, navigateTo) => async (dispatch) => {
    try {
        const { data } = await API.signUp(formData);
        dispatch({ type: 'auth/userSignedUp', payload: data})
        navigateTo('/post');
    
    } catch (error) {
        console.log(error);
    }
}

export const logout = () => async (dispatch) => {
    try {
        dispatch({type: 'auth/userLoggedOut'});
    } catch (error) {
        console.log(error)
    }
}
