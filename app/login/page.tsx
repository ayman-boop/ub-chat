'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim() || !email.endsWith('@buffalo.edu')) {
      setMessage({
        text: 'Please enter a valid @buffalo.edu email address',
        type: 'error'
      });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      // This would be replaced with actual Firebase email link authentication
      // For now, just simulating the success case
      setTimeout(() => {
        setMessage({
          text: 'Check your email! We\'ve sent a sign-in link.',
          type: 'success'
        });
        setLoading(false);
      }, 1500);
      
      // Actual Firebase code would be something like:
      // await sendSignInLinkToEmail(auth, email, {
      //   url: window.location.origin + '/auth/confirm',
      //   handleCodeInApp: true,
      // });
      // window.localStorage.setItem('emailForSignIn', email);
      
    } catch (error) {
      console.error('Error sending login link:', error);
      setMessage({
        text: 'Failed to send login link. Please try again.',
        type: 'error'
      });
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ub-blue mb-2">Sign In</h1>
          <p className="text-gray-600">
            Use your UB email to access the chat platform
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          {message && (
            <div 
              className={`mb-4 p-3 rounded ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                UB Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@buffalo.edu"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ub-blue"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-ub-blue hover:bg-blue-700 text-white font-medium py-2 px-4 rounded ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Sending link...' : 'Send Sign-in Link'}
            </button>
          </form>
          
          <p className="mt-4 text-sm text-gray-600">
            We'll email you a secure link to sign in. No password needed.
          </p>
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-ub-blue hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 