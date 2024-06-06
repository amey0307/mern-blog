import { Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {useSelector} from 'react-redux';

function CreatePost() {
    const [formData, setFormData] = useState({})
    const {currentUser} = useSelector(state => state.user);
    //document.querySelector('.ql-editor').textContent;
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    }
    console.log(formData)

    if(currentUser.isAdmin){
        formData.isAdmin = true;
    }
    
    const handleSubmit = async (e) => {
        const res = await fetch('/api/post/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await res.json();
        console.log(data)
    }
    
  return (
    <div className='min-h-screen text-3xl mx-auto p-3 max-w-3xl'>
        <h1 className='mx-auto text-center my-7 font-semibold text-3xl'>Create Post</h1>
        <form onSubmit={handleSubmit} onChange={handleChange}>
            <div className='flex gap-5 flex-col'>
                <TextInput 
                label='Title' 
                placeholder='Enter Title' 
                id='title'
                required
                />
            <Select id='category'>
                <option value={'uncategorized'}>Select A Category </option>
                <option value={'javascript'}>Javascript </option>
                <option value={'reactjs'}>React Js </option>    
                <option value={'nextjs'}>Next Js </option>
            </Select>
            </div>
            <div className='flex items-center justify-between mt-4 border-teal-500 border-dotted border-4 p-3'>
                <FileInput id='image' />
                <Button type='button' outline gradientDuoTone={'purpleToBlue'} size={'sm'}>Upload Image</Button>
            </div>
            <ReactQuill theme="snow" className='h-72' placeholder='Write Something...'/>
            <Button
            type='submit'
            gradientDuoTone={'greenToBlue'}
            className='mx-auto mt-20 min-w-full'
            size={'lg'}
            >
                Create Post
            </Button> 
        </form>
    </div>
  )
}

export default CreatePost
