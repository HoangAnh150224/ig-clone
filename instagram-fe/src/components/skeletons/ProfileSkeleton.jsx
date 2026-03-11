import React from "react";

const ProfileSkeleton = () => {
    return (
        <div className="mx-auto max-w-[935px] bg-white px-4">
            {/* Header Skeleton */}
            <div className="flex flex-col items-center gap-8 py-8 md:flex-row md:gap-20">
                {/* Avatar Section */}
                <div className="h-20 w-20 shrink-0 animate-pulse rounded-full bg-gray-200 md:h-[150px] md:w-[150px]"></div>

                {/* Info Section */}
                <div className="flex flex-1 flex-col gap-6 w-full">
                    <div className="flex w-full gap-4">
                        <div className="h-6 w-36 animate-pulse rounded bg-gray-200"></div>
                        <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-200"></div>
                        <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-200"></div>
                    </div>

                    <div className="hidden w-full gap-10 md:flex">
                        <div className="h-[18px] w-20 animate-pulse rounded bg-gray-200"></div>
                        <div className="h-[18px] w-20 animate-pulse rounded bg-gray-200"></div>
                        <div className="h-[18px] w-20 animate-pulse rounded bg-gray-200"></div>
                    </div>

                    <div className="flex w-full flex-col gap-2">
                        <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                        <div className="h-3.5 w-64 animate-pulse rounded bg-gray-200"></div>
                        <div className="h-3.5 w-48 animate-pulse rounded bg-gray-200"></div>
                    </div>
                </div>
            </div>

            {/* Highlights Skeleton */}
            <div className="mb-10 flex gap-10 overflow-x-hidden py-4 px-6">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <div className="h-[87px] w-[87px] animate-pulse rounded-full border border-gray-100 bg-gray-200 p-[3px]"></div>
                        <div className="h-3 w-12 animate-pulse rounded bg-gray-200"></div>
                    </div>
                ))}
            </div>

            {/* Tabs Skeleton */}
            <div className="flex justify-center gap-16 border-t border-gray-200">
                <div className="-mt-px h-px w-[60px] animate-pulse bg-gray-300"></div>
                <div className="-mt-px h-px w-[60px] animate-pulse bg-gray-300"></div>
                <div className="-mt-px h-px w-[60px] animate-pulse bg-gray-300"></div>
            </div>
            <div className="flex justify-center gap-16 py-4">
                <div className="h-4 w-[60px] animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-[60px] animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-[60px] animate-pulse rounded bg-gray-200"></div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-3 gap-1 md:gap-7 py-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <div key={i} className="aspect-square w-full animate-pulse bg-gray-200"></div>
                ))}
            </div>
        </div>
    );
};

export default ProfileSkeleton;
