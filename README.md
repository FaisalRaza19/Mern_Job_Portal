# 💼 MERN Job Portal

![React](https://img.shields.io/badge/Frontend-React-blue.svg)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green.svg)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen.svg)
![Status](https://img.shields.io/badge/Status-Complete-blueviolet.svg)
![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)

A fully responsive, full-featured **Job Portal Web Application** built with the **MERN stack**. It supports both **Employers** and **Job Seekers** with modern UI, real-time chat, AI-powered skill suggestions, resume handling, email notifications, and much more.

---

## 🚀 Features

### 🔐 Authentication & Email Verification
- Role-based Sign Up / Login / Logout
- **Email verification** during sign-up using **Nodemailer** and unique codes

### 👨‍💼 Employer Features
- Edit company profile (name, avatar, description, email, social links)
- Add, edit, delete jobs
- Change **application status** (e.g., Hired, Rejected) with **email notifications** to applicants
- View all applications for posted jobs
- Start **real-time chat** with job seekers
  - Send **text, voice, images, videos** (Cloudinary integration)

### 👨‍🎓 Job Seeker Features
- Update profile: name, username, avatar, email, education, experience, skills
- Upload and **preview resume**
- **AI-powered skill suggestions** (via GPT API)
- Apply to jobs, save jobs, and track application status
- Browse companies and their jobs
- Post, edit, and delete **company reviews**

### 💬 Real-Time Chat System
- Built with **Socket.IO**
- Features: typing indicator, seen status, live messaging
- Media support: **voice notes, images, videos**
- Only **employers** can initiate chats

---

## 🛠️ Tech Stack

| Layer       | Tech Used                          |
|-------------|------------------------------------|
| Frontend    | React.js, Tailwind CSS, React Router |
| Backend     | Node.js, Express.js, MongoDB       |
| Auth        | JWT, Cookies                       |
| Email       | Nodemailer                         |
| Real-Time   | Socket.IO                          |
| File Upload | Cloudinary                         |
| AI Feature  | OpenAI GPT API for skills suggestion |

---

## 📂 Installation

### 1. Clone the repository

```bash
git clone https://github.com/FaisalRaza19/Mern_Job_Portal.git
cd Mern_Job_Portal
