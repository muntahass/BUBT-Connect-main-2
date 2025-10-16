// Feed.jsx (Option A)
import React, { useEffect, useState } from 'react'
import { dummyPostsData } from '../assets/assets'
import Loading from '../components/Loading'
import StoriesBar from '../components/StoriesBar'
import PostCard from '../components/PostCard'
import RecentsMessages from '../components/RecentsMessages'

const Feed = () => {
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchFeeds = async () => {
    setFeeds(dummyPostsData)
    setLoading(false)
  }

  useEffect(() => {
    fetchFeeds()
  }, [])

  return !loading ? (
    // removed `no-scrollbar` here
    <div className='h-full overflow-x-auto overflow-y-auto py-10 xl:pr-5 flex items-start justify-center xl:gap-8 min-w-max'>
      {/* Left: Feed Section */}
      <div>
        <StoriesBar />
        <div className='p-4 space-y-6'>
          {feeds.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className='max-xl:hidden sticky top-0'>
        {/* Event card */}
        <div className='max-w-xs bg-white text-xs p-4 rounded-2xl flex flex-col items-center gap-3 shadow-lg border-2 border-indigo-400 hover:shadow-indigo-300 transition-all duration-300'>
          <h2 className='text-slate-800 font-bold text-base mb-2'>🎉 Upcoming Event</h2>

          <img
            src="https://shorturl.at/bvkq4"
            className='w-full h-40 object-cover rounded-lg border border-indigo-300'
            alt="Event Banner"
          />

          <p className='text-slate-600 font-bold text-center'>
            Don’t miss out! Register before seats run out.
          </p>

          <a
            href="https://forms.gle/YOUR_GOOGLE_FORM_ID"
            target="_blank"
            rel="noopener noreferrer"
            className='mt-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-all duration-300'
          >
            Join<br />Now
          </a>
        </div>

        <RecentsMessages />
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default Feed
