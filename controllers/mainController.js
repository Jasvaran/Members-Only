const asyncHandler = require('express-async-handler')
const {body, validationResult } = require('express-validator')
const Message = require('../models/messages')
const User = require('../models/user')
const { DateTime } = require('luxon')



exports.mainController_get = asyncHandler(async(req, res, next) => {

    // redirect if user isn't logged in
    if (!req.user){
        res.redirect('/')
    }

    

    // Query database for allUsers and Messages
    const [allUsers, allMessages] = await Promise.all([
        User.find({}).exec(),
        Message.find({})
            .populate('user')
            .exec()
    ])



    res.render("main", {
        user: req.user,
        allUsers: allUsers,
        allMessages: allMessages
    })
})


exports.create_message_get = asyncHandler(async(req, res, next) => {
    if (!req.user) {
        res.redirect('/')
    }
    console.log(req.user._id)
    res.render("create_message", {
        user: req.user
    })
})

exports.create_message_post = [
    body("title", "Title is required")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("message", "Message is required")
        .trim()
        .isLength({min: 1}),

    asyncHandler(async(req, res, next) => {

        

        const errors = validationResult(req)

        const newMessage = new Message({
            title: req.body.title,
            message: req.body.message,
            user: req.user._id,
        })

        if (!errors.isEmpty()){
            res.render("create_message", {
                user: req.user,
                errors: errors.array()
            })
            return;
        } else {
            await newMessage.save()
            res.redirect('/main')
        }

        


    })
]