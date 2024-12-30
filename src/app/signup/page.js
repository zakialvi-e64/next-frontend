'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !email || !password) {
      setLoading(false);
      setError('All fields are required.');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/register`,
        { name, email, password }
      );

      if (response.status === 201) { // Assuming 201 for successful signup
        setLoading(false);
        router.push('/');
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Sign up failed. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md"
      >
        <Typography variant="h5" align="center" className="mb-4 text-black">
          Sign Up
        </Typography>
        {error && (
          <Typography color="error" align="center" className="mb-4">
            {error}
          </Typography>
        )}
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          className="mb-4"
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          className="mb-4"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          className="mb-4"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="mb-4"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
        </Button>
        <Typography align="center" className="text-sm text-gray-500">
          Already have an account? <a href="/" className="text-blue-600">Sign In</a>
        </Typography>
      </Box>
    </div>
  );
}
