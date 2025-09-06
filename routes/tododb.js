const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Mengimpor koneksi database

// Endpoint untuk mendapatkan semua tugas
router.get('/', (req, res) => {
    const userId = req.user.id; // Mendapatkan userId dari token yang sudah diverifikasi
    console.log(`Mendapatkan todos untuk userId: ${userId}`);
    db.query('SELECT * FROM todos WHERE user_id = ?', [userId], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.json(results);
    });
});

// // Endpoint untuk mendapatkan tugas berdasarkan ID
// router.get('/:id', (req, res) => {
//     db.query('SELECT * FROM todos WHERE id = ?', [req.params.id], (err, results) => {
//         if (err) return res.status(500).send('Internal Server Error');
//         if (results.length === 0) return res.status(404).send('Tugas tidak ditemukan');
//         res.json(results[0]);
//     });
// });

// Endpoint untuk menambahkan tugas baru
router.post('/', (req, res) => {
    const { task } = req.body;
    const userId = req.user.id;
    if (!task || task.trim() === '') {
        return res.status(400).send('Tugas tidak boleh kosong');
    }

    db.query('INSERT INTO todos (task, user_id) VALUES (?, ?)', [task.trim(), userId], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        const newTodo = { id: results.insertId, task: task.trim(), user_id: userId, completed: false };
        res.status(201).json(newTodo);
    });
});

// Endpoint untuk memperbarui tugas
router.put('/:id', (req, res) => {
    const { task, completed } = req.body;
    const userId = req.user.id;
    const todoId = req.params.id;
    db.query('UPDATE todos SET task = ?, completed = ? WHERE id = ? AND user_id = ?', [task, completed, todoId, userId], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Tugas tidak ditemukan');
        res.json({ id: todoId, task, completed });
    });
});

// Endpoint untuk menghapus tugas
router.delete('/:id', (req, res) => {
    const userId = req.user.id;
    const todoId = req.params.id;
    db.query('DELETE FROM todos WHERE id = ? AND user_id = ?', [todoId, userId], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Tugas tidak ditemukan');
        res.status(204).send();
    });
});

module.exports = router;