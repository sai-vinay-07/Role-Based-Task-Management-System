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
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Role-Based Task Management API</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
                       Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background-color: #0f172a;
          color: #e5e7eb;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 60px 20px;
        }
        h1 {
          color: #38bdf8;
          font-size: 2.4rem;
          margin-bottom: 10px;
        }
        p {
          font-size: 1.05rem;
          line-height: 1.6;
          color: #cbd5f5;
        }
        .badge {
          display: inline-block;
          background: #1e293b;
          color: #38bdf8;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 0.85rem;
          margin-bottom: 20px;
        }
        .section {
          margin-top: 40px;
        }
        ul {
          margin: 15px 0 0 20px;
        }
        li {
          margin-bottom: 10px;
        }
        code {
          background: #020617;
          padding: 4px 8px;
          border-radius: 6px;
          color: #7dd3fc;
          font-size: 0.95rem;
        }
        footer {
          margin-top: 60px;
          font-size: 0.9rem;
          color: #94a3b8;
        }
        a {
          color: #38bdf8;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <span class="badge">Backend API</span>
        <h1>Role-Based Task Management System</h1>
        <p>
          This is a backend-only RESTful API built using <strong>Node.js</strong>,
          <strong>Express.js</strong>, and <strong>MongoDB</strong>, designed around
          secure authentication, role-based access control, and task ownership enforcement.
        </p>

        <div class="section">
          <h2>🔐 Core Features</h2>
          <ul>
            <li>JWT-based authentication and authorization</li>
            <li>Role-Based Access Control (User, Manager, Admin)</li>
            <li>Task lifecycle management with ownership validation</li>
            <li>Middleware-driven route protection</li>
            <li>Centralized error handling</li>
          </ul>
        </div>

        <div class="section">
          <h2>📌 API Base Paths</h2>
          <ul>
            <li><code>/api/auth</code> – Authentication & login</li>
            <li><code>/api/users</code> – User operations</li>
            <li><code>/api/tasks</code> – Task management</li>
          </ul>
        </div>

        <div class="section">
          <h2>📦 Source Code</h2>
          <p>
            GitHub Repository:
            <a href="https://github.com/sai-vinay-07/Role-Based-Task-Management-System" target="_blank">
              View on GitHub
            </a>
          </p>
        </div>

        <footer>
          <p>
            Status: <strong>API is running</strong> ✅
          </p>
        </footer>
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