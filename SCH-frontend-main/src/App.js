import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Posts from './pages/Posts';
import CreatePost from './pages/CreatePost';
import Comments from './pages/Comments';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Highlight active link
function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      style={{
        marginRight: '18px',
        textDecoration: 'none',
        color: isActive ? '#1976d2' : '#333',
        fontWeight: isActive ? 'bold' : 'normal',
        borderBottom: isActive ? '2px solid #1976d2' : 'none',
        paddingBottom: '2px',
        transition: 'color 0.2s'
      }}
    >
      {children}
    </Link>
  );
}

// Navigation bar (hidden on login/signup)
function Navigation() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) return null;
  if (location.pathname === '/login' || location.pathname === '/signup') return null;

  return (
    <nav style={{ textAlign: 'center', marginBottom: '24px' }}>
      <NavLink to="/posts">Posts</NavLink>
      <NavLink to="/create">Create Post</NavLink>
      <button
        onClick={logout}
        style={{
          marginLeft: '12px',
          padding: '4px 8px',
          background: '#d32f2f',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </nav>
  );
}

// Protected route
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Home landing page
function Home() {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    return <Navigate to="/posts" />;
  }

  return (
    <div style={{
      textAlign: 'center',
      padding: '24px'
    }}>
      <h2 style={{
        color: '#1976d2',
        marginBottom: '16px'
      }}>
        Welcome to StudentCollabHub
      </h2>
      <p>Please choose an option:</p>
      <div style={{ marginTop: '16px' }}>
        <NavLink to="/login">Login</NavLink>
        <span style={{ margin: '0 8px' }}>|</span>
        <NavLink to="/signup">Signup</NavLink>
      </div>
    </div>
  );
}

// App routes
function AppRoutes() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)',
        padding: 0,
        margin: 0,
        fontFamily: 'Segoe UI, Arial, sans-serif'
      }}
    >
      <div
        style={{
          maxWidth: '540px',
          margin: '48px auto',
          background: '#fff',
          borderRadius: '14px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          padding: '32px 24px'
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            color: '#1976d2',
            marginBottom: '24px',
            letterSpacing: '1px'
          }}
        >
          StudentCollabHub
        </h1>

        <Navigation />

        <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #eee' }} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <Posts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/comments/:postId"
            element={
              <ProtectedRoute>
                <Comments />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

// App root
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
