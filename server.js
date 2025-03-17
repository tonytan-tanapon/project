const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');
const fs = require('fs');
const yahooFinance = require('yahoo-finance2').default;


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydb',
    port: 3306
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure Multer for file storage
const storage = multer.diskStorage({
    destination: './uploads/', 
    filename: (req, file, cb) => {
        const uniqueFilename = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueFilename);
    }
});
const upload = multer({ storage });

// Upload file & save to MySQL
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const filename = req.file.filename;
    const filePath = `uploads/${filename}`;
    
    db.query('INSERT INTO files (filename, filepath, upload_date) VALUES (?, ?, NOW())', 
        [filename, filePath], 
        (err) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err.message });
            }
            console.log('File uploaded successfully!')
            res.json({ message: 'File uploaded successfully!', filename });
        }
    );
});

// Fetch all uploaded files
app.get('/files', (req, res) => {
    db.query('SELECT id, filename FROM files', (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching files', error: err.message });
        }

        // Ensure JSON response
        res.setHeader('Content-Type', 'application/json');
        res.json(results);
    });
});

// Download file
app.get('/files/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.download(filePath, (err) => {
        if (err) {
            res.status(500).json({ message: 'File not found', error: err.message });
        }
    });
});

// Delete file
app.delete('/files/:id', (req, res) => {
    const fileId = req.params.id;

    db.query('SELECT filepath FROM files WHERE id = ?', [fileId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ message: 'File not found' });
        }

        const filePath = results[0].filepath;

        // Delete from DB
        db.query('DELETE FROM files WHERE id = ?', [fileId], (err) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err.message });
            }

            // Delete from filesystem
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
                res.json({ message: 'File deleted successfully!' });
            });
        });
    });
});


// ==========================
// 📌 CRUD ROUTES FOR USERS
// ==========================

// CREATE - Insert a new user
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

    db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.json({ message: 'User added successfully!', id: result.insertId });
    });
});

// READ - Get all users
app.get('/users', (req, res) => {
    
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching users', error: err.message });
        }
        res.json(results);
    });
});

// READ - Get a user by ID
app.get('/users/:id', (req, res) => {
    db.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(result[0]);
    });
});

// UPDATE - Update user by ID
app.put('/users/:id', (req, res) => {
    const { name, email } = req.body;
    db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User updated successfully!' });
    });
});

// DELETE - Delete user by ID
app.delete('/users/:id', (req, res) => {
    db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully!' });
    });
});


//// 
// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
