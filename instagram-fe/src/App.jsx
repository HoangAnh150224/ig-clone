import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { useSelector } from 'react-redux';

const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const Auth = lazy(() => import('./pages/Auth'));
const Explore = lazy(() => import('./pages/Explore'));
const Messages = lazy(() => import('./pages/Messages'));
const Reels = lazy(() => import('./pages/Reels'));
const Settings = lazy(() => import('./pages/Settings'));

// Component bảo vệ các route yêu cầu đăng nhập
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    // Nếu chưa đăng nhập, redirect về trang login
    return <Navigate to="/accounts/login" replace />;
  }
  
  return children;
};

// Component ngăn người đã đăng nhập truy cập lại trang login
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  if (isAuthenticated) {
    // Nếu đã đăng nhập, redirect về trang chủ
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>}>
        <Routes>
          {/* Route công khai (Login/Register) */}
          <Route 
            path="/accounts/login" 
            element={
              <PublicRoute>
                <Auth />
              </PublicRoute>
            } 
          />
          
          {/* Các Route yêu cầu bảo mật */}
          <Route path="/" element={<ProtectedRoute><MainLayout><Home /></MainLayout></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><MainLayout><Explore /></MainLayout></ProtectedRoute>} />
          <Route path="/reels" element={<ProtectedRoute><MainLayout><Reels /></MainLayout></ProtectedRoute>} />
          <Route path="/direct/inbox" element={<ProtectedRoute><MainLayout><Messages /></MainLayout></ProtectedRoute>} />
          <Route path="/accounts/edit" element={<ProtectedRoute><MainLayout><Settings /></MainLayout></ProtectedRoute>} />
          <Route path="/:username" element={<ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>} />

          {/* Catch all - Redirect về trang chủ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
