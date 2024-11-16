const express = require('express');
const pool = require('../../config/db');
const router = express.Router();

console.log('Leave routes initialized');

// Route to get leave request details by ID

router.get('/allleave', async (req, res) => {
    console.log('Fetching all leave requests');
    try {
        const result = await pool.query('SELECT lr.*, u.name as student_name FROM leave_requests lr JOIN users u ON lr.student_id = u.id');
        console.log('Query result:', result.rows);
        res.status(200).json({ leaveRequests: result.rows });
    } catch (err) {
        console.error('Error fetching leave requests:', err);
        res.status(500).json({ error: 'Failed to fetch leave requests', details: err.message });
    }
});
// Route to get leave requests with student names




router.get('/leave/:id', async (req, res) => {
    console.log(`Fetching leave request for ID: ${req.params.id}`);
    const { id } = req.params;
    try {
        console.log('Executing database query...');
        const result = await pool.query(
            `SELECT * FROM leave_requests WHERE id = $1`,
            [id]
        );
        console.log('Query result:', result.rows);

        if (result.rows.length === 0) {
            console.log('No leave request found');
            return res.status(404).json({ error: 'Leave request not found' });
        }

        console.log('Leave request found, sending response');
        res.status(200).json({ leaveRequest: result.rows[0] });
    } catch (err) {
        console.error('Error fetching leave request:', err);
        res.status(500).json({ error: 'Failed to fetch leave request', details: err.message });
    }
});




// Route for faculty to approve the leave request
router.post('/faculty/approve/:student_id', async (req, res) => {
    console.log(`Processing faculty approval for student ID: ${req.params.student_id}`);
    const { student_id } = req.params;
    try {
        const leaveRequest = await pool.query(
            `SELECT * FROM leave_requests WHERE student_id = $1 AND faculty_status = 'Pending'`,
            [student_id]
        );

        if (leaveRequest.rows.length === 0) {
            return res.status(404).json({ error: 'Leave request not found' });
        }

        const { start_date, end_date } = leaveRequest.rows[0];
        const duration = (new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24);
        console.log(`Leave duration: ${duration} days`);

        let nextStatus = 'hod_status';
        if (duration < 3) {
            nextStatus = 'warden_status';
        }

        const result = await pool.query(
            `UPDATE leave_requests
            SET faculty_status = 'Approved'
            WHERE student_id = $1
            RETURNING *`,
            [student_id]
        );
        console.log('Faculty approval result:', result.rows[0]);
        res.status(200).json({ message: `Faculty approval successful, request sent to ${nextStatus === 'hod_status' ? 'HOD' : 'Warden'}`, leaveRequest: result.rows[0] });
    } catch (err) {
        console.error('Error approving leave request by Faculty:', err);
        res.status(500).json({ error: 'Failed to approve leave request', details: err.message });
    }
});

// Route for HOD to approve leave request
router.post('/hod/approve/:student_id', async (req, res) => {
    console.log(`Processing HOD approval for ID: ${req.params.student_id}`);
    const { student_id } = req.params;
    try {
        const result = await pool.query(
            `UPDATE leave_requests
            SET hod_status = 'Approved', warden_status = 'Pending'
            WHERE student_id = $1
            RETURNING *`,
            [student_id]
        );
        console.log('HOD approval result:', result.rows[0]);
        res.status(200).json({ message: 'HOD approval successful, request sent to Warden', leaveRequest: result.rows[0] });
    } catch (err) {
        console.error('Error approving leave request by HOD:', err);
        res.status(500).json({ error: 'Failed to approve leave request', details: err.message });
    }
});

// Route for warden to approve leave request
router.post('/warden/approve/:student_id', async (req, res) => {
    console.log(`Processing warden approval for ID: ${req.params.student_id}`);
    const { student_id } = req.params;
    try {
        const result = await pool.query(
            `UPDATE leave_requests
            SET warden_status = 'Approved', gatekeeper_status = 'Pending'
            WHERE student_id = $1
            RETURNING *`,
            [student_id]
        );
        console.log('Warden approval result:', result.rows[0]);
        res.status(200).json({ message: 'Warden approval successful, request sent to Gatekeeper', leaveRequest: result.rows[0] });
    } catch (err) {
        console.error('Error approving leave request by Warden:', err);
        res.status(500).json({ error: 'Failed to approve leave request', details: err.message });
    }
});

