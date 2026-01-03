
import React, { useMemo, useState } from 'react';
import { FrequenciaRegistro, Aluno, Turma, PeriodoBimestral, Escola } from '../types';
import { STATUS_FREQ_CONFIG } from '../constants';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, AreaChart, Area
} from 'recharts';
import { Activity, Calendar, Download } from 'lucide-react';
import ReportHeader from '../components/ReportHeader';

interface AnaliseStatusViewProps {
  frequencias: FrequenciaRegistro[];
  alunos: Aluno[];
  turmas: Turma[];
  periodos: PeriodoBimestral[];
  currentEscola?: Escola;
}

const AnaliseStatusView: React.FC<AnaliseStatusViewProps> = ({ frequencias, alunos, turmas, periodos, currentEscola }) => {
  const [viewType, setViewType] = useState<'mensal' | 'bimestral'>('bimestral');
  const [selectedTurma, setSelectedTurma] = useState<string>('all');

  const filteredFreqs = useMemo(() => {
    return selectedTurma === 'all' 
      ? frequencias 
      : frequencias.filter(f => f.turmaId === selectedTurma);
  }, [frequencias, selectedTurma]);

  // Status List (all 8 parameters)
  const allStatusKeys = ['P', 'F', 'J', 'AT', 'D', 'A', 'C', 'L'];

  const dataBimestral = useMemo(() => {
    return periodos.map(p => {
      const bimFreqs = filteredFreqs.filter(f => f.bimestre === p.bimestre);
      const total = bimFreqs.length || 1;
      
      const counts: any = { name: `${p.bimestre}º Bim` };
      allStatusKeys.forEach(status => {
        counts[status] = (bimFreqs.filter(f => f.status === status).length / total) * 100;
      });
      return counts;
    });
  }, [filteredFreqs, periodos, allStatusKeys]);

  const dataMensal = useMemo(() => {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return meses.map((mes, idx) => {
      const monthFreqs = filteredFreqs.filter(f => new Date(f.data).getMonth() === idx);
      const counts: any = { name: mes };
      allStatusKeys.forEach(status => {
        counts[status] = monthFreqs.filter(f => f.status === status).length;
      });
      return counts;
    });
  }, [filteredFreqs, allStatusKeys]);

  const stats = useMemo(() => {
    const total = filteredFreqs.length || 1;
    return allStatusKeys.map(key => {
      const config = STATUS_FREQ_CONFIG[key];
      return {
        key,
        label: config.label,
        color: config.color,
        count: filteredFreqs.filter(f => f.status === key).length,
        percent: ((filteredFreqs.filter(f => f.status === key).length / total) * 100).toFixed(1)
      };
    });
  }, [filteredFreqs, allStatusKeys]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <ReportHeader 
        escola={currentEscola} 
        titulo="Relatório de Análise Geral de Status" 
        subtitulo="Visão 360º de presença, comportamento e engajamento discente."
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
             <Activity className="text-emerald-600" /> Métricas de Engajamento
          </h2>
        </div>
        <div className="flex gap-2">
           <select 
            value={selectedTurma}
            onChange={e => setSelectedTurma(e.target.value)}
            className="bg-white border-2 border-slate-100 rounded-xl font-bold text-xs px-4 py-2"
           >
             <option value="all">Todas as Turmas</option>
             {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
           </select>
           <button className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all">
              <Download size={20} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {stats.map(s => (
          <div key={s.key} className="bg-white p-5 rounded-[30px] border border-slate-100 shadow-sm flex flex-col items-center group hover:border-amber-500 transition-all cursor-default">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs mb-3 ${s.color}`}>
              {s.key}
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase mb-1">{s.label}</span>
            <span className="text-xl font-black text-slate-800">{s.count}</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-2">
              {s.percent}%
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
           <div className="flex items-center justify-between mb-10">
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs flex items-center gap-2">
                 <Calendar size={18} className="text-amber-500" /> Fluxo Temporal de Presença
              </h3>
              <div className="bg-slate-50 p-1.5 rounded-2xl flex gap-1 border border-slate-100">
                 <button onClick={() => setViewType('bimestral')} className={`px-4 py-1.5 text-[10px] font-black rounded-xl transition-all ${viewType === 'bimestral' ? 'bg-white shadow-lg text-amber-600' : 'text-slate-400 hover:text-slate-600'}`}>BIMESTRE</button>
                 <button onClick={() => setViewType('mensal')} className={`px-4 py-1.5 text-[10px] font-black rounded-xl transition-all ${viewType === 'mensal' ? 'bg-white shadow-lg text-amber-600' : 'text-slate-400 hover:text-slate-600'}`}>MENSAL</button>
              </div>
           </div>
           <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={viewType === 'bimestral' ? dataBimestral : dataMensal}>
                    <defs>
                       <linearGradient id="colorP" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                       </linearGradient>
                       <linearGradient id="colorF" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                    <Tooltip 
                      contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)'}} 
                    />
                    <Legend iconType="circle" wrapperStyle={{paddingTop: '30px', fontSize: '10px', fontWeight: 900}} />
                    <Area type="monotone" dataKey="P" stroke="#10b981" fillOpacity={1} fill="url(#colorP)" strokeWidth={4} name="Presente" />
                    <Area type="monotone" dataKey="F" stroke="#ef4444" fillOpacity={1} fill="url(#colorF)" strokeWidth={2} name="Falta" />
                    <Area type="monotone" dataKey="AT" stroke="#f59e0b" fillOpacity={0} strokeWidth={2} name="Atraso" />
                    <Area type="monotone" dataKey="D" stroke="#a855f7" fillOpacity={0} strokeWidth={2} name="Dormindo" />
                    <Area type="monotone" dataKey="C" stroke="#ec4899" fillOpacity={0} strokeWidth={2} name="Celular" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col">
           <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-8">Frequência por Perfil Comportamental</h3>
           <div className="flex-1 space-y-6 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {stats.sort((a,b) => b.count - a.count).map(s => (
                <div key={s.key} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1">
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg ${s.color}`}>
                            {s.key}
                         </div>
                         <div>
                            <p className="font-black text-slate-800 text-lg">{s.label}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total: {s.count} ocorrências</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-2xl font-black text-slate-800">{s.percent}%</p>
                      </div>
                   </div>
                   <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${s.key === 'P' ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                        style={{width: `${s.percent}%`}}
                      ></div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnaliseStatusView;
