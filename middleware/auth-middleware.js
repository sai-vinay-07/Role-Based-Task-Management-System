const express = require('express')
const jwt = require('jsonwebtoken')

const authMiddleware = async (req, res, next) => {
    try {
        const headerToken = req.headers.authorization || ''

        if (!headerToken || !headerToken.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token not found or invalid format.' })
        }

        const token = headerToken.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded
        next()
    } catch (error) {
        console.error(error)
        return res.status(status).json({ message: msg })
    }
}

module.exports = authMiddleware