import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../App';
import axios from 'axios';
import { profileDataStructure } from './profile.page';
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/loader.component';
import toast, { Toaster } from 'react-hot-toast';
import InputBox from '../components/input.component';
import { uploadImage } from '../common/aws';
import { storeInSession } from '../common/session';

const EditProfile = () => {
    const{userAuth,userAuth:{access_token,username},setUserAuth}=useContext(UserContext);

    const [profileState, setProfileState] = useState(profileDataStructure);
    const [loading, setLoading] = useState(true);
    const [updatedProfileImg, setUpdatedProfileImg] = useState(null);

    let {personal_info:{fullname,username:profile_username,profile_img,email,bio},social_links}=profileState

    let bioLimit=150;

    const [characterLeft, setCharacterLeft] = useState(bioLimit);
    useEffect(() => {
        if(access_token){
            axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/get-profile",{username:username}).then(({data})=>{
                setProfileState(data);
                setLoading(false)
            }).catch(err=>{
                console.log(err)
            })
        }
    }, [access_token]);

    let profileImgRef=useRef();
    const handleImageChange = (e) => {
        let image=e.target.files[0];

        profileImgRef.current.src=URL.createObjectURL(image);

        setUpdatedProfileImg(image)
    };

    const handleUploadImage = async(e) => {
        e.preventDefault();

        if(!updatedProfileImg){
            return toast.error("Please try to upload new image");
        }
        else{
            let loadingToast=toast.loading("Uploading...");

            e.target.setAttribute("disabled",true);

            await uploadImage({image:updatedProfileImg}).then(url=>{
                console.log("URL:::",url);
                if(url){
                    axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/update-profile-image",{url},{headers:{Authorization: `Bearer ${access_token}`}}).then(({data})=>{

                        setUserAuth({...userAuth,profile_img:data.profile_img});


                        storeInSession("user",JSON.stringify(userAuth));


                        setUpdatedProfileImg(null);

                        toast.dismiss(loadingToast);

                        e.target.removeAttribute("disabled");

                        toast.success("Uploaded")
                    })
                    .catch(({response})=>{
                        toast.dismiss(loadingToast);

                        e.target.removeAttribute("disabled");

                        toast.error("Please try again later.")
                    })

                } 
            }).catch(err=>{
                console.log(err); 
            })
        }
    };


    let editProfileRef=useRef();
    const handleSubmitForm = (e) => {

        e.preventDefault();

        let form=new FormData(editProfileRef.current);

        let formData={};

        for(let [key,value] of form.entries()){
            formData[key]=value;
        }

        let {username,bio,youtube,facebook,twitter,github,instagram,website}=formData;


        if(username.length < 3){
            return toast.error("Username should be long than 2 character")
        }
        if(bio.length > bioLimit){
            return toast.error(`Bio should not be more than ${bioLimit}`)
        }

        let loadingToast=toast.loading("Updating...");

        e.target.setAttribute("disabled",true);

        axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/update-profile",{
            username,bio,social_links:{youtube,facebook,twitter,website,instagram,github},
        },{
            headers:{
                Authorization:`Bearer ${access_token}`
            }
        }).then(({data})=>{
            if(userAuth.username!=data.username){
                console.log(data);

                let newUserAuth={...userAuth,username:data.username}
                storeInSession("user",JSON.stringify(newUserAuth))
                setUserAuth(newUserAuth);
            }

            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            toast.success("Updated successfully")
        }).catch(err=>{
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            console.log(err)
            // toast.error(response.data.error);    
        })
    };
    
  return (
    <AnimationWrapper>
      {
        loading ? <Loader/>:
        <form ref={editProfileRef}>
            <Toaster/>

            <h1 className='max-md:hidden'>
                Edit Profile
            </h1>

            <div className='flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10'>
                <div className='max-lg:center mb-5 '>
                    <label htmlFor="uploadImage" id='profileImgLable' className='relative block w-48 h-48 bg-grey rounded-full overflow-hidden'>
                        <div className='w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/60  opacity-0 hover:opacity-100 cursor-pointer'>Upload Image</div>
                        <img ref={profileImgRef} className='' src={profile_img} alt="" />
                    </label>
                    <input type="file" id='uploadImage' accept='.jpeg, .jpg, .png' hidden onChange={handleImageChange}/>

                    <button onClick={handleUploadImage} className='btn-light mt-5 max-lg:center lg:w-full px-10'>Upload</button>


                </div>
            

            <div className='w-full'>
                <div className='grid grid-cols-1 md:grid-cols-2 md:gap-5'>
                    <div>
                        <InputBox name={"fullname"} type={"text"} value={fullname} placeholder={"Full Name"} disable={true} icon={"fi-rr-user"}/>
                    </div>
                    <div>
                        <InputBox name={"email"} type={"email"} value={email} placeholder={"Email"} disable={true} icon={"fi-rr-envelope"}/>
                    </div>
                </div>

                <InputBox type={"text"} name={"username"} value={profile_username} placeholder={"Username"} icon={"fi-rr-at"}/>

                <p className='text-dark-grey -mt-3'>Username will use to search user and will be visible to all users</p>


                <textarea name="bio" maxLength={bioLimit} defaultValue={bio} className='input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5' placeholder='Bio...' onChange={(e)=>{setCharacterLeft(bioLimit-e.target.value.length)}}></textarea>

                <p className='mt-1 text-dark-grey'>{characterLeft} character left</p>

                <p className='my-6 text-dark-grey capitalize'>Add Your social handles below</p>

                <div className='md:grid md:grid-cols-2 gap-x-6'>

                    {
                        Object.keys(social_links).map((key,index)=>{

                            let link =social_links[key]
                
                            return <InputBox key={index} name={key} type={"text"} value={link} placeholder={"https://"} icon={'fi '+(key!='website' ? "fi-brands-"+key : "fi-rr-globe")}/>
                        })
                    }

                </div>
                <button onClick={handleSubmitForm} className='btn-dark w-auto px-10 ' type='submit'>Update</button>
            </div>
            </div>
        </form>
      }
    </AnimationWrapper>
  )
}

export default EditProfile

