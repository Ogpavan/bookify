// src/components/Navbar.jsx

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import books from '../bookData'; // Ensure this path is correct
import { FaBookmark } from 'react-icons/fa';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      const results = books.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // You could handle navigation here if needed
    if (searchResults.length > 0) {
      navigate(`/books/${searchResults[0].id}`);
    }
  };

  const handleResultClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  return (
    <nav className="p-4 flex flex-col md:flex-row justify-between items-center">
      <Link to="/" className="text-xl font-bold cinzel-decorative-bold">
        Bookify
      </Link>
      <form onSubmit={handleSearchSubmit} className="relative flex items-center w-[500px] ">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-2 rounded border border-gray-600 focus:outline-none w-full hidden md:block"
        />
        {searchResults.length > 0 && (
          <ul className="absolute top-full left-0 mt-2 w-full bg-white text-gray-800 border border-gray-300 rounded-lg shadow-lg z-10">
            {searchResults.map((book) => (
              <li
                key={book.id}
                onClick={() => handleResultClick(book.id)}
                className="cursor-pointer p-2 hover:bg-gray-100"
              >
                <p>{book.title}</p>
              </li>
            ))}
          </ul>
        )}
      </form>
      <div className="flex items-center space-x-6">
        <Link
          to="/"
          className={`text-lg mulish-regular ${location.pathname === '/' ? 'underline' : ''}`}
        >
          Home
        </Link>
        <Link
          to="/about"
          className={`text-lg mulish-regular ${location.pathname === '/about' ? 'underline' : ''}`}
        >
          About
        </Link>
        <Link
          to="/login"
          className={`text-lg mulish-regular ${location.pathname === '/login' ? 'underline' : ''}`}
        >
          Login
        </Link>
        <Link
          to="/bookmarks"
          className={`text-lg mulish-regular ${location.pathname === '/bookmarks' ? 'underline' : ''}`}
        >
           <FaBookmark />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
