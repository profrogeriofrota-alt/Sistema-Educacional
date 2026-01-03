
import React from 'react';
import { PeriodoBimestral } from '../types';
import { Settings, Save, Calendar, Info } from 'lucide-react';

interface ConfigViewProps {
  periodos: PeriodoBimestral[];
  setPeriodos: React.Dispatch<React.SetStateAction<PeriodoBimestral[]>>;
}

const ConfigView: React.FC<ConfigViewProps> = ({ periodos, setPeriodos }) => {
  const updatePeriodo = (bimestre: number, field: keyof PeriodoBimestral, value: string) => {
    setPeriodos(prev => prev.map(p => p.bimestre === bimestre ? { ...p, [field]: value } : p));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
           <div className="p-3 bg-slate-100 rounded-2xl text-slate-700">
             <Settings size={24} />
           </div>
           <div>
             <h2 className="text-2xl font-black text-slate-800">Parâmetros do Ano Letivo</h2>
             <p className="text-slate-500">Defina os períodos de cada bimestre para sincronização automática.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {periodos.map((p) => (
            <div key={p.bimestre} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-amber-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                  {p.bimestre}º Bimestre
                </span>
                <Calendar size={18} className="text-slate-300" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Início</label>
                  <input 
                    type="date" 
                    value={p.inicio}
                    onChange={(e) => updatePeriodo(p.bimestre, 'inicio', e.target.value)}
                    className="w-full border-slate-200 rounded-xl font-bold text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Término</label>
                  <input 
                    type="date" 
                    value={p.fim}
                    onChange={(e) => updatePeriodo(p.bimestre, 'fim', e.target.value)}
                    className="w-full border-slate-200 rounded-xl font-bold text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Recuperação (Início)</label>
                    <input 
                      type="date" 
                      value={p.recuperacaoInicio || ''}
                      onChange={(e) => updatePeriodo(p.bimestre, 'recuperacaoInicio', e.target.value)}
                      className="w-full border-slate-200 rounded-xl font-bold text-sm opacity-60"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Recuperação (Fim)</label>
                    <input 
                      type="date" 
                      value={p.recuperacaoFim || ''}
                      onChange={(e) => updatePeriodo(p.bimestre, 'recuperacaoFim', e.target.value)}
                      className="w-full border-slate-200 rounded-xl font-bold text-sm opacity-60"
                    />
                 </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-3xl border border-blue-100 flex gap-4">
          <Info className="text-blue-500 shrink-0" size={20} />
          <p className="text-sm text-blue-800 leading-relaxed">
            <strong>Dica Pedagógica:</strong> As datas inseridas aqui determinam automaticamente em qual bimestre os lançamentos de frequência, planejamento e notas serão alocados. Isso evita erros de preenchimento manual e mantém o histórico íntegro.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfigView;
