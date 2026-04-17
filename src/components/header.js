import React, { useEffect, useState, useCallback } from "react";
import { logout } from "../actions/actions";
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { persistor } from "../store/store";
import AuthRequiredModal from "./ui/AuthRequiredModal";

const BrandMark = ({ className }) => (
    <svg
        viewBox="0 0 40 40"
        width="28"
        height="28"
        className={className}
        aria-hidden="true"
        focusable="false"
    >
        <defs>
            <linearGradient id="ls-grad" x1="6" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#7c3aed" />
                <stop offset="0.5" stopColor="#6366f1" />
                <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
        </defs>
        {/* Outer ring / sphere */}
        <path
            d="M20 4.75c8.422 0 15.25 6.828 15.25 15.25S28.422 35.25 20 35.25 4.75 28.422 4.75 20 11.578 4.75 20 4.75Z"
            fill="url(#ls-grad)"
            opacity="0.18"
        />
        <path
            d="M20 6.75c7.318 0 13.25 5.932 13.25 13.25S27.318 33.25 20 33.25 6.75 27.318 6.75 20 12.682 6.75 20 6.75Z"
            fill="none"
            stroke="url(#ls-grad)"
            strokeWidth="2.25"
        />
        {/* Link nodes */}
        <circle cx="13" cy="16" r="3.25" fill="url(#ls-grad)" />
        <circle cx="27" cy="15" r="3.25" fill="url(#ls-grad)" />
        <circle cx="22.5" cy="27" r="3.25" fill="url(#ls-grad)" />
        {/* Links */}
        <path d="M15.7 17.1l8.1-1.1" stroke="url(#ls-grad)" strokeWidth="2.25" strokeLinecap="round" />
        <path d="M25.6 17.2l-2.1 7" stroke="url(#ls-grad)" strokeWidth="2.25" strokeLinecap="round" />
        <path d="M16 18.7l4.8 6.4" stroke="url(#ls-grad)" strokeWidth="2.25" strokeLinecap="round" />
    </svg>
);

