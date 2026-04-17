import React from "react"

const Footer = () => {
    return(
        <footer className=" border-slate-200/70 bg-transparent">
            <div className="app-container py-8">
                <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-600">
                    <span className="dark:text-white">Designed with</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-rose-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="dark:text-white">by Hardik Parmar</span>
                </div>
            </div>
        </footer>
    )
}


export default Footer;