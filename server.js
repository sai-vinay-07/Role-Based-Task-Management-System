const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
dotenv.config()
const { connectDB } = require('./config/db')
const AuthRouter = require('./routers/auth.routes')
const UserRouter = require('./routers/user.routes')
const TaskRouter = require('./routers/task.routes')
dotenv.config();

const app = express();

//Middleware 
app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(cookieParser())

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON payload. Use valid JSON with double quotes and no trailing commas.'
    })
  }
  next(err)
})


//Api's 
app.use('/api/auth', AuthRouter)
app.use('/api/users', UserRouter)
app.use('/api/tasks', TaskRouter)

app.get('/', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Task Management API</title>
      <style>
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          background: #f8fafc;
          color: #1f2937;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
        }
        .card {
          background: #ffffff;
          padding: 32px 40px;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          max-width: 520px;
          text-align: center;
        }
        h1 {
          margin: 0 0 12px;
          font-size: 1.6rem;
          font-weight: 600;
        }
        p {
          margin: 8px 0;
          font-size: 0.95rem;
          line-height: 1.5;
          color: #374151;
        }
        code {
          background: #f1f5f9;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.85rem;
        }
        a {
          color: #111827;
          text-decoration: underline;
          font-weight: 500;
        }
        .status {
          margin-top: 16px;
          font-size: 0.9rem;
          color: #065f46;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Role-Based Task Management API</h1>
        <p>Backend REST API with JWT authentication and role-based access control.</p>
        <p>
          Base routes:
          <br />
          <code>/api/auth</code> ·
          <code>/api/users</code> ·
          <code>/api/tasks</code>
        </p>
        <p>
          <a href="https://github.com/sai-vinay-07/Role-Based-Task-Management-System" target="_blank">
            View GitHub Repository
          </a>
        </p>
        <p class="status">API status: running</p>
      </div>
    </body>
    </html>
  `)
})


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