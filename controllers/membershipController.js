const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')
const User = require('../models/user')



exports.membership_get = asyncHandler(async(req, res, next) => {
    
    res.render("membership", {
        user: req.user
    })
})


exports.membership_post = [
    body('membership', 'Incorrect Code')
        .trim()
        .isLength({min: 1})
        .escape(),

    asyncHandler(async(req, res, next) => {

        const errors = validationResult(req)

        const password = req.body.membership
        
        console.log(password)
        const currentUser = await User.findById(req.user._id).exec()
        console.log('CURRENT USER QUERY ----------', currentUser)
    
        if (!errors.isEmpty){
            res.render('/join', {
                errors: errors.array()
            })
            return;
        }

        if (password === process.env.SECRET_CODE) {
            // need to save membership status in database. it isn't saving. ex query: user.save()
            console.log('Correct')
            await User.findByIdAndUpdate(req.user._id, {membership_status: true}).exec()
            console.log('UPDATED QUERY---------', req.user)
            res.redirect('/main')
        } else {
            console.log('Incorrect Code')
            console.log('FAILED TO UPDATE QUERY--------', req.user)
            res.redirect('/main')
        }
    })

]