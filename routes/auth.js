const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database/db');

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ msg: 'Please enter all fields' });

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query (
        "INSERT INTO users SET ?",
        { email, password: hashedPassword },
        (err) => {
            if (err) return res.status(500).json({ error:err.message});
            res.status(201).json({ msg: 'User registered successfully' });
        }
    );
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ msg: 'Please enter all fields' });
    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, results) => {
            const user = results[0];
            if (!user) return res.status(400).json({ msg: "Invalid credentials" });
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { 
                expiresIn: 3600 });
            res.json({ token, user: { id: user.id, email: user.email } });
        }
    );      
});

module.exports = router;