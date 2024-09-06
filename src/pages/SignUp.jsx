import React, { useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      // Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      alert('Verification email sent. Please check your inbox.');
      
      // Save the user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        role,
      });

      alert('User registered successfully! Please verify your email.');
      navigate('/login');  // Redirect to login or a verification page
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Signup failed: ' + error.message);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user already exists in Firestore
      const userDoc = await setDoc(doc(db, 'users', user.uid), {
        firstName: user.displayName.split(' ')[0],
        lastName: user.displayName.split(' ').slice(1).join(' '),
        email: user.email,
        role: role || 'Reader',  // Default role if not selected
      });

      alert('User signed up successfully!');
      navigate('/');  // Redirect to the home page or another page
    } catch (error) {
      console.error('Error with Google sign up:', error);
      alert('Google sign up failed: ' + error.message);
    }
  };

  return (
    <div className="md:mt-10 flex flex-col items-center justify-center w-full ">
      <form onSubmit={handleSignUp} className="flex flex-col items-center justify-center border px-6 py-12 ">
        <h1 className="text-xl font-bold mb-4 w-full cinzel-decorative-bold">Bookify</h1>
        <p className="w-full text-3xl mulish-bold">Hi, Welcome to Bookify</p>
        <p className="mb-4 w-full text-gray-500 md:text-sm text-xs mulish-light">
          Create an account and start enjoying Bookify
        </p>
        <button
          type="button"
          onClick={handleGoogleSignUp}
          className="mb-4 border rounded px-2 py-2 w-full flex items-center gap-x-2 justify-center"
        >
          <FcGoogle size={30} />
          Sign Up with Google
        </button>
        <div className="mb-6 w-full text-gray-500 text-xs text-center mulish-light flex justify-center items-center gap-x-2">
          <div className="h-[0.1px] w-full bg-gray-300"></div>
          <p className="text-nowrap">or SignUp with email</p>
          <div className="h-[0.1px] w-full bg-gray-300"></div>
        </div>
        <div className="flex gap-x-2 flex-wrap ">
          <input
            className="mb-4 border rounded px-3 py-2 w-full"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="mb-4 border rounded px-3 py-2 w-full"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <input
          className="mb-4 border rounded px-3 py-2 w-full"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="mb-4 border rounded px-3 py-2 w-full"
          type="password"
          placeholder="Password (Min 6 Characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          className="mb-6 border rounded px-3 py-2 w-full"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="Reader">Reader</option>
          <option value="Writer">Writer</option>
          <option value="RJ">RJ</option>
        </select>
        <button
          className="mb-4 border rounded px-3 py-2 w-full bg-gradient-to-br from-blue-500 to-blue-700 text-white"
          type="submit"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
