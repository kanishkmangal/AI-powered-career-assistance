# EduMitra AI – Student Learning & Career Assistant

EduMitra AI is a student-focused web application designed to help students manage their academic profiles, monitor their learning progress, and access an organized academic dashboard.

The project aims to provide a centralized platform for student information, academic performance tracking, and future AI-powered learning and career assistance.

## 🚀 Features

### 1. Student Authentication
- Student registration and login.
- Form validation and password confirmation.
- Duplicate email validation.
- Secure password handling through Django authentication.
- Protected dashboard routes.

### 2. Student Dashboard
- Personalized student dashboard.
- Academic overview and progress indicators.
- Study streak and performance indicators.
- Study goals and progress visualization.
- Centralized navigation.

### 3. My Profile
- View and manage student profile information.
- Personal and educational details.
- Academic standing information.
- Semester-wise academic performance and GPA tracking.

### 4. Notifications
- Organized notification categories.
- Academic and system notifications.
- Read/unread notification interactions.
- Notification preferences.

### 5. Settings
- Account and security settings.
- Notification preferences.
- Appearance settings.
- Privacy controls.
- Session and logout management.

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- React Router
- Vite

### Backend
- Python
- Django
- Django REST Framework

### Database
- PostgreSQL
- Neon PostgreSQL

### Development Tools
- Visual Studio Code
- Google Stitch (UI Design)
- Antigravity (AI-assisted development)
- Git and GitHub

## 📁 Project Structure

```text
Website Code/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── accounts/
│   ├── manage.py
│   ├── requirements.txt
│   └── ...
│
├── .gitignore
└── README.md
```

*Note: The structure above represents the main project organization. Individual files and folders may vary.*

## ⚙️ Installation and Setup

Follow these steps to run EduMitra AI locally.

### Prerequisites

Make sure you have installed:

- Node.js and npm
- Python 3
- Git
- A Neon PostgreSQL database

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate to the project directory:

```bash
cd "Website Code"
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```powershell
.\venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file inside the backend directory.

Configure your Neon PostgreSQL connection using the following example:

```env
DATABASE_URL=your_neon_postgresql_connection_string
```

Use your own database credentials. Never commit your actual `.env` file or expose database passwords.

Make sure the environment variable names match the Django settings configuration.

### 4. Database Migrations

Run the following commands:

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Start the Backend Server

```bash
python manage.py runserver 127.0.0.1:8000
```

Backend server:

`http://127.0.0.1:8000`

### 6. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev -- --port 3000
```

Frontend application:

`http://localhost:3000`

## 🔗 Application Routes

| Page | Route |
|---|---|
| Landing Page | `/` |
| Login | `/login` |
| Register | `/register` |
| Overview | `/overview` |
| My Profile | `/my-profile` |
| Notifications | `/notifications` |
| Settings | `/settings` |

## 🔌 Backend API

The backend provides authentication and student profile-related API functionality.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register/` | Student registration |
| POST | `/api/auth/login/` | Student login |
| GET | `/api/auth/me/` | Retrieve student information |

Additional profile and academic performance endpoints may be implemented as the application evolves.

## 🗄️ Database

EduMitra AI uses Neon PostgreSQL as its cloud database.

Django manages database models and migrations, while student authentication and profile information are stored in PostgreSQL.

## 🔒 Security

- Passwords are handled using Django's password hashing.
- Database credentials are stored in environment variables.
- `.env` files are excluded from version control.
- Protected routes restrict access to authenticated users.
- Student-specific data should be accessible only to its owner.

## ▶️ Running the Project

To run the complete application, start both servers:

| Service | Local URL |
|---|---|
| React Frontend | `http://localhost:3000` |
| Django Backend | `http://127.0.0.1:8000` |

Keep both development servers running while using the application.

## 🔮 Future Enhancements

- AI-powered student assistance chatbot.
- Personalized study plan generation.
- AI-based career recommendations.
- Student performance analysis and prediction.
- Advanced academic progress tracking.
- Integration of intelligent learning recommendations.

## 👨‍💻 Project

**EduMitra AI – Student Learning & Career Assistant**

Developed as an academic project using React, Django REST Framework, and Neon PostgreSQL.

---

*EduMitra AI – Empowering Students Through Technology and Intelligent Learning.*
