const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

// To Create tasks
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

// To Read all tasks complete or uncomplete based on user search
// GET /tasks?completed=true  --> Filtering
// GET /tasks?limit=10&skip=0 --> Paginating Data
// GET /tasks?sortBy=createdAt:desc or asc --> here we can use any special character in place of ':'
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed){    // Here req.query.completed is a string
        match.completed = req.query.completed === "true"    // convert to boolean
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':') // This ':' must match match with the special character used in url
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1   //for desc(-1) or asc(1)
    }
    
    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send()
    }
})

//To Read individual task
router.get('/tasks/:id', auth, async (req, res)=>{
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

// To update task
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const ValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    if(!ValidOperation){
        return  res.status(400).send({error: "Invalid update!"})
    }   
    try{
        const task = await Task.findOne({_id:req.params.id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update) => task[update]=req.body[update])
        await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

// To Delete Task
router.delete('/tasks/:id', auth, async (req, res) => {
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router
