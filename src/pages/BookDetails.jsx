// src/pages/BookDetails.jsx

import React from 'react';
import { useParams } from 'react-router-dom';
import books from '../bookData';
import { useBookmarks } from '../context/BookmarkContext';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

const BookDetails = () => {
  const { id } = useParams();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const book = books.find((b) => b.id === parseInt(id));

  if (!book) {
    return <div className="text-center text-2xl font-semibold">Book not found</div>;
  }

  const handleBookmark = () => {
    if (isBookmarked(book.id)) {
      removeBookmark(book.id);
    } else {
      addBookmark(book);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-5xl font-extrabold text-center mb-6">{book.title}</h1>
      <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-8">
        <img 
          src={book.coverImage} 
          alt={book.title} 
          className="w-60 h-80 object-cover shadow-lg mb-6 lg:mb-0" 
        />
        <div className="flex-1">
          <p className="text-lg leading-relaxed mb-2 text-justify">{book.description}</p>
          
          <div className="mb-4">
            <p className="text-xl font-semibold">Author: {book.author}</p>
            <div className="flex items-center justify-between ">
              <div className='flex items-center '>
              <p className="text-lg font-medium mr-2">Rating:</p>
              <div className="flex space-x-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={index < book.rating ? "gold" : "none"}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                    />
                  </svg>
                ))}
              </div>
              </div>
              <button
            onClick={handleBookmark}
            className={` py-2 px-6 border rounded-lg transition-colors duration-300 ${
              isBookmarked(book.id) ? '' : ''
            }`}
          >
            {isBookmarked(book.id) ? <FaBookmark/> : <FaRegBookmark />}
          </button>
            </div>
          </div>

          <div className="prose max-w-none text-justify">
            <p>{book.content}</p>
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
