
import React, { useState } from 'react';
import { Aluno, Turma, NotaBimestre, Disciplina, Escola } from '../types';
import { getPerformanceFrame } from '../constants';
import { Printer, Download, Eye } from 'lucide-react';
import ReportHeader from '../components/ReportHeader';

interface RelatoriosViewProps {
  alunos: Aluno[];
  turmas: Turma[];
  notas: NotaBimestre[];
  disciplinas: Disciplina[];
  schools: Escola[];
  currentEscola?: Escola;
}

// Fixed: Renamed disciplines to disciplinas to match interface RelatoriosViewProps
const RelatoriosView: React.FC<RelatoriosViewProps> = ({ alunos, turmas, notas, disciplinas, schools, currentEscola }) => {
  const [selectedTurma, setSelectedTurma] = useState(turmas[0]?.id || '');
  const [viewMode, setViewMode] = useState<'bimestral' | 'global'>('bimestral');

  const filteredAlunos = alunos.filter(a => a.turmaId === selectedTurma);

  return (
    <div className="space-y-6">
      <ReportHeader 
        escola={currentEscola} 
        titulo="Boletim Escolar de Desempenho" 
        subtitulo={`Listagem de alunos da turma ${turmas.find(t => t.id === selectedTurma)?.nome || ''}`}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest">Filtros de Exibição</h2>
        </div>
        <div className="flex gap-2">
          <select 
            value={selectedTurma}
            onChange={e => setSelectedTurma(e.target.value)}
            className="bg-white border-2 border-slate-100 rounded-xl font-bold text-xs px-4 py-2"
          >
            {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
          </select>
          <button onClick={() => setViewMode('bimestral')} className={`px-4 py-2 rounded-xl font-black text-xs transition-all ${viewMode === 'bimestral' ? 'bg-amber-600 text-white shadow-lg shadow-amber-200' : 'bg-white text-slate-500 border border-slate-100'}`}>BIMESTRAL</button>
          <button onClick={() => setViewMode('global')} className={`px-4 py-2 rounded-xl font-black text-xs transition-all ${viewMode === 'global' ? 'bg-amber-600 text-white shadow-lg shadow-amber-200' : 'bg-white text-slate-500 border border-slate-100'}`}>GLOBAL</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAlunos.map(aluno => {
          const notaB1 = notas.find(n => n.alunoId === aluno.id && n.bimestre === 1);
          const mediaFinal = notaB1?.media || 0;
          const frame = getPerformanceFrame(mediaFinal);

          return (
            <div 
              key={aluno.id} 
              className={`bg-white rounded-[40px] overflow-hidden shadow-2xl transition-all hover:scale-[1.02] border-solid ${frame.color} ${frame.width} p-1`}
            >
              <div className="bg-white rounded-[36px] h-full p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm">
                    <img src={aluno.foto} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full text-white bg-slate-800`}>
                      {frame.label}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-black text-slate-800 truncate">{aluno.nome}</h3>
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">{turmas.find(t => t.id === aluno.turmaId)?.nome}</p>
                </div>

                <div className="space-y-3 mb-8">
                   <div className="grid grid-cols-4 text-[10px] font-black text-slate-400 uppercase text-center border-b pb-2">
                      <span className="text-left col-span-1">MATÉRIA</span>
                      <span>N1</span>
                      <span>N2</span>
                      <span>MÉDIA</span>
                   </div>
                   {/* Fixed: Renamed disciplines to disciplinas to match the interface */}
                   {disciplinas?.slice(0, 3).map(d => {
                     const nota = notas.find(n => n.alunoId === aluno.id && n.disciplinaId === d.id);
                     return (
                       <div key={d.id} className="grid grid-cols-4 text-xs items-center text-center">
                          <span className="text-left font-bold text-slate-600 truncate">{d.nome}</span>
                          <span className="font-medium">{nota?.n1 || '-'}</span>
                          <span className="font-medium">{nota?.provaParcial || '-'}</span>
                          <span className="font-black text-slate-800 bg-slate-50 py-1 rounded-lg">
                            {nota?.media.toFixed(1) || '0.0'}
                          </span>
                       </div>
                     );
                   })}
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                    <Eye size={14} /> DETALHES
                  </button>
                  <button className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100 hover:bg-amber-100 transition-all">
                    <Printer size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatoriosView;
