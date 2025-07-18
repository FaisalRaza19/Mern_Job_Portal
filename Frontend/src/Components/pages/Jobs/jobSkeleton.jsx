import React from "react";

const JobSkeleton = () => {
    return (
        <div className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-2xl shadow p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col gap-4 animate-pulse transition-colors duration-300">
            <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/4" />
            <div className="flex flex-wrap gap-2">
                <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded-full w-16" />
                <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded-full w-20" />
                <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded-full w-12" />
            </div>
            <div className="h-10 bg-zinc-200 dark:bg-zinc-700 rounded mt-4" />
        </div>
    );
};

export default JobSkeleton;
