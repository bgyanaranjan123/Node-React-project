import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Chip,
    Avatar,
    Alert,
    Snackbar,
    LinearProgress,
    InputAdornment
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Lock as LockIcon,
    Refresh as RefreshIcon,
    Person as PersonIcon,
    AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const UserManagement = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            showSnackbar('Error fetching users', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (user = null) => {
        if (user) {
            setSelectedUser(user);
            setFormData({
                username: user.username,
                email: user.email,
                password: '',
                role: user.role
            });
        } else {
            setSelectedUser(null);
            setFormData({
                username: '',
                email: '',
                password: '',
                role: 'user'
            });
        }
        setOpenDialog(true);
    };

    const handleOpenPasswordDialog = (user) => {
        setSelectedUser(user);
        setFormData({ ...formData, password: '' });
        setOpenPasswordDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setOpenPasswordDialog(false);
        setSelectedUser(null);
        setFormData({
            username: '',
            email: '',
            password: '',
            role: 'user'
        });
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            
            if (selectedUser) {
                // Update user
                await axios.put(
                    `http://localhost:5000/api/users/${selectedUser.id}`,
                    {
                        username: formData.username,
                        email: formData.email,
                        role: formData.role
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                showSnackbar('User updated successfully', 'success');
            } else {
                // Create new user
                await axios.post(
                    'http://localhost:5000/api/users',
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                showSnackbar('User created successfully', 'success');
            }
            
            fetchUsers();
            handleCloseDialog();
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Error saving user', 'error');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/api/users/${selectedUser.id}/password`,
                { newPassword: formData.password },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            showSnackbar('Password changed successfully', 'success');
            handleCloseDialog();
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Error changing password', 'error');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            showSnackbar('User deleted successfully', 'success');
            fetchUsers();
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Error deleting user', 'error');
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const getRoleIcon = (role) => {
        switch(role) {
            case 'admin':
                return <AdminIcon sx={{ color: 'error.main' }} />;
            default:
                return <PersonIcon sx={{ color: 'info.main' }} />;
        }
    };

    const getRoleColor = (role) => {
        switch(role) {
            case 'admin': return 'error';
            case 'manager': return 'warning';
            default: return 'info';
        }
    };

    if (loading) {
        return <LinearProgress />;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">User Management</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Create New User
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Last Login</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                            {user.username.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body1">
                                                {user.username}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                ID: {user.id}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Chip
                                        icon={getRoleIcon(user.role)}
                                        label={user.role}
                                        color={getRoleColor(user.role)}
                                        size="small"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    {new Date(user.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {user.last_login 
                                        ? new Date(user.last_login).toLocaleString()
                                        : 'Never'
                                    }
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => handleOpenDialog(user)}
                                        title="Edit User"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="info"
                                        onClick={() => handleOpenPasswordDialog(user)}
                                        title="Change Password"
                                    >
                                        <LockIcon />
                                    </IconButton>
                                    {user.id !== currentUser?.id && (
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteUser(user.id)}
                                            title="Delete User"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Create/Edit User Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedUser ? 'Edit User' : 'Create New User'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                        {!selectedUser && (
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        )}
                        <TextField
                            fullWidth
                            margin="normal"
                            select
                            label="Role"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                        >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="manager">Manager</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            {selectedUser ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Change Password Dialog */}
            <Dialog open={openPasswordDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Change Password for {selectedUser?.username}</DialogTitle>
                <form onSubmit={handlePasswordChange}>
                    <DialogContent>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="New Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button type="submit" variant="contained">Change Password</Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UserManagement;