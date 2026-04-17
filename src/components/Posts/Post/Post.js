import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import moment from 'moment';
import { useDispatch, useSelector } from "react-redux";
import { addComment, deleteComment, deletePost, likePost } from "../../../actions/actions";
import { AnimatePresence, motion, useMotionVariants } from "../../ui/motion";
import AuthRequiredModal from "../../ui/AuthRequiredModal";

const Post = ({ post, setCurrentId }) => {
    const user = useSelector((state) => state.auth.user);
    const [drawer, setDrawer] = useState(false);
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [showAllComments, setShowAllComments] = useState(false);
    const [commentError, setCommentError] = useState(null);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [deletingCommentId, setDeletingCommentId] = useState(null);
    const [replyTo, setReplyTo] = useState(null); // { id, name } | null
    const [isLiking, setIsLiking] = useState(false);
    const [imageOpen, setImageOpen] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [modalImageLoaded, setModalImageLoaded] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authModalMessage, setAuthModalMessage] = useState('');
    const dispatch = useDispatch();
    const menuRef = useRef(null);
    const menuButtonRef = useRef(null);
    const commentsPanelRef = useRef(null);
    const commentsButtonRef = useRef(null);

    const initials = useMemo(() => {
        const raw = (post?.name || '').trim();
        if (!raw) return '?';
        const parts = raw.split(/\s+/).filter(Boolean);
        const first = parts[0]?.[0] || '';
        const last = (parts.length > 1 ? parts[parts.length - 1]?.[0] : '') || '';
        return (first + last).toUpperCase() || '?';
    }, [post?.name]);

    const { hoverCard, tap, fade } = useMotionVariants();

    const tokenFromStorage = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('profile') || 'null')?.token || null;
        } catch {
            return null;
        }
    }, []);
    const authToken = user?.token || tokenFromStorage;
    const canComment = Boolean(authToken);
    const commentCount = Array.isArray(post?.comments) ? post.comments.length : 0;

    const requireAuth = useCallback((message) => {
        setAuthModalMessage(message || 'Please sign in to continue.');
        setAuthModalOpen(true);
    }, []);

    const userId = user?.result?._id ? String(user.result._id) : null;
    const postCreatorId = post?.creator != null ? String(post.creator) : null;
    const isCreator = Boolean(userId && postCreatorId && userId === postCreatorId);

    const handleDelete = useCallback(() => {
        if (!authToken) {
            requireAuth('Please sign in to delete your post.');
            return;
        }
        if (!isCreator) return;
        dispatch(deletePost(post._id));
    }, [dispatch, post._id, authToken, isCreator, requireAuth]);

    const handleLikes = useCallback(async () => {
        if (!authToken) {
            requireAuth('Please sign in to like posts.');
            return;
        }
        if (isLiking) return;
        setIsLiking(true);
        try {
            await dispatch(likePost(post._id)).unwrap();
        } finally {
            setIsLiking(false);
        }
    }, [dispatch, post._id, isLiking, authToken, requireAuth]);

    useEffect(() => {
        setImageLoaded(false);
        setModalImageLoaded(false);
    }, [post?._id, post?.selectedFile]);

    const toggleDrawer = useCallback(() => {
        setDrawer((prev) => !prev);
    }, []);

    const isLiked = user?.result?._id && post.likes.findIndex((id) => id === String(user.result._id)) !== -1;

    const getInitials = useCallback((name) => {
        const raw = String(name || '').trim();
        if (!raw) return '?';
        const parts = raw.split(/\s+/).filter(Boolean);
        const first = parts[0]?.[0] || '';
        const last = (parts.length > 1 ? parts[parts.length - 1]?.[0] : '') || '';
        return (first + last).toUpperCase() || '?';
    }, []);

    const visibleComments = useMemo(() => {
        const list = Array.isArray(post?.comments) ? post.comments : [];
        const topLevel = list.filter((c) => !c.parentId);
        if (showAllComments) return topLevel;
        return topLevel.slice(-2);
    }, [post?.comments, showAllComments]);

    const repliesByParentId = useMemo(() => {
        const list = Array.isArray(post?.comments) ? post.comments : [];
        const map = new Map();
        for (const c of list) {
            if (!c.parentId) continue;
            const pid = String(c.parentId);
            const arr = map.get(pid) || [];
            arr.push(c);
            map.set(pid, arr);
        }
        for (const [k, arr] of map.entries()) {
            arr.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            map.set(k, arr);
        }
        return map;
    }, [post?.comments]);

    const toggleComments = useCallback(() => {
        setCommentsOpen((v) => {
            const next = !v;
            if (next) setCommentError(null);
            return next;
        });
    }, []);

    const submitComment = useCallback(async () => {
        if (!canComment) {
            requireAuth(replyTo ? 'Please sign in to reply.' : 'Please sign in to comment.');
            return;
        }
        const text = commentText.trim();
        if (!text) return;

        setIsSubmittingComment(true);
        setCommentError(null);
        try {
            await dispatch(addComment({
                postId: post._id,
                text,
                name: user?.result?.name || '',
                parentId: replyTo?.id || null,
            })).unwrap();
            setCommentText('');
            setReplyTo(null);
            setCommentsOpen(true);
        } catch (e) {
            setCommentError(typeof e === 'string' ? e : 'Failed to post comment');
        } finally {
            setIsSubmittingComment(false);
        }
    }, [canComment, commentText, dispatch, post._id, user?.result?.name, replyTo, requireAuth]);

    const removeComment = useCallback(async (commentId) => {
        if (!canComment) {
            requireAuth('Please sign in to delete comments.');
            return;
        }
        setDeletingCommentId(commentId);
        setCommentError(null);
        try {
            await dispatch(deleteComment({ postId: post._id, commentId })).unwrap();
        } catch (e) {
            setCommentError(typeof e === 'string' ? e : 'Failed to delete comment');
        } finally {
            setDeletingCommentId(null);
        }
    }, [canComment, dispatch, post._id, requireAuth]);

    const formatMeta = useCallback((createdAt) => {
        if (!createdAt) return '';
        const m = moment(createdAt);
        const relative = m.fromNow();
        const full = m.format('MMM D, YYYY • h:mm A');
        return `${relative} • ${full}`;
    }, []);

    const BrandSpinner = ({ size = 14 }) => (
        <motion.span
            aria-hidden="true"
            className="inline-flex"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
            style={{ width: size, height: size }}
        >
            <span
                className="block h-full w-full rounded-full border-2 border-rose-300/60 border-t-rose-600 dark:border-rose-300/40 dark:border-t-rose-200"
            />
        </motion.span>
    );

    useEffect(() => {
        if (!drawer) return;
        const onPointerDown = (e) => {
            const menuEl = menuRef.current;
            const btnEl = menuButtonRef.current;
            if (!menuEl || !btnEl) return;
            if (menuEl.contains(e.target) || btnEl.contains(e.target)) return;
            setDrawer(false);
        };

        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [drawer]);

    useEffect(() => {
        if (!commentsOpen) return;
        const onPointerDown = (e) => {
            const panel = commentsPanelRef.current;
            const btn = commentsButtonRef.current;
            if (!panel || !btn) return;
            if (panel.contains(e.target) || btn.contains(e.target)) return;
            setCommentsOpen(false);
        };
        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [commentsOpen]);

    return (
        <div className="w-full">
            <motion.div className="card card-hover relative overflow-visible" {...hoverCard}>
                <div className="flex items-start justify-between gap-3 p-4">
                    <div className="min-w-0">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-xs font-bold text-white shadow-sm">
                                {initials}
                            </div>
                            <div className="min-w-0">
                                <h2 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">{post.name || 'User'}</h2>
                                <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{moment(post.createdAt).fromNow()}</div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        {isCreator && (
                            <motion.button
                                ref={menuButtonRef}
                                onClick={toggleDrawer}
                                className="btn btn-ghost h-9 w-9 p-0"
                                aria-label="Post menu"
                                aria-expanded={drawer ? 'true' : 'false'}
                                {...tap}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                </svg>
                            </motion.button>
                        )}
                        {drawer && (
                            <motion.div
                                ref={menuRef}
                                className="absolute right-0 top-10 z-10 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950"
                                {...fade}
                            >                         
                                <button className="w-full px-3 py-2 text-left text-sm text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10" onClick={handleDelete}>
                                    Delete
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>

                {post.selectedFile && (
                    <button
                        type="button"
                        className="block w-full overflow-hidden"
                        onClick={() => { setDrawer(false); setImageOpen(true); setModalImageLoaded(false); }}
                        aria-label="Open image"
                    >
                        <div className="relative bg-slate-100 dark:bg-slate-800/60">
                            {!imageLoaded && (
                                <div className="absolute inset-0 animate-pulse">
                                    <div className="h-full w-full bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800" />
                                </div>
                            )}
                            <img
                                className="max-h-[520px] w-full object-cover"
                                src={post.selectedFile}
                                alt="post"
                                loading="lazy"
                                onLoad={() => setImageLoaded(true)}
                                onError={() => setImageLoaded(true)}
                            />
                        </div>
                    </button>
                )}

                <div className="space-y-3 p-4">
                    {post.message && (
                        <p className="break-words text-sm text-slate-800 dark:text-slate-100">{post.message}</p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((item, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800/70 dark:text-slate-200"
                                >
                                    #{item}
                                </span>
                            ))}
                        </div>
                    )}
                    <div className="relative flex items-center justify-between border-t border-slate-200/70 pt-3 dark:border-slate-800/70">
                        <div className="flex items-center gap-2">
                            <motion.button className="btn btn-ghost px-3" onClick={handleLikes} {...tap} aria-label="Like post" disabled={isLiking}>
                            {isLiked ? (
                                <svg className="fill-red-600" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20" viewBox="0 0 16 16" className="text-slate-700 dark:text-slate-200">
                                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                                </svg>
                            )}
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{post.likes.length}</span>
                            </motion.button>

                            <motion.button
                                className="btn btn-ghost px-3"
                                type="button"
                                onClick={toggleComments}
                                {...tap}
                                aria-label="Toggle comments"
                                ref={commentsButtonRef}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="currentColor" className="text-slate-700 dark:text-slate-200" aria-hidden="true">
                                    <path d="M2 1a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.586a1 1 0 0 1 .707.293l2.414 2.414c.63.63 1.707.184 1.707-.707V13h2a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z" />
                                </svg>
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{commentCount}</span>
                            </motion.button>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            {commentsOpen ? 'Hide' : 'Comments'}
                        </div>
                    </div>

                    <AnimatePresence initial={false}>
                        {commentsOpen && (
                            <motion.div
                                key="comments"
                                ref={commentsPanelRef}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.18, ease: 'easeOut' }}
                                className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-3 shadow-soft dark:border-slate-800/70 dark:bg-slate-950"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                                            Comments ({commentCount})
                                        </div>
                                        {commentCount > 2 && (
                                            <button
                                                type="button"
                                                className="text-xs font-semibold text-rose-600 hover:underline dark:text-rose-300"
                                                onClick={() => setShowAllComments((v) => !v)}
                                            >
                                                {showAllComments ? 'Show less' : 'View all'}
                                            </button>
                                        )}
                                    </div>

                                    {commentError && (
                                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
                                            {commentError}
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        {commentCount === 0 ? (
                                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                                No comments yet. Be the first.
                                            </div>
                                        ) : (
                                            <div className="max-h-64 space-y-2 overflow-auto pr-1">
                                                {visibleComments.map((c) => {
                                                    const name = c.name || 'User';
                                                    const replies = repliesByParentId.get(String(c._id)) || [];
                                                    const repliesToShow = showAllComments ? replies : replies.slice(0, 1);

                                                    const isCommentOwner = String(c.userId) === String(user?.result?._id);
                                                    const isPostOwner = String(post.creator) === String(user?.result?._id);
                                                    const canDelete = isCommentOwner || isPostOwner;
                                                    const deleting = deletingCommentId === c._id;

                                                    return (
                                                        <div key={c._id} className="space-y-2">
                                                            <div className="rounded-2xl border border-slate-200/70 bg-white p-3 text-sm shadow-sm dark:border-slate-800/70 dark:bg-slate-950/30">
                                                                <div className="flex items-start gap-3">
                                                                    <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
                                                                        {getInitials(name)}
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <div className="flex items-start justify-between gap-3">
                                                                            <div className="min-w-0">
                                                                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                                                    <div className="truncate font-semibold text-slate-900 dark:text-slate-50">
                                                                                        {name}
                                                                                    </div>
                                                                                    <div className="text-xs text-slate-500 dark:text-slate-400" title={c.createdAt ? moment(c.createdAt).format('MMM D, YYYY • h:mm A') : ''}>
                                                                                        {c.createdAt ? moment(c.createdAt).fromNow() : ''}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="mt-1 break-words text-slate-700 dark:text-slate-200">
                                                                                    {c.text}
                                                                                </div>
                                                                                <div className="mt-2 flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                                                    <button
                                                                                        type="button"
                                                                                        className="hover:text-rose-600 dark:hover:text-rose-300"
                                                                                        onClick={() => {
                                                                                            if (!authToken) {
                                                                                                requireAuth('Please sign in to reply.');
                                                                                                return;
                                                                                            }
                                                                                            setReplyTo({ id: String(c._id), name });
                                                                                            setCommentsOpen(true);
                                                                                        }}
                                                                                    >
                                                                                        Reply
                                                                                    </button>
                                                                                    <span className="text-slate-300 dark:text-slate-700">•</span>
                                                                                    <span title={c.createdAt ? formatMeta(c.createdAt) : ''}>
                                                                                        {c.createdAt ? moment(c.createdAt).format('MMM D') : ''}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center gap-1">
                                                                                {canDelete && (
                                                                                    <button
                                                                                        className="btn btn-ghost h-8 w-8 p-0"
                                                                                        type="button"
                                                                                        disabled={deleting}
                                                                                        onClick={() => removeComment(c._id)}
                                                                                        aria-label="Delete comment"
                                                                                    >
                                                                                        {deleting ? (
                                                                                            <BrandSpinner size={14} />
                                                                                        ) : (
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-rose-600 dark:text-rose-300" aria-hidden="true">
                                                                                                <path d="M5.5 5.5a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Z" />
                                                                                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2H5.5l1-1h3l1 1H14.5a1 1 0 0 1 1 1Z" />
                                                                                            </svg>
                                                                                        )}
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {repliesToShow.length > 0 && (
                                                                <div className="space-y-2 pl-5">
                                                                    {repliesToShow.map((r) => {
                                                                        const rName = r.name || 'User';
                                                                        const rIsCommentOwner = String(r.userId) === String(user?.result?._id);
                                                                        const rIsPostOwner = String(post.creator) === String(user?.result?._id);
                                                                        const rCanDelete = rIsCommentOwner || rIsPostOwner;
                                                                        const rDeleting = deletingCommentId === r._id;
                                                                        return (
                                                                            <div key={r._id} className="rounded-2xl border border-slate-200/70 bg-white p-3 text-sm shadow-sm dark:border-slate-800/70 dark:bg-slate-950/30">
                                                                                <div className="flex items-start gap-3">
                                                                                    <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
                                                                                        {getInitials(rName)}
                                                                                    </div>
                                                                                    <div className="min-w-0 flex-1">
                                                                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                                                            <div className="truncate font-semibold text-slate-900 dark:text-slate-50">
                                                                                                {rName}
                                                                                            </div>
                                                                                            <div className="text-xs text-slate-500 dark:text-slate-400" title={r.createdAt ? moment(r.createdAt).format('MMM D, YYYY • h:mm A') : ''}>
                                                                                                {r.createdAt ? moment(r.createdAt).fromNow() : ''}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="mt-1 break-words text-slate-700 dark:text-slate-200">
                                                                                            {r.text}
                                                                                        </div>
                                                                                        <div className="mt-2 flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                                                            <button
                                                                                                type="button"
                                                                                                className="hover:text-rose-600 dark:hover:text-rose-300"
                                                                                                onClick={() => {
                                                                                                    if (!authToken) {
                                                                                                        requireAuth('Please sign in to reply.');
                                                                                                        return;
                                                                                                    }
                                                                                                    setReplyTo({ id: String(c._id), name });
                                                                                                    setCommentsOpen(true);
                                                                                                }}
                                                                                            >
                                                                                                Reply
                                                                                            </button>
                                                                                            <span className="text-slate-300 dark:text-slate-700">•</span>
                                                                                            <span title={r.createdAt ? formatMeta(r.createdAt) : ''}>
                                                                                                {r.createdAt ? moment(r.createdAt).format('MMM D') : ''}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                    {rCanDelete && (
                                                                                        <button
                                                                                            className="btn btn-ghost h-8 w-8 p-0"
                                                                                            type="button"
                                                                                            disabled={rDeleting}
                                                                                            onClick={() => removeComment(r._id)}
                                                                                            aria-label="Delete comment"
                                                                                        >
                                                                                            {rDeleting ? (
                                                                                                <BrandSpinner size={14} />
                                                                                            ) : (
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-rose-600 dark:text-rose-300" aria-hidden="true">
                                                                                                    <path d="M5.5 5.5a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Z" />
                                                                                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2H5.5l1-1h3l1 1H14.5a1 1 0 0 1 1 1Z" />
                                                                                                </svg>
                                                                                            )}
                                                                                        </button>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                    {!showAllComments && replies.length > 1 && (
                                                                        <button
                                                                            type="button"
                                                                            className="pl-2 text-xs font-semibold text-rose-600 hover:underline dark:text-rose-300"
                                                                            onClick={() => setShowAllComments(true)}
                                                                        >
                                                                            View {replies.length - 1} more repl{replies.length - 1 === 1 ? 'y' : 'ies'}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-xs font-bold text-white">
                                            {getInitials(user?.result?.name || 'U')}
                                        </div>
                                        <div className="flex-1">
                                            {replyTo && canComment && (
                                                <div className="mb-1 flex items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800/70 dark:bg-slate-950/30 dark:text-slate-200">
                                                    <span className="min-w-0 truncate">Replying to {replyTo.name}</span>
                                                    <button
                                                        type="button"
                                                        className="shrink-0 text-rose-600 hover:underline dark:text-rose-300"
                                                        onClick={() => setReplyTo(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                            <input
                                                className="input"
                                                placeholder={canComment ? (replyTo ? "Write a reply…" : "Write a comment…") : "Sign in to comment"}
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                disabled={!canComment || isSubmittingComment}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        submitComment();
                                                    }
                                                }}
                                            />
                                        </div>
                                        <motion.button
                                            className="btn btn-primary"
                                            type="button"
                                            disabled={!canComment || isSubmittingComment || !commentText.trim()}
                                            onClick={submitComment}
                                            {...tap}
                                        >
                                            {isSubmittingComment ? <BrandSpinner size={14} /> : 'Post'}
                                        </motion.button>
                                    </div>

                                    {!canComment && (
                                        <div className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-800/70 dark:bg-slate-950/30 dark:text-slate-200">
                                            <span>Sign in to comment and reply.</span>
                                            <button
                                                type="button"
                                                className="btn btn-soft px-3 py-2"
                                                onClick={() => requireAuth('Please sign in to comment and reply.')}
                                            >
                                                Sign in
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {imageOpen && post.selectedFile && (
                <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" {...fade} onClick={() => setImageOpen(false)}>
                    <button
                        type="button"
                        className="absolute right-4 top-4 btn btn-ghost h-10 w-10 p-0 text-white hover:bg-white/10"
                        aria-label="Close image"
                        onClick={() => setImageOpen(false)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                    </button>
                    <motion.div
                        className="max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.98, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                    >
                        <div className="relative">
                            {!modalImageLoaded && (
                                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/10 via-white/5 to-white/10" />
                            )}
                            <img
                                src={post.selectedFile}
                                alt="post"
                                className="max-h-[85vh] w-full object-contain"
                                onLoad={() => setModalImageLoaded(true)}
                                onError={() => setModalImageLoaded(true)}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
            <AuthRequiredModal
                open={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                message={authModalMessage || 'Please sign in to continue.'}
                ctaLabel="Sign in"
                ctaTo="/auth/login"
                ctaState={{ from: '/feed', message: authModalMessage || 'Please sign in to continue.' }}
            />
        </div>
    );
};

export default Post;