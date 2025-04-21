'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Thread {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  category: string;
  courseCode?: string;
  professorName?: string;
  created: string;
  lastActivity: string;
  messageCount: number;
}

interface Reply {
  _id: string;
  authorHandle: string;
  content: string;
  created: string;
}

interface Message {
  _id: string;
  authorHandle: string;
  content: string;
  created: string;
  edited?: string;
  reactions?: {
    up: number;
    down: number;
  };
  replies?: Reply[];
  repliesCount?: number;
}

export default function ThreadPage() {
  const [thread, setThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  
  const params = useParams();
  const slug = params.slug as string;
  
  useEffect(() => {
    const fetchThread = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/threads/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Thread not found');
          }
          throw new Error('Failed to fetch thread');
        }
        
        const data = await response.json();
        setThread(data.thread);
        setMessages(data.messages);
      } catch (err) {
        setError('Error loading thread. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchThread();
  }, [slug]);
  
  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!thread || !newMessage.trim()) {
      return;
    }
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-auth-token', // This would be a real token in production
        },
        body: JSON.stringify({
          threadId: thread._id,
          content: newMessage,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to post message');
      }
      
      // Simulate success for now
      const mockMessage: Message = {
        _id: `temp-${Date.now()}`,
        authorHandle: 'BoldBull1234', // This would come from the server in production
        content: newMessage,
        created: new Date().toISOString(),
        reactions: { up: 0, down: 0 },
        replies: [],
        repliesCount: 0,
      };
      
      setMessages([mockMessage, ...messages]);
      setNewMessage('');
      
    } catch (err) {
      console.error('Error posting message:', err);
      alert('Failed to post message. Please try again.');
    }
  };
  
  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!thread || !replyContent.trim() || !replyToId) {
      return;
    }
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-auth-token', // This would be a real token in production
        },
        body: JSON.stringify({
          threadId: thread._id,
          content: replyContent,
          parentId: replyToId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to post reply');
      }
      
      // Simulate success for now
      const mockReply: Reply = {
        _id: `temp-${Date.now()}`,
        authorHandle: 'BoldBull1234', // This would come from the server in production
        content: replyContent,
        created: new Date().toISOString(),
      };
      
      // Update the state to include the new reply
      setMessages(messages.map(message => {
        if (message._id === replyToId) {
          return {
            ...message,
            replies: [...(message.replies || []), mockReply],
            repliesCount: (message.repliesCount || 0) + 1,
          };
        }
        return message;
      }));
      
      // Reset reply state
      setReplyToId(null);
      setReplyContent('');
      
    } catch (err) {
      console.error('Error posting reply:', err);
      alert('Failed to post reply. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">Loading thread...</p>
        </div>
      </div>
    );
  }
  
  if (error || !thread) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error || 'Thread not found'}
        </div>
        <div className="mt-4">
          <Link href="/browse" className="text-ub-blue hover:underline">
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <Link href="/browse" className="text-ub-blue hover:underline flex items-center">
          ← Back to Browse
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{thread.title}</h1>
        
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium capitalize">
            {thread.category}
          </span>
          {thread.courseCode && (
            <span className="px-2 py-1 bg-blue-50 text-ub-blue rounded text-xs font-medium">
              {thread.courseCode}
            </span>
          )}
          {thread.professorName && (
            <span className="text-gray-600 text-sm">Prof. {thread.professorName}</span>
          )}
        </div>
        
        {thread.description && (
          <p className="text-gray-700 mb-4">{thread.description}</p>
        )}
        
        <div className="text-sm text-gray-500">
          <p>Created: {new Date(thread.created).toLocaleString()}</p>
          <p>Messages: {thread.messageCount}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Post a Message</h2>
        <form onSubmit={handleSubmitMessage}>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Share your thoughts anonymously..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ub-blue min-h-[100px]"
            required
          />
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              className="bg-ub-blue hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
            >
              Post Message
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b">Discussion</h2>
        
        {messages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No messages yet. Be the first to post!
          </div>
        ) : (
          <div className="divide-y">
            {messages.map((message) => (
              <div key={message._id} className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-ub-blue">{message.authorHandle}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(message.created).toLocaleString()}
                  </span>
                </div>
                
                <div className="text-gray-800 mb-3 whitespace-pre-wrap">{message.content}</div>
                
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setReplyToId(message._id)}
                    className="text-sm text-ub-blue hover:underline"
                  >
                    Reply
                  </button>
                  
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center text-gray-500 hover:text-green-600">
                      <span className="mr-1">👍</span>
                      <span>{message.reactions?.up || 0}</span>
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-red-600">
                      <span className="mr-1">👎</span>
                      <span>{message.reactions?.down || 0}</span>
                    </button>
                  </div>
                </div>
                
                {replyToId === message._id && (
                  <div className="mt-3 pl-4 border-l-2 border-gray-200">
                    <form onSubmit={handleSubmitReply} className="mt-2">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write your reply..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ub-blue min-h-[80px]"
                        required
                      />
                      <div className="mt-2 flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setReplyToId(null)}
                          className="text-gray-600 hover:text-gray-800 font-medium py-1 px-3"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-ub-blue hover:bg-blue-700 text-white font-medium py-1 px-3 rounded"
                        >
                          Post Reply
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {message.replies && message.replies.length > 0 && (
                  <div className="mt-4 pl-6 border-l-2 border-gray-200 space-y-4">
                    {message.replies.map((reply) => (
                      <div key={reply._id} className="pt-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-ub-blue">{reply.authorHandle}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(reply.created).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-gray-800 text-sm whitespace-pre-wrap">{reply.content}</div>
                      </div>
                    ))}
                    
                    {(message.repliesCount || 0) > (message.replies?.length || 0) && (
                      <button className="text-sm text-ub-blue hover:underline">
                        Show more replies ({(message.repliesCount || 0) - (message.replies?.length || 0)} more)
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 