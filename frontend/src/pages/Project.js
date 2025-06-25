import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Button, TextField, Paper, Grid, Card, CardContent, Checkbox, MenuItem, Chip } from '@mui/material';
import axios from 'axios';

const statusColumns = [
  { label: 'To Do', value: false },
  { label: 'Done', value: true },
];

function Project({ user }) {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setTasks(res.data);
      } catch (err) {
        setError('Failed to load tasks');
      }
    };
    fetchTasks();
  }, [id]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/tasks/${id}`, { title, description, priority, deadline }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks([...tasks, res.data]);
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDeadline('');
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const handleToggle = async (taskId, completed) => {
    try {
      const res = await axios.put(`/api/tasks/${taskId}`, { completed: !completed }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks(tasks.map(t => t._id === taskId ? res.data : t));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h4" mb={3} sx={{ fontWeight: 700 }}>Tasks Board</Typography>
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 2 }}>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField label="Title" value={title} onChange={e => setTitle(e.target.value)} required sx={{ flex: 1 }} />
          <TextField label="Description" value={description} onChange={e => setDescription(e.target.value)} sx={{ flex: 2 }} />
          <TextField select label="Priority" value={priority} onChange={e => setPriority(e.target.value)} sx={{ width: 120 }}>
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>
          <TextField type="date" label="Deadline" value={deadline} onChange={e => setDeadline(e.target.value)} sx={{ width: 160 }} InputLabelProps={{ shrink: true }} />
          <Button type="submit" variant="contained" sx={{ height: 56 }}>Add Task</Button>
        </form>
        {error && <Typography color="error" mt={2}>{error}</Typography>}
      </Paper>
      <Grid container spacing={3}>
        {statusColumns.map(col => (
          <Grid item xs={12} md={6} key={col.label}>
            <Paper sx={{ p: 2, borderRadius: 3, minHeight: 300, background: 'rgba(0,0,0,0.02)' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>{col.label}</Typography>
              {tasks.filter(t => t.completed === col.value).map(task => (
                <Card key={task._id} sx={{ mb: 2, borderRadius: 2, boxShadow: 1 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography sx={{ fontWeight: 600, textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</Typography>
                      <Box>
                        <Chip label={task.priority} size="small" color={task.priority === 'High' ? 'error' : task.priority === 'Medium' ? 'warning' : 'default'} sx={{ mr: 1 }} />
                        <Checkbox checked={task.completed} onChange={() => handleToggle(task._id, task.completed)} />
                        <Button color="error" size="small" onClick={() => handleDelete(task._id)}>Delete</Button>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{task.description}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Project; 