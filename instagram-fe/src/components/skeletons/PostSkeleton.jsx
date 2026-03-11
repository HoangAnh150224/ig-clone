import React from "react";

const PostSkeleton = () => {
    return (
        <div className="mx-auto mb-4 w-full max-w-[470px] overflow-hidden rounded-lg border border-gray-200 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-3">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
                    <div className="h-3.5 w-24 animate-pulse rounded bg-gray-200"></div>
                </div>
                <div className="h-5 w-5 animate-pulse rounded-full bg-gray-200"></div>
            </div>

            {/* Media (Image/Video) - 4:5 Aspect Ratio */}
            <div className="relative w-full pb-[125%] bg-gray-100 animate-pulse"></div>

            {/* Footer / Interaction Area */}
            <div className="bg-white p-3">
                {/* Buttons */}
                <div className="mb-3 flex justify-between">
                    <div className="flex gap-4">
                        <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
                        <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
                        <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
                    </div>
                    <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
                </div>

                {/* Likes & Caption */}
                <div className="flex flex-col gap-2">
                    <div className="h-3.5 w-20 animate-pulse rounded bg-gray-200"></div>
                    <div className="flex w-full gap-2">
                        <div className="h-3 w-14 animate-pulse rounded bg-gray-200"></div>
                        <div className="h-3 w-36 animate-pulse rounded bg-gray-200"></div>
                    </div>
                    <div className="h-2.5 w-28 animate-pulse rounded bg-gray-200"></div>
                </div>
            </div>

            {/* Comment Input Skeleton */}
            <div className="hidden border-t border-gray-100 bg-white p-3 md:block">
                <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-pulse rounded-full bg-gray-200"></div>
                    <div className="h-3.5 flex-1 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-3.5 w-10 animate-pulse rounded bg-gray-200"></div>
                </div>
            </div>
        </div>
    );
};

export default PostSkeleton;
