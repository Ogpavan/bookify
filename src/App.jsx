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
import SignUp from './pages/SignUp';
import ReaderDashboard from './pages/Dashboard/ReaderDashboard';
import WriterDashboard from './pages/Dashboard/WriterDashboard';
import RJDashboard from './pages/Dashboard/RJDashboard';
 

const App = () => {
  const userRole = 'reader';

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
          <Route path='/signup' element={<SignUp />} />
          <Route
          path="/dashboard"
          element={
            userRole === 'reader' ? <ReaderDashboard/> :
            userRole === 'writer' ? <WriterDashboard/> :
            <RJDashboard />
          }
        />
            <Route path="/admin" element={<AdminPanel />} />
         
        </Routes>
        <Footer/>
      </Router>
    </BookmarkProvider>
  );
};

export default App;
