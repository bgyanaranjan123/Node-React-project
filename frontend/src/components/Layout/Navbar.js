import React from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    Badge,
    useMediaQuery
} from '@mui/material';
import {
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import { useTheme } from '@mui/material/styles';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { toggleSidebar } = useSidebar();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [notificationAnchor, setNotificationAnchor] = React.useState(null);
    
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const handleNotificationMenu = (event) => {
        setNotificationAnchor(event.currentTarget);
    };
    
    const handleNotificationClose = () => {
        setNotificationAnchor(null);
    };
    
    const handleLogout = () => {
        logout();
        handleClose();
    };
    
    return (
        <AppBar 
            position="fixed" 
            sx={{ 
                zIndex: theme.zIndex.drawer + 1,
                backgroundColor: '#fff',
                color: '#333',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleSidebar}
                    edge="start"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    Dashboard
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Notifications */}
                    <IconButton color="inherit" onClick={handleNotificationMenu}>
                        <Badge badgeContent={4} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    
                    <Menu
                        anchorEl={notificationAnchor}
                        open={Boolean(notificationAnchor)}
                        onClose={handleNotificationClose}
                        onClick={handleNotificationClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem>New order received</MenuItem>
                        <MenuItem>Product low stock alert</MenuItem>
                        <MenuItem>User registration spike</MenuItem>
                        <Divider />
                        <MenuItem>View all notifications</MenuItem>
                    </Menu>
                    
                    {/* User menu */}
                    <IconButton
                        onClick={handleMenu}
                        size="small"
                        sx={{ ml: 2 }}
                    >
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                            {user?.username?.charAt(0).toUpperCase()}
                        </Avatar>
                    </IconButton>
                    
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        onClick={handleClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem>
                            <ListItemIcon>
                                <PersonIcon fontSize="small" />
                            </ListItemIcon>
                            Profile
                        </MenuItem>
                        <MenuItem>
                            <ListItemIcon>
                                <SettingsIcon fontSize="small" />
                            </ListItemIcon>
                            Settings
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                    
                    {!isMobile && (
                        <Typography variant="body2" sx={{ ml: 1 }}>
                            {user?.username}
                        </Typography>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;