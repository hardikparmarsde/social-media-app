import React, { useEffect } from "react";
import Post from "./Post/Post";

const Posts = ({setCurrentId, posts}) => {
    
    return (
            <div className="grid grid-flow-row">
                <div className="grid md:grid-cols-3 gap-3">
                        {
                           posts && posts.map(
                                post => {
                                    return <Post post={post} setCurrentId={setCurrentId} key={post._id}/>
                                }
                            )
                        }
                </div>    
            </div>
    )
}

export default Posts;