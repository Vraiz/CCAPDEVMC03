const express = require('express')
const router = express.Router()
const taskSchema = require('../models/tasks')

router.use(express.json())

//gets all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await taskSchema.find()
        res.json(tasks)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

//gets a certain task
router.get('/:id', getTask, (req, res) => {
    res.json(res.task)
})


//creates a task
router.post('/', async (req, res) => {
    const task = new taskSchema({
        userID: req.body.userID,
        taskName: req.body.taskName,
        taskSubject: req.body.taskSubject,
        taskDesc: req.body.taskDesc,
        taskDateGiven: req.body.taskDateGiven,
        taskDateDue: req.body.taskDateDue,
        taskDateCompleted: req.body.taskDateCompleted,
        TaskCreditsReward: req.body.TaskCreditsReward,
        TaskRollReward: req.body.TaskRollReward,
        taskStatus: req.body.taskStatus,
        isTaskDeleted: req.body.isTaskDeleted
    })
    try {
        const newTask = await task.save()
        res.status(201).json(newTask)

    } catch (err) {
        res.status(400).json({message: err.message})
    }
})


//gets all tasks of a certain ID
router.get('/getUser/:id', async (req, res) => {//fix this
    try {
        const tasks = await taskSchema.find({userID: req.params.id});
        res.json(tasks)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

//edits 1
router.patch('/:id', getTask, async (req, res) => {
    if (req.body.userID != null) {
        res.task.userID = req.body.userID
    }
    if (req.body.taskName != null) {
        res.task.taskName = req.body.taskName
    }
    if (req.body.taskSubject != null) {
        res.task.taskSubject = req.body.taskSubject
    }
    if (req.body.taskDesc != null) {
        res.task.taskDesc = req.body.taskDesc
    }
    if (req.body.taskDateGiven != null) {
        res.task.taskDateGiven = req.body.taskDateGiven
    }
    if (req.body.taskDateDue != null) {
        res.task.taskDateDue = req.body.taskDateDue
    }
    if (req.body.taskDateCompleted != null) {
        res.task.taskDateCompleted = req.body.taskDateCompleted
    }
    if (req.body.TaskCreditsReward != null) {
        res.task.TaskCreditsReward = req.body.TaskCreditsReward
    }
    if (req.body.TaskRollReward != null) {
        res.task.TaskRollReward = req.body.TaskRollReward
    }
    if (req.body.taskStatus != null) {
        res.task.taskStatus = req.body.taskStatus
    }
    if (req.body.isTaskDeleted != null) {
        res.task.isTaskDeleted = req.body.isTaskDeleted
    }
    try{
        const updatedTask = await res.task.save()
        res.json(updatedTask)
    } catch (err) {
        res.status(400).json({message: err.message})
    }

})

//removes 1
router.delete('/:id', getTask, async (req, res) => {
    try{
        await res.task.deleteOne()
        res.json({ message: "deleted task"})
    } catch  (err){
        res.status(500).json({message: err.message})
    }
})

//gets a specific task
async function getTask(req, res, next) {//fix this
    let task
    try {
        task = await taskSchema.findById(req.params.id)
        if (task == null) {
            return res.status(404).json({ message:"cannot find Task"})
        }
    } catch(err) {
        res.status(500).json({message: err.message})
    }

    res.task = task
    next()
}


module.exports = router