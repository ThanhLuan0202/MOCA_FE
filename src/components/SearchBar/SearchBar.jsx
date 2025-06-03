import React from "react";
import "./SearchBar.scss";
// Assuming you might use a library like react-icons for the search icon
// import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        {/* Add a search icon here, e.g., <FaSearch className="search-icon" /> */}
        <input type="text" className="search-input" placeholder="Tìm kiếm" />
      </div>
      <button className="search-button"></button>
    </div>
  );
};

export default SearchBar;
