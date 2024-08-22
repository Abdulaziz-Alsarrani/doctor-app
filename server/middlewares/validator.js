const { body, validationResult } = require('express-validator');

const userValidatorRules = () =>{
    return [
        body("name").notEmpty().withMessage('Enter a name'),
        body("email").notEmpty().withMessage('Enter a email'),
        body("email").isEmail().withMessage('Enter correct email'),
        body("password").notEmpty().withMessage('Enter password'),
        body("password").isLength({min:5}).withMessage('password must be more than 5 characters')

    ]
}

const validate = (req, res, next) => {
    const errors = validationResult(req)

    if(errors.isEmpty()){
        return next();
    }
    
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({
        [err.path]: err.msg
    }))
    return res.status(400).json({errors: extractedErrors})
}

module.exports ={
    userValidatorRules,
    validate
}