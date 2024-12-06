# Modern Todo List Application

A full-stack todo list application built with React and Express, featuring a modern UI and comprehensive task management capabilities.

## Features

- ✨ Modern, responsive UI with smooth animations
- 📅 Due date tracking with relative time display
- 🎯 Priority levels (Low, Medium, High)
- 🏷️ Custom categories for better organization
- 📝 Notes support for detailed task descriptions
- 🔍 Search functionality across tasks and categories
- 🔄 Sort by date, priority, or alphabetically
- ✅ Filter tasks by status (All, Active, Completed)
- 💫 Beautiful animations using Framer Motion

## Tech Stack

### Frontend
- React
- Framer Motion (animations)
- React DatePicker
- React Icons
- date-fns (date formatting)

### Backend
- Express.js
- MongoDB Atlas
- Mongoose
- CORS

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todo-list
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

5. Start the backend server:
```bash
cd backend
npm start
```

6. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
todo-app/
│
├── frontend/
│   ├── src/
│   │   ├── App.js          # Main application component
│   │   ├── App.css         # Styles
│   │   └── index.js        # Entry point
│   └── package.json
│
└── backend/
    ├── server.js           # Express server setup
    └── package.json
```

## Features in Detail

### Task Management
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Set due dates with intuitive date picker
- Assign priority levels
- Add detailed notes
- Categorize tasks

### Search and Filter
- Search across task titles and categories
- Filter by completion status
- Sort by multiple criteria
  - Creation date
  - Priority level
  - Alphabetical order

### User Interface
- Responsive design for all screen sizes
- Smooth animations for better UX
- Intuitive icons and visual feedback
- Clean, modern aesthetic

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React team for the amazing frontend library
- MongoDB team for the reliable database
- Framer Motion for the beautiful animations
