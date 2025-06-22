import React from 'react'
import Hero from "./Home Components/Hero.jsx"
import FeaturedJobs from "./Home Components/featuredJobs.jsx"
import JobCategories from "./Home Components/jobCategories.jsx"
import Testimonials from "./Home Components/Testimonials.jsx"

const HomePage = () => {
  return (
    <div className='min-h-screen'>
      <Hero/>
      <FeaturedJobs/>
      <JobCategories />
      <Testimonials />
    </div>
  )
}

export default HomePage
