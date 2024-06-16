import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { Button } from 'flowbite-react'


function ReadPost() {
    const { postId } = useParams();
    const { currentUser } = useSelector(state => state.user)
    const [postData, setPostData] = useState([])
    const [comment, setComment] = useState('')
    const [reply, setReply] = useState('')
    const [commentData, setCommentData] = useState([])
    const [replyData, setReplyData] = useState([])
    const [showReplyBox, setShowReplyBox] = useState(false)

    useEffect(() => {
        try {
            const fetchComment = async () => {
                const res = await fetch(`/api/post/getComments?postId=${postId}`)
                if (res.ok) {
                    const data = await res.json()
                    setCommentData(data)
                }
            }

            const fetchReply = async () => {
                const res = await fetch(`/api/post/getReplies?postId=${postId}`)
                if (res.ok) {
                    const data = await res.json()
                    setReplyData(data)
                }
            }

            fetchComment();
            fetchReply();
        } catch (e) {
            console.log(e)
        }
    }, [])

    //fetching the post data
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`/api/post/getPosts?postId=${postId}`)
                const data = await response.json()
                if (data.success === true) {
                    setPostData(data.posts[0])
                }
            } catch (e) {
                console.log(e)
            }
        }
        fetchPost();
    }, [currentUser._id])

    const handleChange = (e) => {
        setComment(e.target.value)
    }

    const handleReplyChange = (e) => {
        setReply(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (comment === '') {
                alert('Comment cannot be empty')
                return
            }
            const data = {
                comment,
                commentId: new Date().getTime(),
                postId,
                userId: currentUser._id,
                userName: currentUser.username
            }
            const res = await fetch('/api/post/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            const result = await res.json()
            if (res.ok) {
                console.log('Comment added successfully')
                setComment('')
            }

            setCommentData([...commentData, data])
            setComment('')
        }
        catch (e) {
            console.log(e)
        }
    }

    const handleReply = async (commentId) => {
        try {
            if (reply === '') {
                alert('Reply cannot be empty')
                return
            }
            const data = {
                reply: reply,
                replyId: new Date().getTime(),
                postId,
                commentId,
                userId: currentUser._id,
                userName: currentUser.username
            }
            const res = await fetch('/api/post/reply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            const result = await res.json()
            if (res.ok) {
                console.log('Reply added successfully')
                setReply('')
            }

            setReplyData([...replyData, data])
            setReply('')
        }
        catch (e) {
            console.log(e)
        }
    }


    return (
        <div className='min-h-screen'>
            <h1 className='text-[58px] w-full text-center'>{postData.title}</h1>
            <h1 className='text-xl bg-teal-700 w-fit px-4 rounded-full mx-auto mb-4 text-white'>{postData.category}</h1>
            <img src={postData.photo} alt="" className='md:w-[70vw] md:h-[40vh] mx-auto border-2 rounded-lg object-cover sm:w-[80vw] sm:h-[20vh]' />
            <div className='min-h-20 p-4 m-4'>
                <h1 className='text-[20px]'>
                    <div dangerouslySetInnerHTML={{ __html: postData?.content }}></div>
                </h1>
            </div ><hr className='w-[80vw] mx-auto' />

            {/* Comment */}
            <form onSubmit={handleSubmit}>
                <div className='border-2 h-[40vh] w-[70vw] mx-auto my-10 rounded-3xl relative'>
                    <div className='h-10 border-2 absolute w-[80rem] my-4 right-[8rem] rounded-full text-center'>COMMENT</div>
                    <textarea name="comment" id="comment" className='absolute h-[30vh] w-[60vw] top-[15%] right-[7%] rounded-lg dark:bg-slate-800 text-2xl' onChange={handleChange}></textarea>
                    <Button className='absolute z-10 px-4 py-2 bottom-4 right-4' type='submit' gradientDuoTone={'purpleToBlue'}>Comment</Button>
                </div>
            </form >

            {/* Comment Section */}
            <div>
                <h1 className='text-[20px] text-center'>Comments</h1>
                <div className='w-[70vw] mx-auto'>
                    <div className='border-2 rounded-2xl p-4 my-4'>
                        {
                            commentData.length > 1 &&
                            commentData?.slice(1)?.map((comment, i) => {
                                comment = commentData[i + 1]
                                return (
                                    <div key={i} className='relative'>
                                        <h1 className='text-[18px]'>Username: {comment?.userName}</h1>
                                        <h1 className='text-[26px] font-bold mb-4'>{comment?.comment}</h1>
                                        <div className='flex justify-center items-center gap-10'>
                                            <textarea name={`reply-${i}`} id={`reply-${i}`} className='h-[6vh] w-[60vw] top-[15%] right-[7%] rounded-lg dark:bg-slate-800 text-2xl' onChange={handleReplyChange} required></textarea>
                                            <Button name={`reply-${i}`} id={`reply-${i}`} className='items-center justify-center' type='submit' gradientDuoTone={'purpleToBlue'} onClick={() => {
                                                handleReply(comment?.commentId)
                                            }}>Reply</Button>
                                        </div>

                                        <hr className='border-2 mt-4' />

                                        {
                                            replyData.length > 1 ?
                                                <div>
                                                    {
                                                        replyData.map((reply, i) => {
                                                            return (
                                                                reply?.commentId === comment?.commentId && (
                                                                    <div key={i} className='ml-20 mt-4'>
                                                                        <h1 className='text-3xl'>Replies</h1>
                                                                        <h1 className='text-[18px]'>Username: {reply?.userName}</h1>
                                                                        <div className='flex justify-start items-center gap-[20px]'>
                                                                            <h1 className='text-[26px] font-bold mb-4'><span className='text-xl text-teal-600'> @{comment?.userName} </span> {reply?.reply}</h1>
                                                                            <div hidden={showReplyBox}>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )

                                                            )
                                                        })
                                                    }
                                                </div>
                                                :
                                                <h1 className='text-3xl'>No Replies</h1>
                                        }
                                        <hr className='border-2 mt-4' />
                                    </div>

                                )
                            })
                        }
                    </div>
                </div>
            </div>

        </div >
    )
}

export default ReadPost
