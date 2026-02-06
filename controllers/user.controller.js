const mongoose = require('mongoose')
const User = require('../models/User')

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find({}).select('-password -__v')

        return res.status(200).json({
            success: true,
            message: 'All Registered users',
            count: allUsers.length,
            users: allUsers
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal Server Error.' })
    }
}

const getUserById = async (req, res) => {
    try {
        const userId = req.params.userId

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user id.' })
        }

        const user = await User.findById(userId).select('-password -__v')

        if (!user) {
            return res.status(404).json({ message: 'User Not Found.' })
        }

        return res.status(200).json({
            success: true,
            message: 'Successfully retrieved user details',
            user_details: user
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal Server Error.' })
    }
}

const updateRole = async (req, res) => {
    try {
        const { role } = req.body
        const userId = req.params.userId

        if (!role) {
            return res.status(400).json({ message: 'Role field is required.' })
        }

        if (!userId ) {
            return res.status(400).json({ message: 'Invalid user id.' })
        }

        const allowedRoles = ['user', 'manager', 'admin']
    
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: `Invalid role.` })
        }

        const userExist = await User.findById(userId)

        if (!userExist) {
            return res.status(404).json({ message: 'User Not Found.' })
        }

        userExist.role = role
        await userExist.save()

        const updatedUser = await User.findById(userId).select('-password -__v')

        return res.status(200).json({ success: true, message: 'User role updated successfully.', user: updatedUser })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal Server Error.' })
    }
}

const deleteUserById = async(req,res)=>{
    try {

        const userId = req.params.userId

        const user = await User.findById(userId)

        if(!user){
            return res.status(404).send("User Not Found.")
        }

        await User.findByIdAndDelete(userId)

        return res.status(200).json({
            success : true,
            message : "User deleted Successfully."
        })

    } 
     catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal Server Error.' })
    }
}
module.exports = { getAllUsers, getUserById, updateRole, deleteUserById }