import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import badgeWhite from '../assets/badge-white.svg'
import badgeBlack from '../assets/badge-black.svg'
import Card from '../components/CardComponent.jsx'
import { Button } from 'flowbite-react'

function Home() {
  const { currentUser } = useSelector(state => state.user)
  const { theme } = useSelector(state => state.theme)
  const [postData, setPostData] = useState([])
  const [loading, setLoading] = useState(window.onload)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/post/getPosts`)
        const data = await response.json()
        if (data.success === true) {
          setPostData(data.posts)
        }
      } catch (e) {
        console.log(e)
      }
    }
    fetchPosts();
  }, [currentUser.id])

  return (
    <>
      <section className='min-h-screen p-4 md:text-[56px] sm:text-[48px] overflow-hidden'>
        <div>
          <div className='flex gap-2'>
            {
              theme === 'dark' ?
                <img src={badgeWhite} alt='badge' className='md:w-16 md:h-16 sm:w-12 sm:h-12 relative bottom-4' />
                :
                <img src={badgeBlack} alt='badge' className='md:w-20 md:h-20 sm:w-12 sm:h-12 relative bottom-5' />
            }
            <h1 className='md:text-[56px] sm:text-xl'>Hello <span className='dark:text-yellow-300 text-yellow-500'>{currentUser.username}</span></h1>
          </div>
          <h1 className='text-3xl relative left-[96px] bottom-7'>Welcome to the Home Page!!!</h1>
        </div>

        <div className='p-10'>
          <h1 className=''>Blogs</h1>
          <div className='flex gap-[10px] flex-wrap justify-around items-center'>
            {
              postData.map((post, index) => (
                <div className='border-neutral-500 border-[2px] rounded-lg relative'>
                  <img key={index} src={post.photo} alt={post.title} className='h-[28vh] w-[28vw] object-cover' />
                  <div className='py-10 pl-4'>
                    <h1 className='text-2xl font-bold'>{post.title}</h1>
                    <Button gradientDuoTone={'greenToBlue'} className='mt-4'>READ MORE</Button>
                    <p className='text-sm absolute right-4 bottom-2'>{post.slug}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
