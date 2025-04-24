import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define types
export type CourseType = {
  id: string;
  name: string;
};

export type Course = {
  id: string;
  name: string;
};

export type CourseOffering = {
  id: string;
  courseId: string;
  courseTypeId: string;
};

export type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type Registration = {
  id: string;
  studentId: string;
  courseOfferingId: string;
  registrationDate: string;
};

// Define state type
interface AppState {
  courseTypes: CourseType[];
  courses: Course[];
  courseOfferings: CourseOffering[];
  students: Student[];
  registrations: Registration[];
}

// Define action types
type Action =
  | { type: 'ADD_COURSE_TYPE'; payload: CourseType }
  | { type: 'UPDATE_COURSE_TYPE'; payload: CourseType }
  | { type: 'DELETE_COURSE_TYPE'; payload: string }
  | { type: 'ADD_COURSE'; payload: Course }
  | { type: 'UPDATE_COURSE'; payload: Course }
  | { type: 'DELETE_COURSE'; payload: string }
  | { type: 'ADD_COURSE_OFFERING'; payload: CourseOffering }
  | { type: 'UPDATE_COURSE_OFFERING'; payload: CourseOffering }
  | { type: 'DELETE_COURSE_OFFERING'; payload: string }
  | { type: 'ADD_STUDENT'; payload: Student }
  | { type: 'ADD_REGISTRATION'; payload: Registration }
  | { type: 'DELETE_REGISTRATION'; payload: string };

// Initial state
const initialState: AppState = {
  courseTypes: [
    { id: 'ct1', name: 'Individual' },
    { id: 'ct2', name: 'Group' },
    { id: 'ct3', name: 'Special' },
  ],
  courses: [
    { id: 'c1', name: 'Hindi' },
    { id: 'c2', name: 'English' },
    { id: 'c3', name: 'Urdu' },
  ],
  courseOfferings: [
    { id: 'co1', courseId: 'c1', courseTypeId: 'ct1' },
    { id: 'co2', courseId: 'c2', courseTypeId: 'ct2' },
  ],
  students: [
    { id: 's1', name: 'John Doe', email: 'john@example.com', phone: '1234567890' },
    { id: 's2', name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321' },
  ],
  registrations: [
    { id: 'r1', studentId: 's1', courseOfferingId: 'co1', registrationDate: '2023-04-15' },
  ],
};

// Create reducer
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_COURSE_TYPE':
      return {
        ...state,
        courseTypes: [...state.courseTypes, action.payload],
      };
    case 'UPDATE_COURSE_TYPE':
      return {
        ...state,
        courseTypes: state.courseTypes.map(ct => 
          ct.id === action.payload.id ? action.payload : ct
        ),
      };
    case 'DELETE_COURSE_TYPE': {
      // Check if course type is used in any course offering
      const isUsed = state.courseOfferings.some(co => co.courseTypeId === action.payload);
      if (isUsed) {
        alert('Cannot delete this course type because it is used in course offerings.');
        return state;
      }
      return {
        ...state,
        courseTypes: state.courseTypes.filter(ct => ct.id !== action.payload),
      };
    }
    case 'ADD_COURSE':
      return {
        ...state,
        courses: [...state.courses, action.payload],
      };
    case 'UPDATE_COURSE':
      return {
        ...state,
        courses: state.courses.map(c => 
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_COURSE': {
      // Check if course is used in any course offering
      const isUsed = state.courseOfferings.some(co => co.courseId === action.payload);
      if (isUsed) {
        alert('Cannot delete this course because it is used in course offerings.');
        return state;
      }
      return {
        ...state,
        courses: state.courses.filter(c => c.id !== action.payload),
      };
    }
    case 'ADD_COURSE_OFFERING':
      return {
        ...state,
        courseOfferings: [...state.courseOfferings, action.payload],
      };
    case 'UPDATE_COURSE_OFFERING':
      return {
        ...state,
        courseOfferings: state.courseOfferings.map(co => 
          co.id === action.payload.id ? action.payload : co
        ),
      };
    case 'DELETE_COURSE_OFFERING': {
      // Check if course offering is used in any registration
      const isUsed = state.registrations.some(r => r.courseOfferingId === action.payload);
      if (isUsed) {
        alert('Cannot delete this course offering because it has student registrations.');
        return state;
      }
      return {
        ...state,
        courseOfferings: state.courseOfferings.filter(co => co.id !== action.payload),
      };
    }
    case 'ADD_STUDENT':
      return {
        ...state,
        students: [...state.students, action.payload],
      };
    case 'ADD_REGISTRATION':
      return {
        ...state,
        registrations: [...state.registrations, action.payload],
      };
    case 'DELETE_REGISTRATION':
      return {
        ...state,
        registrations: state.registrations.filter(r => r.id !== action.payload),
      };
    default:
      return state;
  }
};

// Create context
type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Create provider
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Create hook to use context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};