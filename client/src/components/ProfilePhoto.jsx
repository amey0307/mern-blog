import React, { useState } from 'react'
import { useSelector } from 'react-redux';

function ProfilePhoto(props) {
    const { theme } = useSelector(state => state.theme);
    return (
        <div className={theme}>
            <img src={props.imgSrc} alt="user" className='rounded-full w-32 h-32 border-2 hover:border-8 dark:border-[#d1dddf] border-[#404048a9] hover:opacity-80 transition-all object-cover self-center' />
        </div>
    )
}

export default ProfilePhoto