const Header = ({ setItemOffset }) => {
    const navigateTo = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const user = useSelector((state) => state.auth.user);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);

    const pathname = location.pathname;
    const isLoginRoute = pathname === '/auth/login';
    const isSignupRoute = pathname === '/auth/signup';
    const isAuthed = Boolean(user?.token);

    useEffect(() => {
        const saved = localStorage.getItem('theme');
        const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
        const shouldBeDark = saved ? saved === 'dark' : Boolean(prefersDark);

        setIsDark(shouldBeDark);
        document.documentElement.classList.toggle('dark', shouldBeDark);
    }, []);

    const toggleTheme = useCallback(() => {
        setIsDark((prev) => {
            const next = !prev;
            document.documentElement.classList.toggle('dark', next);
            localStorage.setItem('theme', next ? 'dark' : 'light');
            return next;
        });
    }, []);

    const handleMobileMenu = useCallback(() => {
        setMobileMenu((prev) => !prev);
    }, []);

    const handleLogout = useCallback(async () => {
        try {
            await dispatch(logout()).unwrap();
        } finally {
            // Ensure persisted auth is wiped so refresh can't restore session
            await persistor.purge();
            navigateTo('/auth', { replace: true });
        }
    }, [dispatch, navigateTo]);

    // Check if token is expired
    useEffect(() => {
        const token = user?.token;

        if (token) {
            try {
                const decodedToken = jwtDecode(token);

                if (decodedToken.exp * 1000 < new Date().getTime()) {
                    handleLogout();
                }
            } catch (error) {
                console.error('Invalid token:', error);
                handleLogout();
            }
        }
    }, [user?.token, handleLogout]);

    const handleFeed = useCallback(() => {
        if (typeof setItemOffset === 'function') setItemOffset(0);
        setMobileMenu(false);
    }, [setItemOffset]);

    return (
        <>
        <nav className="sticky top-0 z-40 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/70">
            <div className="app-container">
                <div className="flex h-16 items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Link to="/feed" onClick={handleFeed} className="flex items-center gap-2">
                            <BrandMark className="shrink-0" />
                            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-50 sm:text-xl">
                                LinkSphere
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={toggleTheme} className="btn btn-ghost h-10 w-10 p-0" aria-label="Toggle theme">
                            {isDark ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                                    <path d="M12.742 10.472a.5.5 0 0 1 .3.91A6.5 6.5 0 1 1 4.618 2.958a.5.5 0 0 1 .91.3A5.5 5.5 0 0 0 12.742 10.472z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                                    <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                                    <path d="M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zM3.05 2.343a.5.5 0 0 1 .707 0l1.414 1.414a.5.5 0 1 1-.707.707L3.05 3.05a.5.5 0 0 1 0-.707zm7.778 7.778a.5.5 0 0 1 .707 0l1.414 1.414a.5.5 0 1 1-.707.707l-1.414-1.414a.5.5 0 0 1 0-.707zM0 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 8zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 13 8zM2.343 12.95a.5.5 0 0 1 0-.707l1.414-1.414a.5.5 0 1 1 .707.707L3.05 12.95a.5.5 0 0 1-.707 0zm7.778-7.778a.5.5 0 0 1 0-.707l1.414-1.414a.5.5 0 1 1 .707.707L10.828 5.172a.5.5 0 0 1-.707 0z" />
                                </svg>
                            )}
                        </button>

                        {user && (
                            <div className="md:hidden">
                                <button onClick={handleMobileMenu} className="btn btn-ghost px-3" aria-label="Toggle menu">
                                    {mobileMenu ? (
                                        <svg className="fill-slate-800 dark:fill-slate-100" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 16 16">
                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                        </svg>
                                    ) : (
                                        <svg className="fill-slate-800 dark:fill-slate-100" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        )}

                        <div className="hidden md:flex items-center gap-2">
                        <Link
                            to="/feed"
                            onClick={handleFeed}
                            className={`btn px-3  ${location.pathname === '/feed' ? 'btn-soft' : 'btn-ghost'}`}
                        >
                            Feed
                        </Link>
                        <Link
                            to="/post"
                            onClick={(e) => {
                                if (!isAuthed) {
                                    e.preventDefault();
                                    setAuthModalOpen(true);
                                }
                            }}
                            className={`btn px-3 ${location.pathname === '/post' ? 'btn-soft' : 'btn-ghost'}`}
                        >
                            Post
                        </Link>
                        {isAuthed ? (
                            <button onClick={handleLogout} className="btn btn-primary">
                                Logout
                            </button>
                        ) : (
                            <>
                                {!isLoginRoute && (
                                    <Link to="/auth/login" className="btn btn-primary">
                                        Sign in
                                    </Link>
                                )}
                                {!isSignupRoute && (
                                    <Link to="/auth/signup" className="btn btn-primary">
                                        Sign up
                                    </Link>
                                )}
                            </>
                        )}
                            </div>
                    </div>
            </div>
            {mobileMenu && user && (
                <div className="md:hidden pb-4">
                    <div className="app-container">
                        <div className="card p-3">
                            <div className="flex flex-col gap-2">
                                <Link
                                    to="/feed"
                                    onClick={handleFeed}
                                    className={`btn w-full justify-start ${location.pathname === '/feed' ? 'btn-soft' : 'btn-ghost'}`}
                                >
                                    Feed
                                </Link>
                                <Link
                                    to="/post"
                                    onClick={() => setMobileMenu(false)}
                                    className={`btn w-full justify-start ${location.pathname === '/post' ? 'btn-soft' : 'btn-ghost'}`}
                                >
                                    Post
                                </Link>
                                <button onClick={handleLogout} className="btn btn-primary w-full">
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </nav>
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

export default Header;