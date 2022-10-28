import React from "react"

const Search = () => {
    return (
        <div className="w-full flex justify-center">
            <input className="p-3 w-full m-1 md:w-1/2 border border-gray-300 rounded " type="search" placeholder="Search users or posts" />
        </div>
    )
}

export default Search;