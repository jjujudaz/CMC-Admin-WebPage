# Coffee Meets Careers - Admin Webpage

### 📌 Summary

Cyberfleet: Coffee Meets Careers (CMC) Admin Webpage is a React-based web application that allows administrators to manage users in the Coffee Meets Careers application. The Admin Webpage colaborates with Supabase to dynamically create, view, suspend, and delete users in the Supabase database.

---

## 🔖 Introduction

Cyberfleet: Coffee Meets Careers (CMC) was created to bridge the gap between tertiary education and the requirements of the cybersecurity industry.

Our mission is to connect university students with experienced industry professionals, providing them with an opportunity to learn through mentorships and career insights from industry experience. By supporting these connections, Cyberfleet aims to empower the next generation of cybersecurity talents to transition from academic learning to the professional industry.

The Admin Webpage was built using **React** and connects directly to **Supabase**, allowing administrators to manage user data efficiently. Admin users can:

- Create new users (Mentees and Mentors)
- View all users in a structured table format
- Suspend any user from using the app
- Delete user accounts when necessary

The application operates with the Coffee Meets Careers Supabase database and updates the `users`, `mentees`, and `mentors` tables in real-time.

---

## 💡 Features

- **User Management:** Create, view, suspend, and delete mentees and mentors
- **Real-time Database Updates:** Changes immediately reflected in the Supabase database
- **User Categorisation:** Users are categorised as either Mentees or Mentors and data is inserted into their corresponding tables
- **Skill Management:** Skills can be assigned to different users to be used in the match making algorithm
- **Responsive UI:** Tables and input forms adapt to different screen sizes

---

## 🛠 Prerequisites

Before running this project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Supabase](https://supabase.com/) account and the correct database set up

---

## 🚀 Getting Started

1. **Clone the repository**  
   Download or clone this repository onto your local machine using your preferred method (GitHub desktop, Git CLI, etc.).

2. **Install dependencies**  
   Open a terminal in the project folder and run:

   ```bash
   npm install

3. **Run the project**  
   Open a terminal and run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
Open http://localhost:3000 with your browser to see the Admin Webpage!
