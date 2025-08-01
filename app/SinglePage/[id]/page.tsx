'use client';
import React from 'react';
import { notFound, useParams } from 'next/navigation';
import { useGetJobByIdQuery } from '@/app/service/jobListing';
import { HiOutlineClock, HiOutlineFire, HiOutlineMapPin, HiOutlineCalendar, HiCheckCircle } from 'react-icons/hi2';
const formatDate = (dateString: string) => {
  if (!dateString || dateString.startsWith('0001')) return 'Not specified';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};


export default function SingleJobPage() {

  const params = useParams();
  

  const id = params.id as string;
  const { 
    data: job,
    isLoading,
    isError,
    error 
  } = useGetJobByIdQuery(id, { skip: !id });

  if (isLoading || !id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading job details...</p>
      </div>
    );
  }


  if (isError) {
    console.error('Failed to fetch job:', error);
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-red-600">Failed to load job details.</h2>
            <p className="text-gray-600 mt-2">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return notFound(); 
  }

  const responsibilitiesList = job.responsibilities.split('\n').filter(line => line.trim() !== '');

  
  return (
    <div className="bg-white min-h-screen font-sans p-4 sm:p-6 md:p-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

  
        <main className="md:col-span-2">
          {/* Description */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
            <p className="text-gray-600 leading-relaxed">{job.description}</p>
          </section>

          {/*  Responsibilities   */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Responsibilities</h2>
            <ul className="space-y-3">
              {responsibilitiesList.map((resp, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1"><HiCheckCircle className="w-5 h-5 text-teal-500" /></span>
                  <span className="text-gray-600">{resp}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Ideal Candidate */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ideal Candidate we want</h2>
            <p className="text-gray-600 leading-relaxed">{job.idealCandidate}</p>
          </section>
          
          {/*  When & Where  */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">When & Where</h2>
            <div className="flex items-center gap-3 text-gray-600">
              <HiOutlineMapPin className="w-5 h-5" />
              <span>{job.whenAndWhere}</span>
            </div>
          </section>
        </main>


        <aside className="md:col-span-1">
          <div className="sticky top-12">
            {/*  About  */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4"><HiOutlineClock className="w-5 h-5 text-blue-500 mt-1" /><div><p className="text-sm text-gray-500">Posted On</p><p className="font-semibold text-gray-800">{formatDate(job.datePosted)}</p></div></div>
                <div className="flex items-start gap-4"><HiOutlineFire className="w-5 h-5 text-blue-500 mt-1" /><div><p className="text-sm text-gray-500">Deadline</p><p className="font-semibold text-gray-800">{formatDate(job.deadline)}</p></div></div>
                <div className="flex items-start gap-4"><HiOutlineMapPin className="w-5 h-5 text-blue-500 mt-1" /><div><p className="text-sm text-gray-500">Location</p><p className="font-semibold text-gray-800">{job.location.join(', ')}</p></div></div>
                <div className="flex items-start gap-4"><HiOutlineCalendar className="w-5 h-5 text-blue-500 mt-1" /><div><p className="text-sm text-gray-500">Start Date</p><p className="font-semibold text-gray-800">{formatDate(job.startDate)}</p></div></div>
                <div className="flex items-start gap-4"><HiOutlineCalendar className="w-5 h-5 text-blue-500 mt-1" /><div><p className="text-sm text-gray-500">End Date</p><p className="font-semibold text-gray-800">{formatDate(job.endDate)}</p></div></div>
              </div>
            </section>
            
            {/*  Categories  */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {job.categories.map((cat, index) => (
                   <span key={cat} className={`${index === 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-teal-100 text-teal-800'} text-xs font-medium px-3 py-1 rounded-full`}>{cat}</span>
                ))}
              </div>
            </section>
            
            {/*  Required Skills  */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill) => (
                   <span key={skill} className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1.5 rounded-md">{skill}</span>
                ))}
              </div>
            </section>
          </div>
        </aside>

      </div>
    </div>
  );
}