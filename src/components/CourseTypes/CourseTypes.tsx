import React, { useState } from 'react';
import { useAppContext, CourseType } from '../../context/AppContext';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import Modal from '../shared/Modal';

const CourseTypes: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourseType, setCurrentCourseType] = useState<CourseType | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [error, setError] = useState('');

  const openAddModal = () => {
    setCurrentCourseType(null);
    setFormData({ name: '' });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (courseType: CourseType) => {
    setCurrentCourseType(courseType);
    setFormData({ name: courseType.name });
    setError('');
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Course type name is required');
      return false;
    }
    
    // Check if name already exists (for new course types)
    if (!currentCourseType && state.courseTypes.some(ct => ct.name.toLowerCase() === formData.name.toLowerCase())) {
      setError('A course type with this name already exists');
      return false;
    }
    
    // Check if name already exists (for editing, excluding current one)
    if (currentCourseType && state.courseTypes.some(ct => 
      ct.id !== currentCourseType.id && 
      ct.name.toLowerCase() === formData.name.toLowerCase()
    )) {
      setError('A course type with this name already exists');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (currentCourseType) {
      // Update existing course type
      dispatch({
        type: 'UPDATE_COURSE_TYPE',
        payload: {
          ...currentCourseType,
          name: formData.name
        }
      });
    } else {
      // Add new course type
      dispatch({
        type: 'ADD_COURSE_TYPE',
        payload: {
          id: `ct${Date.now()}`,
          name: formData.name
        }
      });
    }
    
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this course type?')) {
      dispatch({ type: 'DELETE_COURSE_TYPE', payload: id });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Course Types</h2>
        <button 
          onClick={openAddModal}
          className="btn-primary flex items-center gap-2"
        >
          <PlusCircle size={18} />
          <span>Add Course Type</span>
        </button>
      </div>

      {state.courseTypes.length === 0 ? (
        <div className="empty-state animate-slide-up">
          <p>No course types available. Add your first course type to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-up">
          {state.courseTypes.map((courseType) => (
            <div 
              key={courseType.id} 
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-800">{courseType.name}</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => openEditModal(courseType)}
                    className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-full hover:bg-blue-50"
                    aria-label="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(courseType.id)}
                    className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-full hover:bg-red-50"
                    aria-label="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              {/* Show usage count */}
              <p className="text-sm text-gray-500">
                Used in {state.courseOfferings.filter(co => co.courseTypeId === courseType.id).length} course offerings
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal for add/edit */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentCourseType ? 'Edit Course Type' : 'Add Course Type'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Course Type Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter course type name"
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
              {currentCourseType ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CourseTypes;