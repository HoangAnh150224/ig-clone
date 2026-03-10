import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { useSelector } from 'react-redux';

// Lazy load các trang để tối ưu hiệu năng
const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const Auth = lazy(() => import('./pages/Auth'));
const Explore = lazy(() => import('./pages/Explore'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  // Tạm thời cho phép truy cập để vibe code nhanh, sau này sẽ uncomment
  // if (!isAuthenticated) return <Navigate to="/accounts/login" />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Auth Routes */}
          <Route path="/accounts/login" element={<Auth />} />
          
          {/* Main App Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Home />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/explore"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Explore />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/:username"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
