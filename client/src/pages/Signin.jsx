import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice';
import GoogleButton from 'react-google-button'
import OAuth from '../components/OAuth';

function SignIn() {
  const [formData, setFormData] = useState({});

  // const [loading, setLoading] = useState(false);
  // const [errorMessage, setErrorMessage] = useState(null);

  const { loading, error: errorMessage } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
  }
  console.log(formData)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      dispatch(signInFailure("Fill All the Field"))
    }

    try {
      // setLoading(true)
      dispatch(signInStart());

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);

      if (data.success === false) {
        // return setErrorMessage(data.message)
        dispatch(signInFailure(data.message));
      }


      if (res.ok) {
        dispatch(signInSuccess(data))
        navigate("/Home");
      }

    } catch (err) {
      console.log(err);
      // setLoading(false)
      dispatch(signInFailure(err))
    }
  }

  const firstWord = (str) => {
    let resStr = "";
    for (let c = 0; c < str.length; c++) {
      if (str[c] == " ") {
        return resStr;
      }
      resStr += str[c];
    }
  }

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex flex-wrap p-3 gap-5 max-w-4xl mx-auto flex-col md:flex-row md:items-center overflow-y-hidden'>
        {/* left */}
        <div className='flex-1'>
          <Link to='/' className='self-center whitespace-nowrap text-4xl sm:text-4xl font-semibold dark:text-white'>
            <span className='px-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Amey's</span>
            Blog
          </Link>
          <p className='mt-3'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti provident, quidem, eaque ullam vitae possimus hic eveniet quo
          </p>
        </div>

        {/* right */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your Email' />
              <TextInput
                type='email'
                placeholder='email'
                id='email'
                className='mb-3 focus-within:scale-105 transition-all'
                onChange={handleChange}
              />

              <Label value='Your Password' />
              <TextInput
                type='password'
                placeholder='password'
                id='password'
                className='mb-3 focus-within:scale-105 transition-all'
                onChange={handleChange}
              />

              <Button
                gradientDuoTone={'purpleToPink'}
                className='mt-5 min-w-full'
                type='submit'
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size={'sm'} />
                    <span className='pl-3'>Loading...</span>
                  </>
                ) : 'Sign In'
                }
              </Button>

              <OAuth />
                
            </div>
          </form>

          <div className='flex gap-2 text-sm mt-5'>
            <span>Dont Have an Account?</span>
            <Link to={'/sign-up'} className='text-blue-500'>Sign Up</Link>
          </div>

          {
            errorMessage &&
            (
              <Alert className='mt-5' color={'failure'}>
                {(errorMessage)}
              </Alert>
            )
          }

        </div>
      </div>
    </div>
  )
}

export default SignIn
