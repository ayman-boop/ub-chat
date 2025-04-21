'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

interface Thread {
  _id: string;
  title: string;
  slug: string;
  category: string;
  courseCode?: string;
  professorName?: string;
  lastActivity: string;
  messageCount: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function BrowsePage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0
  });
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  
  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let url = `/api/threads?page=${page}`;
        
        if (category) {
          url += `&category=${category}`;
        }
        
        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch threads');
        }
        
        const data = await response.json();
        setThreads(data.threads);
        setPagination(data.pagination);
      } catch (err) {
        setError('Error loading threads. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchThreads();
  }, [category, search, page]);
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('search') as string;
    
    router.push(`/browse?search=${encodeURIComponent(searchQuery)}`);
  };
  
  const handleCategoryChange = (newCategory: string) => {
    router.push(`/browse?category=${newCategory}`);
  };
  
  const handlePageChange = (newPage: number) => {
    let url = `/browse?page=${newPage}`;
    
    if (category) {
      url += `&category=${category}`;
    }
    
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    
    router.push(url);
  };
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-ub-blue mb-4 md:mb-0">Browse Discussions</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              name="search"
              placeholder="Search discussions..."
              className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-ub-blue focus:border-transparent"
              defaultValue={search}
            />
            <button 
              type="submit"
              className="bg-ub-blue hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
            >
              Search
            </button>
          </form>
          
          <Link 
            href="/threads/new" 
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md text-center"
          >
            Start New Thread
          </Link>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="text-lg font-medium mb-3">Categories</h2>
            <div className="space-y-2">
              <button 
                onClick={() => handleCategoryChange('')}
                className={`w-full text-left px-3 py-2 rounded ${!category ? 'bg-blue-50 text-ub-blue' : 'hover:bg-gray-100'}`}
              >
                All Discussions
              </button>
              <button 
                onClick={() => handleCategoryChange('professor')}
                className={`w-full text-left px-3 py-2 rounded ${category === 'professor' ? 'bg-blue-50 text-ub-blue' : 'hover:bg-gray-100'}`}
              >
                Professors
              </button>
              <button 
                onClick={() => handleCategoryChange('course')}
                className={`w-full text-left px-3 py-2 rounded ${category === 'course' ? 'bg-blue-50 text-ub-blue' : 'hover:bg-gray-100'}`}
              >
                Courses
              </button>
              <button 
                onClick={() => handleCategoryChange('general')}
                className={`w-full text-left px-3 py-2 rounded ${category === 'general' ? 'bg-blue-50 text-ub-blue' : 'hover:bg-gray-100'}`}
              >
                General
              </button>
            </div>
          </div>
        </div>
        
        <div className="md:w-3/4">
          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">Loading threads...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          ) : threads.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">No threads found. Be the first to start a discussion!</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="divide-y">
                  {threads.map((thread) => (
                    <Link href={`/threads/${thread.slug}`} key={thread._id}>
                      <div className="p-4 hover:bg-gray-50 cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                              {thread.title}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium capitalize">
                                {thread.category}
                              </span>
                              {thread.courseCode && (
                                <span className="px-2 py-1 bg-blue-50 text-ub-blue rounded text-xs font-medium">
                                  {thread.courseCode}
                                </span>
                              )}
                              {thread.professorName && (
                                <span className="text-gray-600">Prof. {thread.professorName}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end text-sm text-gray-500">
                            <span>{thread.messageCount} messages</span>
                            <span>Last active: {new Date(thread.lastActivity).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              
              {pagination.pages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className={`px-3 py-1 rounded ${
                        pagination.page === 1 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-ub-blue hover:bg-blue-50'
                      }`}
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded ${
                          pageNum === pagination.page 
                            ? 'bg-ub-blue text-white' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className={`px-3 py-1 rounded ${
                        pagination.page === pagination.pages 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-ub-blue hover:bg-blue-50'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 