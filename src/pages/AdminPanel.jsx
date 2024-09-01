// src/pages/AdminPanel.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import books from '../bookData'; // If you're using a static file; otherwise, use your API or local storage

const AdminPanel = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && description && coverImage && content) {
      // You can save this to your backend or local storage
      books.push({
        id: books.length + 1, // Ensure unique IDs
        title,
        description,
        coverImage,
        content,
      });
      alert("Book added successfully!");
      navigate('/'); // Redirect to home or another page
    } else {
      alert("Please fill all fields.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Admin Panel</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-lg">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-lg">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="coverImage" className="block text-lg">Cover Image URL</label>
          <input
            type="text"
            id="coverImage"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-lg">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Add Book</button>
      </form>
    </div>
  );
};

export default AdminPanel;
