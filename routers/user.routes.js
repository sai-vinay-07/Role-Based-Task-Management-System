const express = require('express')
const  {getAllUsers, getUserById, updateRole, deleteUserById} = require('../controllers/user.controller')
const authMiddleware = require('../middleware/auth-middleware')
const roleAccess = require('../middleware/role.middleware')
const router = express.Router()

router.get('/',authMiddleware,roleAccess('admin'),getAllUsers )
router.get('/:userId',authMiddleware,roleAccess('admin'),getUserById)
router.put('/:userId/role',authMiddleware,roleAccess('admin',), updateRole)
router.delete('/:userId',authMiddleware,roleAccess('admin',), deleteUserById)


module.exports = router