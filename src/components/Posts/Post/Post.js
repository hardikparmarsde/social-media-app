import React, { useState } from "react";
import moment from 'moment';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deletePost, likePost } from "../../../actions/actions";

const Post = ({post, setCurrentId}) => {

    const user = JSON.parse(localStorage.getItem('profile'));    
    const[drawer, setDrawer] = useState(false);
    const navigateTo = useNavigate();
    const dispatch = useDispatch();

    const handleUpdate = () => {
        setCurrentId(post._id);
        navigateTo('/post');
    }

    const handleDelete = () => {
         dispatch(deletePost(post._id));   
    }

    const handleLikes = () => {
      dispatch(likePost(post._id));
    }

    return (
        <div className="w-full">
          <div className="xs:border-t-2 md:border-0 xs:border-gray-300 bg-white rounded-xl shadow-lg transform transition duration-500  hover:shadow-2xl">
            <div className="flex justify-between">
                <div className="mx-2">
                  <div className="flex items-center space-x-2 mt-1">
                      {/* <img className="w-10 h-10 rounded-full" src={ProfileImage} alt="user-profile-image" /> */}
                      <h2 className="text-gray-800 font-bold cursor-pointer">{post.name}</h2>
                  </div>
                  <h2 className="my-1 text-gray-700 hover:underline cursor-pointer">{moment(post.createdAt).fromNow()}</h2>
                </div>
                <div className="m-2">
                  {
                    user?.result?._id === post?.creator && 
                    <button onClick={() => setDrawer(!drawer)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        </svg>                    
                    </button>
                  }
                  {
                      drawer && <div className="absolute shadow-sm right-0 bg-white flex flex-col items-start">
                        <button className="p-2" onClick={handleUpdate}>
                            Edit
                        </button>                
                        <button className="p-2" onClick={handleDelete}>
                            Delete
                        </button>
                      </div>
                  }
                </div>
            </div>
            <div>
                {
                    post.selectedFile ? 
                      <img className='w-full cursor-pointer' onClick={() => setDrawer(false) } src={post.selectedFile} alt="post-image"/>
                    :
                    ''
                }
            </div>
            <div className="px-2 w-full break-words">
                  <p className="">
                    {
                          post.message    
                    }
                  </p>
                  {
                    post.tags.map(item => {
                      return <span>{item}</span>
                    })
                  }
                </div>
            <div className="flex px-2 py-2 justify-between">
                <div className="flex items-center space-x-2">
                  <button className="cursor-pointer" onClick={ handleLikes}>
                  {
                    post.likes.findIndex((id) => id === String(user.result._id)) !== -1  ?       
                      <svg className="fill-red-600 " xmlns="http://www.w3.org/2000/svg"  fill="currentColor" width="20" height="20"  viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                      </svg>                    
                      :           
                      <svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" width="20" height="20"   viewBox="0 0 16 16">
                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                      </svg>                  
                  }
                  </button>
                  <span>{post.likes.length}</span>
                </div>
                <div>

                </div>
            </div>
          </div>
        </div>
    )
}

export default Post;