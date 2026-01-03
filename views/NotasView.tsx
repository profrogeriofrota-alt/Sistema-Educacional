
import React, { useState } from 'react';
import { Aluno, Turma, Disciplina, NotaBimestre } from '../types';
import { RefreshCcw, Search, Star, Download, GraduationCap, ChevronDown } from 'lucide-react';

interface NotasViewProps {
  notas: NotaBimestre[];
  setNotas: React.Dispatch<React.SetStateAction<NotaBimestre[]>>;
  alunos: Aluno[];
  turmas: Turma[];
  disciplinas: Disciplina[];
  syncN1: (alunoId: string, discId: string, bimestre: number) => number;
}

const NotasView: React.FC<NotasViewProps> = ({ notas, setNotas, alunos, turmas, disciplinas, syncN1 }) => {
  const [selectedTurma, setSelectedTurma] = useState(turmas[0]?.id || '');
  const [selectedDisc, setSelectedDisc] = useState(disciplinas[0]?.id || '');
  const [currentBimestre, setCurrentBimestre] = useState<1|2|3|4>(1);

  const getNota = (alunoId: string) => {
    return notas.find(n => n.alunoId === alunoId && n.disciplinaId === selectedDisc && n.bimestre === currentBimestre) || {
      n1: syncN1(alunoId, selectedDisc, currentBimestre),
      provaParcial: 0,
      provaGlobal: 0,
      trabalhos: 0,
      media: 0
    };
  };

  const handleSyncN1 = () => {
    const updated = notas.map(n => ({
      ...n,
      n1: syncN1(n.alunoId, n.disciplinaId, n.bimestre),
      media: (syncN1(n.alunoId, n.disciplinaId, n.bimestre) + n.provaParcial + n.provaGlobal + n.trabalhos) / 4
    }));
    setNotas(updated);
    alert("Notas de participação (N1) sincronizadas com sucesso com base na frequência e atividades.");
  };

  const filteredAlunos = alunos.filter(a => a.turmaId === selectedTurma);

  const calculateTurmaMedia = () => {
    const relevantNotas = notas.filter(n => n.turmaId === selectedTurma && n.disciplinaId === selectedDisc && n.bimestre === currentBimestre);
    if (relevantNotas.length === 0) return "---";
    const sum = relevantNotas.reduce((acc, curr) => acc + curr.media, 0);
    return (sum / relevantNotas.length).toFixed(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Boletim Escolar & Notas</h2>
          <p className="text-slate-500 font-medium">Lançamento consolidado e visão integrada de desempenho.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={handleSyncN1} className="p-3 bg-white border border-slate-200 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm" title="Recalcular N1 da Frequência">
              <RefreshCcw size={20} />
           </button>
           <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
              <Download size={18} />
              Exportar Boletim
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Unidade/Turma</label>
          <div className="relative">
            <select value={selectedTurma} onChange={e => setSelectedTurma(e.target.value)} className="w-full appearance-none bg-slate-50 border-none rounded-xl font-bold py-2.5 px-3 text-slate-700">
              {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Disciplina</label>
          <div className="relative">
            <select value={selectedDisc} onChange={e => setSelectedDisc(e.target.value)} className="w-full appearance-none bg-slate-50 border-none rounded-xl font-bold py-2.5 px-3 text-slate-700">
              {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Bimestre Letivo</label>
          <div className="relative">
            <select value={currentBimestre} onChange={e => setCurrentBimestre(Number(e.target.value) as any)} className="w-full appearance-none bg-slate-50 border-none rounded-xl font-bold py-2.5 px-3 text-slate-700">
              <option value={1}>1º Bimestre</option>
              <option value={2}>2º Bimestre</option>
              <option value={3}>3º Bimestre</option>
              <option value={4}>4º Bimestre</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div className="bg-indigo-600 p-4 rounded-3xl shadow-xl shadow-indigo-100 flex flex-col justify-center text-white">
          <span className="text-[10px] font-black uppercase opacity-60 tracking-widest mb-1">Média de Desempenho</span>
          <span className="text-3xl font-black">{calculateTurmaMedia()}</span>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estudante</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">N1 (Particip.)</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">P. Parcial</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">P. Global</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trabalhos</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Média Bimestral</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlunos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center flex flex-col items-center">
                    <GraduationCap size={48} className="text-slate-200 mb-2" />
                    <p className="text-slate-400 font-bold">Nenhum aluno encontrado para os critérios selecionados.</p>
                  </td>
                </tr>
              ) : filteredAlunos.map(aluno => {
                const nota = getNota(aluno.id);
                const media = ((nota.n1 + (nota.provaParcial || 0) + (nota.provaGlobal || 0) + (nota.trabalhos || 0)) / 4).toFixed(1);
                
                return (
                  <tr key={aluno.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img src={aluno.foto || `https://ui-avatars.com/api/?name=${aluno.nome}`} className="w-10 h-10 rounded-full object-cover border-2 border-slate-100" alt="" />
                        <div>
                           <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{aluno.nome}</p>
                           <p className="text-[10px] font-bold text-slate-400">{aluno.matricula || 'SEM MATRICULA'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="bg-slate-100/50 border border-slate-100 rounded-xl py-2 px-3 inline-block min-w-[60px] font-black text-slate-600 text-xs">
                        {nota.n1.toFixed(1)}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className={`border rounded-xl py-2 px-3 inline-block min-w-[60px] font-black text-xs ${
                        nota.provaParcial > 0 ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-slate-50 border-slate-100 text-slate-300'
                      }`}>
                        {nota.provaParcial > 0 ? nota.provaParcial.toFixed(1) : '---'}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className={`border rounded-xl py-2 px-3 inline-block min-w-[60px] font-black text-xs ${
                        nota.provaGlobal > 0 ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-slate-50 border-slate-100 text-slate-300'
                      }`}>
                        {nota.provaGlobal > 0 ? nota.provaGlobal.toFixed(1) : '---'}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <input 
                        type="number" 
                        step="0.1"
                        min="0"
                        max="10"
                        className="w-16 text-center border-2 border-slate-100 rounded-xl font-black text-slate-700 p-2 text-xs focus:border-indigo-500 transition-all outline-none"
                        value={nota.trabalhos || 0}
                        onChange={e => {
                          const val = parseFloat(e.target.value) || 0;
                          setNotas(prev => {
                            const existing = prev.find(n => n.alunoId === aluno.id && n.bimestre === currentBimestre && n.disciplinaId === selectedDisc);
                            if (existing) {
                              return prev.map(n => n.id === existing.id ? { 
                                ...n, 
                                trabalhos: val,
                                media: (n.n1 + n.provaParcial + n.provaGlobal + val) / 4 
                              } : n);
                            }
                            return [...prev, {
                              id: Math.random().toString(),
                              alunoId: aluno.id,
                              turmaId: selectedTurma,
                              disciplinaId: selectedDisc,
                              bimestre: currentBimestre,
                              n1: syncN1(aluno.id, selectedDisc, currentBimestre),
                              provaParcial: 0,
                              provaGlobal: 0,
                              trabalhos: val,
                              media: (syncN1(aluno.id, selectedDisc, currentBimestre) + val) / 4
                            }];
                          });
                        }}
                      />
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className={`py-2 px-4 rounded-2xl font-black text-sm inline-block shadow-sm ${
                        parseFloat(media) >= 6 ? 'bg-emerald-600 text-white shadow-emerald-100' : 'bg-red-600 text-white shadow-red-100'
                      }`}>
                        {media}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-4">
         <div className="flex-1 bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex items-center gap-6">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
               <Star size={24} strokeWidth={3} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alunos em Destaque</p>
               <p className="font-bold text-slate-700">3 estudantes com média 10.0</p>
            </div>
         </div>
         <div className="flex-1 bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex items-center gap-6">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
               <RefreshCcw size={24} strokeWidth={3} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alunos em Recuperação</p>
               <p className="font-bold text-slate-700">12 estudantes abaixo da média</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default NotasView;
