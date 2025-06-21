import React, { useState } from "react";
import "./SearchBar.scss";
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Tìm kiếm..." 
          value={searchTerm}
          onChange={handleChange}
        />
      </div>
      <button 
        type="button" 
        className="search-button"
        onClick={handleSearch}
      >
        <span className="arrow-icon">→</span>
      </button>
    </div>
  );
};

export default SearchBar;
