import { Alert, Button, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import ProfilePhoto from './ProfilePhoto';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';
import { HiEye, HiInformationCircle } from "react-icons/hi";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useDispatch } from 'react-redux';
import { updateFailure, updateStart, updateSuccess, setUpdateMessage, setUpdateStatus } from '../redux/user/userSlice.js';

function DashProfile() {
  const { currentUser, updateMessage, updateStatus} = useSelector(state => state.user);
  const { theme } = useSelector(state => state.theme);
  const dispatch = useDispatch();

  const [ImageFileUploadingProgress, setImageFileUploadingProgress] = useState(null);
  const [imageFileUploadingError, setImageFileUploadingError] = useState(null);

  const filePickerRef = useRef(null);

  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);

  const hangleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // setImageFileUrl(URL.createObjectURL(file));
    }
  }

  
  // console.log(imageFile, imageFileUrl)
  // console.log(currentUser.profilePicture)
  // console.log(ImageFileUploadingProgress, imageFileUploadingError)
  
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
        }, 5000);
        return () => clearTimeout(timer);
      }
    }, [updateMessage])



  //keep track of when image is uploaded and update the profile picture in the firebase
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile])

  const uploadImage = async () => {
    console.log("Uploading image")
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadingError("Not Uploaded : Upload (jpg, jpeg, png) image.")
        setImageFile(null)
        setImageFileUrl(null)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          setImageFileUrl(downloadURL);
          setFormData({...formData, profilePicture: downloadURL})
        });
      }
    )
  }

  const [formData, setFormData] = useState({});
  const [passMatch, setPassMatch] = useState(true);

  const handleFormChange = (e) => {
    setFormData({...formData, [e.target.id] : e.target.value.trim()})
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      dispatch(setUpdateStatus("noChange"));
      dispatch(setUpdateMessage("No changes made"));
      console.log('No changes made');
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        dispatch(setUpdateStatus("false"));
        dispatch(setUpdateMessage(`Error : ${data.message}`)); 
        dispatch(updateFailure(data.message));
      } else {
        dispatch(updateSuccess(data));
        dispatch(setUpdateStatus("true"));
        dispatch(setUpdateMessage("User Updated Successfully"));
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      dispatch(setUpdateStatus("false"));
      dispatch(setUpdateMessage(`Error : ${error.message}`));
    }
  };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-sans font-bold text-2xl'>Profile</h1>
      <form className='flex flex-col relative border-0' onSubmit={handleSubmit} >

        <input type='file' id='profilePicture' className='hidden' accept='image/*' onChange={hangleImageChange} ref={filePickerRef}/>

        {ImageFileUploadingProgress && (
          <CircularProgressbar value={ImageFileUploadingProgress || 0} text={`${ImageFileUploadingProgress}%`}
          strokeWidth={5}
          styles={{
            root: {
              width: '9em',
              height: '9em',
              position: 'absolute',
              top: '-8px',
              right: '172px',
              zIndex: '1'
            },
            path: {
              stroke: `rgba(62, 231, 153, ${ImageFileUploadingProgress / 100})`,
            }
          }}
          />
        )}

        <div className='w-32 h32 self-center cursor-pointer shadow-md rounded-full z-10' onClick={() => {
          filePickerRef.current.click()
        }}>
          <ProfilePhoto imgSrc={
            imageFileUrl ? imageFileUrl : currentUser.profilePicture
          } />
        </div>



        <div className='min-w-full flex flex-col gap-4 mt-4'>
          <TextInput
            type='text'
            id='username'
            placeholder='username'
            defaultValue={currentUser.username}
            onChange={handleFormChange}
          />
          <TextInput
            type='text'
            id='email'
            placeholder='email'
            defaultValue={currentUser.email}
            onChange={handleFormChange}
          />
          <TextInput
            type='password'
            id='password'
            placeholder='old password'
            onChange={handleFormChange}
          />
          <TextInput
            type='newPassword'
            id='newPassword'
            placeholder='new password'
            onChange={handleFormChange}
          />
          <TextInput
            type='rePassword'
            id='rePassword'
            placeholder='new password'
            onChange={handleFormChange}
          />
          <Button gradientDuoTone={'purpleToBlue'} outline type='submit' className='min-w-full'>
            Update Profile
          </Button>
          <div className='flex justify-between px-1'>
            <div className='text-red-600 text-lg cursor-pointer'>Delete Account</div>
            <div className='text-red-600 text-lg cursor-pointer'>Sign Out</div>
          </div>
        </div>

      </form>

      {
        imageFileUploadingError ? 
        <Alert withBorderAccent
        icon={HiInformationCircle} 
        color='red' 
        className='mt-4 absolute right-4 top-20 animate-SlideIn text-md'>
          {imageFileUploadingError}
        </Alert>
        :
        imageFileUrl && 
        <Alert withBorderAccent
        icon={HiEye} 
        color='green' 
        className='mt-4 right-4 top-20 absolute animate-SlideIn text-md'>
          Image Uploaded Successfully
        </Alert>
      }
      {
        !passMatch && 
        <Alert withBorderAccent
        icon={HiInformationCircle} 
        color='red' 
        className='mt-4 absolute right-4 top-20 animate-SlideIn text-md'>
          Password Did Not Matched
        </Alert>
      }
      
      {
        updateMessage==="User Updated Successfully" ?
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
        updateStatus==="true" ?
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
        updateStatus==="false" ?
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
        updateStatus==="noChange" ?
        <Alert withBorderAccent
        icon={HiInformationCircle} 
        color='yellow' 
        className='mt-4 right-4 top-20 absolute animate-SlideIn text-md'>
          {updateMessage}
        </Alert>
        :
        null
      }
      
    </div>
  )
}

export default DashProfile
