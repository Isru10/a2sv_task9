'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useAddBookmarkMutation, useRemoveBookmarkMutation } from '@/app/service/jobListing';
import { HiOutlineBookmark, HiBookmark } from 'react-icons/hi2';


type SingleCardProps = {
  jobId: string;
  isBookmarked: boolean;
  logo: React.ReactNode;
  title: string;
  company: string;
  location: string;
  description: string;
  tags: { label: string; type: 'filled' | 'outlined'; color: string }[];
   opType?: string; 
};

const getTagClasses = (type: 'filled' | 'outlined', color: string) => {
  if (type === 'filled') {
    return `bg-${color}-100 text-${color}-800`;
  }
  return `bg-white text-${color}-700 border border-${color}-400`;
};

const SingleCard = ({ jobId, isBookmarked, logo, title, company, location, description, tags,opType  }: SingleCardProps) => {
  const { data: session, status } = useSession();
  const [addBookmark, { isLoading: isAdding }] = useAddBookmarkMutation();
  const [removeBookmark, { isLoading: isRemoving }] = useRemoveBookmarkMutation();
  
  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status !== 'authenticated') {
      alert('You must be logged in to bookmark jobs.');
      return;
    }

    try {
      if (isBookmarked) {
        await removeBookmark(jobId).unwrap();
      } else {
        await addBookmark(jobId).unwrap();
      }
    } catch (err) {
      console.error('Failed to update bookmark:', err);
      alert('There was an error updating your bookmark.');
    }
  };

  const isLoading = isAdding || isRemoving;

  return (

    
    <div className="bg-white rounded-3xl p-8 shadow-lg w-full relative">
      

      {status === 'authenticated' && (
        <button
          onClick={handleBookmarkToggle}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 z-10"
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          {isBookmarked ? (
            <HiBookmark className="w-6 h-6 text-indigo-600" />
          ) : (
            <HiOutlineBookmark className="w-6 h-6 text-gray-500 hover:text-indigo-600" />
          )}
        </button>
      )}

      
      
      <div className="flex items-center gap-4">
        <div className="bg-yellow-400 rounded-full p-3 flex items-center justify-center flex-shrink-0">
          {logo}
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {title}
          </h2>
          <p className="text-sm text-gray-500">
            {company} • {location}
          </p>
        </div>
      </div>

      <p className="mt-6 text-gray-700 leading-relaxed line-clamp-3">
        {description}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">

        {opType && (
          <span className={`text-sm font-medium px-4 py-1.5 rounded-full ${
            opType.toLowerCase() === 'inperson' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {opType === 'inPerson' ? 'In-Person' : 'Virtual'}
          </span>
        )}



        {tags.map((tag, index) => (
          <React.Fragment key={index}>
            <span className={`text-sm font-medium px-4 py-1.5 rounded-full ${getTagClasses(tag.type, tag.color)}`}>
              {tag.label}
            </span>
            {index === 0 && tags.length > 1 && <div className="w-px h-6 bg-gray-200"></div>}


             <span className={`text-sm font-medium px-4 py-1.5 rounded-full ${getTagClasses(tag.type, tag.color)}`}>
              {tag.label}
            </span>
            {index === 0 && tags.length > 1 && !opType && <div className="w-px h-6 bg-gray-200"></div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SingleCard;