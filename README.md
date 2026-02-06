# Role-Based Task Management System (Backend)

## Project Overview

Role-Based Task Management System (Backend) is a backend REST API application designed to manage tasks with role-based access control. The system provides secure user authentication, allows users to create and manage tasks, and enforces role-based permissions across different user levels (User, Manager, Admin). The architecture follows MVC (Model-View-Controller) principles and prioritizes clean code, security, and scalability.

This is a **backend-only project** designed for integration with frontend applications or as a standalone API service.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime for server-side development |
| **Express.js** | Web framework for building REST APIs |
| **MongoDB** | NoSQL database for data persistence |
| **Mongoose** | ODM (Object Data Modeling) for MongoDB |
| **JSON Web Tokens (JWT)** | Secure token-based authentication |
| **bcrypt** | Password hashing and encryption |
| **CORS** | Cross-Origin Resource Sharing for API accessibility |
| **dotenv** | Environment variable management |
| **Nodemailer** | Email notification service |

---

## Core Features

### Authentication & Authorization
- User registration with email and password
- User login with JWT token generation
- JWT-based session management
- Role-based access control (RBAC) with three tiers: User, Manager, Admin

### Task Management
- Create, read, update, and delete (CRUD) operations for tasks
- Task assignment and allocation
- Task status tracking
- Role-based task visibility and permissions

### Role Hierarchy
- **User**: Can create and view personal tasks
- **Manager**: Can manage user tasks and access team-level operations
- **Admin**: Full system access, user management, and administrative controls

---

## Security Features

### Password Security
- Passwords are hashed using **bcrypt** with salt rounds for enhanced security
- Plain-text passwords are never stored in the database

### Authentication
- **JWT-based authentication** for stateless session management
- JWT tokens contain user identity and role information
- Tokens validated on each protected endpoint request

### Authorization
- **Role-based middleware** enforces access control
- Endpoints protected with role validation
- Unauthorized access attempts are rejected with appropriate HTTP status codes

### Data Protection
- **CORS** policy ensures secure cross-origin requests
- Input validation on all endpoints
- MongoDB connection requires secure credentials via environment variables

---

## API Workflow

### Authentication Flow

```
User Request (Register/Login)
    ↓
Input Validation
    ↓
Password Hashing (bcrypt) / Verification
    ↓
JWT Token Generation
    ↓
Token Returned to Client
    ↓
Client Stores Token (localStorage/cookie)
```

**Endpoints:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login and token generation
- `GET /api/auth/me` - Retrieve authenticated user profile (requires JWT)

### Task Management Flow

```
Authenticated Request with JWT Token
    ↓
Auth Middleware Verification (JWT validation)
    ↓
Role Middleware Check (access control)
    ↓
Route Handler Execution
    ↓
Task Operation (CRUD)
    ↓
Response with Data/Status
```

**Endpoints:**
- `GET /api/tasks` - Retrieve tasks (role-dependent visibility)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Retrieve specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Request-Response Example

**Authentication Request:**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Task Request (with JWT in header):**
```
GET /api/tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response (200):
[
  {
    "id": "507f1f77bcf86cd799439012",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "in-progress",
    "assignedTo": "507f1f77bcf86cd799439011",
    "createdBy": "507f1f77bcf86cd799439011",
    "createdAt": "2026-02-06T10:30:00Z"
  }
]
```

---

## Folder Structure (MVC Architecture)

```
project-root/
│
├── server.js                 # Application entry point
├── package.json              # Project dependencies and scripts
│
├── config/                   # Configuration and initialization
│   ├── db.js                 # Database connection setup
│   └── createAdmin.js        # Admin user initialization
│
├── controllers/              # Business logic layer
│   ├── auth.controller.js    # Authentication operations
│   ├── user.controller.js    # User management operations
│   └── task.controller.js    # Task management operations
│
├── models/                   # Data models (Mongoose schemas)
│   ├── User.js               # User schema and model
│   └── task.js               # Task schema and model
│
├── middleware/               # Express middleware functions
│   ├── auth-middleware.js    # JWT verification middleware
│   └── role.middleware.js    # Role-based access control middleware
│
└── routers/                  # API route definitions
    ├── auth.routes.js        # Authentication endpoints
    ├── user.routes.js        # User management endpoints
    └── task.routes.js        # Task management endpoints
```

