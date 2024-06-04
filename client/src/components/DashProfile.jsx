import { Button, TextInput } from 'flowbite-react';
import React from 'react'
import { useSelector } from 'react-redux';

function DashProfile() {
  const { currentUser } = useSelector(state => state.user);

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-sans font-bold text-2xl'>Profile</h1>
      <form className='flex flex-col relative border-0'>
        <div className='w-32 h32 self-center cursor-pointer shadow-md rounded-full'>
          <img src={currentUser.profilePicture} alt="user" className='rounded-full w-full h-full border-8 border-[lightgray] hover:opacity-80 transition-all' />
        </div>

        <div className='min-w-full flex flex-col gap-4 mt-4'>
          <TextInput
            type='text'
            id='username'
            placeholder='username'
            defaultValue={currentUser.username}
          />
          <TextInput
            type='text'
            id='email'
            placeholder='email'
            defaultValue={currentUser.email}
          />
          <TextInput
            type='password'
            id='password'
            placeholder='username'
          />
          <Button gradientDuoTone={'purpleToBlue'} outline type='submit' className='min-w-full'>
            Update Profile
          </Button>
          <div className='flex justify-between px-1'>
            <div className='text-red-600 text-lg'>Delete Account</div>
            <div className='text-red-600 text-lg'>Sign Out</div>
          </div>
        </div>

      </form>
    </div>
  )
}

export default DashProfile
