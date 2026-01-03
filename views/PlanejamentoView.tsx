
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { PlanejamentoBNCC, Turma, Disciplina, Escola } from '../types';
import { Sparkles, BookOpen, Loader2, X, ChevronDown, Calendar, Plus, Zap, Microscope, ClipboardList, Puzzle } from 'lucide-react';
import ReportHeader from '../components/ReportHeader';

interface PlanejamentoViewProps {
  planos: PlanejamentoBNCC[];
  setPlanos: React.Dispatch<React.SetStateAction<PlanejamentoBNCC[]>>;
  turmas: Turma[];
  disciplinas: Disciplina[];
  getBimestrePorData: (data: string) => 1 | 2 | 3 | 4;
  currentEscola?: Escola;
}

const PlanejamentoView: React.FC<PlanejamentoViewProps> = ({ planos, setPlanos, turmas, disciplinas, getBimestrePorData, currentEscola }) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanejamentoBNCC | null>(null);
  
  const [formData, setFormData] = useState<Partial<PlanejamentoBNCC>>({
    turmaId: turmas[0]?.id || '',
    disciplinaId: disciplinas[0]?.id || '',
    data: new Date().toISOString().split('T')[0],
    assunto: '',
    codigosBNCC: '',
    objetivos: '',
    metodologia: '',
    habilidades: '',
    componentesCurriculares: '',
    competencia: '',
    atividades: '',
    avaliacoes: '',
    interatividade: '',
    praticasLaboratoriais: ''
  });

  const generateAIPlan = async () => {
    if (!formData.assunto) {
      alert("Por favor, informe o assunto da aula primeiro.");
      return;
    }
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const discNome = disciplinas.find(d => d.id === formData.disciplinaId)?.nome || '';
      const turmaNome = turmas.find(t => t.id === formData.turmaId)?.nome || '';
      
      const prompt = `Como um consultor pedagógico mestre em engajamento estudantil e BNCC, elabore um plano de aula completo para a disciplina de ${discNome} para a turma ${turmaNome} sobre o assunto "${formData.assunto}". 
      Retorne em formato JSON estrito com os seguintes campos:
      {
        "codigos": "códigos da BNCC relacionados",
        "objetivos": "objetivo claro e mensurável",
        "componentes": "componentes curriculares envolvidos",
        "competencia": "competência geral ou específica da BNCC",
        "habilidades": "habilidades detalhadas",
        "metodologia": "metodologia com etapas (abertura, desenvolvimento, fechamento)",
        "atividades": "3 ideias criativas de atividades práticas/mão na massa",
        "avaliacoes": "sugestões de exercícios ou formas de avaliar o aprendizado",
        "interatividade": "como transformar a aula em uma experiência interativa e participativa",
        "praticas": "Sugestão de prática laboratorial estilo 'Show de Ciências' SEM materiais de risco, adequada para o nível da turma, focada em observação e participação ativa."
      }`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const data = JSON.parse(response.text || '{}');
      setFormData(prev => ({
        ...prev,
        codigosBNCC: data.codigos || '',
        objetivos: data.objetivos || '',
        componentesCurriculares: data.componentes || '',
        competencia: data.competencia || '',
        habilidades: data.habilidades || '',
        metodologia: data.metodologia || '',
        atividades: data.atividades || '',
        avaliacoes: data.avaliacoes || '',
        interatividade: data.interatividade || '',
        praticasLaboratoriais: data.praticas || ''
      }));
    } catch (e) {
      console.error(e);
      alert("Erro ao gerar plano via IA.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    const newPlan: PlanejamentoBNCC = {
      id: Math.random().toString(36).substr(2, 9),
      bimestre: getBimestrePorData(formData.data || ''),
      ...(formData as any)
    };
    setPlanos(prev => [...prev, newPlan]);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      turmaId: turmas[0]?.id || '',
      disciplinaId: disciplinas[0]?.id || '',
      data: new Date().toISOString().split('T')[0],
      assunto: '',
      codigosBNCC: '',
      objetivos: '',
      metodologia: '',
      habilidades: '',
      componentesCurriculares: '',
      competencia: '',
      atividades: '',
      avaliacoes: '',
      interatividade: '',
      praticasLaboratoriais: ''
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <ReportHeader 
        escola={currentEscola} 
        titulo="Planejamento Pedagógico & Engajamento" 
        subtitulo="Gestão integrada de competências, habilidades e práticas inovadoras (Show de Ciências)."
      />

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest">Banco de Planejamentos</h3>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus size={20} />
          Novo Planejamento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {planos.length === 0 ? (
          <div className="col-span-full bg-slate-50 border-4 border-dashed border-slate-100 rounded-[40px] p-20 text-center">
             <BookOpen className="mx-auto text-slate-200 mb-6" size={64} />
             <p className="text-slate-400 font-black uppercase tracking-widest">Sua biblioteca de planos está vazia.</p>
          </div>
        ) : [...planos].reverse().map(p => (
          <div key={p.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:border-indigo-500 transition-all group flex flex-col h-full">
             <div className="flex justify-between items-start mb-4">
                <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {new Date(p.data).toLocaleDateString('pt-BR')}
                </span>
                <span className="text-[10px] text-slate-400 font-black uppercase">{turmas.find(t => t.id === p.turmaId)?.nome}</span>
             </div>
             <h4 className="font-black text-slate-800 text-lg mb-2 line-clamp-1">{p.assunto}</h4>
             <p className="text-xs text-slate-500 font-medium mb-4 line-clamp-2 flex-grow">{p.objetivos}</p>
             <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                <div className="flex gap-2">
                   {/* Fix: Wrapped icons in span to support 'title' attribute since lucide-react types may not support it directly on the icon component */}
                   {p.praticasLaboratoriais && <span title="Possui Prática Laboratorial"><Microscope size={14} className="text-indigo-500" /></span>}
                   {p.interatividade && <span title="Aula Interativa"><Zap size={14} className="text-amber-500" /></span>}
                </div>
                <button 
                  onClick={() => setSelectedPlan(p)}
                  className="text-indigo-600 hover:text-indigo-800 font-bold text-xs"
                >
                  Ver Detalhes →
                </button>
             </div>
          </div>
        ))}
      </div>

      {/* Modal Novo Planejamento */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[95vh]">
            
            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="text-indigo-500" size={20} />
                <h3 className="text-lg font-bold text-slate-800">Novo Planejamento Diário</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-2">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-5 flex-1 custom-scrollbar bg-slate-50/30">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Turma *</label>
                  <div className="relative">
                    <select 
                      className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 appearance-none focus:border-indigo-500 outline-none transition-all font-medium text-slate-600 bg-white"
                      value={formData.turmaId}
                      onChange={e => setFormData({...formData, turmaId: e.target.value})}
                    >
                      <option value="">Selecione</option>
                      {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Disciplina *</label>
                  <div className="relative">
                    <select 
                      className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 appearance-none focus:border-indigo-500 outline-none transition-all font-medium text-slate-600 bg-white"
                      value={formData.disciplinaId}
                      onChange={e => setFormData({...formData, disciplinaId: e.target.value})}
                    >
                      <option value="">Selecione</option>
                      {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Assunto da Aula *</label>
                <input 
                  type="text" 
                  className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all font-medium text-slate-600 bg-white"
                  placeholder="Ex: Circuitos Elétricos, Cadeia Alimentar..."
                  value={formData.assunto}
                  onChange={e => setFormData({...formData, assunto: e.target.value})}
                />
                <button 
                  onClick={generateAIPlan}
                  disabled={loading || !formData.assunto}
                  className="w-full mt-2 py-3 border-2 border-slate-100 rounded-xl text-slate-500 font-bold text-xs flex items-center justify-center gap-2 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 transition-all bg-white/50"
                >
                  {loading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                  Gerar Plano com IA (Foco em Engajamento)
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Puzzle size={16} className="text-indigo-500" /> Atividades
                  </label>
                  <textarea 
                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all font-medium text-slate-600 bg-white min-h-[100px]"
                    placeholder="Sugestões de atividades mão na massa..."
                    value={formData.atividades}
                    onChange={e => setFormData({...formData, atividades: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <ClipboardList size={16} className="text-indigo-500" /> Avaliações
                  </label>
                  <textarea 
                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all font-medium text-slate-600 bg-white min-h-[100px]"
                    placeholder="Formas de avaliar e exercícios..."
                    value={formData.avaliacoes}
                    onChange={e => setFormData({...formData, avaliacoes: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-amber-700 flex items-center gap-2">
                    <Zap size={16} /> Interatividade
                  </label>
                  <textarea 
                    className="w-full border-2 border-amber-100 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-all font-medium text-slate-600 bg-white min-h-[100px]"
                    placeholder="Sugestões para tornar a aula participativa..."
                    value={formData.interatividade}
                    onChange={e => setFormData({...formData, interatividade: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-indigo-700 flex items-center gap-2">
                    <Microscope size={16} /> Show de Ciências (Prática Segura)
                  </label>
                  <textarea 
                    className="w-full border-2 border-indigo-100 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all font-medium text-slate-600 bg-white min-h-[100px]"
                    placeholder="Práticas laboratoriais sem materiais de risco..."
                    value={formData.praticasLaboratoriais}
                    onChange={e => setFormData({...formData, praticasLaboratoriais: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5 opacity-60">
                <label className="text-sm font-bold text-slate-700">Objetivos e BNCC (Técnico)</label>
                <div className="grid grid-cols-2 gap-3">
                   <input type="text" placeholder="BNCC" className="border border-slate-200 rounded-lg p-2 text-xs" value={formData.codigosBNCC} onChange={e => setFormData({...formData, codigosBNCC: e.target.value})} />
                   <input type="text" placeholder="Componentes" className="border border-slate-200 rounded-lg p-2 text-xs" value={formData.componentesCurriculares} onChange={e => setFormData({...formData, componentesCurriculares: e.target.value})} />
                </div>
                <textarea 
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs min-h-[60px]"
                  placeholder="Habilidades e Metodologia técnica..."
                  value={formData.metodologia}
                  onChange={e => setFormData({...formData, metodologia: e.target.value})}
                />
              </div>

            </div>

            <div className="p-8 pt-4 flex gap-3 bg-white">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 border-2 border-slate-100 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                className="flex-[2] py-3 bg-[#9b9cf0] text-white rounded-xl font-bold hover:bg-[#8a8be6] transition-all shadow-lg shadow-indigo-100"
              >
                Salvar Planejamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalhes do Plano */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
           <div className="bg-white rounded-[40px] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                 <div>
                    <h3 className="text-2xl font-black text-slate-800">{selectedPlan.assunto}</h3>
                    <div className="flex items-center gap-3 mt-1">
                       <span className="text-xs font-black text-indigo-500 uppercase">{disciplinas.find(d => d.id === selectedPlan.disciplinaId)?.nome}</span>
                       <span className="text-xs font-bold text-slate-400">•</span>
                       <span className="text-xs font-bold text-slate-400 uppercase">{turmas.find(t => t.id === selectedPlan.turmaId)?.nome}</span>
                    </div>
                 </div>
                 <button onClick={() => setSelectedPlan(null)} className="p-3 hover:bg-white rounded-2xl transition-all text-slate-400 hover:text-red-500 shadow-sm border border-transparent hover:border-red-100">
                    <X size={24} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <h5 className="font-black text-slate-800 uppercase tracking-widest text-xs flex items-center gap-2">
                          <Puzzle size={16} className="text-indigo-500" /> Atividades Propostas
                       </h5>
                       <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                          {selectedPlan.atividades || "Não informado."}
                       </div>
                    </div>
                    <div className="space-y-4">
                       <h5 className="font-black text-slate-800 uppercase tracking-widest text-xs flex items-center gap-2">
                          <ClipboardList size={16} className="text-indigo-500" /> Avaliação & Exercícios
                       </h5>
                       <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                          {selectedPlan.avaliacoes || "Não informado."}
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="bg-amber-50 rounded-[40px] p-8 border border-amber-100">
                       <h5 className="font-black text-amber-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                          <Zap size={18} /> Dinâmica Interativa (Engajamento)
                       </h5>
                       <p className="text-slate-700 leading-relaxed italic whitespace-pre-line">
                          {selectedPlan.interatividade || "Nenhuma sugestão de interatividade."}
                       </p>
                    </div>

                    <div className="bg-indigo-600 rounded-[40px] p-10 text-white shadow-xl relative overflow-hidden">
                       <Microscope className="absolute -right-10 -bottom-10 text-white/10" size={240} />
                       <h5 className="font-black text-indigo-200 uppercase tracking-widest text-xs mb-4 flex items-center gap-2 relative z-10">
                          <Microscope size={18} /> Laboratório: Show de Ciências (Prática Segura)
                       </h5>
                       <p className="text-lg font-medium leading-relaxed relative z-10 whitespace-pre-line">
                          {selectedPlan.praticasLaboratoriais || "Nenhuma sugestão de laboratório."}
                       </p>
                    </div>
                 </div>

                 <div className="pt-10 border-t border-slate-100">
                    <h5 className="font-black text-slate-400 uppercase tracking-widest text-[10px] mb-6">Informações Técnicas & BNCC</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80">
                       <div className="space-y-2">
                          <p className="text-[10px] font-black text-slate-500 uppercase">Habilidades & Metodologia</p>
                          <p className="text-xs text-slate-600 leading-relaxed">{selectedPlan.metodologia}</p>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[10px] font-black text-slate-500 uppercase">Códigos BNCC</p>
                          <p className="text-xs text-slate-600">{selectedPlan.codigosBNCC}</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                 <button onClick={() => window.print()} className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-all text-sm flex items-center gap-2">
                    Imprimir Plano
                 </button>
                 <button onClick={() => setSelectedPlan(null)} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-sm">
                    Fechar
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PlanejamentoView;
