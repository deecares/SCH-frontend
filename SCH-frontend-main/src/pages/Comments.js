import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

export default function Comments() {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem('token');

  // ✅ Cleaned up useCallback: removed API_URL from dependencies
  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/posts/${postId}/comments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments(response.data.data);
      setMessage('');
    } catch (err) {
      console.error(err);
      setMessage('Failed to load comments.');
    } finally {
      setLoading(false);
    }
  }, [postId, token]);  // ✅ only include variables that change at runtime

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!token) {
      setMessage('Please login to add a comment.');
      return;
    }

    if (!newComment.trim()) {
      setMessage('Comment cannot be empty.');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(
        `${API_URL}/api/v1/comments/create`,
        {
          post_id: postId,
          content: newComment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNewComment('');
      setMessage('Comment added!');
      fetchComments();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.detail) {
        setMessage(`Error: ${err.response.data.detail}`);
      } else {
        setMessage('Error adding comment.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Comments for Post ID: {postId}</h2>

      {loading ? (
        <p>Loading comments...</p>
      ) : (
        <>
          {comments.length === 0 && <p>No comments yet.</p>}
          {comments.map((comment) => (
            <div
              key={comment._id || comment.id || comment.created_at || Math.random()}
              style={{ borderBottom: '1px solid #ccc', padding: '8px 0' }}
            >
              <p>{comment.content}</p>
              <small>By: {comment.created_by}</small>
            </div>
          ))}
        </>
      )}

      <h3>Add a Comment</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          required
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={4}
          style={{ width: '100%' }}
          disabled={submitting}
        />
        <button
          type="submit"
          style={{ marginTop: '8px' }}
          disabled={submitting || !newComment.trim()}
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
