const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
dotenv.config()
const {connectDB} = require('./config/db')
const AuthRouter = require('./routers/auth.routes')
const UserRouter = require('./routers/user.routes')
const TaskRouter = require('./routers/task.routes')
dotenv.config();

const app = express();

//Middleware 
app.use(cors({origin:'*'}))
app.use(express.json())
app.use(cookieParser())

//Api's 
app.use('/api/auth',AuthRouter)
app.use('/api/users',UserRouter)
app.use('/api/tasks',TaskRouter)

const PORT = process.env.PORT || 8081;

const startServer = async () => {
    try {
        await connectDB();
        console.log(`MongoDB Connected`);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        console.error(error)
    }
}

startServer()