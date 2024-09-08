import React, { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getFirestore, collection, addDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import axios from 'axios'; // Import axios to make API requests
import BookAudioList from '../pages/BookAudioList';

const AudioUpload = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [books, setBooks] = useState([]);  // For storing the list of books
  const [selectedBookId, setSelectedBookId] = useState(''); // To store the selected book ID
  const [audios, setAudios] = useState([]); // To store the list of audios

  useEffect(() => {
    // Fetch books from MongoDB via the backend API
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/books'); // API endpoint
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    // Fetch audios from Firestore when selectedBookId changes
    const fetchAudios = async () => {
      if (!selectedBookId) return;

      try {
        const db = getFirestore();
        const q = query(collection(db, 'audios'), where('bookId', '==', selectedBookId));
        const querySnapshot = await getDocs(q);
        const audiosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAudios(audiosList);
      } catch (error) {
        console.error('Error fetching audios:', error);
      }
    };

    fetchAudios();
  }, [selectedBookId]);

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!audioFile || !title || !selectedBookId) {
      alert("Please select a book, provide a title, and upload a file.");
      return;
    }

    setUploading(true);

    try {
      // Upload audio to Firebase Storage
      const storage = getStorage();
      const audioRef = ref(storage, `audio/${selectedBookId}/${audioFile.name}`);
      await uploadBytes(audioRef, audioFile);
      const url = await getDownloadURL(audioRef);
      setAudioUrl(url);

      // Save metadata to Firestore
      await saveAudioMetadata(selectedBookId, url, title, description);

      alert('Audio and metadata saved successfully');
    } catch (error) {
      console.error('Error uploading audio or saving metadata:', error);
    }

    setUploading(false);
  };

  // Function to save audio metadata in Firestore
  const saveAudioMetadata = async (bookId, audioUrl, title, description) => {
    const db = getFirestore();
    try {
      await addDoc(collection(db, 'audios'), {
        bookId,  // Link the audio to the selected book
        audioUrl,
        title,
        description,
        createdAt: new Date(),
      });
      // Refresh the audio list
      const q = query(collection(db, 'audios'), where('bookId', '==', bookId));
      const querySnapshot = await getDocs(q);
      const audiosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAudios(audiosList);
    } catch (error) {
      console.error('Error saving audio metadata:', error);
    }
  };

  const handleDelete = async (audioId, audioUrl) => {
    if (!window.confirm('Are you sure you want to delete this audio?')) return;

    try {
      // Delete the audio file from Firebase Storage
      const storage = getStorage();
      const audioRef = ref(storage, audioUrl);
      await deleteObject(audioRef);

      // Remove metadata from Firestore
      const db = getFirestore();
      await deleteDoc(doc(db, 'audios', audioId));

      // Refresh the audio list
      setAudios(audios.filter(audio => audio.id !== audioId));

      alert('Audio deleted successfully');
    } catch (error) {
      console.error('Error deleting audio:', error);
    }
  };

  return (
    <div className='flex justify-center items-center '>
      <div className='md:grid flex flex-col justify-center items-center gap-y-5 mt-10 bg-white md:w-1/2 w-full px-5'>
        <h3 className='text-2xl font-bold text-center p-5'>Upload Audio</h3>
        <select
          className='border border-black p-2 w-full'
          value={selectedBookId}
          onChange={(e) => setSelectedBookId(e.target.value)}
        >
          <option value="">Select a Book</option>
          {books.map((book) => (
            <option key={book._id} value={book._id}>
              {book.title}
            </option>
          ))}
        </select>

        <input type="file" accept="audio/*" onChange={handleFileChange} className='border border-black p-2 w-[100%] md:w-auto' />
        <input
          className='border border-black p-2 w-full'
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className='border border-black p-2 w-full'
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <button
          className="mb-5 border rounded px-3 py-2 w-full bg-gradient-to-br from-blue-500 to-blue-700 text-white"
          onClick={handleUpload} 
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>

        {audioUrl && (
          <p>
            Audio Uploaded: <a href={audioUrl} target="_blank" rel="noopener noreferrer">Listen</a>
          </p>
        )}

        <BookAudioList bookId={selectedBookId} />

        <div>
          <h3 className='text-2xl font-bold text-center p-5'>Manage Audios</h3>
          <ul>
            {audios.map((audio) => (
              <li key={audio.id} className='flex justify-between items-center mb-4'>
                <span>{audio.title}</span>
                <button
                  onClick={() => handleDelete(audio.id, audio.audioUrl)}
                  className='text-red-500 hover:text-red-700'
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
        
      </div>
    </div>
  );
};

export default AudioUpload;
