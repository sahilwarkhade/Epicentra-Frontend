import React, { useContext } from 'react'
import AnimationWrapper from '../common/page-animation'
import toast, { Toaster } from 'react-hot-toast'
import { EditorContext } from '../pages/editor.pages'
import Tag from './tags.component'
import axios from 'axios'
import { UserContext } from '../App'
import { useNavigate, useParams } from 'react-router-dom'

const PublishForm = () => {
  const characterLimit=200;
  const tagLimit=10;

  const {blog_id}=useParams();
  const {blog,blog:{banner,title,tags,des:description,content},setEditorState,setBlog}=useContext(EditorContext);

  const {userAuth:{access_token}}=useContext(UserContext);


  const navigate=useNavigate();

  const handleCloseEvent = () => {
    setEditorState("editor")
  };

  const handleTitleChange = (e) => {
      let input = e.target;

      setBlog({...blog,title:input.value})

  };

  const handleDescriptionChange = (e) => {
    let input = e.target;
    setBlog({...blog,des:input.value})
  };

  const handleKeyDown = (e) => {
    if(e.keyCode==13){
      e.preventDefault();
    }
  };

  const handleTagsKeyDown = (e) => {
    if(e.keyCode==13 || e.keyCode==188){
      e.preventDefault();

      let tag=e.target.value;
      console.log(tag);
      if(tags.length < tagLimit){
        if(!tags.includes(tag) && tag.length){
          setBlog({...blog,tags:[...tags,tag]});
        }else{
          return toast.error("You already enter that tag! Please enter another one");
        }
      } else{
        toast.error(`You can only add max ${tagLimit} tags`)
      }
      e.target.value="";
    }
  };

  const handlePublishBlog = (e) => {
    e.preventDefault();

    if(e.target.className.includes("disable")){
      return;
    }

    if(!title.length){
      return toast.error("Title is required");
    }

    if(!description.length || description.length > 200){
      console.log(e.target.value)
      return toast.error("Description is required within limits");
    }

    if(!tags.length || tags.length > tagLimit){
      return toast.error("Tags is required within limits");
    }

    let loadingToast=toast.loading("Publishing...");

    e.target.classList.add("disable");

    let blogObj={
      title,description,banner,content,tags,draft:false
    }

    axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/create-blog",{...blogObj,id:blog_id},{
      headers:{
        'Authorization':`Bearer ${access_token}`
      }
    }).then(()=>{
      e.target.classList.remove("disable");
      toast.dismiss(loadingToast);
      toast.success("Blog Published..");

      setTimeout(() => {
        navigate("/");
      }, 500);
    })
    .catch(({response})=>{
      e.target.classList.remove("disable");
      toast.dismiss(loadingToast);
      return toast.error(response.data.error)
    })
  };
  return (
    <AnimationWrapper>
      <section className='w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4'>
        <Toaster/>
        <button className='w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]' onClick={handleCloseEvent}>
          <i className='fi fi-br-cross'></i>
        </button>

        <div className='max-w-[550px] center'>
          <p className='text-dark-grey mb-1'>Preview</p>

          <div className='w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4'>
            <img src={banner} />
          </div>

          <h1 className='text-4xl font-medium mt-2 leading-tight line-clamp-2'>{title}</h1>

          <p className='font-gelasio line-clamp-2 text-xl leading-7 mt-4'>{description}</p>
        </div>

        <div className='border-grey lg:border-1 lg:pl-8'>
          <p className='text-dark-grey mb-2 mt-9'>Blog Title</p>
          <input className='input-box pl-4' type="text" placeholder='Blog Title' defaultValue={title} onChange={handleTitleChange}/>


          <p className='text-dark-grey mb-2 mt-9'>Short description about your blog</p>
          <textarea
            onKeyDown={handleKeyDown}
            onChange={handleDescriptionChange}
            className='h-40 resize-none leading-7 input-box pl-4'
            maxLength={characterLimit} 
            defaultValue={description}>

           </textarea>

           <p className='mt-1 text-dark-grey text-sm text-right'>{characterLimit - description.length} Character left</p>

           <p className='mt-9 text-dark-grey mb-2'>Topics- (Helps in searching your blog)</p>


           <div className='relative input-box pl-2 py-2 pb-4'>
            <input 
              type="text" 
              placeholder='Topics' 
              className='sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white'
              onKeyDown={handleTagsKeyDown}
            />
              {
                tags.map((tag,index)=>{
                  return <Tag key={index} tag={tag} tagIndex={index}/>
                })
              }
           </div>

            <p className='mt-1 mb-4 text-dark-grey text-right'>{tagLimit-tags.length} Tags Left</p>
            <button className='btn-dark px-8' onClick={handlePublishBlog}>Publish</button>
        </div>
      </section>
    </AnimationWrapper>
  )
}

export default PublishForm
