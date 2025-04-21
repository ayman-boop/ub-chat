'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewThreadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [courseCode, setCourseCode] = useState('');
  const [professorName, setProfessorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    // Additional validation for course threads
    if (category === 'course' && !courseCode.trim()) {
      setError('Course code is required for course discussions');
      return;
    }
    
    // Additional validation for professor threads
    if (category === 'professor' && !professorName.trim()) {
      setError('Professor name is required for professor discussions');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call to create a thread
      // For now, let's just simulate success after a delay
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a slug from the title
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-')
        .substring(0, 60) + '-' + Date.now().toString().substring(9);
      
      // Redirect to the new thread
      router.push(`/threads/${slug}`);
      
    } catch (err) {
      console.error('Error creating thread:', err);
      setError('Failed to create thread. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-4">
        <Link href="/browse" className="text-ub-blue hover:underline flex items-center">
          ← Back to Browse
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Start a New Thread</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ub-blue"
              required
            >
              <option value="general">General Discussion</option>
              <option value="course">Course Discussion</option>
              <option value="professor">Professor Discussion</option>
            </select>
          </div>
          
          {category === 'course' && (
            <div className="mb-4">
              <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700 mb-1">
                Course Code
              </label>
              <input
                type="text"
                id="courseCode"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="e.g., CS 101"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ub-blue"
                required
              />
            </div>
          )}
          
          {category === 'professor' && (
            <div className="mb-4">
              <label htmlFor="professorName" className="block text-sm font-medium text-gray-700 mb-1">
                Professor Name
              </label>
              <input
                type="text"
                id="professorName"
                value={professorName}
                onChange={(e) => setProfessorName(e.target.value)}
                placeholder="e.g., Smith"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ub-blue"
                required
              />
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Thread Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your thread a descriptive title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ub-blue"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide some context about what you want to discuss"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ub-blue min-h-[120px]"
            />
          </div>
          
          <div className="flex justify-end">
            <Link 
              href="/browse"
              className="mr-3 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`bg-ub-blue hover:bg-blue-700 text-white font-medium py-2 px-4 rounded ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating...' : 'Create Thread'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 