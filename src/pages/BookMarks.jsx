// src/pages/Bookmarks.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useBookmarks } from '../context/BookmarkContext';

const Bookmarks = () => {
  const { bookmarks } = useBookmarks();

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Bookmarked Books</h2>
      <ul className="space-y-4">
        {bookmarks.length === 0 ? (
          <p>No bookmarks yet.</p>
        ) : (
          bookmarks.map((book) => (
            <li key={book.id} className="border-b pb-2 flex items-center space-x-4">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-24 h-36 object-cover"
              />
              <div>
                <Link to={`/books/${book.id}`} className="text-xl text-blue-600 hover:underline">
                  {book.title}
                </Link>
                <p className="text-gray-700">{book.description}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Bookmarks;
