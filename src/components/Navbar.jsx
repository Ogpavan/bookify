import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../pages/firebaseConfig'; // Adjust the path according to your structure
import { doc, getDoc } from 'firebase/firestore';
import { FaBookmark, FaBars, FaTimes } from 'react-icons/fa';
import { IoMdLogOut } from 'react-icons/io';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.firstName  );
        } else {
          console.error('No user data found in Firestore.');
        }
      } else {
        setUser(null);
        setUserName('');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Logged out successfully.');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Logout failed: ' + error.message);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
  <nav className="p-4 flex flex-col md:flex-row justify-between items-center bg-[#F4F5F9] shadow-md">
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
        {user ? (
          <div className="flex items-center gap-x-4">
            <p className="text-lg mulish-regular">{`Hello, ${userName}`}</p>
            <button
              onClick={handleLogout}
              className=" text-xl text-red-600"
            >
              <IoMdLogOut />
            </button>
          </div>
        ) : (
          <>
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
          </>
        )}
        <Link
          to="/bookmarks"
          onClick={closeMobileMenu}
          className={`text-lg mulish-regular flex items-center ${location.pathname === '/bookmarks' ? 'bg-gray-800 text-white px-2 py-1 rounded-full' : ''} md:ml-6`}
        >
          <FaBookmark className="ml-1" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
