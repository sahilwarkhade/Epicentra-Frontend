import React, { useEffect, useRef, useState } from 'react'

export let activeTabLineRef;
export let activeTabRef;
const InPageNavigation = ({children,routes,defaultHidden=[],defaultActiveIndex=0}) => {

    activeTabLineRef=useRef();
    activeTabRef=useRef();

    const [isResizeEventAdded, setIsResizeEventAdded] = useState(false);

    const [width, setWidth] = useState(window.innerWidth);

    const [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);


    const changePageState = (btn,index) => {
        let {offsetWidth, offsetLeft}=btn;

        activeTabLineRef.current.style.width=offsetWidth+"px"

        activeTabLineRef.current.style.left=offsetLeft+"px"

        setInPageNavIndex(index)
    };

    useEffect(() => {

        if(width > 766 && inPageNavIndex!=defaultActiveIndex){

          changePageState(activeTabRef.current,defaultActiveIndex)
        }

        if(!isResizeEventAdded){
          window.addEventListener('resize',()=>{
            if(!isResizeEventAdded){
              setIsResizeEventAdded(true)
            }
            setWidth(Window.innerWidth)
          })
        }
    }, [width]);
  return (
    <>
      <div className='relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto'>
        {
            routes.map((route,i)=>{
                return (
                    <button ref={i==defaultActiveIndex ? activeTabRef : null} 
                    key={i} className={'p-4 px-5 capitalize '+( inPageNavIndex==i ? "text-black":"text-dark-grey ")+(defaultHidden.includes(route) ? "md:hidden " :" ")}onClick={(e)=>{changePageState(e.target,i)}}>
                        {route}
                    </button> 
                ) 
            })
        }
        <hr ref={activeTabLineRef} className='absolute bottom-0 duration-300'/>
        
      </div>
      {
        Array.isArray(children) ? children[inPageNavIndex] : 
        children
      }
    </>
  )
}



export default InPageNavigation
