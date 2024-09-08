import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../pages/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { FaBookmark, FaBars, FaTimes } from 'react-icons/fa';
import { IoMdLogOut } from 'react-icons/io';
import Modal from '../components/Modal';
import SearchBar from './SearchBar';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false); 
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
          setUserName(userData.firstName);
          setUserRole(userData.role); // Assuming 'role' field exists in Firestore
        } else {
          console.error('No user data found in Firestore.');
        }
      } else {
        setUser(null);
        setUserName('');
        setUserRole('');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      closeLogoutModal();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  return (
    <nav className="navbar p-4 flex flex-col md:flex-row justify-between items-center bg-[#F4F5F9] shadow-md  mx-auto">
      <div className="flex justify-between items-center w-full md:w-auto ">
        <Link to="/" className="text-2xl font-bold cinzel-decorative-bold">
          Bookify
        </Link>
        <button
          className="text-2xl md:hidden focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      <div className={`grid gap-y-3 md:flex md:flex-row items-center w-full md:w-auto ${isMobileMenuOpen ? 'block' : 'hidden'} md:flex md:items-center md:space-x-6`}>
        <SearchBar className="mb-4  md:mb-0  " />
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
            {/* Conditionally render the dashboard link based on user role */}
            {userRole === 'Writer' && (
              <Link
                to="/admin"
                onClick={closeMobileMenu}
                className={`text-lg mulish-regular ${location.pathname === '/admin' ? 'bg-gray-800 text-white px-2 py-1 rounded-full' : ''} md:ml-6`}
              >
                Dashboard
              </Link>
            )}
            {userRole === 'RJ' && (
              <Link
                to="/audio"
                onClick={closeMobileMenu}
                className={`text-lg mulish-regular ${location.pathname === '/audio' ? 'bg-gray-800 text-white px-2 py-1 rounded-full' : ''} md:ml-6`}
              >
                Audio
              </Link>
            )}
            <button onClick={openLogoutModal} className="text-xl text-red-600" aria-label="Logout">
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

      <Modal
        show={showLogoutModal}
        onClose={closeLogoutModal}
        title="Logout Confirmation"
        message="Are you sure you want to log out?"
        onConfirm={handleLogout}
      />
    </nav>
  );
};

export default Navbar;
