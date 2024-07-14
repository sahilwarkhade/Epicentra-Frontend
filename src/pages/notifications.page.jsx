import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../App';
import { filterPaginetionData } from '../common/filter-pagination-data';
import Loader from '../components/loader.component';
import AnimationWrapper from '../common/page-animation';
import NoDataMessage from '../components/nodata.component';
import NotificationCard from '../components/notification-card.component';
import LoadMoreDataBtn from '../components/load-more.component';

const Notifications = () => {

    const {userAuth,userAuth:{access_token,new_notification_available},setUserAuth}=useContext(UserContext)
    const [filter, setFilter] = useState('all');
    const [totalNotifications, setTotalNotifications] = useState(null);
    let filters=['all','like','comment'];

    const fetchNotification = ({page,deletedDocCount=0,}) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/notifications",{page,filter,deletedDocCount},{headers:{
            Authorization:`Bearer ${access_token}`
        }}).then(async({data:{notifications:data}})=>{
            if(new_notification_available){
                setUserAuth({...userAuth,new_notification_available:false})
            }
            
            let formatedData = await filterPaginetionData({
                state:totalNotifications,
                data,
                page,
                countRoute:"/all-notification-count",
                data_to_send:{filter},
                user:access_token
            })

            setTotalNotifications(formatedData);
            // console.log(formatedData)
        }).catch(err=>{
            console.log(err)
        })
    };

    const handleFilter = (e) => {

        let btn=e.target;

        setFilter(btn.innerHTML)

        setTotalNotifications(null);
        
    };

    useEffect(() => {
        if(access_token){
            fetchNotification({page:1})
        }
    }, [access_token,filter]);
  return (
    <div>
        <h1 className='max-md:hidden'>Recent Notifications</h1>
        <div className='my-8 flex gap-6'>
            {
                filters.map((filterName,index)=>{
                    return <button key={index} className={'py-2 '+(filter==filterName ? "btn-dark":' btn-light')} onClick={handleFilter}>{filterName}</button>
                })
            }
        </div>

        {
            totalNotifications == null ? <Loader/> 
            : 
            <>
                {
                    totalNotifications.result.length ? totalNotifications.result.map((notification,index)=>{
                        return <AnimationWrapper key={index} transition={{delay:index*0.08}}>
                            <NotificationCard data={notification} index={index} notificationState={{totalNotifications,setTotalNotifications}}/>
                        </AnimationWrapper>
                    })
                    :<NoDataMessage message={"No new notifications"}/>
                }

                <LoadMoreDataBtn state={totalNotifications} fetchDataFunction={fetchNotification} additionalParams={{deletedDocCount:totalNotifications.deletedDocCount}}/>
            </>
        }
    </div>
  )
}

export default Notifications
