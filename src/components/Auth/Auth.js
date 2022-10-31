import React, { useEffect, useState } from "react";

import { useDispatch } from 'react-redux';
import { useNavigate} from "react-router-dom";
import {  signIn, signUp } from "../../actions/actions";


const Auth = () => {

    const dispatch = useDispatch();
    const navigateTo = useNavigate();

    const[showPassword, setShowPassword] = useState(false);
    const helperText = '*this field is required';
    const[formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const[emptyErrors, setEmptyErrors] = useState({
        email:false,
        password:false,
        confirmPassword:false,
        firstName:false,
        lastName:false
    });

    const[passwordWarning, setPasswordWarning] = useState(false);
    const[isSignUp, setIsSignUp] = useState(false);
    const[message, setMessage] = useState();
    const[showMessage, setShowMessage] = useState(false)
    const[isPasswordValid, setIspasswordValid] = useState(true);
        
    const handleOnSubmit = (e) => {
        e.preventDefault();
        if(!isSignUp && (!formData.email || !formData.password)) {
            setEmptyErrors({ ...emptyErrors, email: !formData.email, password: !formData.password});
            return;
        }

        if(isSignUp && (!formData.email || !formData.password || !formData.confirmPassword || !formData.firstName || !formData.lastName)){
            setEmptyErrors({ ...emptyErrors, email: !formData.email, password: !formData.password, confirmPassword: !formData.confirmPassword, firstName: !formData.firstName, lastName: !formData.lastName});
            return;
        }

        if(formData.password.length < 6) {
            setIspasswordValid(false);
            return;
        } 

        if(isSignUp && (formData.password !== formData.confirmPassword)) {
            setPasswordWarning(true);
            return;
        }
        if(isSignUp) 
            return dispatch(signUp(formData, navigateTo));
        else
            return dispatch(signIn(formData, navigateTo));        
    }

    const switchMode = (e)  => {
        e.preventDefault();
        setIsSignUp(!isSignUp);
    }

    const handleEmail = (e) => {
        if(e.target.value) 
            setEmptyErrors({ ...emptyErrors, email:false});

        setFormData({...formData, email: e.target.value});
    }

    const handleFirstName = (e) => {
        if(e.target.value) 
            setEmptyErrors({ ...emptyErrors, firstName:false});
            
        setFormData({...formData, firstName: e.target.value});
    }

    const handleLastName = (e) => {
        if(e.target.value) 
            setEmptyErrors({ ...emptyErrors, lastName:false});
            
        setFormData({...formData, lastName: e.target.value});
    }

    const handlePassword = (e) => {
        if(e.target.value) 
            setEmptyErrors({ ...emptyErrors, password:false});
        if(e.target.value.length >= 6) 
            setIspasswordValid(true);
                
        setFormData({...formData, password: e.target.value});
    }

    const handleConfirmPassword = (e) => {
        if(e.target.value) 
            setEmptyErrors({ ...emptyErrors, confirmPassword:false});

        if(e.target.value === formData.password) 
            setPasswordWarning(false);

        setFormData({...formData, confirmPassword: e.target.value});        
    }

    return(
        <div className="w-full sm:w-96 sm:mx-auto md:w-1/3">
            <form className="p-5 shadow-lg space-y-2" onSubmit={handleOnSubmit}>
                <div className="flex justify-center ">
                    <svg className="fill-red-400" xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                    </svg>
                    {/* <h1 className="text-red-400 ">{ isSignUp ?  'Sign Up' : 'Sign In' }</h1> */}
                </div>
                <div className="px-2 py-2 space-y-2">
                    {   
                        !isSignUp && showMessage && 
                        <div class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                            <span class="font-medium">{message}</span> 
                      </div>
                    }
                    {   
                        isSignUp && !isPasswordValid && 
                        <div class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                            <span>password should contain at least 6 characters</span> 
                      </div>
                    }
                    {   
                        isSignUp && passwordWarning && 
                        <div class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                            <span class="font-medium">Passwords does not match!</span>
                       </div>
                    }
                    <div className="">
                        <input className="w-full rounded border border-gray-300 p-2 text-gray-800" name ="creator" type="email" placeholder="Email Address" value={formData.email} onChange={handleEmail} />
                        {
                            emptyErrors.email && <span className="text-red-500">{helperText}</span>
                        }
                    </div>
                    {
                        isSignUp && 
                        <div className="w-full grid grid-cols-2 space-x-2 "> 
                            <div className="">
                                <input className="w-full rounded border border-gray-300 p-2" name="first-name" type="text"   placeholder="First Name" value={formData.firstName} onChange={handleFirstName} />
                                {
                                    emptyErrors.firstName && <span className="text-red-500">{helperText}</span>
                                }
                            </div>

                            <div className="">
                                <input className="w-full rounded border border-gray-300 p-2" name="last-name" type="text"   placeholder="Last Name" value={formData.lastName} onChange={handleLastName} />
                                {
                                    emptyErrors.lastName && <span className="text-red-500">{helperText}</span>
                                }
                            </div>
                        </div>
                    }

                <div>
                    <div className="relative w-full flex items-center">
                        <input className="w-full rounded border border-gray-300 p-2" name="password" type={showPassword ? 'text': 'password'}   placeholder="Password" value={formData.password} onChange={handlePassword} min={6} max={12} />
                        <label htmlFor="password" className="cursor-pointer absolute right-2" onClick={() => setShowPassword(!showPassword)}>
                            { 
                                showPassword ?
                                <svg className="fill-gray-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"/>
                                    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z"/>
                                </svg>
                                :
                                <svg className="fill-gray-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16"  viewBox="0 0 16 16">
                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                                </svg> 
                            }
                        </label>
                    </div>
                    <div>
                    {
                        emptyErrors.password && <span className="text-red-500">{helperText}</span>
                    }
                    </div>
                </div>
                    {
                        isSignUp &&
                        <div className="space-y-1">     
                            <input className="w-full rounded border border-gray-300 p-2" name="confirm-password" type='password'  placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleConfirmPassword}/>
                            {
                                emptyErrors.confirmPassword && <span className="text-red-500">{helperText}</span>
                            }
                        </div>
                    }
                </div>   
                <div className="w-full px-2 space-y-2">
                        <button type="submit" className="w-full p-3 bg-red-400 text-white rounded">{ isSignUp?'Sign Up':'Sign In'}</button>
                        <button onClick={switchMode} className="w-full p-3 text-gray-700 ">{ isSignUp?'Already have an account? Sign In here':"Don't have an account? Sign Up here"}</button>
                </div>   
            </form>
        </div>   
    )   
}


export default Auth;