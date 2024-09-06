import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import BookDetail from './pages/BookDetails';
import Bookmarks from './pages/BookMarks';
import About from './pages/About';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel'; 
import { BookmarkProvider } from './context/BookmarkContext';
import Footer from './components/Footer';
import SignUp from './pages/SignUp';
import ReaderDashboard from './pages/Dashboard/ReaderDashboard';
import WriterDashboard from './pages/Dashboard/WriterDashboard';
import RJDashboard from './pages/Dashboard/RJDashboard';
import { auth, db } from '../src/pages/firebaseConfig'; // Assuming firebaseConfig is correctly set up
import { getDoc, doc } from 'firebase/firestore';

const App = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      }
    };

    fetchUserRole();
  }, []);

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
          <Route path="/signup" element={<SignUp />} />
          {/* <Route
            path="/dashboard"
            element={
              userRole === 'reader' ? <ReaderDashboard /> :
              userRole === 'writer' ? <WriterDashboard /> :
              userRole === 'RJ' ? <RJDashboard /> :
              <Login /> // Redirect to login if role is undefined
            }
          /> */}
          <Route path="/reader-dashboard" element={<ReaderDashboard />} />
          <Route path="/writer-dashboard" element={<WriterDashboard />} />
          <Route path="/rj-dashboard" element={<RJDashboard />} />

          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
        <Footer />
      </Router>
    </BookmarkProvider>
  );
};

export default App;
