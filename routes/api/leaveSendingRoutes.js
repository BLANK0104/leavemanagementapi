const express = require('express');
const pool = require('../../config/db');
const router = express.Router();

console.log('Leave fetching routes initialized');

// Route to fetch requests of faculty
router.post('/fetchfaculty', async (req, res) => {
    console.log('Received request to fetch leave request to faculty.');

    try {
        const query = `
            SELECT lr.*, u.name 
            FROM leave_requests lr
            JOIN users u ON lr.student_id = u.id
            WHERE lr.faculty_status = 'Pending' AND lr.hod_status = 'Approved'
        `;
        console.log('Executing query:', query);

        const result = await pool.query(query);
        console.log('Query result:', result.rows);

        if (result.rows.length === 0) {
            console.log('No matching leave requests found.');
        }

        res.status(200).json({ leaveRequests: result.rows });
    } catch (err) {
        console.error('Error fetching leave request:', err);
        res.status(500).json({ error: 'Failed to fetch leave request', details: err.message });
    }
});

// Route to fetch requests of HOD
router.post('/fetchhod', async (req, res) => {
    console.log('Received request to fetch leave request to HOD.');

    try {
        const query = `
            SELECT lr.*, u.name 
            FROM leave_requests lr
            JOIN users u ON lr.student_id = u.id
            WHERE lr.hod_status = 'Pending' AND lr.faculty_status = 'Approved'
        `;
        console.log('Executing query:', query);

        const result = await pool.query(query);
        console.log('Query result:', result.rows);

        if (result.rows.length === 0) {
            console.log('No matching leave requests found.');
        }

        res.status(200).json({ leaveRequests: result.rows });
    } catch (err) {
        console.error('Error fetching leave request:', err);
        res.status(500).json({ error: 'Failed to fetch leave request', details: err.message });
    }
});

router.post('/fetchwarden', async (req, res) => {
    console.log('Received request to fetch leave request to warden.');

    try {
        const query = `
            SELECT lr.*, u.name 
            FROM leave_requests lr
            JOIN users u ON lr.student_id = u.id
            WHERE lr.warden_status = 'Pending' AND lr.hod_status = 'Approved' AND lr.faculty_status = 'Approved'
        `;
        console.log('Executing query:', query);

        const result = await pool.query(query);
        console.log('Query result:', result.rows);

        if (result.rows.length === 0) {
            console.log('No matching leave requests found.');
        }

        res.status(200).json({ leaveRequests: result.rows });
    } catch (err) {
        console.error('Error fetching leave request:', err);
        res.status(500).json({ error: 'Failed to fetch leave request', details: err.message });
    }
});

router.post('/fetchgatekeeper', async (req, res) => {
    console.log('Received request to fetch leave request to gatekeeper.');

    try {
        const query = `
            SELECT lr.*, u.name 
            FROM leave_requests lr
            JOIN users u ON lr.student_id = u.id
            WHERE lr.gatekeeper_status = 'Pending' AND lr.warden_status = 'Approved' AND lr.hod_status = 'Approved' AND lr.faculty_status = 'Approved'
        `;
        console.log('Executing query:', query);

        const result = await pool.query(query);
        console.log('Query result:', result.rows);

        if (result.rows.length === 0) {
            console.log('No matching leave requests found.');
        }

        res.status(200).json({ leaveRequests: result.rows });
    } catch (err) {
        console.error('Error fetching leave request:', err);
        res.status(500).json({ error: 'Failed to fetch leave request', details: err.message });
    }
});

module.exports = router;