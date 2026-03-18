# 🎨 Charuka Mayura | Personal Portfolio & Admin System

Welcome to my personal portfolio repository! This project is a complete, production-ready portfolio system built entirely with **Vanilla JavaScript (ES6 Modules)**, **HTML5/CSS3**, and **IndexedDB**. 

It features a stunning, high-performance client-facing website and a secure, fully functional Admin Dashboard to manage all content dynamically without needing a backend server.

![Portfolio Preview](./.github/preview.png) *(Note: Add a preview image here)*

## ✨ Key Features

### 🖥️ Client-Side Portfolio
- **Premium UI/UX:** Dark-mode first design with glassmorphism, smooth scroll reveals, dynamic glow effects, and micro-animations.
- **Dynamic Content:** Everything (Hero stats, About text, Projects, Skills, Gallery) is loaded from the local database.
- **Interactive Filtering:** Project cards can be filtered by category with staggered enter/exit animations.
- **Form Handling:** Fully functional contact form with built-in validation and success/error toasts that saves directly to the database.

### ⚙️ Admin Dashboard
- **Secure Authentication:** Basic login system to protect the dashboard (`admin` / `admin123` by default).
- **Full CMS Capabilities:** Create, Read, Update, and Delete (CRUD) operations for:
  - **Profile Information** (Avatar upload, bio, hero text, stats, social links)
  - **Projects** (Title, category, image, description, tech stack, links)
  - **Skills** (Name, percentage, FontAwesome icon)
  - **Gallery** (Image uploads, titles)
- **Message Center:** View, mark as read, and delete contact form submissions.
- **Modern Architecture:** Built using the MVC (Model-View-Controller) design pattern for clean, maintainable code.

## 🛠️ Tech Stack & Architecture

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6 Modules)
- **Database:** IndexedDB (via an asynchronous wrapper class)
- **Design Pattern:** MVC (Model-View-Controller)
- **Icons:** FontAwesome 6
- **Fonts:** Inter (Body) & Montserrat (Headings)

This project intentionally avoids heavy frontend frameworks (like React or Vue) to demonstrate advanced DOM manipulation, state management, and asynchronous modular JavaScript.

## 🚀 How to Run Locally

You don't need Node.js, npm, or a database server to run this project! It runs entirely in the browser using the local IndexedDB. All you need is a local web server to serve the ES6 modules.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SLxnoat/my_portfolio.git
   cd my_portfolio
   ```

2. **Start a local server:**
   You can use any local web server. For example, using Python 3:
   ```bash
   python -m http.server 3333
   ```
   *Or use the "Live Server" extension in VS Code.*

3. **View the site:**
   - Client Portfolio: `http://localhost:3333/client/index.html`
   - Admin Dashboard: `http://localhost:3333/admin/login.html`

4. **Login Credentials:**
   The database automatically seeds itself on first load.
   - **Username:** `admin`
   - **Password:** `admin123`

## 📁 Project Structure

```text
📁 my_portfolio/
├── 📁 core/                 # Shared logic & data layer
│   ├── db.js                # IndexedDB wrapper
│   ├── seed.js              # Initial data population
│   └── 📁 models/           # Data classes (Project, Profile, Message, etc.)
│
├── 📁 client/               # Public portfolio website
│   ├── index.html           
│   ├── styles.css           # Premium UI styling
│   ├── 📁 controllers/      # App logic (App, Hero, Projects, Contact, etc.)
│   └── 📁 views/            # DOM rendering logic
│
└── 📁 admin/                # Private CMS dashboard
    ├── login.html           
    ├── index.html           
    ├── styles.css           # Glassmorphic admin UI
    └── 📁 controllers/      # Admin CRUD logic
```

## 📬 Contact Me

- **Email:** charuka03bc@gmail.com
- **GitHub:** [SLxnoat](https://github.com/SLxnoat/)
- **LinkedIn:** [charuka-mayura](https://linkedin.com/in/charuka-mayura)

---
*If you find this project helpful, feel free to ⭐ the repository!*
