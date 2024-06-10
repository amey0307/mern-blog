import { Alert, Button, FileInput, Select, Spinner, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';
import { HiEye, HiInformationCircle } from "react-icons/hi";
import { updateFailure, updateStart, updateSuccess, setUpdateMessage, setUpdateStatus, deleteUserFailure, deleteUserStart, deleteUserSuccess, setMessageTime } from '../redux/user/userSlice.js';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import { useNavigate, useParams } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar.jsx';

function CreatePost(props) {
    const [formData, setFormData] = useState({})
    const dispatch = useDispatch();
    const [imageFileUploadingError, setImageFileUploadingError] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [ImageFileUploadingProgress, setImageFileUploadingProgress] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const { currentUser, updateMessage, updateStatus, loading, messageTime } = useSelector(state => state.user);
    const navigate = useNavigate();
    const { id } = useParams();

    //to clear update message and status on page load
    useEffect(() => {
        dispatch(setUpdateMessage(null));
        dispatch(setUpdateStatus(null));

        const res = async () => {

            try {
                const response = await fetch(`/api/post/getPosts?postId=${id}`)
                const data = await response.json()
                if (data.success === true) {
                    setFormData(data.posts[0])
                    setImageFileUrl(data.posts.photo)
                }
                else {
                    dispatch(setUpdateMessage(data.message));
                    dispatch(setUpdateStatus("false"));
                }
            } catch (e) {
                dispatch(setUpdateMessage("Post Fetching Failed"));
                dispatch(setUpdateStatus("false"));
            }

        }
        res();
    }, [])

    //to replace update message if another update is made
    useEffect(() => {
        if (updateMessage) {
            const timer = setTimeout(() => {
                dispatch(setUpdateMessage(null));
                dispatch(setUpdateStatus(null));
            }, messageTime * 1000);
            return () => clearTimeout(timer);
        }
    }, [updateMessage])

    //keep updating the form data
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    }
    console.log(formData)

    //if user is admin, set isAdmin to true
    if (currentUser.isAdmin) {
        formData.isAdmin = true;
    }

    //function to get first word of a string
    const firstWord = (str) => {
        let resStr = "";
        for (let c = 0; c < str.length; c++) {
            if (str[c] == " ") {
                return resStr;
            }
            resStr += str[c];
        }
    }

    //function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(setUpdateMessage("Creating Post..."));
            dispatch(setUpdateStatus("noChange"));
            const res = await fetch('/api/post/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                dispatch(setUpdateMessage("Post Created Successfully"));
                dispatch(setUpdateStatus("true"));
                navigate(`/post/${data.slug}`)
            }
            else {
                if (firstWord(data.message) === "E11000") {
                    dispatch(setUpdateMessage("Title Already Exists"));
                    dispatch(setUpdateStatus("false"));
                }
                else {
                    dispatch(setUpdateMessage(data.message));
                    dispatch(setUpdateStatus("false"));
                }
            }
        } catch (e) {
            dispatch(setUpdateMessage("Post Creation Failed"));
            dispatch(setUpdateStatus("false"));
        }
    }

    //function to handle image upload
    const handleUpload = async (e) => {
        if (!imageFile) {
            dispatch(setUpdateMessage('Please select an image'));
            dispatch(setUpdateStatus('false'));
            return;
        }
        // console.log(imageFile)
        dispatch(setUpdateMessage('Uploading Image...'));
        dispatch(setUpdateStatus('noChange'));
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadingProgress(progress.toFixed(0));
                dispatch(setUpdateMessage("Image Uplading"));
                dispatch(setUpdateStatus("noChange"))
                dispatch(setMessageTime(100))
            },
            (error) => {
                setImageFileUploadingError("Not Uploaded : Upload (jpg, jpeg, png) image.")
                setImageFile(null)
                setImageFileUrl(null)
                dispatch(setUpdateMessage("Image Update Failed"));
                dispatch(setUpdateStatus("false"))
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    // console.log('File available at', downloadURL);
                    setImageFileUrl(downloadURL);
                    setFormData({ ...formData, profilePicture: downloadURL })
                    setImageFileUploadingProgress(false);
                    dispatch(setUpdateMessage("Image Update Successfully"));
                    dispatch(setUpdateStatus("true"))
                });
            }
        )

    }

    return (
        <div className='flex'>
            <div className='min-h-screen text-3xl mx-auto p-3 min-w-[50vw]'>
                {/* //Content */}
                <h1 className='mx-auto text-center my-7 font-semibold text-3xl'>Create Post</h1>
                <form onSubmit={handleSubmit}>
                    <div className='flex gap-5'>
                        <TextInput
                            label='Title'
                            id='title'
                            required
                            onChange={handleChange}
                            className='flex-auto'
                            defaultValue={formData.title}
                        />
                        <Select id='category' value={formData.category} onChange={handleChange} className='flex-2'>
                            <option value={'uncategorized'}>Select A Category </option>
                            <option value={'javascript'}>Javascript </option>
                            <option value={'reactjs'}>React Js </option>
                            <option value={'nextjs'}>Next Js </option>
                            <option value={'nextjs'}>Python</option>
                        </Select>
                    </div>
                    <div className='flex items-center justify-between mt-4 border-teal-500 border-dotted border-4  max-h-[10vh] p-[2rem] gap-5'>
                        <FileInput onChange={(e) => { setImageFile(e.target.files[0]) }} />
                        {
                            ImageFileUploadingProgress ?
                                <CircularProgressbar value={ImageFileUploadingProgress || 0} text={`${ImageFileUploadingProgress}%`}
                                    strokeWidth={5}
                                    styles={{
                                        root: {
                                            width: '3em',
                                            height: '3em',
                                            position: 'relative',
                                            right: '2rem',
                                            zIndex: '1'
                                        },
                                        path: {
                                            stroke: `rgba(62, 231, 153)`,
                                        }
                                    }}
                                />
                                :
                                <Button type='button' outline gradientDuoTone={'purpleToBlue'} size={'sm'} onClick={handleUpload}>Upload Image</Button>
                        }
                    </div>
                    <div className='flex'>
                        {
                            !imageFileUrl ?
                                <img src={formData.photo} alt="image" className='w-72 h-72 mx-auto mt-4 object-cover' />
                                :
                                <img src={formData.profilePicture} alt="image" className='w-72 h-72 mx-auto mt-4 object-cover' />
                        }
                    </div>
                    <ReactQuill theme="snow" className='h-72 mt-4' value={formData.content} onChange={(value) => {
                        setFormData({ ...formData, content: value })
                    }} />
                    <Button
                        type='submit'
                        gradientDuoTone={'greenToBlue'}
                        className='mx-auto mt-20 min-w-full'
                        size={'lg'}
                        disabled={ImageFileUploadingProgress}
                    >
                        {ImageFileUploadingProgress ?
                            <Spinner />
                            :
                            "Update Post"
                        }
                    </Button>
                </form>

                {/* //Alerts */}
                <div>
                    {
                        updateStatus === "true" ?
                            <Alert withBorderAccent
                                icon={HiEye}
                                color='green'
                                className='mt-4 right-4 top-20 absolute animate-SlideIn text-[16px]'>
                                {updateMessage}
                            </Alert>
                            :
                            null
                    }

                    {
                        updateStatus === "false" &&
                        <Alert withBorderAccent
                            icon={HiInformationCircle}
                            color='red'
                            className='mt-4 right-4 top-20 absolute animate-SlideIn text-[16px]'
                            size={'sm'}>
                            {updateMessage}
                        </Alert>

                    }

                    {
                        updateStatus === "noChange" ?
                            <Alert withBorderAccent
                                icon={HiInformationCircle}
                                color='yellow'
                                className='mt-4 right-4 top-20 absolute animate-SlideIn text-[16px]'>
                                {updateMessage}
                            </Alert>
                            :
                            null
                    }
                </div>
            </div>
        </div>
    )

}

export default CreatePost
