import React from 'react'
import { useSelector } from 'react-redux';

function DashProfile() {
    const {currentUser} = useSelector(state => state.user);

  return (
    <div>
      <h1>Hello {currentUser.username}</h1>
    </div>
  )
}

export default DashProfile
