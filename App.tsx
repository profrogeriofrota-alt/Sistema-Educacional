
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Escola, Turma, Disciplina, Aluno, Gabarito, 
  FrequenciaRegistro, NotaBimestre, User, UserRole, 
  Turno, PerfilAluno, FrequenciaStatus, ProvaRealizada, PlanejamentoBNCC, PeriodoBimestral
} from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import AlunosView from './views/AlunosView';
import EscolasView from './views/EscolasView';
import FrequenciaView from './views/FrequenciaView';
import GabaritosView from './views/GabaritosView';
import NotasView from './views/NotasView';
import RelatoriosView from './views/RelatoriosView';
import RankingsView from './views/RankingsView';
import PlanejamentoView from './views/PlanejamentoView';
import ConfigView from './views/ConfigView';
import AnaliseStatusView from './views/AnaliseStatusView';

const LOCAL_STORAGE_KEY = 'educore_pro_data_v5';

const INITIAL_PERIODOS: PeriodoBimestral[] = [
  { bimestre: 1, inicio: '2024-02-01', fim: '2024-04-30' },
  { bimestre: 2, inicio: '2024-05-01', fim: '2024-06-30' },
  { bimestre: 3, inicio: '2024-08-01', fim: '2024-09-30' },
  { bimestre: 4, inicio: '2024-10-01', fim: '2024-12-15' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const loadData = (key: string, defaultValue: any) => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${key}`);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [escolas, setEscolas] = useState<Escola[]>(() => loadData('escolas', []));
  const [turmas, setTurmas] = useState<Turma[]>(() => loadData('turmas', []));
  const [disciplinas] = useState<Disciplina[]>(() => loadData('disciplinas', [
    { id: 'd1', nome: 'Matemática' },
    { id: 'd2', nome: 'Português' },
    { id: 'd3', nome: 'Biologia' },
    { id: 'd4', nome: 'Ciências' }
  ]));

  const [alunos, setAlunos] = useState<Aluno[]>(() => loadData('alunos', []));
  const [frequencias, setFrequencias] = useState<FrequenciaRegistro[]>(() => loadData('frequencias', []));
  const [notas, setNotas] = useState<NotaBimestre[]>(() => loadData('notas', []));
  const [provas, setProvas] = useState<ProvaRealizada[]>(() => loadData('provas', []));
  const [planos, setPlanos] = useState<PlanejamentoBNCC[]>(() => loadData('planos', []));
  const [gabaritos, setGabaritos] = useState<Gabarito[]>(() => loadData('gabaritos', []));
  const [periodos, setPeriodos] = useState<PeriodoBimestral[]>(() => loadData('periodos', INITIAL_PERIODOS));
  
  const [selectedEscolaId, setSelectedEscolaId] = useState(() => loadData('selectedEscolaId', ''));

  const [currentUser] = useState<User>({ 
    id: 'u1', nome: 'Diretor Geral', role: UserRole.ADMIN, escolaId: '',
    permissoes: { podeAlterar: true, podeCriar: true }
  });

  useEffect(() => {
    const data = { escolas, turmas, alunos, frequencias, notas, provas, planos, gabaritos, periodos, selectedEscolaId };
    Object.entries(data).forEach(([k, v]) => localStorage.setItem(`${LOCAL_STORAGE_KEY}_${k}`, JSON.stringify(v)));
  }, [escolas, turmas, alunos, frequencias, notas, provas, planos, gabaritos, periodos, selectedEscolaId]);

  const getBimestrePorData = (data: string): 1 | 2 | 3 | 4 => {
    const d = new Date(data);
    const p = periodos.find(p => d >= new Date(p.inicio) && d <= new Date(p.fim));
    return p ? p.bimestre : 1;
  };

  /**
   * LÓGICA N1: Participação baseada em Frequência Comportamental
   * Base 10.0 - Descontos proporcionais por itens D (Dormindo), A (Fora), C (Celular), AT (Atraso)
   */
  const syncN1 = (alunoId: string, discId: string, bimestre: number) => {
    const alunoFreq = frequencias.filter(f => f.alunoId === alunoId && f.disciplinaId === discId && f.bimestre === bimestre);
    if (alunoFreq.length === 0) return 10.0;
    
    // Filtra apenas itens que influenciam comportamento negativo (D, A, C, AT)
    const negativos = alunoFreq.filter(f => ['D', 'A', 'C', 'AT'].includes(f.status)).length;
    // Total de registros que não são Licença (L) ou Justificada (J)
    const totalConsiderado = alunoFreq.filter(f => !['L', 'J'].includes(f.status)).length;
    
    if (totalConsiderado === 0) return 10.0;

    // Proporção de comportamento positivo
    const positivos = totalConsiderado - negativos;
    const notaFinal = (positivos / totalConsiderado) * 10;
    
    return parseFloat(notaFinal.toFixed(1));
  };

  // Efeito para sincronizar notas automaticamente quando uma prova é corrigida
  useEffect(() => {
    if (provas.length === 0) return;
    const lastProva = provas[provas.length - 1];
    const gabarito = gabaritos.find(g => g.id === lastProva.gabaritoId);
    if (!gabarito) return;

    setNotas(prev => {
      const existingIdx = prev.findIndex(n => n.alunoId === lastProva.alunoId && n.bimestre === gabarito.bimestre && n.disciplinaId === gabarito.disciplinaId);
      const updateField = gabarito.tipoProva === 'Parcial' ? 'provaParcial' : 'provaGlobal';
      
      let updatedList = [...prev];
      if (existingIdx >= 0) {
        const n = updatedList[existingIdx];
        const updatedNota = { 
          ...n, 
          [updateField]: lastProva.notaCalculada,
          n1: syncN1(lastProva.alunoId, gabarito.disciplinaId, gabarito.bimestre)
        };
        updatedNota.media = (updatedNota.n1 + updatedNota.provaParcial + updatedNota.provaGlobal + updatedNota.trabalhos) / 4;
        updatedList[existingIdx] = updatedNota;
      } else {
        const n1 = syncN1(lastProva.alunoId, gabarito.disciplinaId, gabarito.bimestre);
        const parcial = gabarito.tipoProva === 'Parcial' ? lastProva.notaCalculada : 0;
        const global = gabarito.tipoProva === 'Global' ? lastProva.notaCalculada : 0;
        updatedList.push({
          id: Math.random().toString(),
          alunoId: lastProva.alunoId,
          turmaId: gabarito.turmaId,
          disciplinaId: gabarito.disciplinaId,
          bimestre: gabarito.bimestre,
          n1,
          provaParcial: parcial,
          provaGlobal: global,
          trabalhos: 0,
          media: (n1 + parcial + global) / 4
        });
      }
      return updatedList;
    });
  }, [provas]);

  const currentEscola = useMemo(() => escolas.find(e => e.id === selectedEscolaId), [escolas, selectedEscolaId]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-inter">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={currentUser.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          user={currentUser} 
          escolas={escolas} 
          selectedEscolaId={selectedEscolaId} 
          setSelectedEscolaId={setSelectedEscolaId} 
          currentEscola={currentEscola} 
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#fcfdfd]">
          {activeTab === 'dashboard' && <Dashboard alunos={alunos} turmas={turmas} frequencias={frequencias} notas={notas} />}
          {activeTab === 'escolas' && <EscolasView escolas={escolas} setEscolas={setEscolas} />}
          {activeTab === 'alunos' && <AlunosView alunos={alunos} setAlunos={setAlunos} turmas={turmas} escolaId={selectedEscolaId} />}
          {activeTab === 'frequencia' && <FrequenciaView alunos={alunos} turmas={turmas} disciplinas={disciplinas} frequencias={frequencias} setFrequencias={setFrequencias} planos={planos} setPlanos={setPlanos} getBimestrePorData={getBimestrePorData} />}
          {activeTab === 'gabaritos' && <GabaritosView gabaritos={gabaritos} setGabaritos={setGabaritos} disciplinas={disciplinas} turmas={turmas} alunos={alunos} setProvas={setProvas} provas={provas} />}
          {activeTab === 'notas' && <NotasView notas={notas} setNotas={setNotas} alunos={alunos} turmas={turmas} disciplinas={disciplinas} syncN1={syncN1} />}
          {activeTab === 'relatorios' && <RelatoriosView alunos={alunos} turmas={turmas} notas={notas} disciplinas={disciplinas} schools={escolas} currentEscola={currentEscola} />}
          {activeTab === 'analise-status' && <AnaliseStatusView frequencias={frequencias} alunos={alunos} turmas={turmas} periodos={periodos} currentEscola={currentEscola} />}
          {activeTab === 'rankings' && <RankingsView alunos={alunos} notas={notas} turmas={turmas} />}
          {activeTab === 'planejamento' && <PlanejamentoView planos={planos} setPlanos={setPlanos} turmas={turmas} disciplinas={disciplinas} getBimestrePorData={getBimestrePorData} currentEscola={currentEscola} />}
          {activeTab === 'config' && <ConfigView periodos={periodos} setPeriodos={setPeriodos} />}
        </main>
      </div>
    </div>
  );
};

export default App;
