// src/components/Navbar.jsx

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import books from '../bookData';
import { FaBookmark } from 'react-icons/fa';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import icons for the mobile menu

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State to manage mobile menu
  const navigate = useNavigate();
  const location = useLocation();

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
    if (searchResults.length > 0) {
      navigate(`/books/${searchResults[0].id}`);
    }
  };

  const handleResultClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="p-4 flex flex-col md:flex-row justify-between items-center bg-white shadow-md">
      <div className="flex justify-between items-center w-full md:w-auto">
        <Link to="/" className="text-2xl font-bold cinzel-decorative-bold">
          Bookify
        </Link>
        <button
          className="text-2xl md:hidden focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      
      <div className={`md:flex md:items-center md:space-x-6 w-full md:w-auto ${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
        <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full md:w-[500px] mt-4 md:mt-0">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="p-2 rounded border border-gray-600 focus:outline-none w-full"
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
        
        <div className="flex flex-col md:flex-row md:items-center mt-4 md:mt-0 gap-3">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className={`text-lg mulish-regular ${location.pathname === '/' ? 'bg-gray-800 text-white px-2 py-1 rounded-full' : ''} md:ml-6`}
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={closeMobileMenu}
            className={`text-lg mulish-regular ${location.pathname === '/about' ? 'bg-gray-800 text-white px-2 py-1 rounded-full' : ''} md:ml-6`}
          >
            About
          </Link>
          <Link
            to="/login"
            onClick={closeMobileMenu}
            className={`text-lg mulish-regular ${location.pathname === '/login' ? 'bg-gray-800 text-white px-2 py-1 rounded-full' : ''} md:ml-6`}
          >
            Login
          </Link>

          <Link
            to="/signup"
            onClick={closeMobileMenu}
            className={`text-lg mulish-regular ${location.pathname === '/signup' ? 'bg-gray-800 text-white px-2 py-1 rounded-full' : ''} md:ml-6`}
          >
            Signup
          </Link>
          <Link
            to="/bookmarks"
            onClick={closeMobileMenu}
            className={`text-lg mulish-regular flex items-center ${location.pathname === '/bookmarks' ? 'bg-gray-800 text-white px-2 py-1 rounded-full' : ''} md:ml-6`}
          >
            <FaBookmark className="ml-1" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
