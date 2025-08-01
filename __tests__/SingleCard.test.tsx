/* eslint-disable @typescript-eslint/no-require-imports */

/* eslint-disable @typescript-eslint/no-explicit-any */





import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SingleCard from '../app/components/SingleCard';


jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

jest.mock('@/app/service/jobListing', () => ({
  useAddBookmarkMutation: jest.fn(() => [jest.fn(), { isLoading: false }]),
  useRemoveBookmarkMutation: jest.fn(() => [jest.fn(), { isLoading: false }]),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));


const mockCardProps = {
  jobId: 'job-123',
  isBookmarked: false,
  title: 'Senior Frontend Developer',
  company: 'Creative Solutions Inc.',
  location: 'Remote, USA',
  description: 'Build amazing user interfaces with React.',
  logo: <img src="/logo.svg" alt="company logo" />,
  tags: [{ label: 'Tech', type: 'filled' as const, color: 'indigo' }],
};

describe('SingleCard Component', () => {
  
  
  beforeEach(() => {
    (require('next-auth/react').useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'loading', 
    });
  });

  // Test 1: Basic Rendering
  test('renders essential job information correctly', () => {
    render(<SingleCard {...mockCardProps} />);
    expect(screen.getByText('Senior Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Creative Solutions Inc. • Remote, USA')).toBeInTheDocument();
    expect(screen.getByText('Build amazing user interfaces with React.')).toBeInTheDocument();
  });

  // Test 2: Unauthenticated State
  test('hides the bookmark button when the user is not authenticated', () => {
    (require('next-auth/react').useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });
    render(<SingleCard {...mockCardProps} />);
    const bookmarkButton = screen.queryByRole('button', { name: /bookmark/i });
    expect(bookmarkButton).not.toBeInTheDocument();
  });

  // Test 3: Authenticated State & Bookmark Icon Toggle
  test('shows the correct bookmark icon for authenticated users', () => {
    (require('next-auth/react').useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'Test User' } },
      status: 'authenticated',
    });

    const { rerender } = render(<SingleCard {...mockCardProps} isBookmarked={false} />);
    expect(screen.getByLabelText('Add bookmark')).toBeInTheDocument();
    expect(screen.queryByLabelText('Remove bookmark')).not.toBeInTheDocument();
    
    rerender(<SingleCard {...mockCardProps} isBookmarked={true} />);
    expect(screen.getByLabelText('Remove bookmark')).toBeInTheDocument();
    expect(screen.queryByLabelText('Add bookmark')).not.toBeInTheDocument();
  });
});