### Architecture Explanation

- **Controllers**: Contain the core business logic for handling requests and responses
- **Models**: Define the structure of data stored in MongoDB
- **Middleware**: Handle cross-cutting concerns like authentication and authorization
- **Routers**: Define API endpoints and map them to appropriate controller functions
- **Config**: Manage application initialization and external service connections

---

## Environment Variables (.env Example)

Create a `.env` file in the project root with the following variables:

```env
# Server Configuration
PORT=8081
NODE_ENV=development

# Database Configuration
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/taskflow-db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_min_32_characters
JWT_EXPIRE=7d

# Email Configuration (Optional - for notifications)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# Frontend URLs (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Environment Variable Details

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `8081` |
| `NODE_ENV` | Application environment | `development` or `production` |
| `MONGO_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your-secret-key-min-32-chars` |
| `JWT_EXPIRE` | JWT token expiration time | `7d`, `24h`, `3600s` |
| `EMAIL_USER` | Sender email address for notifications | `notifications@example.com` |
| `EMAIL_PASSWORD` | Email service password/token | `app_specific_password` |

---

## Installation & Setup

### Prerequisites

Ensure the following are installed on your system:
- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **MongoDB** (local instance or MongoDB Atlas account)

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/role-based-task-management-system.git
cd role-based-task-management-system
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

1. Create a `.env` file in the project root
2. Copy the example variables from the Environment Variables section above
3. Update the values with your actual configuration:

```bash
# Example
MONGO_URL=mongodb+srv://your_user:your_password@your_cluster.mongodb.net/taskflow-db
JWT_SECRET=your_32_character_secret_key_here
```

### Step 4: Initialize Database (Optional)

If an admin initialization script is provided:

```bash
node config/createAdmin.js
```

This creates an initial admin user for system setup.

### Step 5: Verify Installation

```bash
npm start
```

You should see:
```
MongoDB Connected
Server is running on port 8081
```

---

## Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

Uses **nodemon** to automatically restart the server on file changes. Ideal for development.

### Production Mode

```bash
npm start
```

Runs the server without auto-reload. Use this for production environments.

### Testing API Endpoints

Use **Postman** to test the API:

1. **Import Collection**: Create a new Postman collection or import endpoints manually
2. **Set Environment**: Add `{{base_url}}` variable pointing to `http://localhost:8081`
3. **Test Endpoints**: Execute requests to verify functionality

**Common Test Sequence:**
```
1. POST /api/auth/register      → Create new user
2. POST /api/auth/login         → Obtain JWT token
3. GET /api/auth/me             → Verify authentication
4. POST /api/tasks              → Create task
5. GET /api/tasks               → Retrieve tasks
```

### API Base URL

```
http://localhost:8081/api
```

---

## Future Enhancements

### Planned Features
- **Pagination & Filtering**: Implement pagination for large datasets and advanced filtering options
- **Task Priorities**: Add priority levels (High, Medium, Low) for task organization
- **Task Categories**: Enable task categorization and tagging
- **Notifications**: Real-time notifications for task assignments and updates
- **Task Comments**: Add comment functionality for task collaboration
- **Audit Logging**: Track user actions and system events for compliance
- **Rate Limiting**: Implement API rate limiting for security
- **Input Validation**: Enhanced validation using libraries like Joi or Yup
- **Error Handling**: Centralized error handling and logging system
- **Unit Testing**: Comprehensive test coverage with Jest or Mocha
- **API Documentation**: Auto-generated API docs with Swagger/OpenAPI

### Performance Optimization
- Database indexing on frequently queried fields
- Connection pooling for MongoDB
- Caching layer for frequently accessed data
- API response compression

---

## Contributing

Contributions are welcome. Please follow these guidelines:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the ISC License. See the `package.json` file for details.

---

## Support

For issues, questions, or suggestions, please open an issue in the repository or contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Status**: Active Development
