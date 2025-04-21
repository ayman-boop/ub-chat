import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-ub-blue mb-4">UB Chat</h1>
          <p className="text-lg text-gray-600">
            Anonymous discussions for University at Buffalo students
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="mb-6 text-gray-700">
            Join the conversation about professors, courses, and campus life - 
            anonymously and securely.
          </p>
          
          <div className="flex flex-col space-y-4">
            <Link 
              href="/login" 
              className="bg-ub-blue hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-center"
            >
              Sign in with UB Email
            </Link>
            
            <Link
              href="/browse"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded text-center"
            >
              Browse Discussions
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>For UB students only. All content is anonymous.</p>
        </div>
      </div>
    </div>
  );
} 