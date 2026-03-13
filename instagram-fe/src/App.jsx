import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { useSelector } from "react-redux";
import InstagramAlert from "./components/common/InstagramAlert";
import useAppInitialization from "./hooks/useAppInitialization";

// Lazy pages
const Home = lazy(() => import("./pages/Home"));
const Auth = lazy(() => import("./pages/Auth"));
const Settings = lazy(() => import("./pages/Settings"));
const Messages = lazy(() => import("./pages/Messages"));
const Profile = lazy(() => import("./pages/Profile"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const Archive = lazy(() => import("./pages/Archive"));
const Explore = lazy(() => import("./pages/Explore"));
const Reels = lazy(() => import("./pages/Reels"));

// Lazy modals
const CreatePostModal = lazy(() => import("./components/modals/CreatePostModal"));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    if (!isAuthenticated) return <Navigate to="/accounts/login" replace />;
    return children;
};

const App = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const globalError = useSelector((state) => state.ui.error);

    // Initialize all app-level syncs and websockets
    useAppInitialization();

    return (
        <div className="app-container">
            <Suspense fallback={null}>
                <Routes>
                    {/* Public Routes */}
                    <Route
                        path="/accounts/*"
                        element={
                            !isAuthenticated ? (
                                <Auth />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />

                    {/* Protected Routes */}
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
                        path="/accounts/edit"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Settings />
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
                    <Route
                        path="/p/:postId"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <PostDetail />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/archive"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Archive />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                {/* Modals & Global UI */}
                {isAuthenticated && (
                    <>
                        <CreatePostModal />
                        <InstagramAlert
                            isOpen={!!globalError}
                            onClose={() => {}}
                            title="Error"
                            message={globalError}
                        />
                    </>
                )}
            </Suspense>
        </div>
    );
};

export default App;
