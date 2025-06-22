const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- CONFIGURATION ---
const ADMIN_PASSWORD = "1234"; 
const DB_FILE = path.join(__dirname, 'db.json');

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- DATABASE HELPER ---
function readDb() {
    if (!fs.existsSync(DB_FILE)) {
        const initialData = { testimonials: [], blogs: [], faqs: [] };
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
}

function writeDb(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// --- PUBLIC API ROUTES ---
// These are for your main website to consume.
app.get('/api/testimonials', (req, res) => res.json(readDb().testimonials));
app.get('/api/blogs', (req, res) => res.json(readDb().blogs));
app.get('/api/faqs', (req, res) => res.json(readDb().faqs));


// --- ADMIN ROUTES ---

// Admin Login
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.status(200).json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

// Middleware to protect admin routes
const authMiddleware = (req, res, next) => {
    // This is a simplified check. A real app should use a more secure method like JWT.
    const token = req.headers['authorization'];
    if (token === ADMIN_PASSWORD) {
        next();
    } else {
        res.status(403).send('Forbidden: Access Denied');
    }
};

// Generic CRUD functions to avoid repetition
function createCrudEndpoints(type) {
    // GET all items of a type
    app.get(`/api/admin/${type}`, authMiddleware, (req, res) => {
        const db = readDb();
        res.json(db[type]);
    });

    // **NEW**: GET a single item by ID
    app.get(`/api/admin/${type}/:id`, authMiddleware, (req, res) => {
        const db = readDb();
        const id = parseInt(req.params.id, 10);
        const item = db[type].find(i => i.id === id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).send('Item not found');
        }
    });

    // POST a new item
    app.post(`/api/admin/${type}`, authMiddleware, (req, res) => {
        const db = readDb();
        const newItem = { id: Date.now(), ...req.body };
        db[type].unshift(newItem);
        writeDb(db);
        res.status(201).json(newItem);
    });

    // PUT (update) an item
    app.put(`/api/admin/${type}/:id`, authMiddleware, (req, res) => {
        const db = readDb();
        const id = parseInt(req.params.id, 10);
        const index = db[type].findIndex(item => item.id === id);
        if (index > -1) {
            db[type][index] = { ...db[type][index], ...req.body };
            writeDb(db);
            res.json(db[type][index]);
        } else {
            res.status(404).send('Item not found');
        }
    });

    // DELETE an item
    app.delete(`/api/admin/${type}/:id`, authMiddleware, (req, res) => {
        const db = readDb();
        const id = parseInt(req.params.id, 10);
        const initialLength = db[type].length;
        db[type] = db[type].filter(item => item.id !== id);
        
        if (db[type].length < initialLength) {
            writeDb(db);
            res.status(204).send(); // Success, no content
        } else {
            res.status(404).send('Item not found');
        }
    });
}

// Create all the CRUD endpoints for each content type
createCrudEndpoints('testimonials');
createCrudEndpoints('blogs');
createCrudEndpoints('faqs');


// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`Server is running on port:${PORT}`);
    readDb(); // Initialize DB on start if it doesn't exist
});

// Export the app for Vercel
module.exports = app;
