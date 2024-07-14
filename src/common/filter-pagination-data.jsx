import axios from "axios";

export const filterPaginetionData=async({create_new_arr=false,state,data,page,countRoute,data_to_send={ },user})=>{
    let obj;

    let headers={};

    if(user){
        headers.headers={
            Authorization:`Bearer ${user}`
        }
    }

    if(state!=null && !create_new_arr){
        obj={
            ...state,result:[...state.result,...data],page:page
        }
    }else{
        await axios.post(import.meta.env.VITE_SERVER_DOMAIN+countRoute,data_to_send,headers).then(({data:{totalDocs}})=>{
            obj={result:data,page:1,totalDocs}
        })
        .catch(err=>{
            console.log("FITER PAGINATION DATA")
        })
    }

    return obj;
}