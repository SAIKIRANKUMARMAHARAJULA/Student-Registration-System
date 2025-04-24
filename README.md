# Student-Registration-System
# Student Registration System

A modern, responsive web application for managing student course registrations. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Course Types Management**
  - Create, list, update, and delete course types (e.g., Individual, Group, Special)
  - Prevent deletion of course types in use

- **Courses Management**
  - Create, list, update, and delete courses (e.g., Hindi, English, Urdu)
  - Prevent deletion of courses associated with offerings

- **Course Offerings**
  - Create offerings by combining courses with course types
  - List and manage all available course offerings
  - View student registration counts
  - Prevent deletion of offerings with active registrations

- **Student Registrations**
  - Register students for available course offerings
  - View registered students for each offering
  - Filter offerings by course type
  - Manage student information (name, email, phone)

## Technology Stack

- React 18
- TypeScript
- Tailwind CSS
- React Router
- Lucide React Icons
- Vite

## Getting Started

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Build for production
```bash
npm run build
```

## Project Structure

```
src/
├── components/           # React components
│   ├── CourseTypes/     # Course types management
│   ├── Courses/         # Courses management
│   ├── CourseOfferings/ # Course offerings management
│   ├── shared/          # Shared components
│   └── StudentRegistrations/ # Student registration management
├── context/             # React context for state management
└── App.tsx             # Main application component
```

## State Management

The application uses React Context API for state management, with the following main entities:
- Course Types
- Courses
- Course Offerings
- Students
- Registrations

## Features

### Data Validation
- Required field validation
- Email format validation
- Duplicate entry prevention
- Dependency checks before deletion

### UI/UX
- Responsive design
- Modal dialogs for forms
- Animated transitions
- Loading states
- Error handling
- Filter functionality

## License

MIT
