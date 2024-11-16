// FILE: routes/api/userRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../../config/db');

// Mock database
const users = [];
let currentUser = null;

// Get username and password
// router.get('/credentials', (req, res) => {
//     if (!currentUser) {
//         return res.status(404).json({ message: 'No user is currently logged in' });
//     }
//     res.status(200).json({ username: currentUser.username, password: currentUser.password });
// });

// // Create a new user with role
// router.post('/create', (req, res) => {
//     const { username, password, role } = req.body;
//     if (!username || !password || !role) {
//         return res.status(400).json({ message: 'Username, password, and role are required' });
//     }
//     users.push({ username, password, role });
//     res.status(201).json({ message: 'User created successfully' });
// console.log(`User created: ${username}, Role: ${role}`);
// });


// // Login user
// router.post('/login', (req, res) => {
//     const { username, password } = req.body;
//     const user = users.find(u => u.username === username && u.password === password);
//     if (!user) {
//         return res.status(401).json({ message: 'Invalid credentials' });
//     }
//     currentUser = user;
//     res.status(200).json({ message: 'Login successful', user: currentUser });
// });

// // Get current user
// router.get('/current', (req, res) => {
//     if (!currentUser) {
//         return res.status(404).json({ message: 'No user is currently logged in' });
//     }
//     res.status(200).json({ user: currentUser });
// });

// module.exports = router;






//route to create user
router.post('/create', async (req, res) => {
    const { name, username, role, password } = req.body;
    console.log('Creating user with data:', { name, username, role, password });

    try {
        const result = await pool.query(
            `INSERT INTO users (name, username, role, password)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, username, role, password]
        );
        console.log('User created successfully:', result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Failed to create user', details: err.message });
    }
});

//route to login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt for username:', username);
    try {
        const result = await pool.query(
            `SELECT * FROM users
             WHERE username = $1 AND password = $2`,
            [username, password]
        );
        if (result.rows.length === 0) {
            console.log('Login failed: Invalid credentials');
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        console.log('Login successful for userrrr:', result.rows[0]);
        res.status(200).json({ message: 'Login successfulrrr', user: result.rows[0] });
    } catch (err) {
        console.error('Error logging innnn:', err);
        res.status(500).json({ error: 'Failed to loginnnn', details: err.message });
    }
});

//route to get current user
router.get('/current', (req, res) => {
    if (!currentUser) {
        console.log('Get current user failed: No user logged in');
        return res.status(404).json({ message: 'No user is currently logged in' });
    }
    console.log('Current user requested:', currentUser);
    res.status(200).json({ user: currentUser });
});

//route to get current role
router.get('/role', (req, res) => {
    if (!currentUser) {
        console.log('Get role failed: No user logged in');
        return res.status(404).json({ message: 'No user is currently logged in' });
    }
    console.log('Role requested for user:', currentUser.role);
    res.status(200).json({ role: currentUser.role });
});

module.exports = router;
