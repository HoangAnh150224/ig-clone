import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "../components/feed/PostCard";
import Stories from "../components/feed/Stories";
import RightSidebar from "../components/layout/RightSidebar";
import PostCardSkeleton from "../components/skeletons/PostCardSkeleton";
import { addMockPosts, selectAllPosts } from "../store/slices/postSlice";
import postService from "../services/postService";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Home = () => {
    const dispatch = useDispatch();
    const posts = useSelector(selectAllPosts);
    const { user: authUser } = useSelector((state) => state.auth);
    
    const [loading, setLoading] = useState(true);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchFeedPosts = useCallback(async (pageNum) => {
        try {
            const results = await postService.getFeedPosts(pageNum, 10);
            if (results && results.length > 0) {
                dispatch(addMockPosts(results));
                setHasMore(results.length === 10);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setLoading(false);
            setFetchingMore(false);
        }
    }, [dispatch]);

    useEffect(() => {
        if (authUser) {
            setLoading(true);
            fetchFeedPosts(0);
        }
    }, [authUser, fetchFeedPosts]);

    // Simple Infinite Scroll Logic
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 100 >=
                document.documentElement.scrollHeight &&
                !fetchingMore &&
                hasMore &&
                !loading
            ) {
                setFetchingMore(true);
                const nextPage = page + 1;
                setPage(nextPage);
                fetchFeedPosts(nextPage);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [fetchingMore, hasMore, loading, page, fetchFeedPosts]);

    return (
        <div className="flex justify-center gap-16 py-8 bg-white min-h-screen">
            <div className="w-full max-w-[630px]">
                {/* Stories Section */}
                <div className="mb-4">
                    <Stories />
                </div>

                <div className="flex flex-col gap-8 items-center w-full mt-4">
                    {loading ? (
                        [1, 2, 3].map((i) => <PostCardSkeleton key={i} />)
                    ) : (
                        posts.map((post) => (
                            <div key={post.id} className="w-full">
                                <PostCard post={post} />
                            </div>
                        ))
                    )}
                    
                    {fetchingMore && (
                        <div className="py-4 w-full flex justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-500"></div>
                        </div>
                    )}

                    {!hasMore && posts.length > 0 && (
                        <div className="py-10 text-gray-500 text-sm italic">
                            You've seen all new posts.
                        </div>
                    )}
                </div>
            </div>

            {/* Right Sidebar - Desktop Only */}
            <div className="w-[320px] hidden lg:block">
                <RightSidebar />
            </div>
        </div>
    );
};

export default Home;
