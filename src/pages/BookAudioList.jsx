import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const BookAudioList = ({ bookId }) => {
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAudios = async () => {
      try {
        console.log('Fetching audios for bookId:', bookId);

        const db = getFirestore();

        // Query Firestore to get audio metadata for the selected book
        const q = query(collection(db, 'audios'), where('bookId', '==', bookId));
        const querySnapshot = await getDocs(q);

        console.log('Query snapshot:', querySnapshot.docs);

        if (querySnapshot.empty) {
          console.log('No matching documents.');
          setAudios([]);
          setLoading(false);
          return;
        }

        const audioData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Document data:', data);

          return {
            id: doc.id,
            title: data.title,
            description: data.description,
            rjName: data.rjName,
            audioUrl: data.audioUrl, // Use the URL directly from Firestore
          };
        });

        if (audioData.length === 0) {
          console.log('No audio files found for this book.');
        }

        setAudios(audioData);
      } catch (fetchError) {
        console.error('Error fetching audio files:', fetchError);
        setError('Error fetching audio files.');
      } finally {
        setLoading(false);
      }
    };

    fetchAudios();
  }, [bookId]);

  if (loading) {
    return <p>Loading audios...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (audios.length === 0) {
    return <p>No audios available for this book.</p>;
  }

  return (
    <div>
      <h3>Listen this book</h3>

      {audios.map((audio) => (
        
        <div key={audio.id} style={styles.audioCard}>
           
         <div>Title: {audio.title}     </div>
           
          
          {/* Audio player */}
          <audio controls>
            <source src={audio.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </div>
  );
};

const styles = {
  audioCard: {
    border: '1px solid #ccc',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
  },
};

export default BookAudioList;
