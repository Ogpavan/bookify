// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import BookDetail from './pages/BookDetails';
import Bookmarks from './pages/BookMarks';
import About from './pages/About';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel'; // Import the admin panel component
import { BookmarkProvider } from './context/BookmarkContext';
import Footer from './components/Footer';
 

const App = () => {
 

  return (
    <BookmarkProvider>
      <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
           
            <Route path="/admin" element={<AdminPanel />} />
         
        </Routes>
        <Footer/>
      </Router>
    </BookmarkProvider>
  );
};

export default App;
