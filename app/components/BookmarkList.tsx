'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SingleCard from './SingleCard';
import { Job, useGetBookmarksQuery } from '@/app/service/jobListing';

export default function BookmarkList() {
  const {
    data: bookmarkedJobs,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetBookmarksQuery();

  if (isLoading) {
    return <div className="text-center text-gray-500 py-10">Loading your bookmarks...</div>;
  }

  if (isError) {
    console.error("Error fetching bookmarks:", error);
    return <div className="text-center text-red-500 py-10">Failed to load your bookmarks. Please try again.</div>;
  }
  

  const validJobs = bookmarkedJobs?.filter(job => job && job.id);
  

  
  if (isSuccess && (!validJobs || validJobs.length === 0)) {
    return (
      <div className="text-center text-gray-500 py-10">
        <h3 className="text-xl font-semibold">No Bookmarks Yet</h3>
        <p className="mt-2">You havent bookmarked any opportunities. <Link href="/" className="text-indigo-600 hover:underline">Browse jobs</Link> to find some!</p>
      </div>
    );
  }
  
  return (
    <main className="flex flex-col gap-6">

      {validJobs?.map((job: Job) => {
        const categories = Array.isArray(job.categories) ? job.categories : [];
        const formattedTags = categories.slice(0, 2).map((category, index) => ({
            label: category,
            type: (index === 0 ? 'filled' : 'outlined') as 'filled' | 'outlined',
            color: 'teal',
        }));

        return (

          <Link href={`/SinglePage/${job.id}`} key={job.id}>
            <SingleCard
              jobId={job.id}
              isBookmarked={job.isBookmarked}
              title={job.title}
              company={job.orgName}
              location={Array.isArray(job.location) ? job.location.join(', ') : job.location}
              description={`Posted on: ${new Date(job.datePosted).toLocaleDateString()}`}
              opType={job.opType}
              logo={<Image src={job.logoUrl || '/vercel.svg'} alt={`${job.orgName} logo`} width={40} height={40} className="object-contain w-8 h-8"/>}
              tags={formattedTags}
            />
          </Link>
        );
      })}
    </main>
  );
}