# Student Management System

A complete React + Vite + Tailwind CSS student management web application.

## Features

- **Login / Register** – Mock authentication (any email + password works)
- **Dashboard** – Stats cards, subject averages chart, grade distribution, recent students
- **Students List** – Search, view, edit, delete
- **Add / Edit Student** – Form with validation and subject scores
- **Student Details** – Full profile + performance chart
- **Reports** – Grade distribution, gender pie, subject performance bars

## Tech Stack

- React 18 + Vite 5
- Tailwind CSS 3.4
- React Router DOM 6
- Recharts
- Lucide React icons
- LocalStorage persistence

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

Demo login: any email + any password

## Project Structure

```
src/
  components/Layout.jsx
  context/AppContext.jsx
  pages/
    Login.jsx
    Dashboard.jsx
    StudentsList.jsx
    AddStudent.jsx
    StudentDetails.jsx
    Reports.jsx
  App.jsx
  main.jsx
  index.css
```
