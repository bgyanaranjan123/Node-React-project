import React, { useState, useEffect } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    LinearProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    ShoppingCart,
    AttachMoney,
    People,
    Inventory,
    MoreVert,
    Refresh
} from '@mui/icons-material';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
    ArcElement
} from 'chart.js';
import { dashboard } from '../services/api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
    ArcElement
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        analytics: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await dashboard.getStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon, trend, color }) => (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                        {title}
                    </Typography>
                    <Avatar sx={{ bgcolor: color, width: 40, height: 40 }}>
                        {icon}
                    </Avatar>
                </Box>
                <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                    {value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {trend > 0 ? (
                        <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
                    ) : (
                        <TrendingDown sx={{ color: 'error.main', mr: 1 }} />
                    )}
                    <Typography variant="body2" color={trend > 0 ? 'success.main' : 'error.main'}>
                        {Math.abs(trend)}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                        vs last month
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );

    const lineChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Visitors',
                data: [1200, 1900, 1500, 2200, 2800, 2500, 3000],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.4
            },
            {
                label: 'Page Views',
                data: [3200, 4100, 3800, 5200, 6100, 5800, 6900],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.4
            }
        ]
    };

    const barChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Sales',
                data: [12, 19, 15, 27, 24, 21, 28],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1
            }
        ]
    };

    const doughnutData = {
        labels: ['Electronics', 'Clothing', 'Books', 'Home & Garden'],
        datasets: [
            {
                data: [300, 450, 200, 350],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    const recentOrders = [
        { id: '#12345', customer: 'John Doe', date: '2024-01-15', amount: '$234.50', status: 'completed' },
        { id: '#12346', customer: 'Jane Smith', date: '2024-01-15', amount: '$567.80', status: 'pending' },
        { id: '#12347', customer: 'Bob Johnson', date: '2024-01-14', amount: '$123.45', status: 'processing' },
        { id: '#12348', customer: 'Alice Brown', date: '2024-01-14', amount: '$890.00', status: 'completed' },
        { id: '#12349', customer: 'Charlie Wilson', date: '2024-01-13', amount: '$456.70', status: 'cancelled' }
    ];

    const getStatusColor = (status) => {
        switch(status) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'processing': return 'info';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    if (loading) {
        return <LinearProgress />;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Dashboard
                </Typography>
                <IconButton onClick={fetchStats} color="primary">
                    <Refresh />
                </IconButton>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers}
                        icon={<People />}
                        trend={12}
                        color="primary.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Products"
                        value={stats.totalProducts}
                        icon={<Inventory />}
                        trend={8}
                        color="success.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Orders"
                        value={stats.totalOrders}
                        icon={<ShoppingCart />}
                        trend={-5}
                        color="warning.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Revenue"
                        value={`$${stats.totalRevenue}`}
                        icon={<AttachMoney />}
                        trend={15}
                        color="error.main"
                    />
                </Grid>
            </Grid>

            {/* Charts */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Website Traffic
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            <Line 
                                data={lineChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        }
                                    }
                                }}
                            />
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            Sales by Category
                        </Typography>
                        <Box sx={{ height: 250, display: 'flex', justifyContent: 'center' }}>
                            <Doughnut 
                                data={doughnutData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                        }
                                    }
                                }}
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Recent Orders and Activity */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Orders
                        </Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Order ID</TableCell>
                                        <TableCell>Customer</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recentOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>{order.id}</TableCell>
                                            <TableCell>{order.customer}</TableCell>
                                            <TableCell>{order.date}</TableCell>
                                            <TableCell align="right">{order.amount}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={order.status} 
                                                    color={getStatusColor(order.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small">
                                                    <MoreVert />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Activity
                        </Typography>
                        <List>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'success.main' }}>JD</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary="New order placed"
                                    secondary={
                                        <>
                                            <Typography component="span" variant="body2" color="text.primary">
                                                John Doe
                                            </Typography>
                                            {" — placed an order for $234.50"}
                                        </>
                                    }
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'info.main' }}>JS</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary="New user registered"
                                    secondary={
                                        <>
                                            <Typography component="span" variant="body2" color="text.primary">
                                                Jane Smith
                                            </Typography>
                                            {" — created an account"}
                                        </>
                                    }
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'warning.main' }}>P</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Product stock low"
                                    secondary={
                                        <>
                                            <Typography component="span" variant="body2" color="text.primary">
                                                iPhone 13
                                            </Typography>
                                            {" — only 3 units left"}
                                        </>
                                    }
                                />
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;