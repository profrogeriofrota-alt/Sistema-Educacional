
import React from 'react';
import { Aluno, Turma, FrequenciaRegistro, NotaBimestre } from '../types';
import { Users, BookOpen, GraduationCap, TrendingUp, AlertTriangle } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, PieChart, Pie
} from 'recharts';

interface DashboardProps {
  alunos: Aluno[];
  turmas: Turma[];
  frequencias: FrequenciaRegistro[];
  // Added notas prop
  notas: NotaBimestre[];
}

const Dashboard: React.FC<DashboardProps> = ({ alunos, turmas, frequencias, notas }) => {
  const stats = [
    { label: 'Total Alunos', value: alunos.length, icon: <Users className="text-blue-600" />, color: 'bg-blue-50' },
    { label: 'Turmas Ativas', value: turmas.length, icon: <BookOpen className="text-emerald-600" />, color: 'bg-emerald-50' },
    { label: 'Média de Frequência', value: '92%', icon: <TrendingUp className="text-purple-600" />, color: 'bg-purple-50' },
    { label: 'Perfil Crítico', value: alunos.filter(a => a.perfil === 'CRÍTICO').length, icon: <AlertTriangle className="text-amber-600" />, color: 'bg-amber-50' },
  ];

  const data = [
    { name: '1º Ano', alunos: 34, presenca: 95 },
    { name: '2º Ano', alunos: 28, presenca: 88 },
    { name: '3º Ano', alunos: 42, presenca: 91 },
    { name: '4º Ano', alunos: 31, presenca: 94 },
    { name: '5º Ano', alunos: 25, presenca: 86 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const studentProfiles = [
    { name: 'Bom', value: alunos.filter(a => a.perfil === 'BOM').length || 10 },
    { name: 'Intermediário', value: alunos.filter(a => a.perfil === 'INTERMEDIÁRIO').length || 5 },
    { name: 'Crítico', value: alunos.filter(a => a.perfil === 'CRÍTICO').length || 3 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Bem-vindo, Gestor</h1>
          <p className="text-slate-500">Resumo da performance escolar atual.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-slate-600">Sistema Online - Unidade Matriz</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-xl ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Frequência por Turma (%)</h3>
            <select className="bg-slate-50 border-none rounded-lg text-xs font-semibold px-2 py-1">
              <option>Últimos 30 dias</option>
              <option>Bimestre Atual</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="presenca" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Distribuição de Perfis</h3>
          <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={studentProfiles}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {studentProfiles.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-slate-800">{alunos.length}</span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">Total</span>
            </div>
          </div>
          <div className="space-y-3 mt-4">
             {studentProfiles.map((profile, i) => (
               <div key={i} className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <div className={`w-3 h-3 rounded-full`} style={{backgroundColor: COLORS[i]}}></div>
                   <span className="text-sm text-slate-600 font-medium">{profile.name}</span>
                 </div>
                 <span className="text-sm font-bold text-slate-800">{profile.value} Alunos</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
