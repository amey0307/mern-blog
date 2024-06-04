import React from 'react'
import { Sidebar } from 'flowbite-react'
import { HiArrowSmRight, HiUser } from 'react-icons/hi'
import {useLocation, useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';

function DashSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const[tab, setTab] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); //"?tab=profile"
    const tabFromUrl = urlParams.get('tab'); //profile
    if(tabFromUrl){
      setTab(tabFromUrl)
    }
  }, [location.search])
    
    const handleProfile = () => {
        navigate('/dashboard?tab=profile')
    }

    const handleSignOut = () => {
        navigate('/dashboard?tab=sign-out')
    }

  return (
    <>
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup>
                <Sidebar.Item active={tab==='profile'} icon={HiUser} label={'User'} labelColor='dark' className='cursor-pointer hover:opacity-75' onClick={handleProfile}>
                    Profile
                </Sidebar.Item>
                <Sidebar.Item active={tab === 'sign-out'} icon={HiArrowSmRight} className='cursor-pointer hover:opacity-75' onClick={handleSignOut}>
                    Sign Out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
    </>
  )
}

export default DashSidebar
