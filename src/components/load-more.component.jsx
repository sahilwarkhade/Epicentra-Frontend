import React from 'react'

const LoadMoreDataBtn = ({state,fetchDataFunction,additionalParams}) => {

    if(state != null && state.totalDocs > state.result.length){
        return (
            <button className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2' onClick={()=>{fetchDataFunction({...additionalParams,page:state.page+1})}}>
                Load More
            </button>
        )
    }
  
}

export default LoadMoreDataBtn
