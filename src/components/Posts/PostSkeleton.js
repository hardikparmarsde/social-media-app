import React from 'react';

const Shimmer = ({ className = '' }) => (
  <div className={`animate-pulse rounded bg-slate-200 dark:bg-slate-800 ${className}`} />
);

const PostSkeletonCard = () => (
  <div className="card p-4">
    {/* avatar + name */}
    <div className="flex items-center gap-3">
      <Shimmer className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Shimmer className="h-3 w-28" />
        <Shimmer className="h-2 w-20" />
      </div>
    </div>

    {/* image placeholder */}
    <Shimmer className="mt-4 h-48 w-full rounded-xl" />

    {/* text lines */}
    <div className="mt-4 space-y-2">
      <Shimmer className="h-3 w-5/6" />
      <Shimmer className="h-3 w-3/4" />
    </div>

    {/* action row */}
    <div className="mt-4 flex items-center gap-3">
      <Shimmer className="h-6 w-16 rounded-full" />
      <Shimmer className="h-6 w-16 rounded-full" />
      <Shimmer className="ml-auto h-6 w-10 rounded-full" />
    </div>
  </div>
);

/**
 * Grid of skeleton cards matching the real feed layout (1/2/3 cols).
 * Default count mirrors a typical first-page fetch.
 */
const PostSkeleton = ({ count = 6 }) => (
  <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="mb-4 break-inside-avoid">
        <PostSkeletonCard />
      </div>
    ))}
  </div>
);

export default PostSkeleton;
