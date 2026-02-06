const express = require('express')
const {createTask, taskAssignedByManager, deleteTask,getAllTasks, getMyTasks, getTaskById ,updateTask, updateTaskStatus} = require('../controllers/task.controller')
const authMiddleware = require('../middleware/auth-middleware')
const roleAccess = require('../middleware/role.middleware')

const router = express.Router()

router.post('/',authMiddleware,roleAccess('manager'),createTask)
router.post('/:taskId/assign',authMiddleware,roleAccess('manager'),taskAssignedByManager)
router.get('/',authMiddleware,roleAccess('admin'),getAllTasks)
router.get('/my',authMiddleware,roleAccess(['user','manager']),getMyTasks)
router.get('/:taskId',authMiddleware,roleAccess(['admin','manager','user']),getTaskById)
router.patch('/:taskId',authMiddleware,roleAccess('manager'),updateTask)
router.patch('/:taskId/status',authMiddleware,roleAccess('user'),updateTaskStatus)
router.delete('/:taskId',authMiddleware,roleAccess(['admin','manager']),deleteTask)


module.exports = router