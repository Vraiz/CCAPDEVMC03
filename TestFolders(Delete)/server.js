const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));


mongoose.connect('mongodb+srv://vraiz:123@ccapdevmco.3w1lh3c.mongodb.net');

// Import the userData schema
const UserData = require('./userData'); // Assuming the file is named userData.js and is in the same directory
const Task = require('./tasks');
const Items = require('./inventory');
// Register Account






app.post('/createTask', async (req, res) => {
    try {
        const { userID, taskName, taskDesc, taskDateDue } = req.body;
        console.log("Task data received from frontend:", req.body);
        const newTask = new Task({
            userID,
            taskName,
            taskDesc,
            taskDateDue
        });

        await newTask.save();
        res.status(201).json({ message: 'Task created successfully' }); // Correctly formatted JSON response
    } catch (err) {
        console.error("Error creating task: ", err);
        res.status(500).json({ error: 'Server error' }); // Correctly formatted JSON response
    }
});


app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Update task endpoint
app.put('/updateTask/:taskID', async (req, res) => {
    const { taskID } = req.params;
    const { taskName, taskDesc, taskDateDue } = req.body;

    try {
        await Task.findByIdAndUpdate(taskID, {
            taskName,
            taskDesc,
            taskDateDue
        });
        res.send('Task updated successfully');
    } catch (err) {
        console.error("Error updating task: ", err);
        res.status(500).send('Server error');
    }
});




app.get('/tasks/getUser/:userID', async (req, res) => {
    try {
        const userID = req.params.userID;
        const tasks = await Task.find({ userID });
        res.json(tasks);
    } catch (err) {
        console.error("Error fetching tasks by user ID: ", err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/getUserData/:userID', async (req, res) => {
    try {
        const userID = req.params.userID;
        const userData = await UserData.findById(userID); // Use UserData, not userData

        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(userData);
    } catch (err) {
        console.error("Error fetching user data:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/userdatas/:userID', async (req, res) => {
    try {
        const userID = req.params.userID;
        const userData = await UserData.findById(userID);

        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(userData);
    } catch (err) {
        console.error("Error fetching user data:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'landingpage.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
