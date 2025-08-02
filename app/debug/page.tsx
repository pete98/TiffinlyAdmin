"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DebugPage() {
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/auth/test-session')
      .then(response => {
        setSessionInfo(response.data);
        setLoading(false);
      })
      .catch(error => {
        setSessionInfo({ error: error.message });
        setLoading(false);
      });
  }, []);

  const clearSession = () => {
    axios.get('/api/auth/logout')
      .then(() => {
        window.location.reload();
      });
  };

  if (loading) {
    return <div>Loading session info...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Session Debug Info</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <pre>{JSON.stringify(sessionInfo, null, 2)}</pre>
      </div>
      
      <div className="space-y-2">
        <button 
          onClick={clearSession}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Clear Session
        </button>
        
        <a 
          href="/api/auth/login"
          className="block bg-blue-500 text-white px-4 py-2 rounded text-center"
        >
          Login
        </a>
        
        <a 
          href="/"
          className="block bg-gray-500 text-white px-4 py-2 rounded text-center"
        >
          Go Home
        </a>
      </div>
    </div>
  );
} 