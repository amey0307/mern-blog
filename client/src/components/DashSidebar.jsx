import React from 'react'
import { Avatar, Sidebar } from 'flowbite-react'
import { HiArrowSmRight, HiUser } from 'react-icons/hi'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setUpdateMessage, setUpdateStatus, signoutFailure, signoutStart, signoutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

function DashSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState('')
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);

  // Get the tab from the url
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); //"?tab=profile"
    const tabFromUrl = urlParams.get('tab'); //profile
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search])

  // Handle the profile click
  const handleProfile = () => {
    navigate('/dashboard?tab=profile')
  }

  // Handle the sign out click
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

  const handleUsers = () => {
    navigate('/manage-users')
  }

  return (
    <>
      <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
          <Sidebar.ItemGroup className='flex flex-col gap-1'>
            <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? "Admin" : 'User'} labelColor='dark' className='cursor-pointer hover:opacity-75' onClick={handleProfile}>
              Profile
            </Sidebar.Item>
            {
              currentUser.isAdmin &&
              <Sidebar.Item active={tab === 'users'} icon={HiUser} label={currentUser.isAdmin ? "Admin" : 'User'} labelColor='dark' className='cursor-pointer hover:opacity-75' onClick={handleUsers}>
                Users
              </Sidebar.Item>
            }

            {
              currentUser.isAdmin && (
                <Link to='/dashboard?tab=posts'>
                  <Sidebar.Item active={tab === 'users'} icon={HiUser} className='cursor-pointer hover:opacity-75'>
                    Posts
                  </Sidebar.Item>
                </Link>
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
