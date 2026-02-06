const Task = require('../models/task')
const User = require('../models/User')


const createTask = async (req, res) => {
    try {

        const { title, description, priority, dueDate } = req.body

        const userId = req.user.id

        if (!title || !description || !priority || !dueDate) {
            return res.status(400).json({ message: 'All fields are required.' })
        }

        const newTask = new Task({
            title,
            description,
            priority,
            dueDate,
            user: userId
        })

        await newTask.save()

        return res.status(201).json({
            success: true,
            message: 'New task created successfully.',
            data: newTask
        })

    } catch (error) {
        console.error(error)
        return res.status(500).send('Internal Server Error.')
    }
}

const taskAssignedByManager = async (req, res) => {
    try {

        const { assignedTo } = req.body
        const taskId = req.params.taskId

        const taskExist = await Task.findById(taskId)
        if (!taskExist) {
            return res.status(400).send("No Task Found.")
        }

        taskExist.user = assignedTo
        await taskExist.save()

        return res.status(200).json({
            success: true,
            message: "Task Assigned to new user."
        })

    }
    catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Internal Server Error."
        })
    }
}

const getAllTasks = async (req, res) => {
    try {

        const allTasks = await Task.find({})

        return res.status(200).json({
            success: true,
            message: 'All Tasks',
            count: allTasks.length,
            Tasks: allTasks
        })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal Server Error.' })
    }
}

const getMyTasks = async (req, res) => {
    try {

        const userId = req.user.id

        const userTasks = await Task.findById(userId)

        if (!userTasks) {
            return res.status(400).json({
                message: "No Tasks Assigned To You."
            })
        }

        return res.status(200).json({
            success: true,
            message: "These are tasks assigned to you.",
            count: userTasks.length,
            Tasks: userTasks
        })

    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal Server Error.' })
    }
}

const getTaskById = async (req, res) => {
    try {
        const { taskId } = req.params
        const { id: userId, role } = req.user

        const task = await Task.findById(taskId)

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }

        if (role === 'user' && task.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            })
        }

        return res.status(200).json({
            success: true,
            task
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const updateTask = async (req, res) => {
    try {

        const taskId = req.params.taskId
        const { title, description, priority, dueDate } = req.body

        const task = await Task.findByIdAndUpdate(
            taskId,
            { title, description, priority, dueDate },
            { new: true, runValidators: true }
        )

        return res.status(200).json({
            success: true,
            message: "Task update successfully",
            task
        })

    }
    catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params
    const { status } = req.body
    const { id: userId, role } = req.user

    const allowedStatus = ['pending', 'in-progress', 'completed']

    if (!status || !allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      })
    }

    const task = await Task.findById(taskId)

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      })
    }

    // Authorization
    if (role === 'user' && task.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }

    task.status = status
    await task.save()

    return res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      task
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

const deleteTask = async (req, res) =>{
    try {
        const taskId = req.params.taskId

        const task = await Task.findByIdAndDelete(taskId)

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
            task
        })
    } 
     catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

module.exports = { createTask, taskAssignedByManager, getAllTasks, getMyTasks, getTaskById, updateTask,updateTaskStatus, deleteTask }