import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { useSelector } from 'react-redux';
import { Box } from '@chakra-ui/react';

// Pages
const Home = lazy(() => import('./pages/Home'));
const Explore = lazy(() => import('./pages/Explore'));
const Reels = lazy(() => import('./pages/Reels'));
const Auth = lazy(() => import('./pages/Auth'));
const Settings = lazy(() => import('./pages/Settings'));
const Messages = lazy(() => import('./pages/Messages'));
const Profile = lazy(() => import('./pages/Profile'));
const PostDetail = lazy(() => import('./pages/PostDetail'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/accounts/login" replace />;
  return children;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

const App = () => {
  return (
    <Box minH="100vh" bg="white">
      <Suspense fallback={<Box display="flex" justifyContent="center" alignItems="center" height="100vh">Loading...</Box>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/accounts/login" element={<PublicRoute><Auth /></PublicRoute>} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><MainLayout><Home /></MainLayout></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><MainLayout><Explore /></MainLayout></ProtectedRoute>} />
          <Route path="/reels" element={<ProtectedRoute><MainLayout><Reels /></MainLayout></ProtectedRoute>} />
          <Route path="/direct/inbox" element={<ProtectedRoute><MainLayout><Messages /></MainLayout></ProtectedRoute>} />
          <Route path="/accounts/edit" element={<ProtectedRoute><MainLayout><Settings /></MainLayout></ProtectedRoute>} />
          <Route path="/:username" element={<ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>} />
          <Route path="/p/:postId" element={<ProtectedRoute><MainLayout><PostDetail /></MainLayout></ProtectedRoute>} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Box>
  );
};

export default App;
