# Timer App

A full-stack web application for time tracking, user authentication, and password reset with email verification.

## Features
- User registration and login (with password validation)
- Time tracking (clock in/out, total time calculation)
- Password reset via email with verification code
- Responsive, modern UI
- MongoDB Atlas backend
- Nodemailer for email delivery

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Email:** Nodemailer (Gmail SMTP)

## Folder Structure
```
Timer-App/
├── client/                # Frontend files
│   ├── index.html         # Login & registration page
│   ├── dashboard.html     # User dashboard
│   ├── passwordReset.html # Password reset flow
│   ├── passwordResetEmail.html # Email template for reset code
│   ├── script.js          # Login/register logic
│   ├── dashboardScript.js # Dashboard logic
│   ├── passwordResetScript.js # Password reset logic
│   ├── style.css          # Main styles
│   ├── passwordResetStyle.css # Password reset styles
│   └── images/            # Icons and images
├── server/                # Backend files
│   ├── models/            # Mongoose models
│   │   ├── User.js
│   │   └── VerificationCode.js
│   └── routes/
│       └── auth.js        # Auth and time routes
├── server.js              # Express app entry point
├── package.json           # Node.js dependencies
└── .env                   # Environment variables
```

## Setup & Run
1. **Clone the repo:**
   ```bash
   git clone <repo-url>
   cd Timer-App
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment:**
   - Create a `.env` file with:
     ```
     MONGODB_URI=<your-mongodb-uri>
     EMAIL_USER=<your-gmail-address>
     EMAIL_PASS=<your-app-password>
     ```
4. **Start the server:**
   ```bash
   npm start
   ```
5. **Open the app:**
   - Visit `http://localhost:3000` in your browser.

## Usage
- **Register:** Create a new account on the main page.
- **Login:** Sign in with your email and password.
- **Clock In/Out:** Use the dashboard to track your work time.
- **Password Reset:** Click "Forgot Your Password?" to reset via email code.

## Notes
- For email features, you must use a Gmail account with an app password (not your main password).
- The app is mobile-friendly and works on all modern browsers.

## License
MIT
