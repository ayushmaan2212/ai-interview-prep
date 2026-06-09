# AI Interview Prep

Full-stack SPA for generating AI-powered interview preparation reports. Accepts resume (PDF) or self-description, generates technical/behavioral questions, skill gaps, and 7-day study plan.

## Stack

**Frontend**: React 19 + Vite + React Router 7 + Context API + SCSS  
**Backend**: Node.js + Express + MongoDB + JWT + Groq AI (Llama 3.3 70B)

## Quick Start

### Backend

```bash
cd Backend
npm install
# .env: PORT=5000 MONGO_URI=<atlas-uri> JWT_SECRET=<secret> GROQ_API_KEY=<key> GOOGLE_API_KEY=<key>
npm run dev
```

Runs on `http://localhost:5000`

### Frontend

```bash
cd Frontend/vite-project
npm install
npm run dev
```

Runs on `http://localhost:5173`

## Key Features

- Resume PDF parsing (multipart/form-data) or self-description
- JWT-based auth with token blacklist (logout)
- AI-generated interview questions + skill gap analysis + match score
- AI-generated resume PDF (Puppeteer)
- Protected routes (frontend & backend)
- Dynamic CORS whitelisting

## Project Structure

```
Backend/
├── src/
│   ├── controllers/ (auth, interview)
│   ├── models/ (user, interviewReport, blacklist)
│   ├── routes/ (auth, interview)
│   ├── services/ (ai.service.js)
│   ├── middlewares/ (auth, file upload)
│   └── config/ (database)

Frontend/
└── vite-project/src/
    ├── features/auth/ (pages, hooks, context, services)
    ├── features/interview/ (pages, hooks, context, services, styles)
    └── app.routes.jsx
```

## API

### Auth

| POST | `/api/auth/register` | email, username, password |
| POST | `/api/auth/login` | email, password |
| GET | `/api/auth/logout` | JWT cookie required |
| GET | `/api/auth/get-me` | JWT cookie required |

### Interview

| POST | `/api/interview/generate` | jobDescription, resume (optional), selfDescription (optional) |
| GET | `/api/interview/all` | JWT required |
| GET | `/api/interview/:id` | JWT required |
| POST | `/api/interview/generate-resume/:id` | JWT required |

## Deployment

**Backend → Render**: `node server.js` (see `render.json`)  
**Frontend → Vercel**: `npm run build` (see `vercel.json`)

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for env vars and setup.

## License

MIT
| POST | `/api/interview/` | Generate interview report (with resume upload) |
| GET | `/api/interview/` | Get all reports of logged-in user |
| GET | `/api/interview/report/:reportId` | Get specific report by ID |
| GET | `/api/interview/resume/pdf/:reportId` | Download AI-generated resume as PDF |

---

## 📸 Screenshots

> <img width="1805" height="1033" alt="image" src="https://github.com/user-attachments/assets/42203657-0a25-4e14-a2ba-66aac3574241" />
> <img width="1742" height="1061" alt="image" src="https://github.com/user-attachments/assets/e13f9408-9571-4b3e-82b1-868145221609" />

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
