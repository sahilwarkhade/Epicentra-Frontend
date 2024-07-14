import React from 'react'
import pageNotFound from "../imgs/404.png"
import fullLogo from "../imgs/full-logo.png"
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <section className='h-cover relative p-10 flex flex-col items-center gap-20 text-center'>

        <img src={pageNotFound} alt="404" className='select-none border-2 border-grey w-72 aspect-square object-cover rounded'/>

        <h1 className='text-4xl font-gelasio leading-7'>PAGE NOT FOUND</h1>

        <p className='text-dark-grey text-xl leading-7 -mt-8'>The Page Are You Looking For Does Not Exist. Go To <Link className='text-black underline' to={"/"}>Home Page</Link></p>

        <div className='mt-auto'>
            <img src={fullLogo} alt="LOGO" className='h-8 object-contain block mx-auto select-none'/>
            <p className='mt-5 text-dark-grey'>Read millions of stories around the world</p>
        </div>
    </section>
  )
}

export default PageNotFound
