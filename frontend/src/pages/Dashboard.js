import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, TextField, Paper, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard({ user }) {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('/api/projects', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProjects(res.data);
      } catch (err) {
        setError('Failed to load projects');
      }
    };
    fetchProjects();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/projects', { name, description }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProjects([...projects, res.data]);
      setName('');
      setDescription('');
    } catch (err) {
      setError('Failed to add project');
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h4" mb={3} sx={{ fontWeight: 700 }}>Projects</Typography>
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 2 }}>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField label="Project Name" value={name} onChange={e => setName(e.target.value)} required sx={{ flex: 1 }} />
          <TextField label="Description" value={description} onChange={e => setDescription(e.target.value)} sx={{ flex: 2 }} />
          <Button type="submit" variant="contained" sx={{ height: 56 }}>Add Project</Button>
        </form>
        {error && <Typography color="error" mt={2}>{error}</Typography>}
      </Paper>
      <Grid container spacing={3}>
        {projects.map(project => (
          <Grid item xs={12} sm={6} md={4} key={project._id}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, height: '100%' }}>
              <CardActionArea onClick={() => navigate(`/project/${project._id}`)} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{project.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{project.description}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Dashboard; 