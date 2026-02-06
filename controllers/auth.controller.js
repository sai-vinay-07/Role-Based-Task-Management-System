const express = require('express')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userRegister = async (req, res) => {
    try {
        let { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields required.' })
        }

        username = username.trim()
        email = email.trim().toLowerCase()

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists, please login.' })
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ username, email, password: hashPassword })
        await newUser.save()

        const userResponse = newUser.toObject()
        delete userResponse.password

        return res.status(201).json({
            success: true,
            message: 'Registered successfully.',
            data: userResponse
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

const userLogin = async (req, res) => {
    try {
        let { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields required.' })
        }

        email = email.trim().toLowerCase()
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'User not found, please register first.' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password.' })
        }

        const token = jwt.sign(
            { id: user._id, userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_SECRET_EXPAIRY }
        )

        const userObj = user.toObject()
        delete userObj.password

        return res.status(200).json({
            success: true,
            message: 'Login successful.',
            data: { user: userObj, token }
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

const myProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: user id missing in token' })
        }

        const userProfile = await User.findById(userId)

        if (!userProfile) {
            return res.status(404).json({ message: 'User Not Found. Please Register' })
        }

        const userRecord = userProfile.toObject()
        delete userRecord.password

        return res.status(200).json({ success: true, profile: userRecord })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}



module.exports = { userRegister, userLogin, myProfile }