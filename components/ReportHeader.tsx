
import React from 'react';
import { Escola } from '../types';

interface ReportHeaderProps {
  escola?: Escola;
  titulo: string;
  subtitulo?: string;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ escola, titulo, subtitulo }) => {
  if (!escola) return null;

  return (
    <div className="flex items-center gap-6 p-6 mb-8 bg-white rounded-3xl border border-slate-100 shadow-sm print:shadow-none print:border-b-2 print:rounded-none">
      <div className="w-20 h-20 shrink-0 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
        <img src={escola.logo} alt={escola.nome} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{escola.nome}</h2>
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
            escola.status === 'Ativa' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}>
            UNIDADE {escola.status}
          </span>
        </div>
        <div className="h-0.5 bg-amber-500 w-24 mb-2"></div>
        <h3 className="text-lg font-bold text-slate-700">{titulo}</h3>
        {subtitulo && <p className="text-sm text-slate-400 font-medium">{subtitulo}</p>}
      </div>
      <div className="text-right hidden sm:block">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">EduCore Pro</p>
        <p className="text-xs font-bold text-slate-400">{new Date().toLocaleDateString('pt-BR')}</p>
      </div>
    </div>
  );
};

export default ReportHeader;
