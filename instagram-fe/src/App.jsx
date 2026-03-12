import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrentUser } from "./store/slices/authSlice";
import { setUnreadNotificationCount, incrementUnreadNotificationCount } from "./store/slices/uiSlice";
import CreatePostModal from "./components/modals/CreatePostModal";
import useStomp from "./hooks/useStomp";
import InstagramAlert from "./components/common/InstagramAlert";
import notificationService from "./services/notificationService";

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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    if (!isAuthenticated) return <Navigate to="/accounts/login" replace />;
    return children;
};

const App = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, user, token } = useSelector((state) => state.auth);
    const globalError = useSelector((state) => state.ui.error);

    useEffect(() => {
        if (token) {
            dispatch(fetchCurrentUser());
            notificationService.getUnreadCount().then(count => {
                dispatch(setUnreadNotificationCount(count));
            }).catch(console.error);
        }
    }, [dispatch, token]);

    // GLOBAL WEBSOCKET FOR NOTIFICATIONS
    const { connected, subscribe } = useStomp("/ws");

    useEffect(() => {
        if (connected && user?.id) {
            const sub = subscribe(`/user/${user.id}/queue/notifications`, (notification) => {
                dispatch(incrementUnreadNotificationCount());
            });
            return () => sub?.unsubscribe();
        }
    }, [connected, subscribe, user?.id, dispatch]);

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
