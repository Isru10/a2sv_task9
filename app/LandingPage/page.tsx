'use client';

import React, { useState, useEffect } from 'react'; 
import Image from 'next/image';
import Link from 'next/link';
import SingleCard from '@/app/components/SingleCard';
import Header from '@/app/components/Header';
import { useGetJobsQuery } from '@/app/service/jobListing';
import { FaChevronDown } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  

  const [searchTerm, setSearchTerm] = useState('');


  
  const { 
    data: jobs, 
    isLoading: isLoadingJobs,
    isSuccess, 
    isError,   
    error      
  } = useGetJobsQuery();
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Verifying your session...</p>
      </div>
    );
  }
  

  const filteredJobs = isSuccess && jobs 
    ? jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) 
    : [];

  const tagColors = ['teal', 'yellow', 'indigo', 'rose', 'sky'];

  let content;
  if (isLoadingJobs) {
    content = <div className="text-center text-gray-500">Loading opportunities...</div>;
  } else if (isSuccess && jobs) {

    if (filteredJobs.length > 0) {
      content = filteredJobs.map((job) => {
        const formattedTags = job.categories.slice(0, 2).map((category, index) => ({
          label: category,
          type: (index === 0 ? 'filled' : 'outlined') as 'filled' | 'outlined',
          color: tagColors[index % tagColors.length],
        }));
        
        return (
          <Link href={`/SinglePage/${job.id}`} key={job.id}>
            <SingleCard
              jobId={job.id}
              isBookmarked={job.isBookmarked}
              title={job.title}
              company={job.orgName}
              location={job.location.join(', ')}
              description={job.description}
              logo={<Image src={job.logoUrl || '/vercel.svg'} alt={`${job.orgName} logo`} width={40} height={40} className="object-contain w-8 h-8"/>}
              tags={formattedTags}
            />
          </Link>
        );
      });
    } else {
      content = <div className="text-center text-gray-500 py-10">No opportunities match your search.</div>
    }
  } else if (isError) {
    console.error(error);
    content = <div className="text-center text-red-500">Failed to load opportunities. Please try again later.</div>;
  }

  // Only render if authenticated
  if (status === 'authenticated') {
    return (
      <div className="bg-gray-50 min-h-screen font-sans">
        <Header />
        <div className="container mx-auto max-w-5xl px-4 py-12">
          <header className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Opportunities</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {isSuccess && jobs ? `Showing ${filteredJobs.length} of ${jobs.length} results` : '...'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Sort by:</span>
                <button className="flex items-center gap-1 font-semibold text-gray-800">Most relevant <FaChevronDown /></button>
              </div>
            </div>
          </header>

          {/* 4. Add the Search Input and connect it to local state */}
          <div className="mb-8">
            <input 
              type="text"
              placeholder="Search by job title..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <main className="flex flex-col gap-6">
            {content}
          </main>
        </div>
      </div>
    );
  }

  return null;
}