import React from 'react'
import badgeWhite from '../assets/badge-white.svg'
import badgeBlack from '../assets/badge-black.svg'
import { useSelector } from 'react-redux'

function About() {
  const { theme } = useSelector(state => state.theme)
  const { currentUser } = useSelector(state => state.user)
  return (
    <div className='min-h-screen p-4 md:text-[56px] sm:text-[48px] overflow-hidden'>
      <div>
        <div className='flex gap-2 mt-4'>
          {
            theme === 'dark' ?
              <img src={badgeWhite} alt='badge' className='md:w-16 md:h-16 sm:w-12 sm:h-12 relative bottom-4' />
              :
              <img src={badgeBlack} alt='badge' className='md:w-20 md:h-20 sm:w-12 sm:h-12 relative bottom-5' />
          }
          <h1 className='md:text-[56px] sm:text-xl '>Hello <span className='dark:text-yellow-300 text-yellow-500 bg-[#fffc9f] dark:bg-[#c9f8a829] rounded-xl px-2' hidden={!currentUser?.username}>{currentUser?.username}</span></h1>
        </div>
        <div className='p-4'>
          <p className='text-xl'>
            <span className='font-bold'>About Me</span><br />
            Hello! I'm Amey Tripathi, the voice behind this blog. Welcome to my corner of the internet where I share my thoughts, experiences, and passions with you.
            <br />
            <br />
            <span className='font-bold'>My Journey</span><br />

            From a young age, I've always been curious and eager to learn. This curiosity has driven me to explore various fields, gather a wealth of knowledge, and now, share it with the world. My journey has been filled with challenges and triumphs, each teaching me valuable lessons that I aim to pass on to my readers.

            <br />
            <br />
            <span className='font-bold'>What You'll Find Here</span><br />

            This blog is a reflection of my diverse interests and experiences. Here, you'll find a variety of topics that I am passionate about:

            - Technology and Innovation: As a tech enthusiast, I love exploring the latest advancements in technology and how they shape our world. <br />
            - Personal Development: Sharing tips and insights on how to grow and improve oneself, both personally and professionally. <br />
            - Lifestyle and Wellness: Discussing topics that help us lead a balanced and fulfilling life. <br />
            - Travel and Adventure: Narrating my travel experiences and adventures, hoping to inspire others to explore the world.

            <br />
            <br />
            <span className='font-bold'>My Mission</span><br />

            My mission with this blog is to create a space where knowledge, inspiration, and meaningful conversations can thrive. I believe that through sharing our experiences and insights, we can all learn and grow together.

            <br />
            <br />
            <span className='font-bold'>Get In Touch</span><br />

            I love connecting with my readers! Whether you have a question, a suggestion, or just want to say hello, feel free to reach out. You can contact me through email/social media links.

            Thank you for visiting, and I hope you find something here that resonates with you. Happy reading!

            ---

            Feel free to personalize this content further to better fit your style and the specific themes of your blog.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About