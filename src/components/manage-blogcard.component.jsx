import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { getDay } from '../common/date';
import { UserContext } from '../App';
import axios from 'axios';


const BlogStats = ({stats}) => {
    return (
        <div className='flex gap-2 max-lg:mb-6 max-lg:pb-6 border-grey max-lg:border-b'>
            {
                Object.keys(stats).map((info,index)=>{
                    return !info.includes("parent") ? <div key={index} className={'flex flex-col items-center h-full w-full justify-center p-4 px-6 '+(index!=0 ? " border-grey border-l ":"")}>
                    <h1 className='text-xl lg:text-2xl mb-2'>{stats[info].toLocaleString()}</h1>
                    <p className='capitalize max-lg:text-dark-grey'>{info.split('_')[1]}</p>
                    </div> : ""
                })
            }
        </div>
    )
};

export const ManagePublishedCard = ({blog}) => {
    let{userAuth:{access_token}}=useContext(UserContext);
    let{banner,blog_id,title,publishedAt,activity}=blog;

    const [showStat, setShowStat] = useState(false);
  return (
    <>
        <div className='flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center'>

            <img src={banner} alt="" className='xl:block w-28 h-28 flex-none bg-grey object-cover'/>
            {/* max-md:hidden lg:hidden */}

            <div className='flex flex-col justify-between py-2 w-full min-w-[300px] '>
                <div className=''>
                    <Link to={`/blog/${blog_id}`} className='blog-title mb-4 hover:underline'>
                    {title}
                    </Link>

                    <p className='line-clamp-1'>
                        Published on {getDay(publishedAt)}
                    </p>
                </div>

                <div className='flex gap-6 mt-3'>

                    <Link to={`/editor/${blog_id}`} className='pr-4 py-2 underline'>Edit</Link>

                    <button className='lg:hidden pr-4 py-2 underline' onClick={()=>(setShowStat(prev=>!prev))}>Stats</button>

                    <button className='pr-4 py-2 underline text-red' onClick={(e)=>deleteBlog(blog,access_token,e.target)}>Delete</button>

                </div>
            </div>

            <div className='max-lg:hidden'>
                <BlogStats stats={activity}/>
            </div>
        </div>
        {
            showStat ? <div className='lg:hidden'><BlogStats stats={activity}/></div>:""
        }
    </>
  )
}

export const ManageDraftBlog = ({blog}) => {
    let{userAuth:{access_token}}=useContext(UserContext);
    let{blog_id,title,index}=blog;
    index++;
    return (
        <div className='flex gap-5 lg:gap-10 pb-6 border-b mb-6 border-grey'>

            <h1 className='blog-index text-center pl-4 md:pl-6 flex-none'>{index < 10 ? "0" + index :index}</h1>

            <div>
                <h1 className='blog-title mb-3'>{title}</h1>
            </div>
            <div className='flex gap-6 mt-3'>
                <Link to={`/editor/${blog_id}`} className='pr-4 py-2 underline'>Edit</Link>

                <button className='pr-4 py-2 underline text-red' onClick={(e)=>deleteBlog(blog,access_token,e.target)}>Delete</button>
            </div>
        </div>
    )
};


const deleteBlog = (blog,access_token,target) => {
    let {index,blog_id,setStateFun}=blog;

    target.setAttribute("disabled",true);

    axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/delete-blog",{blog_id},{headers:{Authorization:`Bearer ${access_token}`}}).then(({data})=>{
        target.removeAttribute("disabled");

        setStateFun(prevVal=>{
            let{ deletedDocCount, totalDocs, result}=prevVal
            result.splice(index,1);
            if(!deletedDocCount){
                deletedDocCount=0;
            }

            if(!result.length && totalDocs - 1 > 0){
                return null;
            }
            return {...prevVal,totalDocs:totalDocs-1,deleteDocCount:deletedDocCount+1}
        })
    }).catch(err=>{
        console.log(err); 
    })
};