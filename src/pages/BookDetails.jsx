import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBookmarks } from '../context/BookmarkContext';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/books/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBook(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleBookmark = () => {
    if (isBookmarked(book._id)) {
      removeBookmark(book._id);
    } else {
      addBookmark(book);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the book titled "${book.title}"?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/books/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete the book');
      }
      alert('Book deleted successfully');
      navigate('/'); // Redirect to the homepage or books list after deletion
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const parseContent = (content) => {
    if (!content) return '';

    // Convert **bold** to <b>bold</b>
    const bolded = content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // Convert _italic_ to <i>italic</i>
    const italicized = bolded.replace(/_(.*?)_/g, '<i>$1</i>');

    return italicized;
  };

  if (loading) {
    return <div className="text-center text-2xl font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-2xl font-semibold">Error: {error}</div>;
  }

  if (!book) {
    return <div className="text-center text-2xl font-semibold">Book not found</div>;
  }

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
            <div className="flex items-center justify-between">
              <div className='flex items-center'>
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
                className={`py-2 px-6 border rounded-lg transition-colors duration-300 flex justify-center items-center gap-2 ${
                  isBookmarked(book._id) ? '' : ''
                }`}
              >
                {isBookmarked(book._id) ? <FaBookmark /> : <FaRegBookmark />} {isBookmarked(book._id) ? 'Bookmarked' : "Bookmark"}
              </button>
            </div>
          </div>

          {/* Render parsed content */}
          <div className="prose max-w-none text-justify">
            <div dangerouslySetInnerHTML={{ __html: parseContent(book.content) }} />
          </div>

          {/* Delete Button for Admin */}
          <button
            onClick={handleDelete}
            className="mt-6 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300"
          >
            Delete Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
