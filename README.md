# Nivara - Society Management System

Nivara is a comprehensive, full-stack web application designed to streamline residential society and estate management. Built with modern web technologies, it provides residents and administrators with a centralized platform for communication, directory management, and issue resolution.

## 🚀 Features

* **Interactive Dashboard:** A centralized hub for all society activities and quick actions.
* **Member Directory:** Easily browse and connect with other residents in the community.
* **Notice Board:** Stay updated with real-time announcements, circulars, and community news.
* **Ticketing & Complaints:** Submit, track, and resolve maintenance requests or society complaints efficiently.
* **Emergency SOS:** Quick-access emergency alerts for residents in need of immediate assistance.
* **Secure Authentication:** Robust user login and profile management powered by Supabase.
* **Dark/Light Theme Toggle:** Accessible and customizable UI preferences for all users.

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Frontend:** React, Tailwind CSS
* **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, RLS)
* **Deployment:** Vercel

## ⚙️ Local Development

Follow these steps to run the project locally on your machine.

### Prerequisites
* Node.js 18+ installed
* A Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/yourusername/nivara.git](https://github.com/yourusername/nivara.git)
   cd nivaranivara/
├── app/
│   ├── actions.ts                  # Server actions
│   ├── api/
│   │   ├── health-check/           # Health check endpoint
│   │   └── tickets/                # Ticket API route handlers
│   ├── complaint/new/              # Complaint submission workflow
│   ├── dashboard/                  # Dashboard layout, pages, and components
│   │   ├── members/                # Society member directory page[cite: 1]
│   │   ├── EmergencySOSModal.tsx   # SOS emergency modal[cite: 1]
│   │   ├── NoticeBoard.tsx         # Community notices component[cite: 1]
│   │   └── SendProblemModal.tsx    # Complaint dispatch modal[cite: 1]
│   ├── login/                      # User authentication page[cite: 1]
│   └── page.tsx                    # Landing page[cite: 1]
├── middleware.ts                   # Session and route protection middleware[cite: 1]
├── supabase/
│   └── schema.sql                  # Database schema and RLS policies[cite: 1]
├── utils/
│   └── supabase/                   # Client, server, and middleware Supabase clients[cite: 1]
└── public/                         # Static assets and images[cite: 1]This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

https://nivara-qu5z.vercel.app/

