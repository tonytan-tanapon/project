const express = require('express');
const multer = require('multer'); //file management
const cors = require('cors'); //Cross-Origin Resource Sharing
const path = require('path'); //
const mysql = require('mysql2');
const fs = require('fs');
// const yahooFinance = require('yahoo-finance2').default;
const { Pool } = require('pg');



const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
        cb(null, uniqueFilename); // callback specify how the file should be saved.
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
    const userId = req.body.user_id; // Get user ID from the request

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    console.log(`Uploading file for User ID: ${userId}, Filename: ${filename}`);

    db.query(
        'INSERT INTO files (user_id, filename, filepath, upload_date) VALUES (?, ?, ?, NOW())',
        [userId, filename, filePath],
        (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ message: 'Database error', error: err.message });
            }

            console.log('File uploaded successfully!');
            res.json({ 
                message: 'File uploaded successfully!', 
                fileId: result.insertId, 
                filename, 
                filePath 
            });
        }
    );
});


// Fetch all uploaded files
app.get('/files', (req, res) => {
    db.query('SELECT * FROM files', (err, results) => {
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


app.post('/update-click/:id', (req, res) => {
    const imageId = req.params.id;

    if (!imageId) {
        return res.status(400).json({ message: "Image ID is required." });
    }

    console.log(`Updating click count for Image ID: ${imageId}`);

    db.query('UPDATE files SET click = click + 1 WHERE id = ?', [imageId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ message: 'Database error', error: err.message });
        }

        if (result.affectedRows === 0) {
            console.log("Image ID not found in the database.");
            return res.status(404).json({ message: "Image not found." });
        }

        console.log(`Click count updated successfully for Image ID: ${imageId}`);
        res.json({ message: "Click count updated successfully!" });
    });
});

// ==========================
// CRUD ROUTES FOR USERS
// ==========================

// CREATE - Insert a new user
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }
    console.log(name, email)
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
// app.get('/users/:id', (req, res) => {
//     db.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: 'Database error', error: err.message });
//         }
//         if (result.length === 0) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.json(result[0]);
//     });
// });


// API to fetch user details, comments, and images
app.get('/users/:id', (req, res) => {
    db.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, userResults) => {   
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        
        db.query('SELECT * FROM comments WHERE user_id = ? order by id', [req.params.id], (err, commentsResults) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err.message });
            }
            
            db.query('SELECT * FROM files WHERE user_id = ? order by id', [req.params.id], (err, imagesResults) => {
                if (err) {
                    return res.status(500).json({ message: 'Database error', error: err.message });
                }
                
                res.json({user: userResults[0] || null,
                    comments: commentsResults || [],
                    images: imagesResults || []
                });
            });
    
        });


    });
});

app.get('/comments', (req, res) => {
    
    db.query('SELECT * FROM comments', (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching comments', error: err.message });
        }
        res.json(results);
    });
});

app.post('/comments', (req, res) => {
    
    const { user_id, comment_text, sentiment } = req.body;

    if (!user_id || !comment_text) {
        return res.status(400).json({ message: "User ID and comment text are required." });
    }
    console.log("comment ",user_id, comment_text, sentiment)
    db.query('INSERT INTO comments (user_id, comment_text, sentiment) VALUES (?, ?, ?)', [user_id, comment_text,sentiment], (err, result) => {
        if (err) {
            console.error("Error inserting comment:", err);
            return res.status(500).json({ message: "Database error", error: err.message });
        }
        res.json({ message: "Comment added successfully!", commentId: result.insertId });
    });
   
});

app.delete('/comments/:id', (req, res) => {
    const commentId = req.params.id;

    db.query('DELETE FROM comments WHERE id = ?', [commentId], (err, result) => {
        if (err) {
            console.error("Error deleting comment:", err);
            return res.status(500).json({ message: "Database error", error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Comment not found." });
        }

        res.json({ message: "Comment deleted successfully!" });
    });
});

// update sentiment
app.post('/sentiment/:id', (req, res) => {
    const imageId = req.params.id;
    const { sentiment } = req.body;
    if (!imageId) {
        return res.status(400).json({ message: "Image ID is required." });
    }

    console.log("Sentiment >> ",imageId, sentiment);

    db.query('UPDATE comments SET sentiment = ? WHERE id = ?', [ sentiment, imageId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ message: 'Database error', error: err.message });
        }

        if (result.affectedRows === 0) {
            console.log("Image ID not found in the database.");
            return res.status(404).json({ message: "Image not found." });
        }

        console.log(`Click count updated successfully for Image ID: ${imageId}`);
        res.json({ message: "Click count updated successfully!" });
    });
});

// UPDATE - Update user by ID
app.put('/users/:id', (req, res) => {
  
    const { name, email } = req.body;
    console.log(name, email)
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
    console.log(req.params.id)
  
    db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log("Delete Successfully")
        res.json({ message: 'User deleted successfully!' });
    });
});


//// 
// Start server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
