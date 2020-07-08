const router = require('express').Router();
const pool = require('../db');
const verifyJwt = require('../middleware/verifyJwt');

router.get('/', verifyJwt, async (req, res) => {
    try {
        const user = await pool.query(
            'SELECT user_email, user_id, user_name FROM users WHERE user_id = $1',
            [req.user.id]
        );

        res.json(user.rows[0]);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
