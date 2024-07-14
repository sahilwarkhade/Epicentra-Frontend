import React, { useContext, useRef,useEffect} from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import logo from "../imgs/logo.png"
import AnimationWrapper from '../common/page-animation'
import defaultBanner from "../imgs/blog banner.png"
import { uploadImage } from '../common/aws'
import { Toaster,toast } from 'react-hot-toast'
import { EditorContext } from '../pages/editor.pages'
import EditorJS from "@editorjs/editorjs"
import { tools } from './tools.component'
import axios from 'axios'
import { UserContext } from '../App'
const BlogEditor = () => {

    const {userAuth:{access_token}}=useContext(UserContext);
    
    const {blog,blog :{title,banner,content,tags,description,author},setBlog,textEditor,setTextEditor,setEditorState,editorState}=useContext(EditorContext);

    const {blog_id}=useParams();
    const navigate=useNavigate();


    // let blogBannerRef=useRef();
    // useEffect
    useEffect(() => {
        if(!textEditor.isReady){
            setTextEditor(new EditorJS({
                holderId:"textEditor1",
                data:Array.isArray(content) ? content[0] : content,
                tools:tools,
                placeholder:"Let's Write An Awesome story"
            }))
        }
    }, []);


    const handleBannerUpload=async(e)=>{

        let img=e.target.files[0];
        const formData = new FormData();
        formData.append("image", img);


        if(img){
            const loadingToast=toast.loading("Uploading...")
            const imageURL=await uploadImage(formData);

            if(imageURL){
                toast.dismiss(loadingToast);
                // blogBannerRef.current.src=imageURL;
                toast.success("Uploaded")

                setBlog({...blog,banner:imageURL});
            }else{
                toast.dismiss(loadingToast);
                toast.error("Something went wrong please try again")
            }
            
        }
        
    }

    const handleTitlekeyDown=(e)=>{
        if(e.keyCode==13){
            e.preventDefault();
        }
    }


    const handleTitleChange=(e)=>{
        let input=e.target;

        input.style.height="auto";
        input.style.height=input.scrollHeight+'px';

        setBlog({...blog,title:input.value})
    }

    const handlePublishEvent=()=>{
        if(!banner.length){
            return toast.error("Upload blog banner to publish it");
        }
        if(!title.length){
            return toast.error("Write blog title to publish it")
        }

        if(textEditor.isReady){
            textEditor.save().then(data=>{
                if(data.blocks.length){
                    setBlog({...blog,content:data});
                    setEditorState("publish")
                }
                else{
                    return toast.error("Write something in your blog to publish it")
                }
            }).catch(err=>{
                console.log("Error in text editor : ",err);
            }) 
        }
    }

    const handelSaveDraft = (e) => {
        
        e.preventDefault();

        if(e.target.className.includes("disable")){
            return;
        }

        if(!title.length){
            return toast.error("Title is required");
        }

        let loadingToast=toast.loading("Saving Draft...");

        e.target.classList.add("disable");

        if(textEditor.isReady){
            textEditor.save().then(content=>{
                let blogObj={
                    title,description,banner,content,tags,draft:true
                }
        
                axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/create-blog",{...blogObj,id:blog_id},{
                    headers:{
                        'Authorization':`Bearer ${access_token}`
                    }
                    }).then(()=>{
                    e.target.classList.remove("disable");
                    toast.dismiss(loadingToast);
                    toast.success("Blog Saved..");
        
                    setTimeout(() => {
                        navigate("/");
                    }, 500);
                })
                .catch(({response})=>{
                    e.target.classList.remove("disable");
                    toast.dismiss(loadingToast);
                    return toast.error(response.data.error)
                })
            })
        }
    
    };
  return (
    <>
        <nav className="navbar">
            <Link to={"/"} className='flex-none w-10'>
                <img src={logo} alt="" />
            </Link>
            <p className='max-md:hidden text-black line-clamp-1 w-full'>
                {title.length ? title : "New Blog"}
            </p>
            <div className='flex gap-4 ml-auto'>
                <button className='btn-dark py-2 ' onClick={handlePublishEvent}>
                    Publish
                </button>
                <button className='btn-light py-2' onClick={handelSaveDraft}>
                    Save Draft
                </button>
            </div>
        </nav>
        <Toaster/>
        <AnimationWrapper>
            <section>
                <div className='mx-auto max-w-[900px] w-full'>

                    <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
                        <label htmlFor='uploadBanner'>
                            <img 
                                // ref={blogBannerRef}
                                src={banner}
                                className='z-20'
                                onError={(e)=>e.target.src=defaultBanner}
                                alt=''
                            />
                            <input 
                                id='uploadBanner'
                                type="file"
                                accept=".png, .jpg, .jpeg"
                                hidden
                                onChange={handleBannerUpload}
                            />
                        </label>
                    </div>

                    <textarea
                        defaultValue={title}
                        placeholder='Blog Title'
                        className='text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40'
                        onKeyDown={handleTitlekeyDown}
                        onChange={handleTitleChange}
                    >
                    </textarea>

                    <hr className='w-full opacity-10 my-5'/>

                    <div id='textEditor1' className='font-gelasio'>

                    </div>
                </div>
            </section>
        </AnimationWrapper>
    </>
  )
}

export default BlogEditor
