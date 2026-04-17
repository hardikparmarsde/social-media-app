import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPost, updatePost } from "../../../actions/actions";
import { motion, useMotionVariants } from "../../ui/motion";

const UploadPost = ({ currentId, setCurrentId }) => {
    const { fadeUp, tap } = useMotionVariants();

    const dispatch = useDispatch();
    const navigateTo = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const postsLoading = useSelector((state) => state.posts.loading);
    const post = useSelector((state) =>
        currentId ? state.posts.posts.find((p) => p._id === currentId) : null
    );

    const [postData, setPostData] = useState({
        tags: [],
        message: "",
        selectedFile: null,
        name: ""
    });
    const [tagsText, setTagsText] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [previewLoaded, setPreviewLoaded] = useState(false);

    const previewSrc = useMemo(() => {
        if (!postData.selectedFile) return '';
        if (typeof postData.selectedFile === 'string') return postData.selectedFile;
        try {
            return URL.createObjectURL(postData.selectedFile);
        } catch {
            return '';
        }
    }, [postData.selectedFile]);

    useEffect(() => {
        setPreviewLoaded(false);
    }, [previewSrc]);

    useEffect(() => {
        if (!postData.selectedFile || typeof postData.selectedFile === 'string') return;
        const url = previewSrc;
        return () => {
            if (url) URL.revokeObjectURL(url);
        };
    }, [previewSrc, postData.selectedFile]);

    useEffect(() => {
        if (currentId && post) {
            // Keep existing image URL for preview; new uploads will replace it with a File
            setPostData({
                tags: post.tags || [],
                message: post.message || '',
                selectedFile: post.selectedFile || null,
                name: post.name || '',
            });
            setTagsText((post.tags || []).join(', '));
        }
    }, [currentId, post]);

    const clear = useCallback(() => {
        setPostData({ selectedFile: null, message: '', tags: [], name: '' });
        setTagsText('');
        setCurrentId('');
    }, [setCurrentId]);

    const handleOnSubmit = useCallback(async (e) => {
        e.preventDefault();
        if(!postData.message && !postData.selectedFile) {
            alert('Please add a message or image to your post');
            return;
        }
        const tags = tagsText
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
            .slice(0, 10);

        const formData = new FormData();
        formData.append('message', postData.message || '');
        formData.append('name', user?.result?.name || '');
        formData.append('tags', JSON.stringify(tags));

        // Only append file if the user selected one (File). If editing and they don't,
        // backend will keep the existing URL.
        if (postData.selectedFile && typeof postData.selectedFile !== 'string') {
            formData.append('selectedFile', postData.selectedFile);
        }

        if (currentId) {
            dispatch(updatePost({ postId: currentId, post: formData }));
        } else {
            dispatch(createPost(formData));
        }

        clear();
        navigateTo('/feed');
    }, [postData, tagsText, currentId, user, dispatch, navigateTo, clear]);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            setPostData((prev) => ({ ...prev, selectedFile: file }));
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
            alert('Only .png, .jpg and .jpeg files are allowed');
            return;
        }
        setPostData((prev) => ({ ...prev, selectedFile: file }));
    }, []);

    const handleRemoveImage = useCallback(() => {
        setPostData((prev) => ({ ...prev, selectedFile: null }));
    }, []);

    const handleMessageChange = useCallback((e) => {
        setPostData((prev) => ({ ...prev, message: e.target.value }));
    }, []);

    const handleClear = useCallback((e) => {
        e.preventDefault();
        clear();
    }, [clear]);

    return (
        <motion.div className="mx-auto w-full max-w-md" {...fadeUp}>
            <form className="card card-hover p-5 sm:p-6 space-y-4" encType="multipart/form-data" onSubmit={handleOnSubmit}>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Create a post</h1>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Share something with your followers.</p>
                    </div>
                    <div className="rounded-2xl bg-rose-50 p-3 text-rose-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                            <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2z" />
                        </svg>
                    </div>
                </div>

            

                <div className="space-y-2">
                    <div className="flex items-end justify-between gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Image</label>
                        {postData.selectedFile && (
                            <button type="button" className="text-xs font-semibold text-rose-600 hover:underline dark:text-rose-300" onClick={handleRemoveImage}>
                                Remove
                            </button>
                        )}
                    </div>

                    <div
                        className={[
                            "relative rounded-2xl border border-dashed p-4 transition",
                            isDragging
                                ? "border-rose-400 bg-rose-50/60 dark:bg-rose-500/10"
                                : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/30",
                        ].join(" ")}
                        onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
                        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
                        onDrop={handleDrop}
                    >
                        {previewSrc ? (
                            <div className="relative">
                                {!previewLoaded && (
                                    <div className="absolute inset-0 animate-pulse">
                                        <div className="h-48 w-full rounded-xl bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800" />
                                    </div>
                                )}
                                <img
                                    src={previewSrc}
                                    alt="preview"
                                    className="h-48 w-full rounded-xl object-cover"
                                    onLoad={() => setPreviewLoaded(true)}
                                    onError={() => setPreviewLoaded(true)}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                                        <path d="M4.502 9a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
                                        <path d="M14.002 3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H2.002a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12zm1 2a1 1 0 0 0-1-1H2.002a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5z" />
                                        <path d="M10.648 8.646a.5.5 0 0 1 .704.062l2.5 3a.5.5 0 0 1-.384.822H3.002a.5.5 0 0 1-.4-.8l2.5-3a.5.5 0 0 1 .78-.04l1.5 1.8 3.266-1.844z" />
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Drop an image here</div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">PNG/JPG up to a few MB.</div>
                                </div>
                            </div>
                        )}

                        <input
                            className="absolute inset-0 cursor-pointer opacity-0"
                            type="file"
                            accept=".jpg, .jpeg, .png"
                            name="selectedFile"
                            onChange={handleFileChange}
                            required={false}
                            aria-label="Upload image"
                        />
                    </div>
                </div>
    <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Caption</label>
                    <textarea
                        className="textarea"
                        maxLength={100}
                        name="message"
                        value={postData.message}
                        onChange={handleMessageChange}
                        placeholder="Write something…"
                    />
                    <div className="text-xs text-slate-500">
                        {postData.message?.length || 0}/100
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Tags</label>
                    <input
                        className="input"
                        value={tagsText}
                        onChange={(e) => setTagsText(`#${e.target.value}`)}
                        placeholder="e.g. travel, food, weekend"
                    />
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        Optional. Up to 10 tags, separated by commas.
                    </div>
                </div>

                <div className="flex w-full gap-2 pt-1">
                    <motion.button type="submit" className="btn btn-primary w-1/2 py-3" {...tap} disabled={postsLoading}>
                        {postsLoading ? 'Posting…' : (post ? 'Save' : 'Post')}
                    </motion.button>
                    <motion.button type="button" className="btn btn-ghost w-1/2 py-3" onClick={handleClear} {...tap} disabled={postsLoading}>
                        Clear
                    </motion.button>
                </div>               
            </form>
        </motion.div>
    );
};

export default UploadPost;