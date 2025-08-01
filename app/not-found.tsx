import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-6xl font-bold text-gray-800 mb-2">404</h2>
        <p className="text-xl font-semibold text-gray-700 mb-4">Page Not Found</p>
        <p className="text-gray-500 mb-8">
          Couldn’t find the page.
        </p>
        <Link href="/LandingPage" className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors">
            Go Back to Opportunities
        </Link>
      </div>
    </div>
  );
}