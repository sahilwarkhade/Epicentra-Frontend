import axios from "axios"

export const uploadImage=async(formData)=>{
    let imageURL=null;

    const response=await axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/uploadImage",formData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    })
    imageURL=response.data.imageURL

    return imageURL;
}