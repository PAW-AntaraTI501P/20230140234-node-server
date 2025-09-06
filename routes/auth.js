const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database/db');

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if ( !name || !email || !password)
        return res.status(400).json({ msg: 'Please enter all fields' });
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query (
            "INSERT INTO users SET ?",
            { name, email, password: hashedPassword },
            (err) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ msg: 'Email already registered' });
                }
                console.error(err);
                return res.status(500).json({ error:err.message });
                }
                res.status(201).json({ msg: 'User registered successfully' });
            }
    );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ msg: 'Please enter all fields' });
    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, results) => {
            if (err) {
                console.error("Database error on login:", err);
                return res.status(500).json({ message: "Terjadi kesalahan pada server." });
            }
            if (results.length === 0) {
                return res.status(400).json({ message: "Email atau password salah." });
            }
            const user = results[0];
            
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { 
                expiresIn: 3600 });
            res.json({ token, user: { id: user.id, email: user.email , name: user.name } });
        }
    );      
});

module.exports = router;