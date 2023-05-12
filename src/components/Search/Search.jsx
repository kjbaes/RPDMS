import React from 'react';
import {Search} from 'react-feather'

const SearchField = ({className, placeholder}) => {
    return(
        <div
      className={` ${className} flex items-center justify-center relative w-full md:w-full border-2 border-gray-200 rounded-full focus:outline-none py-1`}
    >
      <input
        type="text"
        name="search"
        className="font-sans font-medium text-indent w-full rounded-full focus:outline-none"
        placeholder={placeholder}
      />
      <div className="absolute right-4">
        <Search className="text-gray-400" size="20"/>
      </div>
    </div>
    )
}

export default SearchField;