
import React, { useState } from 'react';
import { Gabarito, Aluno, Disciplina, ProvaRealizada, Turma } from '../types';
import { Plus, Trash2, BrainCircuit, X, ChevronDown, Calendar, Hash, UserCheck, Info } from 'lucide-react';

interface GabaritosViewProps {
  gabaritos: Gabarito[];
  setGabaritos: React.Dispatch<React.SetStateAction<Gabarito[]>>;
  disciplinas: Disciplina[];
  turmas: Turma[];
  alunos: Aluno[];
  provas: ProvaRealizada[];
  setProvas: React.Dispatch<React.SetStateAction<ProvaRealizada[]>>;
}

const GabaritosView: React.FC<GabaritosViewProps> = ({ gabaritos, setGabaritos, disciplinas, turmas, alunos, setProvas, provas }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);
  
  // Estado do Gabarito Mestre (Imagem)
  const [numQuestions, setNumQuestions] = useState(10);
  const [gabaritoForm, setGabaritoForm] = useState<Partial<Gabarito>>({
    nomeProva: '',
    disciplinaId: disciplinas[0]?.id || '',
    turmaId: turmas[0]?.id || '',
    bimestre: 1,
    anoLetivo: 2026,
    dataProva: new Date().toISOString().split('T')[0],
    pontosPorQuestao: 1,
    tipo: 'A',
    tipoProva: 'Parcial',
    respostas: Array(10).fill('')
  });

  // Estado do Lançamento do Aluno (Manual)
  const [correctionForm, setCorrectionForm] = useState({
    alunoId: '',
    gabaritoId: '',
    respostas: [] as string[]
  });

  const selectedAluno = alunos.find(a => a.id === correctionForm.alunoId);
  const selectedGabaritoForCorrection = gabaritos.find(g => g.id === correctionForm.gabaritoId);

  const handleGerarCampos = () => {
    setGabaritoForm(prev => ({
      ...prev,
      respostas: Array(Number(numQuestions)).fill('')
    }));
  };

  const handleSaveGabarito = () => {
    if (!gabaritoForm.nomeProva) return alert("Informe o nome da prova");
    const toAdd: Gabarito = {
      id: Math.random().toString(36).substr(2, 9),
      nomeProva: gabaritoForm.nomeProva!,
      disciplinaId: gabaritoForm.disciplinaId!,
      turmaId: gabaritoForm.turmaId!,
      bimestre: gabaritoForm.bimestre as any,
      anoLetivo: gabaritoForm.anoLetivo!,
      dataProva: gabaritoForm.dataProva!,
      pontosPorQuestao: Number(gabaritoForm.pontosPorQuestao),
      tipo: gabaritoForm.tipo as any,
      tipoProva: gabaritoForm.tipoProva as any,
      respostas: gabaritoForm.respostas!
    };
    setGabaritos([...gabaritos, toAdd]);
    setShowEditor(false);
  };

  const handleCorrectManual = () => {
    const g = gabaritos.find(x => x.id === correctionForm.gabaritoId);
    if (!g) return;

    let corretas = 0;
    correctionForm.respostas.forEach((r, i) => {
      if (r && r.toUpperCase() === g.respostas[i].toUpperCase()) corretas++;
    });

    const notaFinal = Math.min(10, corretas * g.pontosPorQuestao);
    
    setProvas(prev => [...prev, {
      id: Math.random().toString(),
      alunoId: correctionForm.alunoId,
      gabaritoId: g.id,
      respostasAluno: correctionForm.respostas,
      notaCalculada: notaFinal,
      data: new Date().toISOString()
    }]);

    setShowCorrection(false);
    alert(`Nota Lançada: ${notaFinal.toFixed(1)}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Gabaritos & Correção Manual</h2>
          <p className="text-slate-500">Gestão de chaves de resposta e lançamento de provas dos alunos.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowCorrection(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 disabled:opacity-50"
            disabled={gabaritos.length === 0}
          >
            <BrainCircuit size={20} /> Lançar Prova Aluno
          </button>
          <button 
            onClick={() => setShowEditor(true)}
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg"
          >
            <Plus size={20} /> Novo Gabarito
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gabaritos.map(g => (
          <div key={g.id} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
               <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                 {g.tipoProva} - {g.bimestre}º BIM
               </span>
               <button onClick={() => setGabaritos(prev => prev.filter(x => x.id !== g.id))} className="text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
            </div>
            <h4 className="font-black text-slate-800 text-lg mb-1">{g.nomeProva}</h4>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              <span>{disciplinas.find(d => d.id === g.disciplinaId)?.nome}</span>
              <span>•</span>
              <span>{turmas.find(t => t.id === g.turmaId)?.nome}</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5 flex-grow">
               {g.respostas.slice(0, 15).map((r, i) => (
                 <div key={i} className="flex flex-col items-center">
                    <span className="text-[8px] text-slate-300 font-bold">{i+1}</span>
                    <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center font-black text-slate-700 text-xs">
                       {r || '-'}
                    </div>
                 </div>
               ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
               <span className="text-[10px] font-black text-slate-400 uppercase">TIPO {g.tipo}</span>
               <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px]">
                  <UserCheck size={14} /> {provas.filter(p => p.gabaritoId === g.id).length} CORRIGIDAS
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal NOVO GABARITO (IDÊNTICO À IMAGEM) */}
      {showEditor && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            <div className="px-8 py-5 flex items-center justify-between border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Novo Gabarito</h3>
              <button onClick={() => setShowEditor(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>

            <div className="p-8 overflow-y-auto space-y-5 custom-scrollbar">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Nome da Prova *</label>
                <input 
                  type="text" 
                  placeholder="Ex: Prova Bimestral de Matemática"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-600 focus:border-indigo-500 outline-none"
                  value={gabaritoForm.nomeProva}
                  onChange={e => setGabaritoForm({...gabaritoForm, nomeProva: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Disciplina *</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-600 outline-none"
                    value={gabaritoForm.disciplinaId}
                    onChange={e => setGabaritoForm({...gabaritoForm, disciplinaId: e.target.value})}
                  >
                    {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Turma *</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-600 outline-none"
                    value={gabaritoForm.turmaId}
                    onChange={e => setGabaritoForm({...gabaritoForm, turmaId: e.target.value})}
                  >
                    {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Bimestre *</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-600 outline-none"
                    value={gabaritoForm.bimestre}
                    onChange={e => setGabaritoForm({...gabaritoForm, bimestre: Number(e.target.value) as any})}
                  >
                    <option value={1}>1º Bimestre</option>
                    <option value={2}>2º Bimestre</option>
                    <option value={3}>3º Bimestre</option>
                    <option value={4}>4º Bimestre</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Ano Letivo</label>
                  <input type="number" className="w-full border border-slate-200 rounded-xl px-4 py-3" value={gabaritoForm.anoLetivo} onChange={e => setGabaritoForm({...gabaritoForm, anoLetivo: Number(e.target.value)})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Data da Prova</label>
                  <input type="date" className="w-full border border-slate-200 rounded-xl px-4 py-3" value={gabaritoForm.dataProva} onChange={e => setGabaritoForm({...gabaritoForm, dataProva: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Pontos por Questão</label>
                  <input type="number" step="0.1" className="w-full border border-slate-200 rounded-xl px-4 py-3" value={gabaritoForm.pontosPorQuestao} onChange={e => setGabaritoForm({...gabaritoForm, pontosPorQuestao: Number(e.target.value)})} />
                </div>
              </div>

              <div className="flex items-end gap-3 pt-2">
                 <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Número de Questões *</label>
                    <input type="number" className="w-32 border border-slate-200 rounded-xl px-4 py-3" value={numQuestions} onChange={e => setNumQuestions(Number(e.target.value))} />
                 </div>
                 <button onClick={handleGerarCampos} className="px-6 py-3.5 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all text-sm">Gerar Campos</button>
              </div>

              <div className="flex gap-2 pt-2">
                 <button onClick={() => setGabaritoForm({...gabaritoForm, tipo: 'A'})} className={`px-6 py-2.5 rounded-xl font-bold text-sm border-2 ${gabaritoForm.tipo === 'A' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-400 bg-white'}`}>Gabarito Tipo A</button>
                 <button onClick={() => setGabaritoForm({...gabaritoForm, tipo: 'B'})} className={`px-6 py-2.5 rounded-xl font-bold text-sm border-2 ${gabaritoForm.tipo === 'B' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-400 bg-white'}`}>Gabarito Tipo B</button>
              </div>

              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                 {gabaritoForm.respostas?.map((r, i) => (
                   <div key={i} className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold text-slate-300">{i + 1}</span>
                      <input 
                        type="text" maxLength={1}
                        className="w-full text-center border border-slate-200 rounded-lg py-2 font-black uppercase focus:border-indigo-500 bg-slate-50/30"
                        value={r}
                        onChange={e => {
                          const copy = [...gabaritoForm.respostas!];
                          copy[i] = e.target.value.toUpperCase();
                          setGabaritoForm({...gabaritoForm, respostas: copy});
                        }}
                      />
                   </div>
                 ))}
              </div>
            </div>

            <div className="p-8 pt-4 flex justify-end gap-3 border-t border-slate-50">
              <button onClick={() => setShowEditor(false)} className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold">Cancelar</button>
              <button onClick={handleSaveGabarito} className="px-10 py-3 bg-[#e65a2d] text-white rounded-xl font-bold hover:bg-[#d44e23] shadow-lg shadow-orange-100">Cadastrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal LANÇAMENTO MANUAL ALUNO */}
      {showCorrection && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[110] flex items-center justify-center p-4">
           <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                 <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest">Lançar Respostas do Aluno</h3>
                 <button onClick={() => setShowCorrection(false)} className="text-slate-400"><X size={24} /></button>
              </div>
              <div className="p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-slate-500 uppercase">Selecionar Aluno</label>
                       <select className="w-full border-2 border-slate-100 rounded-xl p-3 font-bold" value={correctionForm.alunoId} onChange={e => setCorrectionForm({...correctionForm, alunoId: e.target.value})}>
                          <option value="">Selecione...</option>
                          {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-slate-500 uppercase">Selecionar Prova</label>
                       <select className="w-full border-2 border-slate-100 rounded-xl p-3 font-bold" value={correctionForm.gabaritoId} onChange={e => {
                          const g = gabaritos.find(x => x.id === e.target.value);
                          setCorrectionForm({...correctionForm, gabaritoId: e.target.value, respostas: Array(g?.respostas.length || 0).fill('')});
                       }}>
                          <option value="">Selecione...</option>
                          {gabaritos.map(g => <option key={g.id} value={g.id}>{g.nomeProva}</option>)}
                       </select>
                    </div>
                 </div>

                 {selectedGabaritoForCorrection && (
                   <div className="animate-in fade-in slide-in-from-top-4">
                      <div className="flex items-center gap-2 text-indigo-600 mb-4 pb-2 border-b">
                         <Info size={16} /> <span className="text-[10px] font-black uppercase">Respostas Marcadas no Cartão</span>
                      </div>
                      <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                         {correctionForm.respostas.map((r, i) => (
                           <div key={i} className="flex flex-col items-center">
                              <span className="text-[9px] font-black text-slate-300">{i+1}</span>
                              <input 
                                type="text" maxLength={1}
                                className="w-full text-center border-2 border-slate-100 rounded-lg py-3 font-black uppercase focus:border-indigo-600 bg-white text-indigo-700"
                                value={r}
                                onChange={e => {
                                   const copy = [...correctionForm.respostas];
                                   copy[i] = e.target.value.toUpperCase();
                                   setCorrectionForm({...correctionForm, respostas: copy});
                                }}
                              />
                           </div>
                         ))}
                      </div>
                   </div>
                 )}
              </div>
              <div className="p-8 border-t border-slate-50 flex justify-end gap-3 bg-white">
                 <button onClick={() => setShowCorrection(false)} className="px-8 py-3 bg-slate-50 rounded-xl text-slate-400 font-bold uppercase text-xs">Cancelar</button>
                 <button onClick={handleCorrectManual} disabled={!correctionForm.alunoId || !correctionForm.gabaritoId} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold uppercase text-xs shadow-lg shadow-indigo-100 disabled:opacity-50">Calcular e Lançar no Boletim</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default GabaritosView;
