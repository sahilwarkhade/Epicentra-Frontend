import React, { useContext, useState } from 'react'
import { UserContext } from '../App';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { BlogContext } from '../pages/blog.page';

const CommentField = ({action}) => {
    let{blog,blog:{_id,author:{_id:blog_author},comments,
    comments:{results:commentArr},activity,activity:{total_comments}},setBlog,setTotalParentCommentsLoaded}=useContext(BlogContext)

    const [comment, setComment] = useState("");

    const{userAuth:{access_token,username,profile_img,fullname}}=useContext(UserContext)
    const handleCommentFun = () => {
        if(!access_token){
            return toast.error("Login first to leave a comment")
        }
        if(!comment.length){
            return toast.error("Write something to leave a comment")
        }

        axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/add-comment",{_id,blog_author,comment},{headers:{Authorization:`Bearer ${access_token}`}}).then(({data})=>{
            setComment("");
            data.commented_by={personal_info:{username,profile_img,fullname}}

            let newCommentArray;

            data.childrenLevel=0;

            newCommentArray=[data,...commentArr];

            let parentCommentIncremental=1;

            setBlog({...blog,comments:{...comments,results:newCommentArray},
            activity:{...activity,total_comments:total_comments+parentCommentIncremental}})

            setTotalParentCommentsLoaded(prev=>prev+parentCommentIncremental)
        })
        .catch(err=>{
            console.log(err)
        })
    };
  return (
    <>
        <Toaster/>
      <textarea className='input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto' onChange={(e)=>setComment(e.target.value)} value={comment} placeholder='Leave a comment...'>
      </textarea>

      <button onClick={handleCommentFun} className='btn-dark mt-5 px-10'>{action}</button>
    </>
  )
}

export default CommentField
