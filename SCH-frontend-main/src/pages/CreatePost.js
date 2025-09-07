import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export default function CreatePost() {
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('title', title);
      formData.append('content', content);
      formData.append('tags', JSON.stringify(tags.split(',').map(tag => tag.trim())));
      if (file) formData.append('file', file);

      const token = localStorage.getItem('token');

      await axios.post(`${API_URL}/api/v1/posts/create`, formData, {
        headers: {
          'Authorization': token
        }
      });

      setMessage('Post created successfully!');
      setType('');
      setTitle('');
      setContent('');
      setTags('');
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage('Error creating post. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          placeholder="Type (e.g. Announcement, Question)"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />

        <input
          className="input"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="input"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}
          style={{ resize: 'vertical' }}
        />

        <input
          className="input"
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <input
          className="input"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button className="button" type="submit">Create Post</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
