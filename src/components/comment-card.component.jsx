import React, { useState } from 'react'
import { getDay } from '../common/date';
import { useContext } from 'react';
import { UserContext } from '../App';
import axios from 'axios';

const CommentCard = ({commentData,index,leftVal,setReload}) => {

    let { commented_by:{personal_info:{profile_img,fullname,username:commented_by_username}},commentedAt,comment,_id}=commentData;

    let {userAuth:{access_token, username}}=useContext(UserContext);

    const deleteComment = (e) => {
        e.target.setAttribute("disable",true);

        axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/delete-comment",{_id},{
            headers:{
                Authorization:`Bearer ${access_token}`
            }
        }).then(()=>{
            e.target.removeAttribute("disable");
            

        }).catch(err=>{
            console.log(err);
        })
        // setReload(prev=>!prev);
    };
  return (
    <div className='w-full' style={{paddingLeft:`${leftVal*10}px`}}>
      <div className='my-5 p-6 rounded-md border-grey'>
        <div className='flex gap-3 items-center mb-8'>
            <img src={profile_img} alt="" className='w-6 h-6 rounded-full'/>

            <p className='line-clamp-1'>{fullname} @{commented_by_username}</p>

            <p className='min-w-fit'>{getDay(commentedAt)}</p>

        </div>
        <p className='font-gelasio tetx-xl ml-3'>{comment}</p>

        <div>
            {
                username == commented_by_username ?<button onClick={deleteComment} className='p-2 px-3 rounded-md border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center'> <i className='fi fi-rr-trash pointer-events-none'></i></button>
                : ""
            }
        </div>

      </div>
    </div>
  )
}

export default CommentCard
