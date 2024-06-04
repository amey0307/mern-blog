import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase.js'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice.js'
import { useNavigate } from 'react-router-dom'

function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({prompt: 'select_account'})
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            });
            const data = await res.json();
            console.log(data);
            
            if(res.ok){
                dispatch(signInSuccess(data));
                navigate('/');
            }
            
        } catch (error) {
            console.log('could not login with google', error);
        }
    };

    return (
        <Button
            outline gradientDuoTone={'pinkToOrange'}
            type='button'
            onClick={handleGoogleClick}
            className='min-w-full mt-4 flex items-center'
        >
            <div className='flex items-center'>
                <AiFillGoogleCircle className='w-6 h-6 mr-2' />
                Sign In With Goole
            </div>
        </Button>
    )
}

export default OAuth
