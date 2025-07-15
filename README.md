# Pomodoro To-Do App

Boost your productivity with a beautiful and modern web app that combines a Pomodoro timer and a powerful to-do list.  
**Made with React, Tailwind CSS, PocketBase, and Vite.**

---

## ✨ Features

- **Pomodoro Timer**: Customizable timer to help you focus and take breaks using the Pomodoro technique.
- **To-Do List**: Add, complete, and remove tasks. Tasks are stored in PocketBase.
- **Notifications**: Desktop notifications when your timer finishes.
- **Modern UI**: Responsive design with smooth animations and gradients.
- **Sound Alerts**: Audible notification when timer completes.

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, Framer Motion, Lucide Icons, Vite
- **Backend (local):** PocketBase (embedded lightweight database)
- **Other:** PostCSS, ESLint

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Br7eleven/Pomodoro-To-do-app.git
cd Pomodoro-To-do-app
```

### 2. Install Dependencies

```bash
npm install
```

---

## 🗃️ PocketBase Backend Setup

This app uses [PocketBase](https://pocketbase.io/) as a lightweight backend for storing tasks and Pomodoro sessions.

---

### ⚙️ 1. Start PocketBase Locally

- Download the latest binary from [https://pocketbase.io/docs/](https://pocketbase.io/docs/)
- Open a terminal and run:

```bash
./pocketbase serve
# or on Windows
pocketbase.exe serve
```

PocketBase will run at:  
👉 [http://127.0.0.1:8090](http://127.0.0.1:8090)  
Admin UI:  
👉 [http://127.0.0.1:8090/_/](http://127.0.0.1:8090/_/)

---

### 🏗️ 2. Create Collections

#### ✅ `todos` Collection

| Field Name | Type     | Required | Options           |
|------------|----------|----------|-------------------|
| text       | Text     | ✅       | task description  |
| completed  | Boolean  | ✅       | task done or not  |
| created    | Date     | auto     | default by PB     |

**API Rules (READ, CREATE, UPDATE, DELETE):**

```
@request.auth.id != ""
```
Or for testing purposes (not secure), simply set the rule as:
```
"="
```
This allows public access (for development/testing only).

---

#### ✅ `sessions` Collection

| Field Name | Type     | Required | Options                     |
|------------|----------|----------|-----------------------------|
| duration   | Number   | ✅       | session length in seconds   |
| type       | Text     | ✅       | e.g., Work, Short Break, etc|
| user       | Relation | optional | link to user (optional)     |

_Use this collection if you want to track Pomodoro sessions over time._

---

### 🔐 3. Public API Rule for Testing (Not Recommended for Production)

To allow read/write without auth temporarily, in API rules (for all operations), just write:
```
"="
```
This makes the collection publicly readable and writable (not secure).

---

### 📦 4. Optional — Setup with Admin UI

- Visit: [http://127.0.0.1:8090/_/](http://127.0.0.1:8090/_/)
- Create the `todos` collection
- Add `text` and `completed` fields
- Set rules (`"="` or `@request.auth.id != ""`)
- Save and test via API or your app

---

> **Note:**  
> For production, always secure your collections by using proper API rules and authentication!

---

### 3. Set Up PocketBase

The app uses [PocketBase](https://pocketbase.io) for backend data storage.  
You need to run a local PocketBase server.

#### a. Download and Run PocketBase

- Download the latest release for your OS from [PocketBase releases](https://github.com/pocketbase/pocketbase/releases).
- Extract and run the server in the repo root:

```bash
./pocketbase serve
```
By default, this runs on `http://127.0.0.1:8090`.

#### b. Apply Migrations

If there are migration files in the `pb_migrations` folder, run them as per [PocketBase migration docs](https://pocketbase.io/docs/migrations/).  
(Usually, you can just start with a fresh PocketBase instance and let the app create collections on demand.)

---

### 4. Start the Development Server

```bash
npm run dev
```

Your app should now be live at [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

---

## ⚙️ Project Structure

```
Pomodoro-To-do-app/
│
├── src/
│   ├── components/        # React components (PomodoroTimer, TodoList, Footer, etc.)
│   ├── lib/               # PocketBase client
│   └── App.jsx            # Main app entry
│
├── pb_migrations/         # PocketBase migration scripts (collections for todos, sessions, etc.)
├── public/                # Static files (e.g., sounds, icons)
├── index.html             # App HTML entry
├── tailwind.config.js     # Tailwind CSS config
├── postcss.config.js      # PostCSS config
├── vite.config.js         # Vite config
├── package.json           # Dependencies and scripts
└── README.md
```

---

## 🔑 Environment & Configuration

- The PocketBase URL is set to `http://127.0.0.1:8090` in `src/lib/pocketbase.js`.
- If you deploy PocketBase elsewhere, update this URL accordingly.

---

## 📝 Scripts

- `npm run dev` — Start the Vite development server
- `npm run build` — Build the app for production
- `npm run lint` — Run ESLint

---

## 👨‍💻 Author

**Balaj Hussain**  
[github.com/Br7eleven](https://github.com/Br7eleven)

---

## 📄 License

This project is for educational/demo purposes.  
Feel free to fork and customize!

---

## 🖼️ Screenshots

_Add screenshots here if you want!_

---

## 🙏 Acknowledgements

- [PocketBase](https://pocketbase.io)
- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Vite](https://vitejs.dev/)
