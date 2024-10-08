import React from 'react'
import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../redux/user/themeSlice'
import { useEffect, useState } from 'react';
import { setUpdateMessage, setUpdateStatus, signoutFailure, signoutStart, signoutSuccess } from '../redux/user/userSlice';

function Header() {
    const dispatch = useDispatch();
    const path = useLocation().pathname;
    const { currentUser } = useSelector(state => state.user);
    const { theme } = useSelector(state => state.theme);
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState([]);

    const handleSignOut = async () => {
        try {
            dispatch(signoutStart());
            const res = await fetch('/api/user/signout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await res.json();
            if (res.ok) {
                dispatch(setUpdateMessage("User Signed Out Successfully"));
                dispatch(setUpdateStatus("true"));
                dispatch(signoutSuccess());
                navigate('/sign-in');
            } else {
                dispatch(setUpdateMessage(`Error : ${data.message}`));
                dispatch(setUpdateStatus("false"));
                dispatch(signoutFailure(data.message));
            }
            window.location.reload();
        } catch (error) {
            dispatch(setUpdateMessage(`Error : ${error.message}`));
            dispatch(setUpdateStatus("false"));
            dispatch(signoutFailure(error.message));
        }
    }

    const handleChange = (e) => {
        setSearch(e.target.value);
    }

    useEffect(() => {
        try {
            const fetchPost = async () => {
                const res = await fetch(`/api/post/search?search=${search}`)
                if (res.ok) {
                    const data = await res.json()
                    setShowSearch(data)
                }
            }
            fetchPost();
        } catch (e) {
            console.log(e)
        }
    }, [search])

    return (
        <Navbar className='border-b-2'>
            <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
                <span className='px-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Amey's</span>
                Blog
            </Link>

            <form>
                <TextInput
                    type='text'
                    placeholder='Search'
                    rightIcon={AiOutlineSearch}
                    className='hidden lg:inline'
                    onChange={handleChange}
                />
                {
                    search.length > 0 &&
                    <div className='absolute top-14 left-[30%] z-10 bg-white w-fit border border-gray-200 rounded-lg shadow-lg'>
                        <ul>
                            {showSearch.map((post, index) => (
                                <li key={index} className='p-2 hover:bg-gray-100 w-[20vw] cursor-pointer dark:bg-slate-800'>
                                    <div onClick={() => {
                                        navigate(`/read/${post._id}`)
                                        setSearch('')
                                        { window.location.reload() }
                                    }}>
                                        {window.innerWidth > 768 ? post.title : post.title.slice(0, 20) + '...'}
                                    </div>
                                </li>
                            ))
                            }
                        </ul>
                    </div>
                }
            </form>

            <Button className='w-12 h-10 lg:hidden' color='gray'>
                <AiOutlineSearch />
            </Button>

            <div className='flex gap-2 md:order-2'>
                <Button className='w-12 h-10 hidden sm:inline' color='gray' pill onClick={() => {
                    dispatch(toggleTheme())
                }}>
                    {theme === 'light' ? <FaMoon /> : <FaSun className='text-yellow-400 scale-150' />}
                </Button>

                <div>
                    {
                        currentUser ?
                            (
                                <Dropdown
                                    arrowIcon={false}
                                    inline
                                    label={
                                        <Avatar alt='user' rounded img={currentUser.profilePicture} />
                                    }
                                    className='z-[11]'
                                >
                                    <Dropdown.Header>
                                        <span className='block text-sm'>@{currentUser.username}</span>
                                        <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                                    </Dropdown.Header>
                                    <Link to={'/dashboard?tab=profile'}>
                                        <Dropdown.Item>Profile</Dropdown.Item>
                                    </Link>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
                                </Dropdown>
                            )
                            :
                            (
                                <Link to={'/sign-in'}>
                                    <Button outline gradientDuoTone={'purpleToBlue'}>Sign In</Button>
                                </Link>
                            )
                    }
                </div>
                <Navbar.Toggle />
            </div>

            {/* menu */}
            <Navbar.Collapse>
                <Navbar.Link active={path === '/'} as={'div'} className='text-xl'>
                    <Link to={'/'}>
                        Home
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/about'} as={'div'} className='text-xl'>
                    <Link to={'/about'}>
                        About
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/favorites'} as={'div'} className='text-xl'>
                    <Link to={'/favorites'}>
                        Favorites
                    </Link>
                </Navbar.Link>
            </Navbar.Collapse>

        </Navbar>
    )
}

export default Header

