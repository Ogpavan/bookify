// src/pages/Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import books from '../bookData';

const Home = () => {
  return (
    <div>
      <div className="relative">
        <img
          src='https://subsolardesigns.com/odrin/demo1/wp-content/uploads/sites/8/2017/08/header-e1502802357504.jpg'
          alt="Header"
          className='w-full h-[80vh] object-cover'
        />
        <div className="absolute inset-0 bg-black opacity-60"></div> {/* Darkening overlay */}
        <div className="absolute inset-0 flex items-center flex-col gap-3 justify-center text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold cinzel-decorative-bold">Welcome</h1>
          <p className="mt-2  text-sm w-[80%] md: md:w-auto md:text-lg font-light text-wrap">You can never get a cup of tea large enough or a book long enough to suit me.</p>
          <div className="max-w-lg mx-auto flex flex-col justify-center items-center gap-4 mt-10 sm:flex-row md:mt-8 lg:mt-10">
            <a className="group relative inline-flex border border-red-500 focus:outline-none w-full sm:w-auto" href="/docs">
              <span className="w-full inline-flex items-center justify-center self-stretch px-4 py-2 text-sm text-white text-center uppercase bg-red-500 ring-1 ring-red-500 ring-offset-1 ring-offset-red-500 transform transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1 group-focus:-translate-y-1 group-focus:-translate-x-1 mulish-regular">
                Explore Books
              </span>
            </a>
            <a className="group relative inline-flex border border-red-600 focus:outline-none w-full sm:w-auto" href="/login" target="_blank">
              <span className="w-full inline-flex items-center justify-center self-stretch px-4 py-2 text-sm text-red-600 text-center uppercase bg-white ring-1 ring-red-600 ring-offset-1 transform transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1 group-focus:-translate-y-1 group-focus:-translate-x-1 mulish-regular">
                Login & Signup
              </span>
            </a>
          </div>
        </div>
      </div>
      <div className="px-4 mt-4">
        <div className="flex flex-wrap gap-x-4 gap-y-8 justify-center items-center ">
          {books.map((book) => (
            <div key={book.id} className="border p-4 flex flex-col space-y-4 bg-white shadow-md rounded  md:w-[250px]">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full md:h-48 object-cover rounded"
              />
              <div>
                <Link to={`/books/${book.id}`} className="text-xl font-bold text-gray-700  ">
                  {book.title}
                </Link>
                <p className="text-gray-500 mulish-light text-sm mt-1">{book.description}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-yellow-500">⭐⭐⭐⭐⭐</span> {/* Example rating */}
                </div>
                <Link to={`/books/${book.id}`} className="mt-4 inline-block text-blue-600 mulish-regular">
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
