'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/'); // Redirect to login if token is missing
        return;
      }

      try {
        // Decode the token to get the user's name
        const decodedToken = jwtDecode(token);
        setName(decodedToken.name); // Assuming the token has a "name" field

        // Fetch the users data
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users. Please try again.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/'); // Redirect to login page
  };

  const columns = [
    { field: 'serial', headerName: 'Serial Number', width: 150 },
    { field: 'name', headerName: 'Name', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <button
          className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
          onClick={() => router.push(`/dashboard/user/${params.row.id}`)}
        >
          Explore
        </button>
      ),
    },
  ];

  const rows = users.map((user, index) => ({
    serial: index + 1, // Serial number
    id: user.id,
    name: user.name
  }));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold mx-auto">Welcome {name}</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <h1 className="text-2xl font-medium mb-4">Dashboard</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white shadow-md rounded p-4">
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            hideFooter // Removes pagination
          />
        </div>
      )}
    </div>
  );
}
