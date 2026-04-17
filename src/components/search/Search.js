import React from "react"

const Search = () => {
    return (
        <div className="w-full flex justify-center">
            <div className="w-full max-w-2xl">
                <input className="input" type="search" placeholder="Search users or posts" />
            </div>
        </div>
    )
}

export default Search;