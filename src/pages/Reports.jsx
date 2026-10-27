import { useApp } from '../context/AppContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FileBarChart, Users, TrendingUp, Award } from 'lucide-react';

export default function Reports() {
  const { students, stats } = useApp();
  const gradeDist = [
    { name: 'A (90-100)', value: students.filter((s) => s.grade === 'A').length, color: '#10b981' },
    { name: 'B (80-89)', value: students.filter((s) => s.grade === 'B').length, color: '#3b82f6' },
    { name: 'C (70-79)', value: students.filter((s) => s.grade === 'C').length, color: '#f59e0b' },
    { name: 'D/F (<70)', value: students.filter((s) => !['A', 'B', 'C'].includes(s.grade)).length, color: '#ef4444' },
  ].filter((d) => d.value > 0);
  const genderDist = [{ name: 'Male', value: stats.male }, { name: 'Female', value: stats.female }].filter((d) => d.value > 0);
  const subjectAvgs = ['Mathematics', 'Science', 'English', 'History'].map((subj) => {
    const scores = students.map((s) => s.grades?.[subj]).filter((v) => typeof v === 'number');
    return { subject: subj, average: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0, max: scores.length ? Math.max(...scores) : 0, min: scores.length ? Math.min(...scores) : 0 };
  });
  const passFail = {
    passed: students.filter((s) => { const vals = Object.values(s.grades || {}); const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0; return avg >= 50; }).length,
    failed: students.filter((s) => { const vals = Object.values(s.grades || {}); const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0; return avg < 50; }).length,
  };
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><FileBarChart className="w-7 h-7 text-blue-600" /> Reports</h1>
        <p className="text-gray-500 mt-1">Analytics and performance overview</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"><div className="flex items-center gap-3 mb-2"><Users className="w-5 h-5 text-blue-600" /><span className="text-sm text-gray-500">Total Students</span></div><p className="text-3xl font-bold text-gray-900">{stats.total}</p></div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"><div className="flex items-center gap-3 mb-2"><TrendingUp className="w-5 h-5 text-emerald-600" /><span className="text-sm text-gray-500">Average Score</span></div><p className="text-3xl font-bold text-gray-900">{stats.averageGrade}%</p></div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"><div className="flex items-center gap-3 mb-2"><Award className="w-5 h-5 text-amber-600" /><span className="text-sm text-gray-500">Passed</span></div><p className="text-3xl font-bold text-emerald-600">{passFail.passed}</p></div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"><div className="flex items-center gap-3 mb-2"><Award className="w-5 h-5 text-red-500" /><span className="text-sm text-gray-500">Failed</span></div><p className="text-3xl font-bold text-red-500">{passFail.failed}</p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h2>
          {gradeDist.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={gradeDist} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}>
                  {gradeDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-center py-20">No data</p>}
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Gender Distribution</h2>
          {genderDist.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={genderDist} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  <Cell fill="#3b82f6" /><Cell fill="#ec4899" />
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-center py-20">No data</p>}
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={subjectAvgs}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="subject" tick={{ fontSize: 13 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 13 }} />
            <Tooltip /><Legend />
            <Bar dataKey="average" name="Average" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="max" name="Highest" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="min" name="Lowest" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
