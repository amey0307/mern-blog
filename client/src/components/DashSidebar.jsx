import React from 'react'
import { Avatar, Sidebar } from 'flowbite-react'
import { HiArrowSmRight, HiUser } from 'react-icons/hi'
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setUpdateMessage, setUpdateStatus, signoutFailure, signoutStart, signoutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

function DashSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const[tab, setTab] = useState('')
    const dispatch = useDispatch();
    const {currentUser} = useSelector(state => state.user);
    
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
    
    const handleSignOut = async () => {
      try { 
        dispatch(signoutStart());
        const res = await fetch('/api/user/signout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await res.json();
        if (res.ok) {
          dispatch(setUpdateMessage("User Signed Out Successfully"));
          dispatch(setUpdateStatus("true"));
          dispatch(signoutSuccess());
          navigate('/sign-in');
        } else {
          dispatch(setUpdateMessage(`Error : ${data.message}`));
          dispatch(setUpdateStatus("false"));
          dispatch(signoutFailure(data.message));
        }
      } catch (error) {
        dispatch(setUpdateMessage(`Error : ${error.message}`));
        dispatch(setUpdateStatus("false"));
        dispatch(signoutFailure(error.message));
      }
    }

  return (
    <>
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup>
                <Sidebar.Item active={tab==='profile'} icon={HiUser} label={currentUser.isAdmin ? "Admin" : 'User'} labelColor='dark' className='cursor-pointer hover:opacity-75' onClick={handleProfile}>
                  Profile
                </Sidebar.Item>
                {
                  currentUser.isAdmin && (
                    <>
                    <Link to={'/create-post'}>
                      <Sidebar.Item active={tab === 'users'} icon={HiUser} labelColor='dark' className='cursor-pointer hover:opacity-75 mt-2' onClick={handleProfile} as='div'>
                          Admin Pannel
                      </Sidebar.Item>
                    </Link>
                    </>
                  )
                }
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
