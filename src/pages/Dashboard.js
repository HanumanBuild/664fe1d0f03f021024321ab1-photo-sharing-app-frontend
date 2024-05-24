import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [photos, setPhotos] = useState([]);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_PHOTO_SHARING_APP_BACKEND_URL}/api/photos`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setPhotos(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPhotos();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('description', description);
    try {
      const response = await axios.post(`${process.env.REACT_APP_PHOTO_SHARING_APP_BACKEND_URL}/api/photos/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setPhotos([...photos, response.data]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_PHOTO_SHARING_APP_BACKEND_URL}/api/photos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPhotos(photos.filter(photo => photo._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl mb-4">Dashboard</h2>
      <form onSubmit={handleUpload} className="mb-4">
        <input
          type="file"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="mb-4 p-2 border rounded w-full"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Upload</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {photos.map(photo => (
          <div key={photo._id} className="bg-white p-4 rounded shadow-md">
            <img src={`${process.env.REACT_APP_PHOTO_SHARING_APP_BACKEND_URL}/${photo.imageUrl}`} alt={photo.description} className="mb-4" />
            <p>{photo.description}</p>
            <button onClick={() => handleDelete(photo._id)} className="bg-red-500 text-white p-2 rounded mt-4">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
