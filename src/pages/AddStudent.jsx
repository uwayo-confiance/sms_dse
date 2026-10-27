import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Save, ArrowLeft } from 'lucide-react';

const emptyForm = {
  fullName: '', email: '', phone: '', grade: 'A', gender: 'Male', address: '',
  grades: { Mathematics: 80, Science: 80, English: 80, History: 80 },
};

export default function AddStudent({ isEdit = false }) {
  const { id } = useParams();
  const { addStudent, updateStudent, getStudent } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit && id) {
      const student = getStudent(id);
      if (student) setForm({ fullName: student.fullName, email: student.email, phone: student.phone, grade: student.grade, gender: student.gender, address: student.address || '', grades: student.grades || emptyForm.grades });
    }
  }, [isEdit, id, getStudent]);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    return e;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleGradeChange = (subject, value) => {
    const num = Math.min(100, Math.max(0, Number(value) || 0));
    setForm((prev) => ({ ...prev, grades: { ...prev.grades, [subject]: num } }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e_ = validate();
    if (Object.keys(e_).length) { setErrors(e_); return; }
    if (isEdit) { updateStudent(id, form); navigate(`/students/${id}`); }
    else { const newS = addStudent(form); navigate(`/students/${newS.id}`); }
  };

  return (
    <div className="p-8 max-w-3xl">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Student' : 'Add New Student'}</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in the required information</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
              <input type="text" value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)} placeholder="Enter full name" className={`w-full px-4 py-3 border rounded-xl outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.fullName ? 'border-red-300' : 'border-gray-200'}`} />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
              <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="student@example.com" className={`w-full px-4 py-3 border rounded-xl outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-300' : 'border-gray-200'}`} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
              <input type="tel" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="078XXXXXXX" className={`w-full px-4 py-3 border rounded-xl outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-300' : 'border-gray-200'}`} />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Grade</label>
              <select value={form.grade} onChange={(e) => handleChange('grade', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="F">F</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
              <select value={form.gender} onChange={(e) => handleChange('gender', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                <option value="Male">Male</option><option value="Female">Female</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
              <input type="text" value={form.address} onChange={(e) => handleChange('address', e.target.value)} placeholder="City, Country" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Subject Scores</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.keys(form.grades).map((subj) => (
                <div key={subj}>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{subj}</label>
                  <input type="number" min="0" max="100" value={form.grades[subj]} onChange={(e) => handleGradeChange(subj, e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition shadow-sm">
              <Save className="w-4 h-4" /> {isEdit ? 'Save Changes' : 'Save Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
