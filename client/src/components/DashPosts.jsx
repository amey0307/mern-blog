import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Alert, Button, Table, TableBody, TableCell, TableHead, TableRow } from 'flowbite-react'
import { useDispatch } from 'react-redux';
import { fetchingFinish, fetchingStart, setMessageTime, setUpdateMessage, setUpdateStatus } from '../redux/user/userSlice.js';
import { HiEye, HiInformationCircle } from "react-icons/hi";
import { Link } from 'react-router-dom';
import PopUp from './PopUp.jsx';

function DashPosts() {
    const { currentUser, updateMessage, updateStatus, loading } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [userPosts, setUserPosts] = useState([])
    const [showMore, setShowMore] = useState(true);
    const [id, setId] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    //fetching posts from the database at every render
    useEffect(() => {
        const fetchPosts = async () => {
            dispatch(fetchingStart());
            try {
                const response = await fetch(`/api/post/getPosts?userId=${currentUser._id}`)
                const data = await response.json()
                if (data.success === true) {
                    dispatch(setUpdateMessage('Posts fetched successfully'));
                    dispatch(setUpdateStatus('true'));
                    setUserPosts(data.posts)
                    if (data.posts.length < 9) {
                        setShowMore(false);
                        dispatch(fetchingFinish())
                    }
                }
                else {
                    dispatch(setUpdateMessage('Error fetching posts'));
                    dispatch(setUpdateStatus('false'));
                    dispatch(fetchingFinish())
                }
            } catch (e) {
                dispatch(setUpdateMessage('Error fetching posts'));
                dispatch(setUpdateStatus('false'));
                dispatch(fetchingFinish())
            }
        }

        if (currentUser.isAdmin) {
            fetchPosts();
        }

    }, [currentUser.id])

    //To remove the update message when the component is mounted
    useEffect(() => {
        dispatch(setUpdateMessage(null));
        dispatch(setUpdateStatus(null));
    }, [])
    //to replace update message if another update is made
    useEffect(() => {
        if (updateMessage) {
            const timer = setTimeout(() => {
                dispatch(setUpdateMessage(null));
                dispatch(setUpdateStatus(null));
            }, 5 * 1000);
            return () => clearTimeout(timer);
        }
    }, [updateMessage])

    //fetch more posts
    const handleShowMore = async () => {
        try {
            const response = await fetch(`/api/post/getPosts?userId=${currentUser._id}&startIndex=${userPosts.length}`)
            const data = await response.json()
            if (data.success === true) {
                setUserPosts([...userPosts, ...data.posts])
                if (data.posts.length < 9) {
                    setShowMore(false);
                }
            }
            else {
                dispatch(setUpdateMessage('Error fetching posts'));
                dispatch(setUpdateStatus('false'));
            }
        } catch (e) {
            dispatch(setUpdateMessage('Error fetching posts'));
            dispatch(setUpdateStatus('false'));
        }
    }

    //delete post
    const handleDelete = async () => {
        setShowPopup(false);
        const fetchAdd = `/api/post/delete/?id=${id}&userId=${currentUser._id}`;
        console.log(fetchAdd)
        try {
            const res = await fetch(`/api/post/delete/?id=${id}&userId=${currentUser._id}`,
                {
                    method: 'DELETE',
                }
            );
            const data = await res.json();
            if (!res.ok) {
                console.log(data);
            } else {
                setUserPosts((prev) =>
                    prev.filter((post) => post._id !== id)
                );
            }
        } catch (error) {
            dispatch(setUpdateMessage('Error deleting post'));
            dispatch(setUpdateStatus('false'));
        }
    }

    return (
        <>
            {/* Refresh Button */}
            <div>
                <Button gradientDuoTone={'greenToBlue'} className='mt-4 ml-4 mb-4 h-10' onClick={() => { window.location.reload() }}>Refresh</Button>
            </div>

            {/* Table */}
            <div className='table-auto overflow-scroll scrollbar w-full scrollbar-track-slate-300 scrollbar-thumb-slate-700 dark:scrollbartra'>
                <div className='p-4 min-w-full'>
                    {currentUser.isAdmin && userPosts.length > 0 ? (
                        <>
                            <Table hoverable className='shadow-md'>
                                <TableHead>
                                    <Table.HeadCell>Date Updated</Table.HeadCell>
                                    <Table.HeadCell>Post Image</Table.HeadCell>
                                    <Table.HeadCell>Title</Table.HeadCell>
                                    <Table.HeadCell>Category</Table.HeadCell>
                                    <Table.HeadCell>Delete</Table.HeadCell>
                                    <Table.HeadCell><span>Edit</span></Table.HeadCell>
                                </TableHead>
                                {userPosts.map((post, index) => (
                                    <TableBody key={post._id}>
                                        <TableRow>
                                            <TableCell>{new Date(post.updatedAt).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <img src={post.photo} alt={post.title} className='w-20 h-10 object-cover' />
                                            </TableCell>
                                            <TableCell className='font-bold text-balance'>{post.title}</TableCell>
                                            <TableCell>{post.category}</TableCell>
                                            <TableCell>
                                                <Button gradientDuoTone={'blueToPurple'} className='hover:scale-125 transition-all hover:underline text-red-500' onClick={() => {
                                                    setId(post._id)
                                                    setShowPopup(true)
                                                }}>Delete</Button>
                                            </TableCell>
                                            {showPopup && <PopUp handleDelete={handleDelete} setShowPopup={setShowPopup} />}
                                            <TableCell>
                                                <Link to={`/editPost/${post._id}`}><Button gradientDuoTone={'greenToBlue'} outline>Edit</Button></Link>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                ))}
                            </Table>
                            {
                                showMore && (
                                    <Button gradientDuoTone={'purpleToPink'} className='mt-4 ml-4 mb-4 h-10' onClick={handleShowMore}>Show More</Button>
                                )
                            }
                        </>
                    ) : (
                        !loading && <h1 className='text-2xl text-center'>No Posts Found</h1>
                    )
                    }
                </div>
            </div >

            {/* Conditional Alerts */}
            <div div >
                {
                    updateStatus === "true" ?
                        <Alert withBorderAccent
                            icon={HiEye}
                            color='green'
                            className='mt-4 right-4 top-20 absolute animate-SlideIn text-md'>
                            {updateMessage}
                        </Alert>
                        :
                        null
                }

                {
                    updateStatus === "false" ?
                        <Alert withBorderAccent
                            icon={HiInformationCircle}
                            color='red'
                            className='mt-4 right-4 top-20 absolute animate-SlideIn text-md'>
                            {updateMessage}
                        </Alert>
                        :
                        null
                }

                {
                    updateStatus === "noChange" ?
                        <Alert withBorderAccent
                            icon={HiInformationCircle}
                            color='yellow'
                            className='mt-4 right-4 top-20 absolute animate-SlideIn text-md'>
                            {updateMessage}
                        </Alert>
                        :
                        null
                }
            </div >
        </>
    )
}

export default DashPosts
