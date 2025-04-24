import React, { useState } from "react";
import { useAppContext, CourseOffering } from "../../context/AppContext";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import Modal from "../shared/Modal";
import { motion } from "framer-motion";

const CourseOfferings: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOffering, setCurrentOffering] = useState<CourseOffering | null>(
    null
  );
  const [formData, setFormData] = useState({
    courseId: "",
    courseTypeId: "",
  });
  const [error, setError] = useState("");

  const openAddModal = () => {
    setCurrentOffering(null);
    setFormData({
      courseId: state.courses[0]?.id || "",
      courseTypeId: state.courseTypes[0]?.id || "",
    });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (offering: CourseOffering) => {
    setCurrentOffering(offering);
    setFormData({
      courseId: offering.courseId,
      courseTypeId: offering.courseTypeId,
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.courseId || !formData.courseTypeId) {
      setError("Please select both a course and a course type");
      return false;
    }
    if (
      !currentOffering &&
      state.courseOfferings.some(
        (co) =>
          co.courseId === formData.courseId &&
          co.courseTypeId === formData.courseTypeId
      )
    ) {
      setError("This course offering combination already exists");
      return false;
    }
    if (
      currentOffering &&
      state.courseOfferings.some(
        (co) =>
          co.id !== currentOffering.id &&
          co.courseId === formData.courseId &&
          co.courseTypeId === formData.courseTypeId
      )
    ) {
      setError("This course offering combination already exists");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (currentOffering) {
      dispatch({
        type: "UPDATE_COURSE_OFFERING",
        payload: {
          ...currentOffering,
          courseId: formData.courseId,
          courseTypeId: formData.courseTypeId,
        },
      });
    } else {
      dispatch({
        type: "ADD_COURSE_OFFERING",
        payload: {
          id: `co${Date.now()}`,
          courseId: formData.courseId,
          courseTypeId: formData.courseTypeId,
        },
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this course offering?")
    ) {
      dispatch({ type: "DELETE_COURSE_OFFERING", payload: id });
    }
  };

  const getCourseName = (id: string) =>
    state.courses.find((c) => c.id === id)?.name || "Unknown Course";
  const getCourseTypeName = (id: string) =>
    state.courseTypes.find((ct) => ct.id === id)?.name || "Unknown Type";
  const getRegistrationCount = (offeringId: string) =>
    state.registrations.filter((r) => r.courseOfferingId === offeringId).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          📚 Course Offerings
        </h2>
        <button
          onClick={openAddModal}
          className="btn-primary flex items-center gap-2"
          disabled={
            state.courses.length === 0 || state.courseTypes.length === 0
          }
          title={
            state.courses.length === 0 || state.courseTypes.length === 0
              ? "You need to create courses and course types first"
              : ""
          }
        >
          <PlusCircle size={18} />
          <span>Add</span>
        </button>
      </div>

      {state.courseOfferings.length === 0 ? (
        <div className="text-center text-gray-500 italic">
          No course offerings available. Start by adding one!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.courseOfferings.map((offering) => (
            <motion.div
              key={offering.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getCourseTypeName(offering.courseTypeId)} -{" "}
                    {getCourseName(offering.courseId)}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {getRegistrationCount(offering.id)} students enrolled
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(offering)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(offering.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentOffering ? "Edit Course Offering" : "Add Course Offering"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="courseTypeId" className="block text-sm font-medium">
              Course Type
            </label>
            <select
              id="courseTypeId"
              name="courseTypeId"
              value={formData.courseTypeId}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500/50"
            >
              {state.courseTypes.map((ct) => (
                <option key={ct.id} value={ct.id}>
                  {ct.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="courseId" className="block text-sm font-medium">
              Course
            </label>
            <select
              id="courseId"
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500/50"
            >
              {state.courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {currentOffering ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default CourseOfferings;
