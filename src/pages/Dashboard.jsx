import { useApp } from '../context/AppContext';
import { Users, UserCheck, UserX, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const { user, students, stats } = useApp();
  const gradeDistribution = [
    { name: 'A', value: students.filter((s) => s.grade === 'A').length },
    { name: 'B', value: students.filter((s) => s.grade === 'B').length },
    { name: 'C', value: students.filter((s) => s.grade === 'C').length },
    { name: 'D/F', value: students.filter((s) => !['A', 'B', 'C'].includes(s.grade)).length },
  ].filter((d) => d.value > 0);
  const subjectAverages = ['Mathematics', 'Science', 'English', 'History'].map((subj) => {
    const scores = students.map((s) => s.grades?.[subj]).filter((v) => typeof v === 'number');
    return { subject: subj.slice(0, 4), avg: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0 };
  });
  const recentStudents = [...students].slice(-5).reverse();
  const statCards = [
    { label: 'Total Students', value: stats.total, icon: Users, bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Male Students', value: stats.male, icon: UserCheck, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { label: 'Female Students', value: stats.female, icon: UserX, bg: 'bg-violet-50', text: 'text-violet-600' },
    { label: 'Avg Score', value: `${stats.averageGrade}%`, icon: TrendingUp, bg: 'bg-amber-50', text: 'text-amber-600' },
  ];
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}! 👋</h1>
        <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening today</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center`}>
              <card.icon className={`w-6 h-6 ${card.text}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Subject Averages</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={subjectAverages}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="subject" tick={{ fontSize: 13 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 13 }} />
              <Tooltip />
              <Bar dataKey="avg" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h2>
          {gradeDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={gradeDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {gradeDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-center py-16">No data yet</p>}
        </div>
      </div>
      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Students</h2>
          <Link to="/students" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">View all <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Grade</th>
                <th className="px-6 py-3 font-medium">Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentStudents.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">{s.fullName.charAt(0)}</div>
                      <span className="font-medium text-gray-900">{s.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{s.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.grade === 'A' ? 'bg-emerald-100 text-emerald-700' : s.grade === 'B' ? 'bg-blue-100 text-blue-700' : s.grade === 'C' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{s.grade}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{s.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
