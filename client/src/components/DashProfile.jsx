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
import { updateFailure, updateStart, updateSuccess, setUpdateMessage, setUpdateStatus, deleteUserFailure, deleteUserStart, deleteUserSuccess, setMessageTime, signInFailure } from '../redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';
import PopUp from './PopUp.jsx';

function DashProfile() {
  const { currentUser, updateMessage, updateStatus, loading, messageTime } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ImageFileUploadingProgress, setImageFileUploadingProgress] = useState(null);
  const [imageFileUploadingError, setImageFileUploadingError] = useState(null);
  const filePickerRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({});
  const [passMatch, setPassMatch] = useState(true);

  const hangleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // setImageFileUrl(URL.createObjectURL(file));
    }
  }

  //To remove the update message when the component is mounted
  useEffect(() => {
    dispatch(setUpdateMessage(null));
    dispatch(setUpdateStatus(null));
    dispatch(signInFailure(null))
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

  //keep track of when image is uploaded and update the profile picture in the firebase
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile])

  //Upload image to firebase
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
          console.log('File available at', downloadURL);
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL })
          setImageFileUploadingProgress(false);
          dispatch(setUpdateMessage("Image Update Successfully"));
          dispatch(setUpdateStatus("true"))
        });
      }
    )
  }

  //Keep track of the data in the form
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
  }

  //Update the user data
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

  //Delete the user
  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        dispatch(deleteUserSuccess());
        dispatch(setUpdateMessage("User Deleted Successfully"));
        dispatch(setUpdateStatus("true"));
        navigate('/sign-in');
      } else {
        dispatch(setUpdateMessage(`Error : ${data.message}`));
        dispatch(setUpdateStatus("false"));
        dispatch(updateFailure(data.message));
        dispatch(deleteUserFailure(data.message));
      }
    } catch (error) {
      dispatch(setUpdateMessage(`Error : ${error.message}`));
      dispatch(setUpdateStatus("false"));
      dispatch(deleteUserFailure(error.message));
    }
  }

  //handle the "create a post" button click if the user is an "admin
  const handleProfile = () => {
    navigate('/create-post')
  }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-sans font-bold text-2xl'>Profile</h1>
      {/* Form Content`` */}
      <form className='flex flex-col relative border-0' onSubmit={handleSubmit} >

        <input type='file' id='profilePicture' className='hidden' accept='image/*' onChange={hangleImageChange} ref={filePickerRef} />

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
                stroke: `rgba(62, 231, 153)`,
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

        {/* Form Fields */}
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
            readOnly
            disabled
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
          <Button gradientDuoTone={'purpleToBlue'} outline type='submit' className='min-w-full' disabled={loading || ImageFileUploadingProgress}>
            {loading ? (
              'Loading...'
            ) : 'Update Profile'}
          </Button>

          {
            currentUser.isAdmin &&
            <Button gradientDuoTone={'greenToBlue'} outline className='min-w-full' disabled={loading || ImageFileUploadingProgress} onClick={handleProfile}>
              Create A Post
            </Button>
          }


          <div className='text-black text-lg cursor-pointer' >
            <Button gradientMonochrome="failure" type='button' outline className='min-w-full rounded hover:opacity-80 transition-all' onClick={() => {
              setShowPopup(true)
            }}>
              Delete Account
            </Button>
          </div>
          {showPopup && <PopUp handleDelete={handleDelete} setShowPopup={setShowPopup} />}
        </div>
      </form>

      {/* Conditional Alerts */}
      <div>
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
          updateMessage === "User Updated Successfully" ?
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
      </div>
    </div>
  )
}

export default DashProfile
