# AI Interview Prep Platform

An AI-powered full-stack web application that generates personalized interview preparation reports based on a candidate's resume, self-description, and job description.

---

## 🚀 Features

- 📄 **PDF Resume Parsing** — Upload your resume as a PDF and extract text automatically
- 🤖 **AI-Powered Report Generation** — Uses Groq AI (Llama 3.3 70B) to generate:
  - Technical interview questions with answers
  - Behavioral interview questions with answers
  - Skill gap analysis with severity levels
  - 7-day personalized preparation plan
  - Match score between candidate and job
- 📊 **Interview Dashboard** — View all your generated reports in one place
- 📥 **AI Resume Generation** — Generate a tailored resume as a PDF using Puppeteer
- 🔐 **JWT Authentication** — Secure login, register, and logout functionality
- 🛡️ **Protected Routes** — Both frontend and backend route protection

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router v7
- Context API (state management)
- Axios
- SCSS

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (JSON Web Tokens)
- Bcrypt
- Multer (file upload)
- PDF-Parse (resume parsing)
- Puppeteer (PDF generation)
- Groq SDK (Llama 3.3 70B)

---

## 📁 Project Structure

```
ai-interview-prep/
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── interview.controller.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   └── interviewReport.model.js
│   │   ├── routes/
│   │   │   ├── auth.route.js
│   │   │   └── interview.route.js
│   │   ├── services/
│   │   │   └── ai.service.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   └── file.middleware.js
│   │   ├── config/
│   │   │   └── database.js
│   │   └── app.js
│   └── server.js
│
└── Frontend/
    └── vite-project/
        └── src/
            ├── features/
            │   ├── auth/
            │   │   ├── pages/
            │   │   ├── hooks/
            │   │   ├── services/
            │   │   └── auth.context.jsx
            │   └── interview/
            │       ├── pages/
            │       ├── hooks/
            │       ├── services/
            │       └── interview.context.jsx
            ├── app.routes.jsx
            └── main.jsx
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Backend Setup

```bash
# Navigate to backend
cd Backend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following to your `.env` file:
```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

```bash
# Start the backend server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend
cd Frontend/vite-project

# Install dependencies
npm install

# Start the frontend
npm run dev
```

---

## 🔌 API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/logout` | Logout user |
| GET | `/api/auth/get-me` | Get current logged-in user |

### Interview Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/interview/` | Generate interview report (with resume upload) |
| GET | `/api/interview/` | Get all reports of logged-in user |
| GET | `/api/interview/report/:reportId` | Get specific report by ID |
| GET | `/api/interview/resume/pdf/:reportId` | Download AI-generated resume as PDF |

---

## 📸 Screenshots

> <img width="1805" height="1033" alt="image" src="https://github.com/user-attachments/assets/42203657-0a25-4e14-a2ba-66aac3574241" />
<img width="1742" height="1061" alt="image" src="https://github.com/user-attachments/assets/e13f9408-9571-4b3e-82b1-868145221609" />



---

## 🧠 How It Works

1. User registers/logs in
2. On the home page, user pastes a job description and uploads their resume (PDF) or writes a self-description
3. Backend parses the PDF using `pdf-parse` and sends the data to Groq AI
4. Groq AI (Llama 3.3 70B) analyzes the candidate profile against the job description
5. AI generates a structured JSON report with questions, skill gaps, and preparation plan
6. Report is saved to MongoDB and displayed on the interview dashboard
7. User can also download an AI-tailored resume as a PDF

---

## 👨‍💻 Author

**Ayushmaan Singh**
- GitHub: [@ayushmaan2212](https://github.com/ayushmaan2212)
- LinkedIn: [ayushmaansingh22](https://linkedin.com/in/ayushmaansingh22)
