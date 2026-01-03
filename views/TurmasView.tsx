
import React, { useState } from 'react';
import { Turma, Disciplina, Turno } from '../types';
// Fixed: Changed UserGroup to Users as UserGroup does not exist in lucide-react
import { Plus, Layers, BookMarked, Users, MoreVertical } from 'lucide-react';

interface TurmasViewProps {
  turmas: Turma[];
  setTurmas: React.Dispatch<React.SetStateAction<Turma[]>>;
  disciplinas: Disciplina[];
  setDisciplinas: React.Dispatch<React.SetStateAction<Disciplina[]>>;
  escolaId: string;
}

const TurmasView: React.FC<TurmasViewProps> = ({ turmas, setTurmas, disciplinas, setDisciplinas, escolaId }) => {
  const [newTurmaName, setNewTurmaName] = useState('');
  const [newDiscName, setNewDiscName] = useState('');

  const handleAddTurma = () => {
    if (!newTurmaName) return;
    setTurmas([...turmas, { id: Math.random().toString(), escolaId, nome: newTurmaName, turno: Turno.MATUTINO }]);
    setNewTurmaName('');
  };

  const handleAddDisc = () => {
    if (!newDiscName) return;
    setDisciplinas([...disciplinas, { id: Math.random().toString(), nome: newDiscName }]);
    setNewDiscName('');
  };

  return (
    <div className="space-y-10">
      {/* Turmas Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
               <Layers className="text-blue-500" />
               Turmas
            </h2>
            <p className="text-slate-500">Estruture as turmas da unidade.</p>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Nome da Turma" 
              className="border-slate-200 rounded-xl px-4 py-2 text-sm"
              value={newTurmaName}
              onChange={e => setNewTurmaName(e.target.value)}
            />
            <button 
              onClick={handleAddTurma}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Adicionar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {turmas.filter(t => t.escolaId === escolaId).map(t => (
            <div key={t.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                     {/* Fixed: Replaced UserGroup with Users */}
                     <Users size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{t.nome}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.turno}</p>
                  </div>
               </div>
               <button className="p-2 text-slate-300 hover:text-slate-600">
                  <MoreVertical size={16} />
               </button>
            </div>
          ))}
        </div>
      </section>

      {/* Disciplinas Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
               <BookMarked className="text-indigo-500" />
               Matérias / Disciplinas
            </h2>
            <p className="text-slate-500">Gerencie o currículo escolar.</p>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Ex: Física Quântica" 
              className="border-slate-200 rounded-xl px-4 py-2 text-sm"
              value={newDiscName}
              onChange={e => setNewDiscName(e.target.value)}
            />
            <button 
              onClick={handleAddDisc}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              Adicionar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {disciplinas.map(d => (
            <div key={d.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                     <BookMarked size={20} />
                  </div>
                  <h4 className="font-bold text-slate-800">{d.nome}</h4>
               </div>
               <button className="p-2 text-slate-300 hover:text-slate-600">
                  <MoreVertical size={16} />
               </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TurmasView;
