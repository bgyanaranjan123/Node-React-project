import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Box,
    Typography,
    Divider,
    useMediaQuery
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    ShoppingCart as ShoppingCartIcon,
    Inventory as InventoryIcon,
    People as PeopleIcon,
    Analytics as AnalyticsIcon,
    Settings as SettingsIcon,
    Assignment as AssignmentIcon,
    Receipt as ReceiptIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { useTheme } from '@mui/material/styles';

const drawerWidth = 260;

const Sidebar = () => {
    const { isOpen, toggleSidebar } = useSidebar();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
        { text: 'Products', icon: <InventoryIcon />, path: '/products' },
        { text: 'Orders', icon: <ShoppingCartIcon />, path: '/orders' },
        { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
        { text: 'Invoices', icon: <ReceiptIcon />, path: '/invoices' },
        { text: 'Reports', icon: <AssignmentIcon />, path: '/reports' },
        { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
    ];

    const handleNavigation = (path) => {
        navigate(path);
        if (isMobile) {
            toggleSidebar();
        }
    };

    const drawer = (
        <Box sx={{ overflow: 'auto' }}>
            <Box sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderBottom: `1px solid ${theme.palette.divider}`
            }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Admin Dashboard
                </Typography>
            </Box>
            
            <List sx={{ mt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            onClick={() => handleNavigation(item.path)}
                            selected={location.pathname === item.path}
                            sx={{
                                mx: 1,
                                borderRadius: 1,
                                '&.Mui-selected': {
                                    backgroundColor: 'primary.light',
                                    color: 'primary.main',
                                    '&:hover': {
                                        backgroundColor: 'primary.light',
                                    },
                                    '& .MuiListItemIcon-root': {
                                        color: 'primary.main',
                                    }
                                }
                            }}
                        >
                            <ListItemIcon sx={{ 
                                minWidth: 40,
                                color: location.pathname === item.path ? 'primary.main' : 'inherit'
                            }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary" align="center">
                    Version 1.0.0
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
            {/* Mobile drawer */}
            <Drawer
                variant="temporary"
                open={isOpen}
                onClose={toggleSidebar}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { 
                        boxSizing: 'border-box', 
                        width: drawerWidth 
                    },
                }}
            >
                {drawer}
            </Drawer>
            
            {/* Desktop drawer */}
            <Drawer
                variant="persistent"
                open={isOpen}
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': { 
                        boxSizing: 'border-box', 
                        width: drawerWidth,
                        position: 'relative',
                        whiteSpace: 'nowrap',
                        transition: theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                        ...(!isOpen && {
                            overflowX: 'hidden',
                            transition: theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.leavingScreen,
                            }),
                            width: theme.spacing(7),
                            [theme.breakpoints.up('sm')]: {
                                width: theme.spacing(9),
                            },
                        }),
                    },
                }}
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

export default Sidebar;