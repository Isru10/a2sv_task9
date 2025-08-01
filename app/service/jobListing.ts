import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';


/* eslint-disable @typescript-eslint/no-explicit-any */


export type Job = {
  id: string;
  title: string;
  orgName: string;
  location: string[];
  description: string;
  logoUrl: string;
  categories: string[];
  responsibilities: string;
  idealCandidate: string;
  whenAndWhere: string;
  datePosted: string;
  deadline: string;
  startDate: string;
  endDate: string;
  requiredSkills: string[];
  isBookmarked: boolean; 
  
  opType: string; 
  

};

type JobsApiResponse = {
  success: boolean;
  message: string;
  data: Job[];
  count: number;
};

type JobApiResponse = {
  success: boolean;
  message: string;
  data: Job;
};


type RawBookmark = {
  eventID: string;
  opType: string; 
  

  title: string;
  orgName: string;
  location: string; 
  
  logoUrl: string;

  [key: string]: any; 
  
};
type BookmarksApiResponse = {
  success: boolean;
  message: string;
  data: RawBookmark[];
  count: number;
};

export const jobApi = createApi({
  reducerPath: 'jobApi',

  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://akil-backend.onrender.com/',
    prepareHeaders: (headers, { getState }) => {

      const token = (getState() as RootState).auth.session?.user?.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  
  tagTypes: ['Jobs', 'Job','Bookmarks'],
  
  endpoints: (builder) => ({
    getJobs: builder.query<Job[], void>({
      query: () => 'opportunities/search',
      transformResponse: (response: JobsApiResponse) => response.data,
  
      
      providesTags: (result) => 
        result 
          ? [...result.map(({ id }) => ({ type: 'Jobs' as const, id })), { type: 'Jobs', id: 'LIST' }]
          : [{ type: 'Jobs', id: 'LIST' }],
    }),
    
    getJobById: builder.query<Job, string>({
      query: (id) => `opportunities/${id}`,
      transformResponse: (response: JobApiResponse) => response.data,
      providesTags: (result, error, id) => [{ type: 'Job', id }],
    }),

    
    addBookmark: builder.mutation<void, string>({
      query: (eventId) => ({
        url: `/bookmarks/${eventId}`,
        method: 'POST',
      }),

      invalidatesTags: [{ type: 'Jobs', id: 'LIST' }, { type: 'Bookmarks', id: 'LIST' }],
    }),

    removeBookmark: builder.mutation<void, string>({
      query: (eventId) => ({
        url: `/bookmarks/${eventId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Jobs', id: 'LIST' }, { type: 'Bookmarks', id: 'LIST' }],
    }),

      
    
    getBookmarks: builder.query<Job[], void>({
      query: () => 'bookmarks',
      

      transformResponse: (response: BookmarksApiResponse) => {
        if (!response || !Array.isArray(response.data)) {
          return [];
        }
        
        
        
        return response.data.map(item => {
        
          
          const locationArray = typeof item.location === 'string' 
            ? item.location.split(',').map(loc => loc.trim()) 
            : [];
            
          
            
          return {
            id: item.eventID,
            opType: item.opType || 'virtual',
            
            title: item.title || '',
            orgName: item.orgName || 'N/A',
            location: locationArray, 
            
            description: item.description || 'No description available.', 
            
            logoUrl: item.logoUrl || '',
            categories: item.categories || [],
            responsibilities: item.responsibilities || '',
            idealCandidate: item.idealCandidate || '',
            whenAndWhere: item.whenAndWhere || '',
            datePosted: item.datePosted || '',
            deadline: item.deadline || '',
            startDate: item.startDate || '',
            endDate: item.endDate || '',
            requiredSkills: item.requiredSkills || [],
            isBookmarked: true, 
            
          };
        });
      },
      providesTags: (result) => 
        result
          ? [...result.map(({ id }) => ({ type: 'Bookmarks' as const, id })), { type: 'Bookmarks', id: 'LIST' }]
          : [{ type: 'Bookmarks', id: 'LIST' }],
    }),


  }),
});



export const { 
  useGetJobsQuery, 
  useGetJobByIdQuery,
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
  useGetBookmarksQuery
} = jobApi;