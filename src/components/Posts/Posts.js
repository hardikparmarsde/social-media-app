import React from "react";
import Post from "./Post/Post";

const Posts = ({setCurrentId, posts}) => {
    const list = Array.isArray(posts) ? posts : (posts?.data && Array.isArray(posts.data) ? posts.data : []);
    
    return (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                {list.map((post) => (
                    <div key={post._id} className="mb-4 break-inside-avoid">
                        <Post post={post} setCurrentId={setCurrentId} />
                    </div>
                ))}
            </div>
    )
}

export default Posts;