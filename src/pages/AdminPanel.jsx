import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Modal from '../components/Modal'; // Import the Modal

const AdminPanel = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [genre, setGenre] = useState('');
  const [author, setAuthor] = useState('');
  const [showModal, setShowModal] = useState(false); // State to show modal
  const [modalMessage, setModalMessage] = useState('');
  const [isPublishing, setIsPublishing] = useState(false); // Track publishing status
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // Use navigate for redirecting

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCoverImage(response.data.url);
    } catch (error) {
      console.error('Image upload failed', error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleSubmit = () => {
    if (title && description && coverImage && content && genre && author) {
      setModalMessage('Do you want to publish this book?');
      setShowModal(true); // Show the confirmation modal
    } else {
      setModalMessage('Please fill all fields.');
      setShowModal(true); // Show the error modal
    }
  };

  const handleConfirmPublish = async () => {
    setShowModal(false); // Close the modal when the user confirms

    try {
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, coverImage, content, genre, author }),
      });

      if (response.ok) {
       
        setIsPublishing(true); // Set publishing status to true
        navigate('/'); // Redirect to the homepage
      } else {
        alert('Failed to publish the book.');
      }
    } catch (error) {
      console.error('Error publishing book', error);
      alert('Failed to publish the book.');
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="p-4 md:flex flex-col justify-center items-center">
      <h2 className="text-3xl font-bold mb-4">Publish Book</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4 bg-white md:flex gap-x-5 border md:w-1/2 p-5">
        <div>
          <label htmlFor="coverImage" className="block text-lg">Cover Image</label>
          <div
            onDrop={(e) => {
              e.preventDefault();
              handleImageUpload(e.dataTransfer.files[0]);
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current.click()} // Trigger file input click
            className="border-dashed border-2 p-4 text-center cursor-pointer h-48 md:w-48 w-full flex justify-center items-center"
          >
            <p>Drag and drop an image here, or click to select</p>
            {coverImage && (
              <img src={coverImage} alt="Cover" className="mt-4 h-40 mx-auto" />
            )}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }} // Hide file input
              accept="image/*"
              onChange={handleFileSelect}
            />
          </div>
        </div>

        <div className='flex flex-col gap-y-4 w-full'>
          <div>
            <label htmlFor="title" className="block text-lg">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-black rounded-sm p-2 w-full"
              placeholder='e.g. "The Great Gatsby"'
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-lg">Author</label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="border border-black rounded-sm p-2 w-full"
              placeholder='e.g. "F. Scott Fitzgerald"'
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-lg">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-black rounded-sm p-2 w-full"
              placeholder='e.g. "The classic novel about a man named Jay Gatsby and his love for the beautiful Daisy Buchanan."'
            />
          </div>
          <div>
            <label htmlFor="genre">Genre</label>
            <select id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} className="border border-black rounded-sm p-2 w-full">
              <option value="">Select Genre</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Science">Science</option>
              {/* Add more genres as needed */}
            </select>
          </div>
          <div>
            <label htmlFor="content" className="block text-lg">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border border-black rounded-sm p-2 w-full"
              placeholder='Paste Your Book Content Here'
            />
          </div>
          <button type="submit" className="p-2 bg-blue-500 text-white rounded" disabled={isPublishing}>Add Book</button>
        </div>
      </form>

      {/* Modal Component */}
      <Modal
        show={showModal}
        onClose={closeModal}
        title="Confirmation"
        message={modalMessage}
        onConfirm={handleConfirmPublish} // Call this when "Confirm" is clicked
      />
    </div>
  );
};

export default AdminPanel;
