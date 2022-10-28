import React from "react"

const Footer = () => {
    return(
        <div className="flex justify-center mt-10 p-5">
                <h1 className="">Designed </h1>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-500 hover:text-red-400 transition duration-100 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                </svg>          
                <h1>by Hardik Parmar</h1>
        </div>
    )
}


export default Footer;