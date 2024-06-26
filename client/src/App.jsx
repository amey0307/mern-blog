import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import SignIn from './pages/Signin.jsx'
import SignUp from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Header from './components/Header.jsx'
import FooterCom from './components/FooterCom.jsx'
import PrivateRouter from './components/PrivateRouter.jsx'
import CreatePost from './pages/CreatePost.jsx'
import Favorite from './pages/Favorite.jsx'
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute.jsx'
import PostUpdate from './pages/PostUpdate.jsx'
import ManageUsers from './components/ManageUsers.jsx'
import ReadPost from './components/ReadPost.jsx'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route element={<PrivateRouter />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route path='/favorites' element={<Favorite />} />
        <Route path='/read/:postId' element={<ReadPost />} />
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/dashboard/editpost/:id' element={<PostUpdate />} />
          <Route path='/manage-users' element={<ManageUsers />} />
        </Route>
      </Routes>
      <FooterCom />
    </BrowserRouter>
  )
}

export default App