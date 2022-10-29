import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { createPost, updatePost } from "../../../actions/actions";
import { useSelector } from "react-redux";

const UploadPost = ({ currentId, setCurrentId, user}) => {
    const dispatch = useDispatch();
    const navigateTo = useNavigate();
        
    const post = useSelector((state) => currentId ? state.posts.posts.find((p) => p._id === currentId) : null);        
    
    const[tags, setTags] = useState([]);
    const [postData, setPostData] = useState({
        tags: [], 
        message: "",
        selectedFile: "",
        name: ""
    });
    useEffect(() => {
        if(currentId)
            setPostData(post);
    },[]);

    const handleOnSubmit =  async (e) => {
        e.preventDefault();

        console.log(postData);

        setPostData({ ...postData, tags: tags});

        if(currentId) 
            dispatch(updatePost(currentId, { ...postData, name: user?.result?.name })); 
        else 
            dispatch(createPost({ ...postData, name:  user?.result?.name}));  

        clear();
        navigateTo('/feed');
    }

    const clear = () => {
        setPostData({ selectedFile:'', message:'', tags:[] });
    }

    const handleBack = (e) => {
        e.preventDefault();
        navigateTo(-1);
    }    

    const handleTags = (e) => { 
        setTags(e.target.value);
    }
    
    return (
        <div className="w-full sm:w-96 sm:mx-auto md:w-1/3">
            <form className="p-5 shadow-lg space-y-2" enctype="multipart/form-data" onSubmit={handleOnSubmit}>
                <div>
                <div className="flex justify-center">
                    <svg className="fill-red-400" xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 16 16">
                        <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2z"/>
                    </svg>
                </div>
                    <div className="flex justify-center">
                        <h1 className="text-gray-700 font-medium">{post ? 'Edit': 'Upload'} a Post</h1>
                    </div>
                </div>
                <div className="space-y-1">
                    <textarea className="w-full focus:ring-1 focus:outline-none focus:ring-red-400 rounded border border-gray-300 p-2  text-gray-800" maxLength={100} name="message" type="text" value={postData.message} onChange={(e) => setPostData({ ...postData, message: e.target.value})} placeholder="Write something about a post here..." />
                </div>
                {/* <div className="space-y-1">
                    <input className="w-full focus:ring-1 focus:outline-none focus:ring-red-400 rounded border border-gray-300 p-2 text-gray-800" name="tags" type="text" value={postData.tags} onChange={handleTags} placeholder="Tags e.g. travel, foodie, cricket" />
                </div> */}
                <div className="w-full">
                    <input 
                    className=""
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    name="selectedFile"  
                    onChange={(e) => setPostData({ ...postData, selectedFile: e.target.files[0] })} required={currentId == null}
                    />                    
                </div>
                <div className="flex w-full">
                    <button type="submit" className="w-1/2 pr-2 bg-red-400 text-white rounded-l">Submit</button>
                    <button type="reset" className="w-1/2 p-3 bg-gray-300 rounded-r" onClick={clear}>Clear</button>
                </div>
                <div className="">
                    <button className="p-2  justify-center font-medium  w-full rounded flex items-center" onClick={handleBack}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-backspace-fill" viewBox="0 0 16 16">
                          <path d="M15.683 3a2 2 0 0 0-2-2h-7.08a2 2 0 0 0-1.519.698L.241 7.35a1 1 0 0 0 0 1.302l4.843 5.65A2 2 0 0 0 6.603 15h7.08a2 2 0 0 0 2-2V3zM5.829 5.854a.5.5 0 1 1 .707-.708l2.147 2.147 2.146-2.147a.5.5 0 1 1 .707.708L9.39 8l2.146 2.146a.5.5 0 0 1-.707.708L8.683 8.707l-2.147 2.147a.5.5 0 0 1-.707-.708L7.976 8 5.829 5.854z"/>
                        </svg>            
                        	&nbsp;       
                        Go to Feed
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UploadPost;