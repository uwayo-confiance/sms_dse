import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const initialStudents = [
  {
    id: '1',
    fullName: 'Alex Nyiragaka',
    email: 'alex@example.com',
    phone: '0783123456',
    grade: 'A',
    gender: 'Male',
    address: 'Kigali, Rwanda',
    enrollmentDate: '2024-09-01',
    grades: { Mathematics: 92, Science: 88, English: 85, History: 90 },
  },
  {
    id: '2',
    fullName: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '0783987654',
    grade: 'B',
    gender: 'Female',
    address: 'Musanze, Rwanda',
    enrollmentDate: '2024-09-05',
    grades: { Mathematics: 78, Science: 82, English: 91, History: 75 },
  },
  {
    id: '3',
    fullName: 'Robert Mugisha',
    email: 'robert@example.com',
    phone: '0783456789',
    grade: 'A',
    gender: 'Male',
    address: 'Huye, Rwanda',
    enrollmentDate: '2024-09-10',
    grades: { Mathematics: 95, Science: 90, English: 88, History: 92 },
  },
  {
    id: '4',
    fullName: 'Emma Uwase',
    email: 'emma@example.com',
    phone: '0783123987',
    grade: 'C',
    gender: 'Female',
    address: 'Rubavu, Rwanda',
    enrollmentDate: '2024-09-12',
    grades: { Mathematics: 65, Science: 70, English: 72, History: 68 },
  },
];

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sms_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('sms_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  useEffect(() => {
    localStorage.setItem('sms_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('sms_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sms_user');
    }
  }, [user]);

  const login = (email, password) => {
    if (email && password) {
      const name = email.split('@')[0];
      const displayName = name.charAt(0).toUpperCase() + name.slice(1);
      setUser({ email, name: displayName });
      return true;
    }
    return false;
  };

  const register = (email, password, name) => {
    if (email && password) {
      setUser({ email, name: name || email.split('@')[0] });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const addStudent = (student) => {
    const newStudent = {
      ...student,
      id: Date.now().toString(),
      enrollmentDate: new Date().toISOString().split('T')[0],
      grades: student.grades || { Mathematics: 0, Science: 0, English: 0, History: 0 },
    };
    setStudents((prev) => [...prev, newStudent]);
    return newStudent;
  };

  const updateStudent = (id, updates) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const deleteStudent = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const getStudent = (id) => students.find((s) => s.id === id);

  const stats = {
    total: students.length,
    male: students.filter((s) => s.gender === 'Male').length,
    female: students.filter((s) => s.gender === 'Female').length,
    averageGrade: students.length
      ? Math.round(
          students.reduce((acc, s) => {
            const vals = Object.values(s.grades || {});
            return acc + (vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0);
          }, 0) / students.length
        )
      : 0,
  };

  return (
    <AppContext.Provider
      value={{
        user,
        students,
        login,
        register,
        logout,
        addStudent,
        updateStudent,
        deleteStudent,
        getStudent,
        stats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
