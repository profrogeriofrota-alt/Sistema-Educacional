
import React, { useState } from 'react';
import { Aluno, Turma, Turno, PerfilAluno } from '../types';
import { Plus, Search, Filter, MoreHorizontal, Camera, Upload, X, ChevronDown } from 'lucide-react';
import { PERFIL_COLORS } from '../constants';

interface AlunosViewProps {
  alunos: Aluno[];
  setAlunos: React.Dispatch<React.SetStateAction<Aluno[]>>;
  turmas: Turma[];
  escolaId: string;
}

const AlunosView: React.FC<AlunosViewProps> = ({ alunos, setAlunos, turmas, escolaId }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<Partial<Aluno>>({
    nome: '',
    matricula: '',
    dataNascimento: '',
    email: '',
    telefone: '',
    turmaId: turmas[0]?.id || '',
    status: 'Ativo',
    laudado: 'Não',
    perfil: PerfilAluno.BOM,
    responsavelNome: '',
    responsavelContato: '',
    foto: ''
  });

  const handleOpenModal = (aluno?: Aluno) => {
    if (aluno) {
      setEditingAluno(aluno);
      setFormData(aluno);
    } else {
      setEditingAluno(null);
      setFormData({
        nome: '',
        matricula: '',
        dataNascimento: '',
        email: '',
        telefone: '',
        turmaId: turmas[0]?.id || '',
        status: 'Ativo',
        laudado: 'Não',
        perfil: PerfilAluno.BOM,
        responsavelNome: '',
        responsavelContato: '',
        foto: ''
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingAluno) {
      setAlunos(prev => prev.map(a => a.id === editingAluno.id ? { ...a, ...formData } as Aluno : a));
    } else {
      const novo: Aluno = {
        id: Math.random().toString(36).substr(2, 9),
        escolaId,
        atividadesEntregues: 0,
        ...formData
      } as Aluno;
      setAlunos(prev => [...prev, novo]);
    }
    setShowModal(false);
  };

  const filteredAlunos = alunos.filter(a => 
    a.escolaId === escolaId && 
    (a.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
     a.responsavelNome.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Gerenciamento de Alunos</h2>
          <p className="text-slate-500 font-medium">Cadastre e gerencie a ficha técnica dos estudantes.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-200"
        >
          <Plus size={20} />
          Novo Aluno
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou responsável..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100 transition-all font-semibold text-sm">
            <Filter size={18} />
            Filtrar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Estudante</th>
                <th className="px-8 py-5">Matrícula</th>
                <th className="px-8 py-5">Turma/Turno</th>
                <th className="px-8 py-5">Status/Perfil</th>
                <th className="px-8 py-5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlunos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-300">
                      <Search size={48} strokeWidth={1} />
                      <p className="font-bold">Nenhum aluno encontrado</p>
                    </div>
                  </td>
                </tr>
              ) : filteredAlunos.map(aluno => {
                const turma = turmas.find(t => t.id === aluno.turmaId);
                return (
                  <tr key={aluno.id} className="hover:bg-slate-50/50 transition-colors group cursor-default">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm">
                          <img src={aluno.foto || `https://ui-avatars.com/api/?name=${aluno.nome}`} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{aluno.nome}</p>
                          <p className="text-xs text-slate-400 font-medium">{aluno.email || 'Sem email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-black text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                        {aluno.matricula || '---'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-slate-700">{turma?.nome || 'Não definido'}</p>
                      <p className="text-[10px] text-emerald-600 font-black uppercase tracking-wider">{turma?.turno || '-'}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black w-fit uppercase tracking-tighter ${
                          aluno.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {aluno.status}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${PERFIL_COLORS[aluno.perfil]}`}></div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">{aluno.perfil}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <button 
                        onClick={() => handleOpenModal(aluno)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                      >
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Editar/Novo Aluno - Redesenhado conforme imagem */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[95vh]">
            
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">{editingAluno ? 'Editar Aluno' : 'Cadastrar Aluno'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-all">
                <X size={24} />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-8 overflow-y-auto space-y-8 flex-1">
              
              {/* Foto Upload Section */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative group">
                  <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 border-4 border-slate-100 shadow-inner overflow-hidden">
                    {formData.foto ? (
                      <img src={formData.foto} className="w-full h-full object-cover" alt="Perfil" />
                    ) : (
                      <div className="flex items-center justify-center bg-blue-50 w-full h-full">
                         <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center">
                            <Plus size={32} className="text-white" />
                         </div>
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-1 right-1 bg-emerald-600 text-white p-2.5 rounded-full shadow-lg border-4 border-white cursor-pointer hover:bg-emerald-700 transition-all">
                    <Upload size={18} />
                    <input type="file" className="hidden" />
                  </label>
                </div>
                <p className="text-sm text-slate-400 font-medium">Clique no ícone para adicionar foto</p>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                
                {/* Nome Completo - Full Width */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700">Nome Completo *</label>
                  <input 
                    type="text" 
                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none transition-all font-medium text-slate-600 bg-slate-50/30"
                    placeholder="ADLA MELISSA SANTOS MARINHO"
                    value={formData.nome}
                    onChange={e => setFormData({...formData, nome: e.target.value})}
                  />
                </div>

                {/* Matricula */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Matrícula *</label>
                  <input 
                    type="text" 
                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none transition-all font-medium text-slate-600 bg-slate-50/30"
                    placeholder="01"
                    value={formData.matricula}
                    onChange={e => setFormData({...formData, matricula: e.target.value})}
                  />
                </div>

                {/* Data de Nascimento */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Data de Nascimento</label>
                  <input 
                    type="date" 
                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none transition-all font-medium text-slate-600 bg-slate-50/30"
                    value={formData.dataNascimento}
                    onChange={e => setFormData({...formData, dataNascimento: e.target.value})}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email</label>
                  <input 
                    type="email" 
                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none transition-all font-medium text-slate-600 bg-slate-50/30"
                    placeholder="email@exemplo.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                {/* Telefone */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Telefone</label>
                  <input 
                    type="tel" 
                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none transition-all font-medium text-slate-600 bg-slate-50/30"
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={e => setFormData({...formData, telefone: e.target.value})}
                  />
                </div>

                {/* Turma */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Turma *</label>
                  <div className="relative">
                    <select 
                      className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 appearance-none focus:border-emerald-500 outline-none transition-all font-medium text-slate-600 bg-slate-50/30 cursor-pointer"
                      value={formData.turmaId}
                      onChange={e => setFormData({...formData, turmaId: e.target.value})}
                    >
                      {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>
                </div>

                {/* Turno */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Turno *</label>
                  <div className="relative">
                    <select 
                      className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 appearance-none focus:border-emerald-500 outline-none transition-all font-medium text-slate-600 bg-slate-50/30 cursor-pointer"
                      value={turmas.find(t => t.id === formData.turmaId)?.turno || Turno.MATUTINO}
                      disabled
                    >
                      {Object.values(Turno).map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>
                </div>

                {/* Nome do Responsável */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Nome do Responsável</label>
                  <input 
                    type="text" 
                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none transition-all font-medium text-slate-600 bg-slate-50/30"
                    value={formData.responsavelNome}
                    onChange={e => setFormData({...formData, responsavelNome: e.target.value})}
                  />
                </div>

                {/* Telefone do Responsável */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Telefone do Responsável</label>
                  <input 
                    type="tel" 
                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none transition-all font-medium text-slate-600 bg-slate-50/30"
                    value={formData.responsavelContato}
                    onChange={e => setFormData({...formData, responsavelContato: e.target.value})}
                  />
                </div>

                {/* Perfil do Aluno */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Perfil do Aluno</label>
                  <div className="relative">
                    <select 
                      className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 appearance-none focus:border-emerald-500 outline-none transition-all font-medium text-slate-600 bg-slate-50/30 cursor-pointer"
                      value={formData.perfil}
                      onChange={e => setFormData({...formData, perfil: e.target.value as PerfilAluno})}
                    >
                      <option value="" disabled>Selecione o perfil</option>
                      {Object.values(PerfilAluno).map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>
                </div>

                {/* Toggles Container */}
                <div className="flex flex-col gap-6 py-4">
                  {/* Aluno Ativo Toggle */}
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <div 
                      onClick={() => setFormData({...formData, status: formData.status === 'Ativo' ? 'Inativo' : 'Ativo'})}
                      className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${formData.status === 'Ativo' ? 'bg-slate-900' : 'bg-slate-200'}`}
                    >
                      <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 transform ${formData.status === 'Ativo' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                    <span className="text-sm font-bold text-slate-700">Aluno Ativo</span>
                  </label>

                  {/* Aluno Laudado Toggle */}
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <div 
                      onClick={() => setFormData({...formData, laudado: formData.laudado === 'Sim' ? 'Não' : 'Sim'})}
                      className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${formData.laudado === 'Sim' ? 'bg-emerald-600' : 'bg-slate-200'}`}
                    >
                      <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 transform ${formData.laudado === 'Sim' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                    <span className="text-sm font-bold text-slate-700">Aluno Laudado</span>
                  </label>
                </div>

              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-8 pt-4 flex justify-end gap-3 bg-white">
              <button 
                onClick={() => setShowModal(false)}
                className="px-8 py-3 bg-white border-2 border-slate-100 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 min-w-[140px]"
              >
                {editingAluno ? 'Atualizar' : 'Cadastrar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlunosView;
