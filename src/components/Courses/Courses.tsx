import React, { useState } from 'react';
import { useAppContext, Course } from '../../context/AppContext';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import Modal from '../shared/Modal';

const Courses: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [error, setError] = useState('');

  const openAddModal = () => {
    setCurrentCourse(null);
    setFormData({ name: '' });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setCurrentCourse(course);
    setFormData({ name: course.name });
    setError('');
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Course name is required');
      return false;
    }
    
    // Check if name already exists (for new courses)
    if (!currentCourse && state.courses.some(c => c.name.toLowerCase() === formData.name.toLowerCase())) {
      setError('A course with this name already exists');
      return false;
    }
    
    // Check if name already exists (for editing, excluding current one)
    if (currentCourse && state.courses.some(c => 
      c.id !== currentCourse.id && 
      c.name.toLowerCase() === formData.name.toLowerCase()
    )) {
      setError('A course with this name already exists');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (currentCourse) {
      // Update existing course
      dispatch({
        type: 'UPDATE_COURSE',
        payload: {
          ...currentCourse,
          name: formData.name
        }
      });
    } else {
      // Add new course
      dispatch({
        type: 'ADD_COURSE',
        payload: {
          id: `c${Date.now()}`,
          name: formData.name
        }
      });
    }
    
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      dispatch({ type: 'DELETE_COURSE', payload: id });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Courses</h2>
        <button 
          onClick={openAddModal}
          className="btn-primary flex items-center gap-2"
        >
          <PlusCircle size={18} />
          <span>Add Course</span>
        </button>
      </div>

      {state.courses.length === 0 ? (
        <div className="empty-state animate-slide-up">
          <p>No courses available. Add your first course to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-up">
          {state.courses.map((course) => (
            <div 
              key={course.id} 
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-800">{course.name}</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => openEditModal(course)}
                    className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-full hover:bg-blue-50"
                    aria-label="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(course.id)}
                    className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-full hover:bg-red-50"
                    aria-label="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              {/* Show usage count */}
              <p className="text-sm text-gray-500">
                Used in {state.courseOfferings.filter(co => co.courseId === course.id).length} course offerings
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal for add/edit */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentCourse ? 'Edit Course' : 'Add Course'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Course Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter course name"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {currentCourse ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Courses;