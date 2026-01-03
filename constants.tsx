
import React from 'react';
import { 
  Users, BookOpen, CheckCircle, BarChart3, School, Calendar, 
  FileSpreadsheet, GraduationCap, Award, Brain, Settings, Activity
} from 'lucide-react';
import { PerfilAluno } from './types';

export const COLORS = {
  primary: '#d97706', // Amber 600
  secondary: '#059669', // Emerald 600
  critical: '#dc2626', // Red 600
  low: '#f97316', // Orange 500
  intermediate: '#eab308', // Yellow 500
  excellent: '#10b981', // Emerald 500
};

export const PERFIL_COLORS = {
  [PerfilAluno.CRITICO]: 'bg-red-500',
  [PerfilAluno.INTERMEDIARIO]: 'bg-yellow-500',
  [PerfilAluno.BOM]: 'bg-emerald-500',
};

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={20} /> },
  { id: 'escolas', label: 'Minhas Unidades', icon: <School size={20} /> },
  { id: 'alunos', label: 'Alunos', icon: <Users size={20} /> },
  { id: 'planejamento', label: 'BNCC & Planos', icon: <Brain size={20} /> },
  { id: 'frequencia', label: 'Frequência', icon: <Calendar size={20} /> },
  { id: 'gabaritos', label: 'Correção IA', icon: <CheckCircle size={20} /> },
  { id: 'notas', label: 'Notas e Boletins', icon: <GraduationCap size={20} /> },
  { id: 'analise-status', label: 'Análise de Status', icon: <Activity size={20} /> },
  { id: 'rankings', label: 'Rankings', icon: <Award size={20} /> },
  { id: 'importar', label: 'Importação', icon: <FileSpreadsheet size={20} /> },
  { id: 'config', label: 'Configurações', icon: <Settings size={20} /> },
];

export const getPerformanceFrame = (nota: number) => {
  if (nota <= 2.5) return { color: 'border-red-600', label: 'MUITO CRÍTICA', width: 'border-[6px]' };
  if (nota <= 5.0) return { color: 'border-orange-500', label: 'BAIXA', width: 'border-[4px]' };
  if (nota <= 7.5) return { color: 'border-yellow-500', label: 'INTERMEDIÁRIA', width: 'border-[3px]' };
  return { color: 'border-emerald-500', label: 'EXCELENTE', width: 'border-[4px]' };
};

export const STATUS_FREQ_CONFIG: Record<string, { label: string, color: string, penalty: boolean }> = {
  P: { label: 'Presente', color: 'bg-emerald-100 text-emerald-700', penalty: false },
  F: { label: 'Falta', color: 'bg-red-100 text-red-700', penalty: false },
  J: { label: 'Justificada', color: 'bg-blue-100 text-blue-700', penalty: false },
  AT: { label: 'Atraso', color: 'bg-amber-100 text-amber-700', penalty: true },
  D: { label: 'Dormindo', color: 'bg-purple-100 text-purple-700', penalty: true },
  A: { label: 'Fora de Sala', color: 'bg-orange-100 text-orange-700', penalty: true },
  C: { label: 'Uso de Celular', color: 'bg-pink-100 text-pink-700', penalty: true },
  L: { label: 'Licença', color: 'bg-slate-100 text-slate-700', penalty: false },
};
