import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Alert, Button, Table, TableBody, TableCell, TableHead, TableRow } from 'flowbite-react'
import { useDispatch } from 'react-redux';
import { fetchingFinish, fetchingStart, setMessageTime, setUpdateMessage, setUpdateStatus } from '../redux/user/userSlice.js';
import { HiEye, HiInformationCircle } from "react-icons/hi";
import { Link, useNavigate } from 'react-router-dom';
import PopUp from './PopUp.jsx';

function ManageUsers() {
    const [users, setUsers] = useState([])
    const { currentUser } = useSelector(state => state.user)
    const [showPopup, setShowPopup] = useState(false);
    const [id, setId] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/user/getusers')
                const data = await res.json()
                console.log(data)
                if (res.ok) {
                    setUsers(data)
                }
            } catch (e) {
                console.log(e)
            }
        }
        fetchUsers();
    }, [currentUser.id])

    const handleDelete = () => {
        try {
            const res = fetch(`/api/user/delete/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                console.log("user DEleted");
            }
            setUsers((prev) =>
                prev.filter((user) => user._id !== id)
            );

        } catch (e) {
            console.log(e)
        }

    }

    return (
        <div className='table-auto overflow-scroll scrollbar w-full scrollbar-track-slate-300 scrollbar-thumb-slate-700 dark:scrollbartra min-h-screen'>
            <div className='p-4 min-w-full'>
                {currentUser.isAdmin ? (
                    <>
                        <Table hoverable className='shadow-md'>
                            <TableHead>
                                <Table.HeadCell>Post Image</Table.HeadCell>
                                <Table.HeadCell>Title</Table.HeadCell>
                                <Table.HeadCell>Category</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                                <Table.HeadCell><span>Edit</span></Table.HeadCell>
                            </TableHead>
                            {users.map((user) => (
                                <TableBody key={user._id}>
                                    <TableRow>
                                        <TableCell>
                                            <img src={user.profilePicture} alt={user.profilePicture} className='w-20 h-10 object-cover' />
                                        </TableCell>
                                        <TableCell className='font-bold text-balance'>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Button gradientDuoTone={'blueToPurple'} className='hover:scale-125 transition-all hover:underline text-red-500' onClick={() => {
                                                setId(user._id)
                                                setShowPopup(true)
                                            }}>Delete</Button>
                                        </TableCell>
                                        {showPopup && <PopUp handleDelete={handleDelete} setShowPopup={setShowPopup} />}
                                        <TableCell>
                                            <Button gradientDuoTone={'greenToBlue'} outline onClick={() => {
                                                navigate(`/dashboard/editpost/${user._id}`)
                                            }}>Edit</Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            ))}
                        </Table>
                        {/* {
                            showMore && (
                                <Button gradientDuoTone={'purpleToPink'} className='mt-4 ml-4 mb-4 h-10' onClick={handleShowMore}>Show More</Button>
                            )
                        } */}
                    </>
                ) : (
                    !loading && <h1 className='text-2xl text-center'>No User Found</h1>
                )
                }
            </div>
        </div >
    )
}

export default ManageUsers
