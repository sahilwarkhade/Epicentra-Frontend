import React from 'react'
import { Link } from 'react-router-dom';
import { getDay } from '../common/date';

const NotificationCard = ({data,index,notificationState}) => {

    let {seen,type,comment,blog:{blog_id,title},user:{personal_info:{profile_img,fullname,username}},createdAt}=data;
  return (
    <div className={'p-6 border-b border-grey border-l-black '+( !seen ? 'border-l-2' :"")}>

        <div className='flex gap-5 mb-3'>
            <img src={profile_img} className='w-14 h-14 flex-none rounded-full' />
            <div className='w-full'>
                <h1 className='font-medium text-xl text-dark-grey'>
                    <span className='lg:inline-block hidden capitalize'>{fullname}</span>
                    <Link className='mx-1 text-black underline' to={`/user/${username}`}>@{username}</Link>
                    <span className='font-normal'>
                        {
                            type=="like" ? "Likend Your Blog" : "Commented On Your Blog"
                        }
                    </span>
                </h1>
                {
                    type=="reply" ? "" :
                    <Link className='font-medium text-dark-grey hover:underline line-clamp-2' to={`/blog/${blog_id}`}>{`"${title}"`}</Link>
                }
            </div>
        </div>

        {
            type!="like" ? <p className='ml-14 pl-5 font-gelasio text-xl my-5'>{comment.comment}</p> :""
        }

        <div className='ml-14 pl-5 mt-3 text-dark-grey flex gap-8'>
            <p className=''>{getDay(createdAt)}</p>
        </div>
      
    </div>
  )
}

export default NotificationCard
