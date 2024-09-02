const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const StudentModel = require('./student');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

// CORS Configuration
app.use(cors({
    origin: "*", // You can replace "*" with your specific frontend domain if needed
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204, // For handling preflight requests
    credentials: true, // Enable if you need to send cookies or authentication headers
}));

// Optional: Manually handle CORS headers (in case automatic configuration isn't enough)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Replace "*" with your frontend domain if needed
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// MongoDB Connection
const mongoURI = "mongodb+srv://users:nani123@cluster0.jvt0su3.mongodb.net/Students?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

// Login Route
app.post('/nani/login', (req, res) => {
    const { username, password } = req.body;
    StudentModel.findOne({ username: username })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    const JWT_SECRET = 'your_jwt_secret_key';
                    const token = jwt.sign(
                        { id: user._id, username: user.username },
                        JWT_SECRET,
                        { expiresIn: '1h' } // Token expires in 1 hour
                    );
                    res.status(200).json({
                        message: "Success",
                        token: token
                    });
                } else {
                    res.status(401).json({ message: "Incorrect Password" });
                }
            } else {
                res.status(404).json({ message: "Invalid username" });
            }
        })
        .catch(err => {
            console.error('Error during login:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        });
});

// Get Users Route
app.get('/nani/users', (req, res) => {
    StudentModel.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            console.error('Error fetching users:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        });
});

// Server Listening
app.listen(5001, () => {
    console.log('Server is running on port 5001...');
});
