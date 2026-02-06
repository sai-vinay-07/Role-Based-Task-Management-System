require('dotenv').config()
const { connectDB } = require('./db')
const bcrypt = require('bcrypt')
const User = require('../models/User')

const createAdmin = async () => {
    try {

        await connectDB()
        
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if (!adminEmail || !adminPassword) {
            console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment')
        }

        const existing = await User.findOne({ email: adminEmail })
        if (existing) {
            console.log(`Admin user with email ${adminEmail} already exists.`)
        }

        const hashPassword = await bcrypt.hash(adminPassword, 12)

        const admin = new User({
            username: 'Admin',
            email: adminEmail,
            password: hashPassword,
            role: 'admin'
        })

        await admin.save()
        console.log('Admin user created successfully.')

    } catch (error) {
        console.error('Failed to create admin:', error)
    }
}

if (require.main === module) {
    createAdmin()
}

module.exports = createAdmin