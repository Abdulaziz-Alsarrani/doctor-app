const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const {  userValidatorRules, validate } = require('../middlewares/validator');
const isLoggedIn = require('../middlewares/auth');
const doctorController = require('../controllers/doctorController')

router.get('/', (req, res) => {
    res.json({message: "hi java"})
})


// User routes
router.post('/account/signup',userValidatorRules(), validate, userController.register)
router.post('/account/login', userController.login)
router.get('/account/me', isLoggedIn, userController.me)
router.get('/account/profile', isLoggedIn, userController.getProfile)
router.put('/account/update', isLoggedIn, userController.updateProfile)
router.delete('/account/delete-profile', isLoggedIn, userController.deleteProfile)


// doctor routes
router.get('/doctor', doctorController.index)

module.exports = router;