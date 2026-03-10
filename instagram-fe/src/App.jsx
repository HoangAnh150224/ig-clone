import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { useSelector } from 'react-redux';

const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const Auth = lazy(() => import('./pages/Auth'));
const Explore = lazy(() => import('./pages/Explore'));
const Messages = lazy(() => import('./pages/Messages'));
const Reels = lazy(() => import('./pages/Reels'));

const ProtectedRoute = ({ children }) => {
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/accounts/login" element={<Auth />} />
          
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
            path="/reels"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Reels />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/direct/inbox"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Messages />
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
