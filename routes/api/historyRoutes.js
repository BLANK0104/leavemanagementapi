const express = require('express');
const pool = require('../../config/db');
const router = express.Router();

console.log('History routes initialized');

//route to get student history
router.get('/student/:id', async (req, res) => {
    console.log(`Fetching history for student ID: ${req.params.id}`);
    const { id } = req.params;
    try {
        console.log('Executing database query...');
        const result = await pool.query(
            `SELECT * FROM leave_requests WHERE student_id = $1`,
            [id]
        );
        console.log('Query result:', result.rows);

        if (result.rows.length === 0) {
            console.log('No history found');
            return res.status(404).json({ error: 'History not found' });
        }

        console.log('History found, sending response');
        res.status(200).json({ history: result.rows });
    } catch (err) {
        console.error('Error fetching history:', err);
        res.status(500).json({ error: 'Failed to fetch history', details: err.message });
    }
});


//route to get faculty history
router.get('/faculty/:id', async (req, res) => {
    console.log(`Fetching history for faculty ID: ${req.params.id}`);
    const { id } = req.params;
    try {
        console.log('Executing database query...');
        const result = await pool.query(
            `SELECT * FROM leave_requests WHERE faculty_id = $1`,
            [id]
        );
        console.log('Query result:', result.rows);

        if (result.rows.length === 0) {
            console.log('No history found');
            return res.status(404).json({ error: 'History not found' });
        }

        console.log('History found, sending response');
        res.status(200).json({ history: result.rows });
    } catch (err) {
        console.error('Error fetching history:', err);
        res.status(500).json({ error: 'Failed to fetch history', details: err.message });
    }
});

//route to get hod history
router.get('/hod/:id', async (req, res) => {
    console.log(`Fetching history for hod ID: ${req.params.id}`);
    const { id } = req.params;
    try {
        console.log('Executing database query...');
        const result = await pool.query(
            `SELECT * FROM leave_requests WHERE hod_id = $1`,
            [id]
        );
        console.log('Query result:', result.rows);

        if (result.rows.length === 0) {
            console.log('No history found');
            return res.status(404).json({ error: 'History not found' });
        }

        console.log('History found, sending response');
        res.status(200).json({ history: result.rows });
    } catch (err) {
        console.error('Error fetching history:', err);
        res.status(500).json({ error: 'Failed to fetch history', details: err.message });
    }
});

//route to get wardne history
router.get('/warden/:id', async (req, res) => {
    console.log(`Fetching history for warden ID: ${req.params.id}`);
    const { id } = req.params;
    try {
        console.log('Executing database query...');
        const result = await pool.query(
            `SELECT * FROM leave_requests WHERE warden_id = $1`,
            [id]
        );
        console.log('Query result:', result.rows);

        if (result.rows.length === 0) {
            console.log('No history found');
            return res.status(404).json({ error: 'History not found' });
        }

        console.log('History found, sending response');
        res.status(200).json({ history: result.rows });
    } catch (err) {
        console.error('Error fetching history:', err);
        res.status(500).json({ error: 'Failed to fetch history', details: err.message });
    }
});

//route to get gatekeeper history
router.get('/gatekeeper/:id', async (req, res) => {
    console.log(`Fetching history for gatekeeper ID: ${req.params.id}`);
    const { id } = req.params;
    try {
        console.log('Executing database query...');
        const result = await pool.query(
            `SELECT * FROM leave_requests WHERE gatekeeper_id = $1`,
            [id]
        );
        console.log('Query result:', result.rows);

        if (result.rows.length === 0) {
            console.log('No history found');
            return res.status(404).json({ error: 'History not found' });
        }

        console.log('History found, sending response');
        res.status(200).json({ history: result.rows });
    } catch (err) {
        console.error('Error fetching history:', err);
        res.status(500).json({ error: 'Failed to fetch history', details: err.message });
    }
});

module.exports = router;