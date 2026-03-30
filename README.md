# 🚀 CallBridge — Video Calling & Meeting Platform

CallBridge is a modern video conferencing web application built using Next.js, Clerk authentication, and Stream Video SDK. It allows users to create, join, and manage meetings with a clean and intuitive interface.

---

## 🌐 Live Demo

👉 https://callbridge-live.vercel.app

---

## ✨ Features

* 🔐 **Authentication** (via Clerk)
* 🎥 **Real-time Video Calling** (Stream SDK)
* 🧑‍🤝‍🧑 **Personal Meeting Rooms**
* 🔗 **Invite Link Sharing**
* 📅 **Upcoming & Previous Meetings**
* 📹 **Call Recordings Management**
* ⚡ **Fast & Responsive UI (Next.js + Tailwind CSS)**

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 14, React
* **Authentication:** Clerk
* **Video API:** Stream (GetStream)
* **Styling:** Tailwind CSS
* **Deployment:** Vercel

---

## 📁 Project Structure

```
CallBridgeProject/
│── app/
│── components/
│── hooks/
│── providers/
│── public/
│── styles/
│── utils/
│── app/api/        # API routes (server-side logic)
```

---

## ⚙️ Environment Variables

Create a `.env.local` file and add:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_STREAM_API_KEY=
STREAM_SECRET=

NEXT_PUBLIC_BASE_URL=http://localhost:3000

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

👉 For production, replace:

```
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

---

## 🚀 Getting Started

### 1️⃣ Clone the repo

```bash
git clone https://github.com/harshdhobi3108/CallBridgeProject.git
cd CallBridgeProject
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Run development server

```bash
npm run dev
```

👉 Open: http://localhost:3000

---

## 🌍 Deployment

Deployed using Vercel.

Steps:

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy 🚀
