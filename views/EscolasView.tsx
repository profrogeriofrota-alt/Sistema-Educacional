
import React, { useState } from 'react';
import { Escola } from '../types';
import { Plus, Building2, Edit2, Trash2, Globe, MapPin, CheckCircle2, XCircle } from 'lucide-react';

interface EscolasViewProps {
  escolas: Escola[];
  setEscolas: React.Dispatch<React.SetStateAction<Escola[]>>;
}

const EscolasView: React.FC<EscolasViewProps> = ({ escolas, setEscolas }) => {
  const [showModal, setShowModal] = useState(false);
  const [newEscola, setNewEscola] = useState<Partial<Escola>>({ 
    nome: '', 
    logo: 'https://picsum.photos/seed/school/200/200', 
    status: 'Ativa' 
  });

  const handleAddEscola = () => {
    if (!newEscola.nome) return;
    const toAdd: Escola = {
      id: Math.random().toString(36).substr(2, 9),
      nome: newEscola.nome,
      logo: newEscola.logo || 'https://picsum.photos/seed/school/200/200',
      status: (newEscola.status as any) || 'Ativa'
    };
    setEscolas([...escolas, toAdd]);
    setShowModal(false);
    setNewEscola({ nome: '', logo: 'https://picsum.photos/seed/school/200/200', status: 'Ativa' });
  };

  const toggleStatus = (id: string) => {
    setEscolas(prev => prev.map(e => e.id === id ? { ...e, status: e.status === 'Ativa' ? 'Inativa' : 'Ativa' } : e));
  };

  const deleteEscola = (id: string) => {
    if (confirm('Deseja realmente remover esta unidade?')) {
      setEscolas(prev => prev.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Rede de Unidades Escolares</h2>
          <p className="text-slate-500 font-medium">Cadastre e gerencie a identidade visual e o status das suas escolas.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 transition-all shadow-xl shadow-amber-200"
        >
          <Plus size={20} strokeWidth={3} />
          ADICIONAR UNIDADE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {escolas.map(escola => (
          <div key={escola.id} className={`bg-white rounded-[40px] border-2 overflow-hidden group transition-all duration-500 hover:shadow-2xl ${escola.status === 'Ativa' ? 'border-slate-100' : 'border-red-100 opacity-75'}`}>
            <div className={`h-28 relative ${escola.status === 'Ativa' ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 'bg-slate-400'}`}>
               <div className="absolute -bottom-10 left-8 w-24 h-24 bg-white rounded-3xl p-2 shadow-2xl transition-transform group-hover:scale-105">
                  <img src={escola.logo} className="w-full h-full object-cover rounded-2xl" alt="" />
               </div>
               <div className="absolute top-4 right-4 flex gap-2">
                 <button className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-xl backdrop-blur-md transition-all">
                    <Edit2 size={16} />
                 </button>
                 <button onClick={() => deleteEscola(escola.id)} className="p-2 bg-white/20 hover:bg-red-500 text-white rounded-xl backdrop-blur-md transition-all">
                    <Trash2 size={16} />
                 </button>
               </div>
            </div>
            
            <div className="pt-16 p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 leading-tight">{escola.nome}</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase mt-2 tracking-widest">
                     <Building2 size={12} />
                     <span>ID: {escola.id.toUpperCase()}</span>
                  </div>
                </div>
                <button 
                  onClick={() => toggleStatus(escola.id)}
                  className={`p-2 rounded-xl transition-all ${escola.status === 'Ativa' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                  title={escola.status === 'Ativa' ? 'Desativar Unidade' : 'Ativar Unidade'}
                >
                  {escola.status === 'Ativa' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 transition-colors group-hover:bg-amber-50 group-hover:border-amber-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Status Operacional</span>
                    <p className={`text-sm font-black uppercase ${escola.status === 'Ativa' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {escola.status}
                    </p>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Configuração</span>
                    <p className="text-sm font-bold text-slate-700">Padrão BNCC</p>
                 </div>
              </div>
            </div>
            
            <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Última Sincronização: Hoje</span>
               <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${escola.status === 'Ativa' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${escola.status === 'Ativa' ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {escola.status === 'Ativa' ? 'Sistema Online' : 'Sistema Offline'}
                  </span>
               </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-300">
            <div>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">Nova Unidade Escolar</h3>
              <p className="text-slate-400 mt-2 font-medium">Defina os detalhes de identificação da nova escola.</p>
            </div>

            <div className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nome da Instituição</label>
                 <input 
                  type="text" 
                  className="w-full border-2 border-slate-100 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-bold text-slate-700" 
                  value={newEscola.nome}
                  onChange={e => setNewEscola({...newEscola, nome: e.target.value})}
                  placeholder="Ex: Colégio Âmbar Saberes"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Logo da Unidade (URL)</label>
                 <input 
                  type="text" 
                  className="w-full border-2 border-slate-100 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-bold text-slate-700" 
                  value={newEscola.logo}
                  onChange={e => setNewEscola({...newEscola, logo: e.target.value})}
                  placeholder="Link da imagem/logo"
                 />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status Inicial</label>
                  <select 
                    className="w-full border-2 border-slate-100 rounded-2xl py-4 px-5 font-bold text-slate-700"
                    value={newEscola.status}
                    onChange={e => setNewEscola({...newEscola, status: e.target.value as any})}
                  >
                    <option value="Ativa">Ativa</option>
                    <option value="Inativa">Inativa</option>
                  </select>
               </div>
            </div>

            <div className="flex gap-4 pt-4">
               <button onClick={() => setShowModal(false)} className="flex-1 py-4 font-black text-slate-400 hover:text-slate-600 transition-all">CANCELAR</button>
               <button onClick={handleAddEscola} className="flex-[2] py-4 bg-amber-600 text-white rounded-2xl font-black text-lg hover:bg-amber-700 shadow-xl shadow-amber-200 transition-all">CRIAR UNIDADE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EscolasView;
