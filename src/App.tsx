import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layers, BookOpen, BookCopy, Users } from 'lucide-react';
import CourseTypes from './components/CourseTypes/CourseTypes';
import Courses from './components/Courses/Courses';
import CourseOfferings from './components/CourseOfferings/CourseOfferings';
import StudentRegistrations from './components/StudentRegistrations/StudentRegistrations';
import { AppProvider } from './context/AppContext';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold">Student Registration System</h1>
            </div>
          </header>
          
          <div className="container mx-auto px-4 py-8">
            <nav className="mb-8">
              <ul className="flex flex-wrap gap-4 justify-center sm:justify-start">
                <li>
                  <Link 
                    to="/" 
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-blue-600 font-medium"
                  >
                    <Layers size={18} />
                    <span>Course Types</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/courses" 
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-blue-600 font-medium"
                  >
                    <BookOpen size={18} />
                    <span>Courses</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/course-offerings" 
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-blue-600 font-medium"
                  >
                    <BookCopy size={18} />
                    <span>Course Offerings</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/student-registrations" 
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-blue-600 font-medium"
                  >
                    <Users size={18} />
                    <span>Student Registrations</span>
                  </Link>
                </li>
              </ul>
            </nav>
            
            <main className="bg-white rounded-xl shadow-md p-6">
              <Routes>
                <Route path="/" element={<CourseTypes />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/course-offerings" element={<CourseOfferings />} />
                <Route path="/student-registrations" element={<StudentRegistrations />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;