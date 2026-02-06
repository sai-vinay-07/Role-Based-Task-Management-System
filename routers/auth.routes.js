const express = require('express')
const {userRegister, userLogin, myProfile} = require('../controllers/auth.controller')
const authMiddleware = require('../middleware/auth-middleware')
const router = express.Router()


router.post('/register',userRegister)
router.post('/login',userLogin)
router.get('/me',authMiddleware,myProfile)

module.exports = router