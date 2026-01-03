
import React from 'react';
import { Escola, User } from '../types';
import { LogOut, Bell, Search, ChevronDown } from 'lucide-react';

interface HeaderProps {
  user: User;
  escolas: Escola[];
  selectedEscolaId: string;
  setSelectedEscolaId: (id: string) => void;
  currentEscola?: Escola;
}

const Header: React.FC<HeaderProps> = ({ user, escolas, selectedEscolaId, setSelectedEscolaId, currentEscola }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative group">
          <select 
            value={selectedEscolaId}
            onChange={(e) => setSelectedEscolaId(e.target.value)}
            className="appearance-none bg-slate-100 border-none rounded-lg px-4 py-2 pr-10 font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all hover:bg-slate-200 text-sm max-w-[250px] truncate"
          >
            {escolas.map(escola => (
              <option key={escola.id} value={escola.id}>{escola.nome}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>

        {currentEscola && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
            <img src={currentEscola.logo} alt="logo" className="w-6 h-6 rounded-full object-cover" />
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Unidade Selecionada</span>
          </div>
        )}

        <div className="relative flex-1 max-w-md hidden md:block">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Pesquisar alunos, turmas..." 
            className="w-full bg-slate-100 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-700 leading-none">{user.nome}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{user.role}</p>
          </div>
          <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src={`https://ui-avatars.com/api/?name=${user.nome}&background=random`} alt="user" />
          </div>
          <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all ml-2">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
