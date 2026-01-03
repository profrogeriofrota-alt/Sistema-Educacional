
export enum Turno {
  MATUTINO = 'Matutino',
  VESPERTINO = 'Vespertino',
  INTEGRAL = 'Integral'
}

export enum PerfilAluno {
  CRITICO = 'CRÍTICO',
  INTERMEDIARIO = 'INTERMEDIÁRIO',
  BOM = 'BOM'
}

export enum FrequenciaStatus {
  P = 'P', // Presente
  F = 'F', // Falta
  J = 'J', // Justificada
  AT = 'AT', // Atraso
  D = 'D', // Dormindo
  A = 'A', // Fora de Sala
  C = 'C', // Uso de Celular
  L = 'L'  // Licença
}

export interface Escola {
  id: string;
  nome: string;
  logo: string;
  status: 'Ativa' | 'Inativa';
}

export interface Turma {
  id: string;
  escolaId: string;
  nome: string;
  turno: Turno;
}

export interface Disciplina {
  id: string;
  nome: string;
}

export interface Aluno {
  id: string;
  escolaId: string;
  turmaId: string;
  nome: string;
  status: 'Ativo' | 'Inativo';
  laudado: 'Sim' | 'Não';
  perfil: PerfilAluno;
  foto?: string;
  responsavelNome: string;
  responsavelContato: string;
  atividadesEntregues: number; // Porcentagem 0-100
  matricula?: string;
  dataNascimento?: string;
  email?: string;
  telefone?: string;
}

export interface Gabarito {
  id: string;
  nomeProva: string;
  disciplinaId: string;
  turmaId: string;
  bimestre: 1 | 2 | 3 | 4;
  anoLetivo: number;
  dataProva: string;
  pontosPorQuestao: number;
  tipo: 'A' | 'B';
  tipoProva: 'Parcial' | 'Global';
  respostas: string[];
}

export interface ProvaRealizada {
  id: string;
  alunoId: string;
  gabaritoId: string;
  respostasAluno: string[];
  notaCalculada: number;
  data: string;
}

export interface PlanejamentoBNCC {
  id: string;
  turmaId: string;
  disciplinaId: string;
  data: string;
  bimestre: 1 | 2 | 3 | 4;
  assunto: string;
  codigosBNCC: string;
  objetivos: string;
  metodologia: string;
  habilidades: string;
  componentesCurriculares?: string;
  competencia?: string;
  atividades?: string;
  avaliacoes?: string;
  interatividade?: string;
  praticasLaboratoriais?: string;
}

export interface FrequenciaRegistro {
  id: string;
  alunoId: string;
  turmaId: string;
  disciplinaId: string;
  data: string;
  status: FrequenciaStatus;
  bimestre: 1 | 2 | 3 | 4;
}

export interface NotaBimestre {
  id: string;
  alunoId: string;
  turmaId: string;
  disciplinaId: string;
  bimestre: 1 | 2 | 3 | 4;
  n1: number; // Participação (Frequência + Atividades)
  provaParcial: number;
  provaGlobal: number;
  trabalhos: number;
  media: number;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  PROFESSOR = 'PROFESSOR',
  PEDAGOGICO = 'PEDAGOGICO'
}

export interface User {
  id: string;
  nome: string;
  role: UserRole;
  escolaId: string;
  permissoes: {
    podeAlterar: boolean;
    podeCriar: boolean;
  };
}

export interface PeriodoBimestral {
  bimestre: 1 | 2 | 3 | 4;
  inicio: string;
  fim: string;
  recuperacaoInicio?: string;
  recuperacaoFim?: string;
}
