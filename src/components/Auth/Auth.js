import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout, signIn, signUp } from "../../actions/actions";
import { motion, useMotionVariants } from "../ui/motion";

const Auth = ({ mode = 'login' }) => {
    const dispatch = useDispatch();
    const navigateTo = useNavigate();
    const location = useLocation();
    const { loading, error } = useSelector((state) => state.auth);

    const { fadeUp } = useMotionVariants();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [isSignUp, setIsSignUp] = useState(mode === 'signup');
    const [fieldErrors, setFieldErrors] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
    });

    useEffect(() => {
        setIsSignUp(mode === 'signup');
    }, [mode]);

    const handleOnSubmit = useCallback((e) => {
        e.preventDefault();
        const nextErrors = { email: '', password: '', confirmPassword: '', firstName: '', lastName: '' };
        const email = String(formData.email || '').trim();
        const password = String(formData.password || '');
        const confirmPassword = String(formData.confirmPassword || '');
        const firstName = String(formData.firstName || '').trim();
        const lastName = String(formData.lastName || '').trim();

        if (!email) nextErrors.email = 'Email is required.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Please enter a valid email address.';

        if (!password) nextErrors.password = 'Password is required.';
        else if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters.';

        if (isSignUp) {
            if (!firstName) nextErrors.firstName = 'First name is required.';
            if (!lastName) nextErrors.lastName = 'Last name is required.';
            if (!confirmPassword) nextErrors.confirmPassword = 'Please confirm your password.';
            else if (password && confirmPassword !== password) nextErrors.confirmPassword = 'Passwords do not match.';
        }

        const hasAny = Object.values(nextErrors).some(Boolean);
        if (hasAny) {
            setFieldErrors(nextErrors);
            return;
        }

        const from = location.state?.from || '/feed';

        if (isSignUp) {
            dispatch(signUp({ formData }))
                .unwrap()
                .then(async () => {
                    // After sign up, force user through sign-in screen
                    await dispatch(logout()).unwrap();
                    navigateTo('/auth/login', {
                        replace: true,
                        state: { from, message: 'Account created. Please sign in.' },
                    });
                })
                .catch(() => {});
        } else {
            dispatch(signIn({ formData }))
                .unwrap()
                .then(() => navigateTo(from, { replace: true }))
                .catch(() => {});
        }
    }, [isSignUp, formData, dispatch, navigateTo, location.state?.from]);

    const handleEmail = useCallback((e) => {
        setFieldErrors((prev) => ({ ...prev, email: '' }));
        setFormData((prev) => ({ ...prev, email: e.target.value }));
    }, []);

    const handleFirstName = useCallback((e) => {
        setFieldErrors((prev) => ({ ...prev, firstName: '' }));
        setFormData((prev) => ({ ...prev, firstName: e.target.value }));
    }, []);

    const handleLastName = useCallback((e) => {
        setFieldErrors((prev) => ({ ...prev, lastName: '' }));
        setFormData((prev) => ({ ...prev, lastName: e.target.value }));
    }, []);

    const handlePassword = useCallback((e) => {
        setFieldErrors((prev) => ({ ...prev, password: '', confirmPassword: '' }));
        setFormData((prev) => ({ ...prev, password: e.target.value }));
    }, []);

    const handleConfirmPassword = useCallback((e) => {
        setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
        setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }));
    }, []);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    return (
        <motion.div className="mx-auto w-full max-w-md" {...fadeUp}>
            <form className="card card-hover p-5 sm:p-6 space-y-4" onSubmit={handleOnSubmit}>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            {isSignUp ? 'Create your account' : 'Welcome back'}
                        </h1>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            {isSignUp ? 'Sign up to start posting to your feed.' : 'Sign in to continue to your feed.'}
                        </p>
                    </div>
                    <div className="rounded-2xl bg-rose-50 p-3 text-rose-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                        </svg>
                    </div>
                </div>

                <div className="space-y-3">
                    {location.state?.message && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-200" role="status">
                            {location.state.message}
                        </div>
                    )}
                    {error && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800" role="alert">
                            <span className="font-semibold">{error}</span>
                        </div>
                    )}
                    <div className="space-y-1">
                        <input
                            className="input"
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleEmail}
                            aria-invalid={fieldErrors.email ? 'true' : 'false'}
                        />
                        {fieldErrors.email && <span className="text-sm text-rose-600">{fieldErrors.email}</span>}
                    </div>
                    {isSignUp && (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="space-y-1">
                                <input
                                    className="input"
                                    name="first-name"
                                    type="text"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleFirstName}
                                    aria-invalid={fieldErrors.firstName ? 'true' : 'false'}
                                />
                                {fieldErrors.firstName && <span className="text-sm text-rose-600">{fieldErrors.firstName}</span>}
                            </div>

                            <div className="space-y-1">
                                <input
                                    className="input"
                                    name="last-name"
                                    type="text"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleLastName}
                                    aria-invalid={fieldErrors.lastName ? 'true' : 'false'}
                                />
                                {fieldErrors.lastName && <span className="text-sm text-rose-600">{fieldErrors.lastName}</span>}
                            </div>
                        </div>
                    )}

                    <div>
                        <div className="relative w-full flex items-center">
                            <input
                                className="input pr-10"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={formData.password}
                                onChange={handlePassword}
                                minLength={6}
                                aria-invalid={fieldErrors.password ? 'true' : 'false'}
                            />
                            <button
                                type="button"
                                className="absolute right-2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                                onClick={togglePasswordVisibility}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <svg className="fill-gray-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                        <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                                        <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
                                    </svg>
                                ) : (
                                    <svg className="fill-gray-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div>
                            {fieldErrors.password && <span className="text-sm text-rose-600">{fieldErrors.password}</span>}
                        </div>
                    </div>
                    {isSignUp && (
                        <div className="space-y-1">
                            <div className="relative w-full flex items-center">
                                <input
                                    className="input pr-10"
                                    name="confirm-password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleConfirmPassword}
                                    aria-invalid={fieldErrors.confirmPassword ? 'true' : 'false'}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                                    onClick={togglePasswordVisibility}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <svg className="fill-gray-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                            <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                                            <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
                                        </svg>
                                    ) : (
                                        <svg className="fill-gray-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {fieldErrors.confirmPassword && <span className="text-sm text-rose-600">{fieldErrors.confirmPassword}</span>}
                        </div>
                    )}
                </div>

                <div className="space-y-2 pt-1">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full py-3"
                    >
                        {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                    </button>
                    {isSignUp ? (
                        <Link to="/auth/login" className="btn btn-ghost w-full py-3 text-center">
                            Already have an account? Sign In
                        </Link>
                    ) : (
                        <Link to="/auth/signup" className="btn btn-ghost w-full py-3 text-center">
                            Don&apos;t have an account? Sign Up
                        </Link>
                    )}
                </div>
            </form>
        </motion.div>
    );
};

export default Auth;