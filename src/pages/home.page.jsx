import React, { useEffect, useState } from 'react'
import AnimationWrapper from '../common/page-animation'
import InPageNavigation, { activeTabLineRef, activeTabRef } from '../components/inpage-navigation.component'
import Loader from "../components/loader.component"
import axios from 'axios';
import BlogPostCard from '../components/blog-post.component';
import MinimalBlogPost from '../components/nobanner-blog-post.component';
import NoDataMessage from '../components/nodata.component';
import { filterPaginetionData } from '../common/filter-pagination-data';
import LoadMoreDataBtn from '../components/load-more.component';

const HomePage = () => {
    const [blogs, setBlogs] = useState(null);
    const [trendingBlogs, setTrendingBlogs] = useState(null);

    const [pageState, setPageState] = useState("home");

    let categories=["programming","hollywood","film making","social media","tech","cooking","finance","travel"];

    const fetchLatestBlogs = ({page=1}) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/latest-blogs",{page})
        .then(async({data})=>{
            // setBlogs(data.blogs);
            let formData=await filterPaginetionData({
                state:blogs,
                data:data.blogs,
                page,
                countRoute: "/all-latest-blogs-count"
            })
            
            console.log(formData)
            setBlogs(formData);
        })
        .catch(err=>{
            console.log(err);
        })
    };
    const fetchTrendingBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN+"/trending-blogs")
        .then(({data})=>{
            // console.log(data.blogs)
            setTrendingBlogs(data.blogs);
        })
        .catch(err=>{
            console.log(err);
        })
    };

    const fetchBlogByCategory = ({page=1}) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/search-blogs",{tag:pageState,page})
        .then(async({data})=>{
            let formData=await filterPaginetionData({
                state:blogs,
                data:data.blogs,
                page,
                countRoute: "/search-blogs-count",
                data_to_send:{tag:pageState}
            })
            
            console.log(formData)
            setBlogs(formData);
        })
        .catch(err=>{
            console.log(err);
        })
    };
    
    const loadBlogByCategory = (e) => {
        
        let category=e.target.innerText.toLowerCase();
        
        setBlogs(null);

        if(pageState==category){
            setPageState("home");
            // fetchLatestBlogs();
            return;
        }
        else{
            setPageState(category);
        }


    };
    
    useEffect(() => {
        activeTabRef.current.click();
        if(pageState=='home'){
            fetchLatestBlogs({page:1});
        }
        else{
            fetchBlogByCategory({page:1});
        }

        if(!trendingBlogs)
            fetchTrendingBlogs();
    }, [pageState]);
  return (
    <div>
        <AnimationWrapper>
            <section className='h-cover flex justify-center gap-10 '>
                <div className='w-full'>

                    <InPageNavigation routes={[pageState,"trending blogs"]} defaultHidden={["trending blogs"]}>
                        <>
                        {
                            blogs==null ?( <Loader/>) 
                            : 
                            blogs.result.length ? 
                            blogs.result.map((blog,i)=>{
                                return (
                                    <AnimationWrapper transition={{duration:1 ,delay:i*.1}} key={i}>
                                        <BlogPostCard content={blog} author={blog.author.personal_info}/>
                                    </AnimationWrapper>
                                )
                            }) : <NoDataMessage message={"No Blogs Published"}/>
                        }
                        <LoadMoreDataBtn state={blogs} fetchDataFunction={(pageState=="home" ? fetchLatestBlogs : fetchBlogByCategory)}/>
                        </>
                        {
                            trendingBlogs==null ? <Loader/> 
                            : 
                            trendingBlogs.length ? 
                            trendingBlogs.map((blog,i)=>{
                                return (
                                    <AnimationWrapper transition={{duration:1 ,delay:i*.1}} key={i}>
                                        <MinimalBlogPost blog={blog} index={i}/>
                                    </AnimationWrapper>
                                )
                            })
                            : <NoDataMessage message={"No Trending Blogs"}/>
                        }
                    </InPageNavigation>
                    
                </div>
                <div className='min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden'>
                    <div className='flex flex-col gap-10'>
                        <div>
                            <h1 className='font-medium text-xl mb-8'>Stories form all interest</h1> 

                            <div className='flex flex-wrap gap-3'>
                                {
                                    categories.map((category,i)=>{
                                        return <button onClick={loadBlogByCategory} className={'tag '+(pageState==category ?"bg-black text-white" :"")} key={i}>
                                            {category}
                                        </button>
                                    })
                                }
                            </div>
                        </div>
                    
                    
                    <div>
                        <h1 className='font-medium text-xl mb-8'>Trending<i className='fi fi-rr-arrow-trend-up'></i></h1>
                        {
                            trendingBlogs==null ? <Loader/> 
                            : 
                            trendingBlogs.length ?
                            trendingBlogs.map((blog,i)=>{
                                return (
                                    <AnimationWrapper transition={{duration:1 ,delay:i*.1}} key={i}>
                                        <MinimalBlogPost blog={blog} index={i}/>
                                    </AnimationWrapper>
                                )
                            })
                            :
                            <NoDataMessage message={"No Trending Blogs"}/>
                        }
                    </div>
                    </div>
                </div>
            </section>
        </AnimationWrapper>
    </div>
  )
}

export default HomePage
