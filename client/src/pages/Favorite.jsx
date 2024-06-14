import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import badgeWhite from '../assets/badge-white.svg'
import badgeBlack from '../assets/badge-black.svg'
import { Button } from 'flowbite-react'
import like from '../assets/like.svg'
import liked from '../assets/like-red.svg'

function Favorite() {
    const { currentUser, likedPostId } = useSelector(state => state.user)
    const { theme } = useSelector(state => state.theme)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const fetchPosts = async (id) => {
            try {
                const response = await fetch(`/api/post/getlikedposts`)
                const data = await response.json()
                if (response.ok) {
                    setPosts(data)
                }
            } catch (e) {
                console.log(e)
            }
        }
        fetchPosts();
    }, [currentUser.id])

    const have = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === currentUser._id) {
                return true
            }
        }
        return false
    }

    const removeCurrentUser = (arr) => {
        return arr?.filter((user) => user !== currentUser._id)
    }

    const addCurrentUser = (arr) => {
        arr?.push(currentUser._id)
        return arr
    }

    const handleLike = async (postId) => {
        try {

            const res = await fetch(`/api/post/likepost?postId=${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })

            const data = await res.json();
            setPosts(posts.map(post => post._id === postId ? { ...post, likedByUsers: addCurrentUser(post?.likedByUsers) || [], isLiked: true } : post))



        } catch (e) {
            console.log(e)
        }
    }

    const handleDisLike = async (postId) => {
        try {
            setPosts(posts.map(post => post._id === postId ? { ...post, likedByUsers: removeCurrentUser(post?.likedByUsers) || [], isLiked: false } : post))
            const res = await fetch(`/api/post/unlikepost?postId=${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })

            const data = await res.json();
        } catch (e) {
            console.log(e)
        }

        setPosts((prev) =>
            prev.filter((post) => post._id !== postId)
        );
    }

    return (
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
                <div className='flex gap-[80px] flex-wrap justify-start items-center px-10'>
                    {
                        posts?.map((post, index) => (
                            <div className='border-neutral-500 border-[2px] rounded-lg relative mt-8' key={index}>
                                <img key={index} src={post.photo} alt={post.title} className='h-[16vh] w-[28vw] object-cover' />
                                <div className='py-10 pl-4'>
                                    <h1 className='text-2xl font-bold'>{post.title}</h1>
                                    <Button gradientDuoTone={'greenToBlue'} className='mt-4'>READ MORE</Button>

                                    <div className='text-sm absolute right-4 bottom-7 hover:scale-110 transition-all' key={post._id} onClick={() => {
                                        console.log(post._id)
                                    }}>
                                        {
                                            have(post?.likedByUsers) ?
                                                < img src={liked} alt='like' className='w-8 h-8 hover:scale-110 transition-all' key={index} onClick={() => {
                                                    handleDisLike(post._id)
                                                }} />
                                                :
                                                < img src={like} alt='like' className='w-8 h-8 hover:scale-110 transition-all' key={index} onClick={() => {
                                                    handleLike(post._id)
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
    )
}

export default Favorite
