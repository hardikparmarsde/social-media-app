import React, { useEffect, useState } from "react"
import logo from "../images/logo.png";
import { logout } from "../actions/actions";
import decode from 'jwt-decode';
import { Link, useNavigate} from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const Header = ({user, setUser}) => {  
    const navigateTo = useNavigate();  
    const dispatch = useDispatch();
    const location = useLocation();
    const[mobileMenu, setMobileMenu] = useState(false);

    const handleMobileMenu = () => {
        setMobileMenu(!mobileMenu);
    }

//    console.log(params);
    
    const handleLogout = () => {
        dispatch(logout());
        setUser(null);
        navigateTo('/');
    }
    
    useEffect(() => {
        const token = user?.token;
    
        if (token) {
            const decodedToken = decode(token);
    
            if (decodedToken.exp * 1000 < new Date().getTime())
                handleLogout();
        }
    
        setUser(JSON.parse(localStorage.getItem('profile')));
      }, [navigateTo]);
    
    return(
        <nav className="w-full border-gray-300 rounded mb-2 md:border-b md:pr-5 md:pl-5 xs:pl-2 xs:pr-2 mt-2">
            <div className="flex justify-between flex-wrap items-center">
                <div className="flex-none">
                    <Link to='/feed'>
                        <img src={logo} alt="logo" className="md:w-40 xs:w-20"/>
                    </Link>
                </div>                
                {
                    user &&
                <div className="md:hidden sm:block">
                    <button onClick={handleMobileMenu} className="">
                        {
                        mobileMenu ? 
                            <svg className="fill-gray-800" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                            :
                            <svg className="fill-gray-800" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                            </svg>
                        }
                    </button>
                </div>
                }
                {
                user &&                
                <div className="hidden md:block p-2">
                    <ul className="flex md:space-x-8 md:text-sm md:font-medium items-center">
                        <Link to='/feed'>
                            <li>    
                                {
                                    location.pathname === '/feed' 
                                    ? 
                                    <a className="block py-2 text-red-600">Feed</a>
                                    :
                                    <a className="block py-2 text-gray-700">Feed</a>
                                }
                            </li>
                        </Link>
                        <Link to='/post'>
                            <li>
                                {
                                    location.pathname === '/post' 
                                    ? 
                                    <a className="block py-2 text-red-600 bg-gray-50">Post</a>
                                    :
                                    <a className="block py-2 text-gray-700 bg-gray-50">Post</a>
                                }
                            </li>
                        </Link>
                            <li>
                                <a onClick={handleLogout} className="block py-2 text-gray-700 cursor-pointer bg-gray-50">
                                    Logout
                                </a>
                            </li>
                    </ul>
                </div>
            }
            </div>
            {
            mobileMenu && user &&
            <div className="md:hidden w-full p-2">
                <ul className="flex flex-col mt-4 items-center">
                    <Link to='/feed'>
                        <li>    
                            {
                                location.pathname === '/feed' 
                                ? 
                                <a className="block py-2 text-red-600 bg-gray-50">Feed</a>
                                :
                                <a className="block py-2 text-gray-700 bg-gray-50">Feed</a>
                            }
                        </li>
                    </Link>
                    <Link to='/post'>
                        <li>
                            {
                                location.pathname === '/post' 
                                ? 
                                <a className="block py-2 text-red-600 bg-gray-50">Post</a>
                                :
                                <a className="block py-2 text-gray-700 bg-gray-50">Post</a>
                            }
                        </li>
                    </Link>
                    <li>
                        <a onClick={handleLogout} className="block cursor-pointer py-2 pr-4 pl-3 text-gray-700 rounded">
                            Logout
                        </a>
                    </li>
                </ul>
            </div>
            }
        </nav>
)}


export default Header;