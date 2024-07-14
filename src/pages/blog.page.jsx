import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import BlogPostCard from "../components/blog-post.component";
import BlogContent from "../components/blog-content.component";
import CommentsContainer, { fetchComments } from "../components/comments.component";


export const blogStructure = {
  title: "",
  des:"", 
  content:[],
  banner:"",
  author: { personal_info: {}},
  publishedAt:"",
  blogId:"",
};

export const BlogContext=createContext({});

const BlogPage = () => {
  let { blog_id } = useParams();
  const [blog, setBlog] = useState(blogStructure);
  const [loding, setLoding] = useState(true);
  const [similarBlogs, setSimilarBlogs] = useState(null);
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [commentWrapper, setCommentWrapper] = useState(true);
  const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

  let {
    title,
    des,
    content,
    banner,
    author: {
      personal_info: { fullname, username:authorUsername, profile_img },
    },
    publishedAt,
  } = blog;
  const fetchBlog = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id })
      .then(async({ data: { blog } }) => {
        blog.comments=await fetchComments({blog_id:blog._id,setParentCommentCountFun:setTotalParentCommentsLoaded})

        console.log("BLOG:::",blog)
        setBlog(blog);
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs",{tag:blog.tags[0],limit:6,eliminate_blog:blog_id})
        .then(({data})=>{
          // console.log(data.blogs); 
          setSimilarBlogs(data.blogs)
        })
        setLoding(false);
      })
      .catch((err) => {
        console.log(err);
        setLoding(false);
      });
      console.log(blog_id)
  };
  const resetState = () => {
    setBlog(blogStructure);
    setLoding(true);
    setSimilarBlogs(null);
    setIsLikedByUser(false);
    setCommentWrapper(false);
    setTotalParentCommentsLoaded(0);
  };
  useEffect(() => {
    resetState();
    fetchBlog();

  }, [blog_id]);

  return (
    <AnimationWrapper >
      {
        loding ? <Loader/>:
          <BlogContext.Provider value={{blog,setBlog,blog_id,isLikedByUser,setIsLikedByUser,commentWrapper,setCommentWrapper,totalParentCommentsLoaded,setTotalParentCommentsLoaded}}>
          
          <CommentsContainer/>
          <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
              <img src={banner} alt="banner" className="aspect-video"/>

              <div className="mt-12">
                <h2>{title}</h2>

                <div className="flex max-sm:flex-col justify-between my-8">
                    <div className="flex gap-5 items-start">
                      <img className="w-12 h-12 rounded-full" src={profile_img} alt="ProfileImage" />

                      <p className="capitalize">
                        {fullname}
                        <br/>
                        @
                        <Link className="underline" to={`/user/${authorUsername}`}>
                        {authorUsername}
                        </Link>
                      </p>
                    </div>
                    <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">Published On {getDay(publishedAt)}</p>
                </div>
              </div>

              <BlogInteraction/>

              <div className="my-12 font-gelasio blog-page-content">
                {
                  content[0].blocks.map((block,index)=>{
                    return <div key={index} className="my-4 md:my-8">
                      <BlogContent block={block}/>
                    </div>
                  })
                }
              </div>
              
              <BlogInteraction/>
              {
                similarBlogs != null && similarBlogs.length ? 
                <>
                  <h1 className="text-2xl mt-14 mb-10 font-medium">Similar Blogs</h1>

                  {
                    similarBlogs.map((blog,index)=>{
                      let {author:{personal_info}}=blog
                      return <AnimationWrapper key={index} transition={{duration:1, delay:index*0.08}}>
                        <BlogPostCard content={blog} author={personal_info}/>
                      </AnimationWrapper>
                    })
                  }
                </>:""
              }

          </div>
        </BlogContext.Provider>

      }
    </AnimationWrapper>
  );
};

export default BlogPage;
