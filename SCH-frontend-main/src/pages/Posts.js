import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/posts/`);
      console.log(response.data);
      setPosts(response.data.data);
    } catch (err) {
      console.error(err);
      setMessage('Failed to fetch posts. Please try again later.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
      <h2 style={{ textAlign: 'center', color: '#1976d2' }}>All Posts</h2>
      
      {message && <p style={{ color: 'red', textAlign: 'center' }}>{message}</p>}
      
      {posts.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No posts available.</p>
      ) : (
        posts.map((post, index) => (
          <div 
            key={index} 
            style={{ 
              border: '1px solid #ccc', 
              borderRadius: '8px', 
              padding: '16px', 
              marginBottom: '16px',
              backgroundColor: '#fafafa' 
            }}
          >
            <h3 style={{ marginBottom: '8px', color: '#333' }}>{post.title}</h3>
            <p><strong>Type:</strong> {post.type}</p>
            <p>{post.content}</p>
            
            {post.file_url && (
              <img 
                src={post.file_url} 
                alt="uploaded" 
                style={{ maxWidth: '100%', marginTop: '12px', borderRadius: '4px' }} 
              />
            )}
            
            <p style={{ marginTop: '8px' }}>
              <strong>Tags:</strong> {post.tags && post.tags.join(', ')}
            </p>
            <p><strong>Created By:</strong> {post.created_by}</p>
            <p><strong>Created At:</strong> {new Date(post.created_at).toLocaleString()}</p>
            
            <Link
              to={`/comments/${post.post_id}`}
              style={{
                display: 'inline-block',
                marginTop: '12px',
                padding: '8px 16px',
                backgroundColor: '#1976d2',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '4px',
                textAlign: 'center'
              }}
            >
              View & Add Comments
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
