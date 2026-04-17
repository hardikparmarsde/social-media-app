import React, { useEffect, useState, useCallback } from 'react';
import ReactPaginate from 'react-paginate';
import Posts from './Posts/Posts';
import { Link } from 'react-router-dom';
import { motion, useMotionVariants } from './ui/motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchTrendingPosts, searchPosts } from '../actions/actions';
import AuthRequiredModal from './ui/AuthRequiredModal';

const PAGE_SIZE = 6;

const PaginatedItems = ({ setCurrentId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading, posts, currentPage, totalPages, totalItems } = useSelector((state) => state.posts);
  const [mode, setMode] = useState('forYou'); // forYou | latest
  const [query, setQuery] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    setCurrentId('');
  }, [setCurrentId]);

  useEffect(() => {
    if (query.trim()) return;
    if (mode === 'forYou') dispatch(fetchTrendingPosts({ limit: 60, windowHours: 96 }));
    else dispatch(fetchPosts({ page: 1, limit: PAGE_SIZE }));
  }, [dispatch, mode, query]);

  useEffect(() => {
    const q = query.trim();
    if (!q) return;
    const t = setTimeout(() => {
      dispatch(searchPosts({ q }));
    }, 250);
    return () => clearTimeout(t);
  }, [dispatch, query]);

  const handlePageClick = useCallback((event) => {
    const nextPage = event.selected + 1;
    dispatch(fetchPosts({ page: nextPage, limit: PAGE_SIZE }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch]);

  const { fadeUp } = useMotionVariants();

  return (
    <>
    <motion.div className="space-y-6" {...fadeUp}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Home</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {query.trim()
              ? `Results for “${query.trim()}”`
              : mode === 'forYou'
                ? 'For you · trending posts'
                : 'Latest posts'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-soft dark:border-slate-800 dark:bg-slate-950/60">
            <button
              className={`btn px-3 py-2 ${mode === 'forYou' ? 'btn-soft' : 'btn-ghost'}`}
              onClick={() => { setMode('forYou'); setQuery(''); }}
              type="button"
            >
              For You
            </button>
            <button
              className={`btn px-3 py-2 ${mode === 'latest' ? 'btn-soft' : 'btn-ghost'}`}
              onClick={() => { setMode('latest'); setQuery(''); }}
              type="button"
            >
              Latest
            </button>
          </div>
          <div className="w-full sm:w-72">
            <input
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts…"
              type="search"
            />
          </div>
        </div>
      </div>

      <Link
        to="/post"
        onClick={(e) => {
          if (!user?.token) {
            e.preventDefault();
            setAuthModalOpen(true);
          }
        }}
        className="card card-hover block p-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-sm font-bold text-white">
            {(user?.result?.name || 'U').slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Create post</div>
            <div className="truncate text-sm text-slate-600 dark:text-slate-400">
              What’s on your mind?
            </div>
          </div>
          <div className="ml-auto text-slate-400 dark:text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h10.793L9.146 4.354a.5.5 0 1 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L12.293 8.5H1.5A.5.5 0 0 1 1 8z" />
            </svg>
          </div>
        </div>
      </Link>

      {posts.length === 0 ? (
        <div className="card p-6 sm:p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8Z" />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-50">No posts yet</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Be the first to share something. Your post will show up here.
          </p>
          <div className="mt-5 flex justify-center">
            <Link to="/post" className="btn btn-primary">
              Create a post
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {loading && (
            <div className="card p-4">
              <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="mt-3 h-24 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
          )}
          <Posts setCurrentId={setCurrentId} posts={posts} />
        </div>
      )}

      {mode === 'latest' && !query.trim() && totalPages > 1 && (
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Page {currentPage} of {totalPages} · {totalItems} posts
          </div>
          <ReactPaginate
            breakLabel="..."
            nextLabel={
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
              </svg>
            }
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={totalPages}
            forcePage={Math.max(0, (currentPage || 1) - 1)}
            previousLabel={
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
              </svg>
            }
            renderOnZeroPageCount={null}
            className="flex select-none items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200"
            pageClassName="rounded-xl"
            pageLinkClassName="inline-flex h-9 min-w-9 items-center justify-center rounded-xl px-3 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            previousClassName="rounded-xl"
            previousLinkClassName="inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60"
            nextClassName="rounded-xl"
            nextLinkClassName="inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60"
            breakClassName="rounded-xl"
            breakLinkClassName="inline-flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-slate-500 dark:text-slate-400"
            activeLinkClassName="bg-rose-50 text-rose-700 hover:bg-rose-50 dark:bg-rose-500/10 dark:text-rose-200"
          />
        </div>
      )}
    </motion.div>
    <AuthRequiredModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        message="Please sign in to create a post."
        ctaLabel="Sign in"
        ctaTo="/auth/login"
        ctaState={{ from: '/post' }}
      />
    </>
  );
};

export default PaginatedItems;