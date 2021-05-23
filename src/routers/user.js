const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail, sendDeleteEmail} = require('../emails/account')
const router = new express.Router()

// To Create users
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try{
        sendWelcomeEmail(user.email, user.name)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }catch(e){
        res.status(400).send(e)
    }
})

//User login
router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password) // this func is defined in models/user.js
        const token = await user.generateAuthToken()
        res.send({user,token}) //send({user,token})
    }catch(e){
        res.status(400).send()
    }
})

// User LogOut, one token
router.post('/users/logout', auth, async(req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

// USer logout, all tokens
router.post('/users/logoutAll', auth, async (req,res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

// To see a users profile, here auth is a middleware for authentication
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// To update user
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const ValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    if(!ValidOperation){
        return  res.status(400).send({error: "Invalid update!"})
    }
    try{
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

// To Delete user
router.delete('/users/me', auth, async (req, res) => {
    try{
        await req.user.remove()
        sendDeleteEmail(req.user.email, req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000 //In bytes
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return (cb(new Error("Please upload an image")))
        }
        cb(undefined, true)
    }
})

// Creating and updating a user's profile pic
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar = buffer//to access buffer dest option must not be used in upload multer above
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

// Deleting a user's Avatar profile pic
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

// Accessing image by user id
router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            return new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

module.exports = router
