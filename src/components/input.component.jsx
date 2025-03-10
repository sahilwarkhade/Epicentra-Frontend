import React, { useState } from 'react'

const InputBox = ({name,type,id,value,placeholder,icon,disable=false}) => {

    const [passwordVisible, setPasswordVisible] = useState(false);
  return (
    <div className='relative w-[100%] mb-4'>
        <input 
            type={type == "password" ? passwordVisible ? "text" : "password" :type}
            name={name} 
            placeholder={placeholder}
            defaultValue={value} 
            id={id}
            className='input-box'
            disabled={disable}
        />
        
        <i className={'fi '+icon+' input-icon'}></i>

        {
            type == "password" ?
            <i className={'fi fi-rr-eye'+(passwordVisible ? '':'-crossed')+' input-icon left-auto right-4 cursor-pointer'} onClick={()=>setPasswordVisible(curr=>!curr)}></i>
            :""
        }
    </div>
  )
}

export default InputBox
