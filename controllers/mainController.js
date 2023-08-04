const asyncHandler = require('express-async-handler')
const {body, validationResult } = require('express-validator')



exports.mainController_get = asyncHandler(async(req, res, next) => {

    if (!req.user){
        res.redirect('/')
    }

    res.render("main", {
        user: req.user
    })
})