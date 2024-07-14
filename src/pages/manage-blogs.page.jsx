import React, { useContext, useEffect, useState } from 'react'
import axios from "axios";
import { UserContext } from '../App';
import { filterPaginetionData } from '../common/filter-pagination-data';
import { Toaster } from 'react-hot-toast';
import InPageNavigation from '../components/inpage-navigation.component';
import Loader from '../components/loader.component';
import NoDataMessage from '../components/nodata.component';
import AnimationWrapper from '../common/page-animation';
import {ManagePublishedCard, ManageDraftBlog } from '../components/manage-blogcard.component';
import LoadMoreDataBtn from '../components/load-more.component';

const ManageBlogs = () => {

    const{userAuth:{access_token}}=useContext(UserContext)

    const [blogs, setBlogs] = useState(null);
    const [draft, setDraft] = useState(null);
    const [query, setQuery] = useState("");

    const getBlogs=({page,draftVal,deletedDocCount=0})=>{
        axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/user-written-blogs",{page,draft:draftVal,query,deletedDocCount},{headers:{
            Authorization:`Bearer ${access_token}`
        }}).then(async({data})=>{

            let formatedData=await filterPaginetionData({
                state: draftVal ? draft : blogs,
                data:data.blogs,
                page,
                user:access_token,
                countRoute:"/user-written-blogs-count",
                data_to_send:{draft:draftVal,query}
            });

            console.log(formatedData);
            if(draftVal){
                setDraft(formatedData);
            }
            else{
                setBlogs(formatedData);
            }


        }).catch(err=>{
            console.log(err);
        })
    }

    const handleChange = (e) => {
        if(!e.target.value.length){
            setQuery("");
            setBlogs(null);
            setDraft(null);
        }
    };

    const handleSearch=(e)=>{
        let searchQuery=e.target.value;
        setQuery(searchQuery);

        if(e.keyCode==13 && searchQuery.length){
            setBlogs(null);
            setDraft(null);
        }
    }
    useEffect(() => {
        if(access_token){
            if(blogs==null)
                getBlogs({page:1,draftVal:false});
            if(draft==null)
                getBlogs({page:1,draftVal:true});
        }
    }, [access_token,blogs,draft,query]);
  return (
    <>
        <h1 className='max-md:hidden '>Manage Blogs</h1>
        <Toaster/>

        <div className='relative max-md:mt-5 md:mt-8 mb-10'>
            <input type="search" placeholder='Search Blogs' className='w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey' onChange={handleChange} onKeyDown={handleSearch}/>

            <i className='fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey'></i>
        </div>

        <InPageNavigation routes={["Published Blogs","Drafts"]}>
            {
                blogs===null ? <Loader/> :
                blogs.result.length ? 
                <>
                {
                    blogs.result.map((blog,index)=>{
                        return <AnimationWrapper key={index} transition={{delay:index*0.08}}>
                            <ManagePublishedCard blog={{...blog,index:index,setStateFun:setBlogs}}/>
                        </AnimationWrapper>
                    })
                }

                <LoadMoreDataBtn state={blogs} fetchDataFunction={getBlogs} additionalParams={{draftVal:false,deletedDocCount:blogs.deletedDocCount}}/>
                </>:
                <NoDataMessage message={"No Published Blogs"}/>
            }
            {
                draft===null ? <Loader/> :
                draft.result.length ? 
                <>
                {
                    draft.result.map((blog,index)=>{
                        return <AnimationWrapper key={index} transition={{delay:index*0.08}}>
                            <ManageDraftBlog blog={{...blog,index:index,setStateFun:setDraft}}/>
                        </AnimationWrapper>
                    })
                }

                <LoadMoreDataBtn state={draft} fetchDataFunction={getBlogs} additionalParams={{draftVal:true,deletedDocCount:draft.deletedDocCount}}/>
                </>:
                <NoDataMessage message={"No Draft Blogs"}/>
            }
        </InPageNavigation>

    </>
  )
}

export default ManageBlogs
