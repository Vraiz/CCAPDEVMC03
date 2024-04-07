const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    taskName: {
        type: String,
        required: true
    },
    taskSubject: {
        type: String,
        required: false,
        default: "uncategorized"
    },
    taskDesc: {
        type: String,
        required: false,
    },
    taskDateGiven: {
        type: Date,
        required: true,
        default: Date.now
    },
    taskDateDue: {
        type: Date,
        required: false,
    },
    taskDateCompleted: {
        type: Date,
        required: false,
    },
    TaskCreditsReward: {
        type: Number,
        required: true,
        default: 0
    },
    TaskRollReward: {
        type: Number,
        required: true,
        default: 0
    },
    taskStatus: {
        type: String,
        required: true,
        enum: ['Not Started', 'Started', 'Overdue'],
        default: 'Not Started' 
    },
    isTaskDeleted: {
        type: Boolean,
        required: true,
        default: false
    }
})

module.exports = mongoose.model("tasks", taskSchema)