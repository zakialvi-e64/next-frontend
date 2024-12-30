'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Modal, Button, TextField, Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export default function UserPage({ params }) {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null); // Added userId state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // Fetch user data
  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/'); // Redirect to login if token is missing
      return;
    }

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setName(response.data.name);
      setEmail(response.data.email);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch user data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Await the params id and set userId
    const getParamId = async () => {
      const paramId = await params.id;
      setUserId(paramId); // Set userId
    };

    getParamId();

  }, [params]);

  useEffect(() => {
    if (userId) {
      fetchUser(); // Fetch user data when userId is available
    }
  }, [userId]); // Run effect when userId changes

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/'); // Redirect to login if token is missing
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/${userId}`,
        { name, email, password },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data); // Update the user state with the new data
      setOpenModal(false);
      setLoading(false);

      // Re-fetch the user data to reflect the changes
      fetchUser(); // This ensures the user data is reloaded after the update
    } catch (err) {
      setError('Failed to update user data.');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/'); // Redirect to login if token is missing
      return;
    }

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push('/dashboard'); // Redirect to dashboard after successful delete
    } catch (err) {
      setError('Failed to delete user.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    router.push('/'); // Redirect to login page
  };

  return (
    <div className="relative p-6">
      {/* Logout Button */}

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 absolute top-4 right-4"
      >
        Logout
      </button>

      {loading ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div>
          <Typography variant="h4" className="mb-4">
            User Details
          </Typography>
          <Typography>Name: {user.name}</Typography>
          <Typography>Email: {user.email}</Typography>
          <div className="flex space-x-4 mt-4">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenModal(true)}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        className="flex justify-center items-center"
      >
        <Box className="bg-white p-6 rounded-lg shadow-lg w-96">
          <Typography variant="h6" className="mb-4 text-black">
            Edit User
          </Typography>
          <form onSubmit={handleEditSubmit}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4"
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4"
            />
            <div className="flex justify-end space-x-4">
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Save'}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
