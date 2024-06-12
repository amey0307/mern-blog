import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import badgeWhite from '../assets/badge-white.svg'
import badgeBlack from '../assets/badge-black.svg'
import Card from '../components/CardComponent.jsx'
import { Button } from 'flowbite-react'
import like from '../assets/like.svg'
import liked from '../assets/like-red.svg'

function Home() {
  const { currentUser } = useSelector(state => state.user)
  const { theme } = useSelector(state => state.theme)
  const [postData, setPostData] = useState([])
  const [likedPostId, setLikedPostId] = useState(null)
  const [isLiked, setLiked] = useState(false)
  const [fetchedLikedPost, setFetchedLikedPost] = useState([])
  const [postLikedByUsers, setPostLikedByUsers] = useState([])
  const [toggleHide, setToggleHide] = useState(false)

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

  useEffect(() => {
    const fetchLikedPost = async () => {
      try {
        const response = await fetch('/api/user/getlikedposts', { method: 'GET' })
        const data = await response.json()
        // console.log(data)
        if (response.ok) {
          setPostLikedByUsers(data)
        }
      } catch (e) {
        console.log(e)
      }
    }
    fetchLikedPost();
  }, [postData.isLiked])

  useEffect(() => {
    setPostData(
      postData?.map((post) => (
        post.likedByUsers.includes(currentUser._id) ?
          { ...post, isLiked: true }
          :
          { ...post, isLiked: false }
      ))
    )
  }, [])

  const handleLike = async (postId) => {
    try {
      const res = await fetch(`/api/user/likedpost?postId=${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      const data = await res.json();
      setPostLikedByUsers(data.likedPosts)

      setPostData(
        postData.map((post) =>
          post._id === postId ? { ...post, isLiked: !post.isLiked } : post
        )
      )
    } catch (e) {
      console.log(e)
    }
  }

  // console.log("postLikedByUsers: ", postLikedByUsers)
  // console.log("postDAta : ", postData)

  return (
    <>
      <section className='min-h-screen p-4 md:text-[56px] sm:text-[48px] overflow-hidden'>
        <div>
          <div className='flex gap-2 mt-4'>
            {
              theme === 'dark' ?
                <img src={badgeWhite} alt='badge' className='md:w-16 md:h-16 sm:w-12 sm:h-12 relative bottom-4' />
                :
                <img src={badgeBlack} alt='badge' className='md:w-16 md:h-16 sm:w-12 sm:h-12 relative bottom-4' />
            }
            <h1 className='md:text-[56px] sm:text-xl'>Hello <span className='dark:green-yellow-300 text-green-500 bg-[#c8ff91] rounded-2xl px-2 dark:bg-[rgba(34,76,4,0.52)]'>{currentUser.username}</span></h1>
          </div>
          <h1 className='text-3xl relative left-[76px] bottom-4'>Welcome to the Home Page!!!</h1>
        </div>

        <div className='p-10'>
          <h1 className=''>Blogs</h1>
          <div className='flex gap-[10px] flex-wrap justify-around items-center'>
            {
              postData?.map((post, index) => (
                <div className='border-neutral-500 border-[2px] rounded-lg relative' key={index}>
                  <img key={index} src={post.photo} alt={post.title} className='h-[28vh] w-[28vw] object-cover' />
                  <div className='py-10 pl-4'>
                    <h1 className='text-2xl font-bold'>{post.title}</h1>
                    <Button gradientDuoTone={'greenToBlue'} className='mt-4'>READ MORE</Button>

                    <div className='text-sm absolute right-4 bottom-7 hover:scale-110 transition-all' key={post._id} onClick={() => {
                      handleLike(post._id)
                      // console.log(post._id)
                    }}>

                      {/* login for like */}
                      {
                        post.isLiked || postLikedByUsers.includes(post._id) ?
                          < img src={liked} alt='like' className='w-8 h-8 hover:scale-110 transition-all' key={index} onClick={() => {
                            // handleUnlike(post._id)
                            console.log("unliked")
                            // setToggleHide(!toggleHide)
                          }} />
                          :
                          < img src={like} alt='like' className='w-8 h-8 hover:scale-110 transition-all' key={index} onClick={() => {
                            // handleUnlike(post._id)
                            // handleLike(post._id)
                            console.log("liked")
                            // post?.isLiked && setToggleHide(!toggleHide)
                          }} />



                      }

                    </div>
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


//   < img src = { liked } alt = 'like' className = 'w-8 h-8 hover:scale-110 transition-all' key = { index } onClick = {() => {
//   // handleUnlike(post._id)
//   setToggleHide(!toggleHide)
// }} />
//                             :
//   < img src = { like } alt = 'like' className = 'w-8 h-8 hover:scale-110 transition-all' key = { index } onClick = {() => {
//   // handleUnlike(post._id)
//   // handleLike(post._id)
//   post.isLiked && setToggleHide(!toggleHide)
// }} />