const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const pool = require('./config/db');

dotenv.config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// Test the database connectionṅī
pool.connect((err) => {
    if (err) {
        console.error('Database connection error', err.stack);
    } else {
        console.log('Connected to the database');
    }
});

// Default route
app.get('/', (_, res) => {
    res.send('Welcome to the Leave Management API');
});

// Import and use the leaveRoutes
const leaveRoutes = require('./routes/api/leaveRoutes');
app.use('/api/leaves', leaveRoutes);

// Import and use the userRoutes
const userRoutes = require('./routes/api/userRoutes');
app.use('/api/login', userRoutes);

//import and use leave sending routes
const leaveSendingRoutes = require('./routes/api/leaveSendingRoutes');
app.use('/api/leave', leaveSendingRoutes);

const hisotryRoutes = require('./routes/api/historyRoutes');
app.use('/api/history', hisotryRoutes);

// Start the server
app.listen(PORT, (err) => {
    if (err) {
        console.error('Error starting the server:', err);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});