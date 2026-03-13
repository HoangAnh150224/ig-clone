import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "../components/feed/PostCard";
import Stories from "../components/feed/Stories";
import RightSidebar from "../components/layout/RightSidebar";
import PostCardSkeleton from "../components/skeletons/PostCardSkeleton";
import { fetchPosts, selectAllPosts } from "../store/slices/postSlice";

const Home = () => {
    const dispatch = useDispatch();
    const posts = useSelector(selectAllPosts);
    const { status, hasMore, nextCursor } = useSelector((state) => state.posts);
    const { user: authUser } = useSelector((state) => state.auth);

    const loadPosts = useCallback(
        (cursor = null) => {
            dispatch(fetchPosts({ cursor, size: 20 }));
        },
        [dispatch],
    );

    useEffect(() => {
        if (authUser && status === "idle") {
            loadPosts();
        }
    }, [authUser, status, loadPosts]);

    // Handle Infinite Scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = document.documentElement.scrollTop;
            const clientHeight = window.innerHeight;

            if (
                scrollTop + clientHeight + 100 >= scrollHeight &&
                status !== "loading" &&
                hasMore
            ) {
                loadPosts(nextCursor);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [status, hasMore, nextCursor, loadPosts]);

    return (
        <div className="flex justify-center gap-16 py-8 bg-white min-h-screen">
            <div className="w-full max-w-[630px]">
                {/* Stories Section */}
                <div className="mb-4">
                    <Stories />
                </div>

                <div className="flex flex-col gap-8 items-center w-full mt-4">
                    {status === "loading" && posts.length === 0 ? (
                        [1, 2, 3].map((i) => <PostCardSkeleton key={i} />)
                    ) : (
                        <>
                            {Array.from(
                                new Map(posts.map((p) => [p.id, p])).values(),
                            ).map((post) => (
                                <div key={post.id} className="w-full">
                                    <PostCard post={post} />
                                </div>
                            ))}

                            {status === "loading" && (
                                <div className="py-4 w-full flex justify-center">
                                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-500"></div>
                                </div>
                            )}

                            {!hasMore && posts.length > 0 && (
                                <div className="py-10 text-gray-500 text-sm italic text-center w-full">
                                    You've seen all new posts.
                                </div>
                            )}

                            {posts.length === 0 && status === "succeeded" && (
                                <div className="py-20 text-gray-500 text-center w-full">
                                    No posts available. Follow some people to
                                    see their posts!
                                </div>
                            )}
                        </>
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
