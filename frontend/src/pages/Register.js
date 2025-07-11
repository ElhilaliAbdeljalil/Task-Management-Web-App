import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register({ setUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={3} sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" mb={2}>Register</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Name" fullWidth margin="normal" value={name} onChange={e => setName(e.target.value)} />
          <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Register</Button>
          <Button onClick={() => navigate('/login')} fullWidth sx={{ mt: 1 }}>Login</Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Register; 