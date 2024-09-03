import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md';

const Home = () => {
  const [booksByGenre, setBooksByGenre] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/books');
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        console.log(data);

        // Group books by genre
        const groupedBooks = data.reduce((acc, book) => {
          if (!acc[book.genre]) {
            acc[book.genre] = [];
          }
          acc[book.genre].push(book);
          return acc;
        }, {});

        setBooksByGenre(groupedBooks);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return ( <div>
    <div className="relative">
      <img
        src="https://subsolardesigns.com/odrin/demo1/wp-content/uploads/sites/8/2017/08/header-e1502802357504.jpg"
        alt="Header"
        className="w-full h-[80vh] object-cover"
      />
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="absolute inset-0 flex items-center flex-col gap-3 justify-center text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold cinzel-decorative-bold">Welcome</h1>
        <p className="mt-2 text-sm w-[80%] md:w-auto md:text-lg font-light text-wrap">
          You can never get a cup of tea large enough or a book long enough to suit me.
        </p>
        <div className="max-w-lg mx-auto flex flex-col justify-center items-center gap-4 mt-10 sm:flex-row md:mt-8 lg:mt-10">
          <a
            className="group relative inline-flex border border-red-500 focus:outline-none w-full sm:w-auto"
            href="#genre"
          >
            <span className="w-full inline-flex items-center justify-center self-stretch px-4 py-2 text-sm text-white text-center uppercase bg-red-500 ring-1 ring-red-500 ring-offset-1 ring-offset-red-500 transform transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1 group-focus:-translate-y-1 group-focus:-translate-x-1 mulish-regular">
              Explore Books
            </span>
          </a>
          <Link to={'/signup'}
            className="group relative inline-flex border border-red-600 focus:outline-none w-full sm:w-auto"
            
          >
            <span className="w-full inline-flex items-center justify-center self-stretch px-4 py-2 text-sm text-red-600 text-center uppercase bg-white ring-1 ring-red-600 ring-offset-1 transform transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1 group-focus:-translate-y-1 group-focus:-translate-x-1 mulish-regular">
              Login & Signup
            </span>
          </Link>
        </div>
        <div className='flex gap-x-10 mt-16 cinzel-decorative-regular text-xl'>
        <p>4000+ Books</p>
        
        <p>1000+ Authors</p>
        <p>100+ RJ</p>
      </div>
      </div>
     
    </div>
 
    <div className='md:p-16 p-5'>
      {Object.keys(booksByGenre).map((genre) => (
        <div key={genre} className="mb-8  " id='genre'>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{genre}</h2>
          <div className="flex overflow-x-auto space-x-4 overflow-hidden border p-2">
            {booksByGenre[genre].map((book) => (
              <div key={book._id} className="flex-shrink-0 w-48 border p-4 flex flex-col space-y-4 bg-white shadow-md rounded">
                <img
                  src={book.coverImage || 'https://via.placeholder.com/150'}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded"
                />
                <div>
                  <Link to={`/books/${book._id}`} className="text-xl font-bold text-gray-700">
                    {book.title}
                  </Link>
                  <p className="text-gray-600 text-sm mt-2 italic">"{book.description}"</p>
                  <p className="text-gray-600 text-sm mt-2">By: {book.author}</p>
                  <Link to={`/books/${book._id}`} className="mt-4 flex items-center justify-between border hover:text-white hover:bg-black rounded-md px-4 py-2 text-sm mulish-regular">
                    <span>Read More</span>
                    <span><MdOutlineKeyboardDoubleArrowRight /></span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="mt-4">
            <Link to={`/genre/${genre}`} className="text-blue-600 hover:text-blue-800">
              View More
            </Link>
          </div> */}
        </div>
      ))}
    </div>
    </div>
  );
};

export default Home;
