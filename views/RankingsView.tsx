
import React from 'react';
import { Aluno, NotaBimestre, Turma } from '../types';
import { Trophy, TrendingUp, AlertCircle, Medal } from 'lucide-react';

interface RankingsViewProps {
  alunos: Aluno[];
  notas: NotaBimestre[];
  turmas: Turma[];
}

const RankingsView: React.FC<RankingsViewProps> = ({ alunos, notas, turmas }) => {
  const sortedRank = [...alunos].map(aluno => {
    const studentNotas = notas.filter(n => n.alunoId === aluno.id);
    const avg = studentNotas.length > 0 
      ? studentNotas.reduce((acc, n) => acc + n.media, 0) / studentNotas.length 
      : 0;
    return { ...aluno, mediaGeral: avg };
  }).sort((a, b) => b.mediaGeral - a.mediaGeral);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <Trophy className="text-amber-500" /> Rankings de Performance
          </h2>
          <p className="text-slate-500">Top 10 alunos com maior rendimento na rede.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-slate-50 border-b">
                <tr>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Posição</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Estudante</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-center">Turma</th>
                   <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-right">Média Geral</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {sortedRank.slice(0, 10).map((aluno, idx) => (
                  <tr key={aluno.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-8 py-4">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${
                         idx === 0 ? 'bg-amber-100 text-amber-600' : 
                         idx === 1 ? 'bg-slate-200 text-slate-600' :
                         idx === 2 ? 'bg-orange-100 text-orange-600' : 'text-slate-400'
                       }`}>
                         {idx + 1}
                       </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                         <img src={aluno.foto} className="w-10 h-10 rounded-xl object-cover" alt="" />
                         <span className="font-bold text-slate-800">{aluno.nome}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-center">
                       <span className="text-xs font-bold text-slate-400">{turmas.find(t => t.id === aluno.turmaId)?.nome}</span>
                    </td>
                    <td className="px-8 py-4 text-right">
                       <span className={`text-lg font-black ${aluno.mediaGeral >= 7.5 ? 'text-emerald-600' : 'text-slate-800'}`}>
                         {aluno.mediaGeral.toFixed(2)}
                       </span>
                    </td>
                  </tr>
                ))}
             </tbody>
          </table>
        </div>

        <div className="space-y-6">
           <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 rounded-[40px] text-white shadow-xl">
              <h4 className="font-black text-lg mb-4 flex items-center gap-2">
                <Medal /> Visão Pedagógica
              </h4>
              <div className="space-y-4">
                 <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                    <p className="text-[10px] font-black opacity-60 uppercase mb-1">Taxa de Aprovação</p>
                    <p className="text-2xl font-black">84.2%</p>
                 </div>
                 <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                    <p className="text-[10px] font-black opacity-60 uppercase mb-1">Média da Rede</p>
                    <p className="text-2xl font-black">7.15</p>
                 </div>
              </div>
           </div>

           <div className="bg-red-50 border border-red-100 p-8 rounded-[40px]">
              <h4 className="font-black text-red-800 mb-4 flex items-center gap-2">
                <AlertCircle /> Alunos em Risco
              </h4>
              <div className="space-y-3">
                 {sortedRank.filter(a => a.mediaGeral < 5).slice(0, 3).map(a => (
                   <div key={a.id} className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-sm">
                      <img src={a.foto} className="w-8 h-8 rounded-lg grayscale" alt="" />
                      <div className="flex-1">
                         <p className="text-xs font-bold text-slate-800">{a.nome}</p>
                         <p className="text-[10px] text-red-500 font-bold uppercase">Média: {a.mediaGeral.toFixed(1)}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RankingsView;
