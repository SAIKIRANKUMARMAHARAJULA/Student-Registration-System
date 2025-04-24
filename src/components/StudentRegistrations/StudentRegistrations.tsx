import React, { useState } from 'react';
import { useAppContext, Registration, Student } from '../../context/AppContext';
import { PlusCircle, User, Trash2, Filter } from 'lucide-react';
import Modal from '../shared/Modal';

const StudentRegistrations: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseTypeId, setSelectedCourseTypeId] = useState<string>('all');
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    studentPhone: '',
    courseOfferingId: ''
  });
  const [error, setError] = useState('');
  const [isStudentListModalOpen, setIsStudentListModalOpen] = useState(false);
  const [selectedOfferingId, setSelectedOfferingId] = useState<string | null>(null);

  // Filter course offerings based on selected course type
  const filteredOfferings = selectedCourseTypeId === 'all'
    ? state.courseOfferings
    : state.courseOfferings.filter(co => co.courseTypeId === selectedCourseTypeId);

  const openAddModal = () => {
    setFormData({
      studentName: '',
      studentEmail: '',
      studentPhone: '',
      courseOfferingId: filteredOfferings.length > 0 ? filteredOfferings[0].id : ''
    });
    setError('');
    setIsModalOpen(true);
  };

  const openStudentListModal = (offeringId: string) => {
    setSelectedOfferingId(offeringId);
    setIsStudentListModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourseTypeId(e.target.value);
  };

  const validateForm = () => {
    if (!formData.studentName.trim()) {
      setError('Student name is required');
      return false;
    }
    
    if (!formData.studentEmail.trim()) {
      setError('Student email is required');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.studentEmail)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (!formData.studentPhone.trim()) {
      setError('Student phone is required');
      return false;
    }
    
    if (!formData.courseOfferingId) {
      setError('Please select a course offering');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Create a new student
    const studentId = `s${Date.now()}`;
    dispatch({
      type: 'ADD_STUDENT',
      payload: {
        id: studentId,
        name: formData.studentName,
        email: formData.studentEmail,
        phone: formData.studentPhone
      }
    });
    
    // Create the registration
    dispatch({
      type: 'ADD_REGISTRATION',
      payload: {
        id: `r${Date.now()}`,
        studentId,
        courseOfferingId: formData.courseOfferingId,
        registrationDate: new Date().toISOString().split('T')[0]
      }
    });
    
    setIsModalOpen(false);
  };

  const handleDeleteRegistration = (id: string) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      dispatch({ type: 'DELETE_REGISTRATION', payload: id });
    }
  };

  // Helper function to get course name by id
  const getCourseName = (id: string) => {
    const course = state.courses.find(c => c.id === id);
    return course ? course.name : 'Unknown Course';
  };

  // Helper function to get course type name by id
  const getCourseTypeName = (id: string) => {
    const courseType = state.courseTypes.find(ct => ct.id === id);
    return courseType ? courseType.name : 'Unknown Type';
  };

  // Helper function to get offering display name
  const getOfferingDisplayName = (offeringId: string) => {
    const offering = state.courseOfferings.find(co => co.id === offeringId);
    if (!offering) return 'Unknown Offering';
    
    return `${getCourseTypeName(offering.courseTypeId)} - ${getCourseName(offering.courseId)}`;
  };

  // Helper function to get student by id
  const getStudent = (id: string): Student | undefined => {
    return state.students.find(s => s.id === id);
  };

  // Get students for selected offering
  const getStudentsForOffering = (offeringId: string) => {
    const registrations = state.registrations.filter(r => r.courseOfferingId === offeringId);
    return registrations.map(r => {
      const student = getStudent(r.studentId);
      return {
        registration: r,
        student
      };
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center flex-wrap gap-2 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Student Registrations</h2>
        
        <div className="flex items-center gap-4">
          {/* Filter dropdown */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={selectedCourseTypeId}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Course Types</option>
              {state.courseTypes.map(ct => (
                <option key={ct.id} value={ct.id}>{ct.name}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={openAddModal}
            className="btn-primary flex items-center gap-2"
            disabled={filteredOfferings.length === 0}
            title={filteredOfferings.length === 0 ? 'No course offerings available' : ''}
          >
            <PlusCircle size={18} />
            <span>Add Registration</span>
          </button>
        </div>
      </div>

      {filteredOfferings.length === 0 ? (
        <div className="empty-state animate-slide-up">
          <p>No course offerings available for the selected filter.</p>
        </div>
      ) : (
        <div className="space-y-8 animate-slide-up">
          {filteredOfferings.map((offering) => {
            const registrationsForOffering = state.registrations.filter(
              r => r.courseOfferingId === offering.id
            );
            
            return (
              <div key={offering.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-800">
                      {getOfferingDisplayName(offering.id)}
                    </h3>
                    <button 
                      onClick={() => openStudentListModal(offering.id)}
                      className="btn-secondary flex items-center gap-2 text-sm"
                    >
                      <User size={16} />
                      <span>View {registrationsForOffering.length} Students</span>
                    </button>
                  </div>
                </div>
                
                {registrationsForOffering.length === 0 ? (
                  <div className="p-4 text-gray-500 text-center">
                    No students registered for this course offering.
                  </div>
                ) : (
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      {registrationsForOffering.length} student(s) registered
                    </p>
                    <button 
                      onClick={() => openStudentListModal(offering.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Click to view student details
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Registration Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Register a Student"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
              Student Name
            </label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter student name"
            />
          </div>
          
          <div>
            <label htmlFor="studentEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="studentEmail"
              name="studentEmail"
              value={formData.studentEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter student email"
            />
          </div>
          
          <div>
            <label htmlFor="studentPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="studentPhone"
              name="studentPhone"
              value={formData.studentPhone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter student phone"
            />
          </div>
          
          <div>
            <label htmlFor="courseOfferingId" className="block text-sm font-medium text-gray-700 mb-1">
              Course Offering
            </label>
            <select
              id="courseOfferingId"
              name="courseOfferingId"
              value={formData.courseOfferingId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {filteredOfferings.map(co => (
                <option key={co.id} value={co.id}>{getOfferingDisplayName(co.id)}</option>
              ))}
            </select>
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}
          
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
              Register
            </button>
          </div>
        </form>
      </Modal>
      
      {/* Student List Modal */}
      <Modal 
        isOpen={isStudentListModalOpen} 
        onClose={() => setIsStudentListModalOpen(false)} 
        title={selectedOfferingId ? `Students for ${getOfferingDisplayName(selectedOfferingId)}` : 'Students'}
      >
        {selectedOfferingId && (
          <div className="max-h-96 overflow-y-auto">
            {getStudentsForOffering(selectedOfferingId).length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No students registered for this course offering.
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {getStudentsForOffering(selectedOfferingId).map(({ registration, student }) => (
                  <li key={registration.id} className="py-4 flex justify-between items-center">
                    {student ? (
                      <div>
                        <h4 className="text-base font-medium">{student.name}</h4>
                        <p className="text-sm text-gray-500">{student.email}</p>
                        <p className="text-sm text-gray-500">{student.phone}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Registered: {new Date(registration.registrationDate).toLocaleDateString()}
                        </p>
                      </div>
                    ) : (
                      <div className="text-gray-500">Unknown student</div>
                    )}
                    
                    <button
                      onClick={() => handleDeleteRegistration(registration.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                      aria-label="Delete registration"
                    >
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={() => setIsStudentListModalOpen(false)}
            className="btn-secondary"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default StudentRegistrations;