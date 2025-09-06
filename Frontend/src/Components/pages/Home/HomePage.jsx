import React, { useContext, useEffect, useState } from 'react';
import Hero from "./Home Components/Hero.jsx";
import FeaturedJobs from "./Home Components/featuredJobs.jsx";
import JobCategories from "./Home Components/jobCategories.jsx";
import Testimonials from "./Home Components/Testimonials.jsx";
import { Context } from "../../../Context/context.jsx";

const HomePage = () => {
  const { Jobs } = useContext(Context);
  const { allJob } = Jobs;
  const [jobs, setJobs] =useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleJobs = async () => {
      try {
        const data = await allJob();
        setJobs(data.data || []); 
      } catch (error) {
        console.log("error during get all jobs", error.message);
      } finally {
        setLoading(false);
      }
    };

    handleJobs();
  }, [allJob]);

  return (
    <div className='min-h-screen'>
      <Hero jobs={jobs} loading={loading} />
      <FeaturedJobs jobs={jobs} loading={loading} />
      <JobCategories />
      <Testimonials />
    </div>
  );
};

export default HomePage;