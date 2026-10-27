import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Pencil, Mail, Phone, MapPin, Calendar, GraduationCap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentDetails() {
  const { id } = useParams();
  const { getStudent } = useApp();
  const navigate = useNavigate();
  const student = getStudent(id);
  if (!student) return (<div className="p-8 text-center"><p className="text-gray-500">Student not found</p><Link to="/students" className="text-blue-600 mt-2 inline-block">Back to list</Link></div>);
  const gradeData = Object.entries(student.grades || {}).map(([name, score]) => ({ name: name.slice(0, 4), score }));
  const avg = gradeData.length > 0 ? Math.round(gradeData.reduce((a, b) => a + b.score, 0) / gradeData.length) : 0;
  return (
    <div className="p-8 max-w-4xl">
      <button onClick={() => navigate('/students')} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm font-medium"><ArrowLeft className="w-4 h-4" /> Back to Students</button>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold">{student.fullName.charAt(0)}</div>
              <div>
                <h1 className="text-2xl font-bold">{student.fullName}</h1>
                <p className="text-blue-100 mt-1 flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Grade {student.grade}</p>
              </div>
            </div>
            <Link to={`/students/${id}/edit`} className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-medium transition"><Pencil className="w-4 h-4" /> Edit</Link>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Mail className="w-5 h-5 text-blue-600" /></div><div><p className="text-xs text-gray-500">Email</p><p className="font-medium text-gray-900">{student.email}</p></div></div>
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><Phone className="w-5 h-5 text-emerald-600" /></div><div><p className="text-xs text-gray-500">Phone</p><p className="font-medium text-gray-900">{student.phone}</p></div></div>
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center"><MapPin className="w-5 h-5 text-violet-600" /></div><div><p className="text-xs text-gray-500">Address</p><p className="font-medium text-gray-900">{student.address || '—'}</p></div></div>
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><Calendar className="w-5 h-5 text-amber-600" /></div><div><p className="text-xs text-gray-500">Enrollment Date</p><p className="font-medium text-gray-900">{student.enrollmentDate}</p></div></div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-gray-900">{student.grade}</p><p className="text-xs text-gray-500 mt-1">Overall Grade</p></div>
            <div className="bg-gray-50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-gray-900">{avg}%</p><p className="text-xs text-gray-500 mt-1">Average Score</p></div>
            <div className="bg-gray-50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-gray-900">{student.gender}</p><p className="text-xs text-gray-500 mt-1">Gender</p></div>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={gradeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 13 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 13 }} />
              <Tooltip />
              <Bar dataKey="score" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-6 overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full">
              <thead><tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase"><th className="px-5 py-3 font-medium">Subject</th><th className="px-5 py-3 font-medium">Score</th><th className="px-5 py-3 font-medium">Status</th></tr></thead>
              <tbody className="divide-y divide-gray-50">
                {Object.entries(student.grades || {}).map(([subj, score]) => (
                  <tr key={subj}>
                    <td className="px-5 py-3 font-medium text-gray-900">{subj}</td>
                    <td className="px-5 py-3 text-gray-700">{score}%</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${score >= 90 ? 'bg-emerald-100 text-emerald-700' : score >= 80 ? 'bg-blue-100 text-blue-700' : score >= 70 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {score >= 90 ? 'Excellent' : score >= 80 ? 'Good' : score >= 70 ? 'Average' : 'Needs Improvement'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
