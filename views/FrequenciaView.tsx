
import React, { useState } from 'react';
import { Aluno, Turma, Disciplina, FrequenciaRegistro, FrequenciaStatus, PlanejamentoBNCC } from '../types';
import { STATUS_FREQ_CONFIG } from '../constants';
import { Save, UserCheck, BookOpen, Sparkles } from 'lucide-react';

interface FrequenciaViewProps {
  alunos: Aluno[];
  turmas: Turma[];
  disciplinas: Disciplina[];
  frequencias: FrequenciaRegistro[];
  setFrequencias: React.Dispatch<React.SetStateAction<FrequenciaRegistro[]>>;
  planos: PlanejamentoBNCC[];
  setPlanos: React.Dispatch<React.SetStateAction<PlanejamentoBNCC[]>>;
  getBimestrePorData: (data: string) => 1 | 2 | 3 | 4;
}

const FrequenciaView: React.FC<FrequenciaViewProps> = ({ 
  alunos, turmas, disciplinas, frequencias, setFrequencias, planos, setPlanos, getBimestrePorData 
}) => {
  const [selectedTurma, setSelectedTurma] = useState(turmas[0]?.id || '');
  const [selectedDisc, setSelectedDisc] = useState(disciplinas[0]?.id || '');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [dailyPlan, setDailyPlan] = useState({ assunto: '', codigos: '' });

  const currentBimestre = getBimestrePorData(currentDate);
  const turmaAlunos = alunos.filter(a => a.turmaId === selectedTurma);

  const getStatus = (alunoId: string) => {
    return frequencias.find(f => 
      f.alunoId === alunoId && 
      f.data === currentDate && 
      f.disciplinaId === selectedDisc
    )?.status || FrequenciaStatus.P;
  };

  const handleUpdateStatus = (alunoId: string, status: FrequenciaStatus) => {
    setFrequencias((prev: FrequenciaRegistro[]) => {
      const filtered = prev.filter(f => !(f.alunoId === alunoId && f.data === currentDate && f.disciplinaId === selectedDisc));
      return [...filtered, {
        id: Math.random().toString(36),
        alunoId,
        turmaId: selectedTurma,
        disciplinaId: selectedDisc,
        data: currentDate,
        status,
        bimestre: currentBimestre
      }];
    });
  };

  const markAllPresent = () => {
    const newRecords: FrequenciaRegistro[] = turmaAlunos.map(a => ({
      id: Math.random().toString(36),
      alunoId: a.id,
      turmaId: selectedTurma,
      disciplinaId: selectedDisc,
      data: currentDate,
      status: FrequenciaStatus.P,
      bimestre: currentBimestre
    }));

    setFrequencias((prev: FrequenciaRegistro[]) => {
      const otherRecords = prev.filter(f => !(f.turmaId === selectedTurma && f.data === currentDate && f.disciplinaId === selectedDisc));
      return [...otherRecords, ...newRecords];
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Chamada Diária</h2>
          <p className="text-slate-500">
            Período identificado: <span className="font-bold text-amber-600">{currentBimestre}º Bimestre</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowPlanForm(!showPlanForm)}
            className="px-4 py-2.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl font-bold flex items-center gap-2"
          >
            <BookOpen size={18} />
            Lançar Planejamento
          </button>
          <button 
            onClick={markAllPresent}
            className="px-4 py-2.5 bg-green-50 text-green-700 border border-green-200 rounded-xl font-bold flex items-center gap-2 hover:bg-green-100 transition-all"
          >
            <UserCheck size={18} />
            Presença p/ Todos
          </button>
        </div>
      </div>

      {showPlanForm && (
        <div className="bg-amber-600 p-6 rounded-[30px] shadow-xl animate-in zoom-in-95 text-white space-y-4">
           <h3 className="font-black text-lg flex items-center gap-2">
             <Sparkles /> Planejamento para esta Aula
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                placeholder="Assunto da aula..." 
                className="bg-white/10 border-white/20 rounded-xl text-white placeholder:text-white/50 font-bold"
                value={dailyPlan.assunto}
                onChange={e => setDailyPlan({...dailyPlan, assunto: e.target.value})}
              />
              <input 
                placeholder="Códigos BNCC..." 
                className="bg-white/10 border-white/20 rounded-xl text-white placeholder:text-white/50 font-bold"
                value={dailyPlan.codigos}
                onChange={e => setDailyPlan({...dailyPlan, codigos: e.target.value})}
              />
           </div>
           <p className="text-[10px] font-bold opacity-60 uppercase">Ao salvar a frequência, este planejamento será vinculado ao dia.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Data Selecionada</label>
          <input 
            type="date" 
            value={currentDate}
            onChange={e => setCurrentDate(e.target.value)}
            className="w-full border-none bg-slate-50 rounded-lg font-bold text-slate-700 p-2"
          />
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Turma</label>
          <select 
            value={selectedTurma}
            onChange={e => setSelectedTurma(e.target.value)}
            className="w-full border-none bg-slate-50 rounded-lg font-bold text-slate-700 p-2"
          >
            {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
          </select>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Matéria</label>
          <select 
            value={selectedDisc}
            onChange={e => setSelectedDisc(e.target.value)}
            className="w-full border-none bg-slate-50 rounded-lg font-bold text-slate-700 p-2"
          >
            {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
          </select>
        </div>
        <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-200 flex flex-col justify-center">
          <span className="text-white/70 text-[10px] font-black uppercase">Taxa de Presença</span>
          <span className="text-white text-2xl font-black">
            {turmaAlunos.length > 0 ? (frequencias.filter(f => f.turmaId === selectedTurma && f.data === currentDate && f.status === 'P').length / turmaAlunos.length * 100).toFixed(0) : 0}%
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Aluno</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Status Comportamental</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {turmaAlunos.map(aluno => {
                const currentStatus = getStatus(aluno.id);
                return (
                  <tr key={aluno.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
                           <img src={aluno.foto || `https://ui-avatars.com/api/?name=${aluno.nome}`} alt="" className="w-full h-full object-cover" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-800">{aluno.nome}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{aluno.perfil}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {Object.entries(STATUS_FREQ_CONFIG).map(([key, config]) => (
                          <button
                            key={key}
                            onClick={() => handleUpdateStatus(aluno.id, key as FrequenciaStatus)}
                            title={config.label}
                            className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs transition-all border-2 ${
                              currentStatus === key 
                                ? `${config.color.replace('100', '600')} text-white border-transparent scale-110 shadow-md` 
                                : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300'
                            }`}
                          >
                            {key}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FrequenciaView;
