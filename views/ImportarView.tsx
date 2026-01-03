
import React, { useState } from 'react';
import { Aluno, Turma, Turno, PerfilAluno } from '../types';
import { Upload, FileDown, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ImportarViewProps {
  setAlunos: React.Dispatch<React.SetStateAction<Aluno[]>>;
  escolaId: string;
  turmas: Turma[];
}

const ImportarView: React.FC<ImportarViewProps> = ({ setAlunos, escolaId, turmas }) => {
  const [dragActive, setDragActive] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleImport = (e: any) => {
    e.preventDefault();
    setImportStatus('idle');
    
    // Simulação de processamento de CSV
    setTimeout(() => {
      // Fixed: Added missing atividadesEntregues field to fix Errors on line 23 and 29
      const mockImported: Aluno[] = [
        { 
          id: 'imp1', escolaId, turmaId: turmas[0]?.id || 't1', nome: 'Aluno Importado 1', 
          status: 'Ativo', laudado: 'Não', perfil: PerfilAluno.BOM, 
          responsavelNome: 'Pai do Aluno 1', responsavelContato: '99999999',
          foto: 'https://picsum.photos/seed/imp1/200/200',
          atividadesEntregues: 0
        },
        { 
          id: 'imp2', escolaId, turmaId: turmas[0]?.id || 't1', nome: 'Aluno Importado 2', 
          status: 'Ativo', laudado: 'Sim', perfil: PerfilAluno.INTERMEDIARIO, 
          responsavelNome: 'Mãe do Aluno 2', responsavelContato: '88888888',
          foto: 'https://picsum.photos/seed/imp2/200/200',
          atividadesEntregues: 0
        }
      ];
      setAlunos(prev => [...prev, ...mockImported]);
      setImportStatus('success');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-10">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Importação em Massa</h2>
        <p className="text-slate-500">Adicione centenas de alunos de uma só vez via planilha Excel ou CSV.</p>
      </div>

      <div className="bg-white rounded-3xl border-2 border-slate-100 p-8 space-y-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-center bg-blue-50 p-6 rounded-2xl border border-blue-100">
           <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
             <FileDown size={32} />
           </div>
           <div className="flex-1">
             <h4 className="font-bold text-blue-900">Baixar Modelo Padrão</h4>
             <p className="text-sm text-blue-700">Utilize nosso modelo para garantir que os dados sejam importados corretamente para o sistema.</p>
           </div>
           <button className="px-6 py-2.5 bg-white text-blue-600 border border-blue-200 rounded-xl font-bold hover:bg-blue-100 transition-all">
             Download .XLSX
           </button>
        </div>

        <form 
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onSubmit={handleImport}
          className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all ${
            dragActive ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="space-y-4">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 group-hover:text-blue-500 transition-colors">
               <Upload size={32} />
             </div>
             <div>
               <p className="text-lg font-bold text-slate-700">Arraste seu arquivo aqui</p>
               <p className="text-sm text-slate-400">ou <span className="text-blue-600 font-bold underline cursor-pointer">procure no computador</span></p>
             </div>
             <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImport} />
          </div>
        </form>

        {importStatus === 'success' && (
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-4 text-emerald-800 animate-in slide-in-from-top duration-300">
            <CheckCircle2 size={24} className="text-emerald-500" />
            <div>
              <p className="font-bold">Importação Concluída!</p>
              <p className="text-sm">Os alunos foram adicionados com sucesso à unidade selecionada.</p>
            </div>
          </div>
        )}

        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
          <AlertCircle className="text-amber-500 shrink-0" size={20} />
          <div className="text-xs text-amber-800 space-y-1">
            <p className="font-bold uppercase tracking-wider">Instruções Importantes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>A coluna "Turma" deve coincidir exatamente com os nomes cadastrados no sistema.</li>
              <li>O campo "Status" aceita apenas os valores: Ativo ou Inativo.</li>
              <li>Arquivos permitidos: .csv, .xls, .xlsx</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportarView;