// Route for gatekeeper to approve leave request
router.post('/gatekeeper/approve/:student_id', async (req, res) => {
    console.log(`Processing gatekeeper approval for ID: ${req.params.student_id}`);
    const { student_id } = req.params;
    try {
        const result = await pool.query(
            `UPDATE leave_requests
            SET gatekeeper_status = 'Approved'
            WHERE student_id = $1
            RETURNING *`,
            [student_id]
        );
        console.log('Gatekeeper approval result:', result.rows[0]);
        res.status(200).json({ message: 'Gatekeeper approval successful', leaveRequest: result.rows[0] });
    } catch (err) {
        console.error('Error approving leave request by Gatekeeper:', err);
        res.status(500).json({ error: 'Failed to approve leave request', details: err.message });
    }
});

router.post('/faculty/reject/:student_id', async (req, res) => {
    console.log(`Processing faculty rejection for student ID: ${req.params.student_id}`);
    const { student_id } = req.params;
    try {
        const result = await pool.query(
            `UPDATE leave_requests
            SET faculty_status = 'Rejected'
            WHERE student_id = $1
            RETURNING *`,
            [student_id]
        );
        console.log('Faculty rejection result:', result.rows[0]);
        res.status(200).json({ message: 'Faculty rejection successful', leaveRequest: result.rows[0] });
    } catch (err) {
        console.error('Error rejecting leave request by Faculty:', err);
        res.status(500).json({ error: 'Failed to reject leave request', details: err.message });
    }
});

router.post('/hod/reject/:student_id', async (req, res) => {
    console.log(`Processing HOD rejection for ID: ${req.params.student_id}`);
    const { student_id } = req.params;
    try {
        const result = await pool.query(
            `UPDATE leave_requests
            SET hod_status = 'Rejected'
            WHERE student_id = $1
            RETURNING *`,
            [student_id]
        );
        console.log('HOD rejection result:', result.rows[0]);
        res.status(200).json({ message: 'HOD rejection successful', leaveRequest: result.rows[0] });
    } catch (err) {
        console.error('Error rejecting leave request by HOD:', err);
        res.status(500).json({ error: 'Failed to reject leave request', details: err.message });
    }
});






// Route to get leave requests by student ID
router.get('/student/:studentId', async (req, res) => {
    console.log(`Fetching leave requests for student ID: ${req.params.studentId}`);
    const { studentId } = req.params;
    try {
        const result = await pool.query(
            `SELECT * FROM leave_requests WHERE student_id = $1`,
            [studentId]
        );
        console.log('Query result:', result.rows);
        
        if (result.rows.length === 0) {
            return res.status(200).json({ message: 'No leave requests yet' });
        }
        
        res.status(200).json({ leaveRequests: result.rows });
    } catch (err) {
        console.error('Error fetching student leave requests:', err);
        res.status(500).json({ error: 'Failed to fetch leave requests', details: err.message });
    }
});


router.post('/request', async (req, res) => {
    console.log('Processing new leave request');
    const { studentId, startDate, endDate, reason, totalAttendance, academicDaysLeave, totalDays, guardianName, guardianContact, guardianEmail } = req.body;
    console.log('Request details:', { studentId, startDate, endDate, reason, totalAttendance, academicDaysLeave, totalDays, guardianName, guardianContact, guardianEmail });
    try {
        console.log('Inserting leave request into database...');
        const result = await pool.query(
            `INSERT INTO leave_requests (student_id, start_date, end_date, reason, total_attendance, academic_days_leave, total_days, guardian_name, guardian_contact, guardian_email)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [ studentId ,startDate, endDate, reason, totalAttendance, academicDaysLeave, totalDays, guardianName, guardianContact, guardianEmail]
        );
        console.log('Insert result:', result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error inserting leave request:', err);
        res.status(500).json({ error: 'Failed to submit leave request', details: err.message });
    }
});

module.exports = router;