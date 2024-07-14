import React, { useContext, useRef } from 'react'
import AnimationWrapper from '../common/page-animation'
import InputBox from '../components/input.component'
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { UserContext } from '../App';

let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

const ChangePassword = () => {

    const{userAuth:{access_token}}=useContext(UserContext);

    const changePasswordRef=useRef();
    const handleChangePassword = (e) => {
        e.preventDefault();

        let form=new FormData(changePasswordRef.current);

        let formData={};

        for(let [key,value] of form.entries()){
            formData[key]=value;
        }
        
        let {currentPassword,newPassword}=formData;

        if(!currentPassword.length || !newPassword.length){
            return toast.error("Fill all the inputs")
        }

        if(!passwordRegex.test(newPassword) || !passwordRegex.test(currentPassword)){
            return toast.error("Enter Strong Password which contains 1 or more uppercase, lowercase character and Password must be between 6 to 20 character long")
        }

        e.target.setAttribute("disabled",true)
        
        let loadingToast=toast.loading("Updateing Password...")
        axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/change-password",formData,{headers:{
            Authorization:`Bearer ${access_token}`
        }}).then(()=>{
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            return toast.success("Password Changed Successfully...");
        })
        .catch(({response})=>{
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            return toast.error(response.data.error);
        })
    };
  return (
    <AnimationWrapper >
        <Toaster/>
      <form ref={changePasswordRef}>
        <h1 className='max-md:hidden'>Change Password</h1>

        <div className='py-10 w-full md:max-w-[400px]'>
            <InputBox name={"currentPassword"} type={"password"} className="profile-edit-input" placeholder={"Current Password"} icon={"fi-rr-unlock"}/>
            <InputBox name={"newPassword"} type={"password"} className="profile-edit-input" placeholder={"New Password"} icon={"fi-rr-unlock"}/>

            <button onClick={handleChangePassword} className='btn-dark px-10 ' type='submit'>Change Password</button>
        </div>
      </form>
    </AnimationWrapper>
  )
}

export default ChangePassword
