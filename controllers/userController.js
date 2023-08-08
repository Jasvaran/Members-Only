const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const passport = require('passport')
const localStrategy = require('passport-local')
const {body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')

exports.index = asyncHandler(async(req, res, next) => {

    // if user is already authenticated, user will be redirected back to main page 
    if (req.user){
        res.redirect('/main')
    }

    res.render("index", {
        title: "Members Project",
        user: req.user
    })
})


exports.signUp_Controller_get = asyncHandler(async(req, res, next) => {
    
    res.render("sign-up-form",{
        errors: false
    })
})

exports.signUp_Controller_post = [
    // validate and sanitize
    body('first_name', 'Name must not be empty')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('last_name', 'Name must not be empty')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('username', 'Username must not be empty')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('password', 'Password must not be empty')
        .trim()
        .isLength({min: 6})
        .withMessage("Password must be atleast 6 characters")
        .escape(),
    body('confirm-password')
        .trim()
        .isLength({min: 6})
        .withMessage("Password must contain atleasat 6 characters")
        .escape()
        .custom((val, {req}) => {
           return val === req.body.password
        }),

    // process request after validation and sanitization
    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req)

        const newUser = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            password: req.body.password,
        })

        if (!errors.isEmpty()){
            // there are errors. render form with sanitized values and error messages
            res.render("sign-up-form", {
                user: newUser,
                errors: errors.array()
            })
            return;
            
        } else {

            bcrypt.hash(req.body.password, 10, async(err, hashedPassword) => {
                if (err){
                    next(err)
                }
                newUser.password = hashedPassword
                await newUser.save()
                res.redirect('/')
            })

        }

    })
]


exports.logInController_post = passport.authenticate("local", {
    successRedirect: '/main',
    failureRedirect: '/'
})



exports.LogOutController_get = asyncHandler(async(req, res, next) => {
    req.logOut(function(err){
        if (err){
            return next(err)
        }
        res.redirect('/')
    })
})