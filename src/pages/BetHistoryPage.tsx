import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, X, Clock, ChevronDown, ChevronUp, Trophy, Calendar } from 'lucide-react';
import { PageTransition, staggerContainer, staggerItem } from '@/components/animations';

type BetStatus = 'won' | 'lost' | 'pending';

interface Bet {
  id: string;
  date: string;
  event: string;
  selection: string;
  odds: number;
  stake: number;
  status: BetStatus;
  payout?: number;
}

const mockBets: Bet[] = [
  { id: '1', date: '2026-03-24', event: 'Flamengo vs Palmeiras', selection: 'Flamengo (Casa)', odds: 2.10, stake: 50, status: 'pending' },
  { id: '2', date: '2026-03-23', event: 'Corinthians vs Santos', selection: 'Ambas Marcam - Sim', odds: 1.85, stake: 30, status: 'won', payout: 55.50 },
  { id: '3', date: '2026-03-22', event: 'São Paulo vs Grêmio', selection: 'Mais de 2.5 gols', odds: 1.95, stake: 40, status: 'lost' },
  { id: '4', date: '2026-03-22', event: 'Botafogo vs Fluminense', selection: 'Empate', odds: 3.20, stake: 25, status: 'won', payout: 80 },
  { id: '5', date: '2026-03-21', event: 'Inter vs Athletico-PR', selection: 'Inter (Casa)', odds: 1.70, stake: 60, status: 'won', payout: 102 },
  { id: '6', date: '2026-03-20', event: 'Cruzeiro vs Vasco', selection: 'Cruzeiro -1.5', odds: 2.50, stake: 35, status: 'lost' },
  { id: '7', date: '2026-03-19', event: 'Bahia vs Fortaleza', selection: 'Fortaleza (Fora)', odds: 2.80, stake: 20, status: 'pending' },
  { id: '8', date: '2026-03-18', event: 'Atlético-MG vs Cuiabá', selection: 'Mais de 1.5 gols', odds: 1.45, stake: 100, status: 'won', payout: 145 },
];

const statusConfig: Record<BetStatus, { label: string; color: string; icon: typeof Check }> = {
  won: { label: 'Ganhou', color: 'text-secondary bg-secondary/15', icon: Check },
  lost: { label: 'Perdeu', color: 'text-destructive bg-destructive/15', icon: X },
  pending: { label: 'Pendente', color: 'text-primary bg-primary/15', icon: Clock },
};

const filters: { id: BetStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'won', label: 'Ganhas' },
  { id: 'lost', label: 'Perdidas' },
  { id: 'pending', label: 'Pendentes' },
];

const BetHistoryPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<BetStatus | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filter === 'all' ? mockBets : mockBets.filter(b => b.status === filter);

  const totalStake = mockBets.reduce((sum, b) => sum + b.stake, 0);
  const totalPayout = mockBets.filter(b => b.status === 'won').reduce((sum, b) => sum + (b.payout || 0), 0);
  const winRate = Math.round((mockBets.filter(b => b.status === 'won').length / mockBets.filter(b => b.status !== 'pending').length) * 100);

  return (
    <PageTransition>
      <div className="pb-20 px-4 pt-2 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground/70 hover:text-foreground">
            <ArrowLeft size={22} />
          </button>
          <h1 className="font-display text-xl font-extrabold">Histórico de Apostas</h1>
        </div>

        {/* Summary Cards */}
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-3 gap-2">
          <motion.div variants={staggerItem} className="bg-surface-card rounded-xl p-3 text-center">
            <p className="font-display text-base font-bold text-primary">R$ {totalStake}</p>
            <p className="text-[0.6rem] text-muted-foreground font-body mt-0.5">Apostado</p>
          </motion.div>
          <motion.div variants={staggerItem} className="bg-surface-card rounded-xl p-3 text-center">
            <p className="font-display text-base font-bold text-secondary">R$ {totalPayout.toFixed(0)}</p>
            <p className="text-[0.6rem] text-muted-foreground font-body mt-0.5">Retorno</p>
          </motion.div>
          <motion.div variants={staggerItem} className="bg-surface-card rounded-xl p-3 text-center">
            <p className="font-display text-base font-bold text-foreground">{winRate}%</p>
            <p className="text-[0.6rem] text-muted-foreground font-body mt-0.5">Taxa Acerto</p>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <div className="flex gap-2">
          {filters.map(f => (
            <motion.button
              key={f.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-body font-semibold min-h-[40px] transition-colors ${
                filter === f.id ? 'bg-primary text-primary-foreground' : 'bg-surface-card text-muted-foreground'
              }`}
            >
              {f.label}
            </motion.button>
          ))}
        </div>

        {/* Bet List */}
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((bet) => {
              const config = statusConfig[bet.status];
              const StatusIcon = config.icon;
              const isExpanded = expandedId === bet.id;

              return (
                <motion.div
                  key={bet.id}
                  variants={staggerItem}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-surface-card rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : bet.id)}
                    className="w-full p-4 flex items-center justify-between min-h-[60px]"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.color}`}>
                        <StatusIcon size={14} />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-sm font-body font-medium text-foreground truncate">{bet.event}</p>
                        <p className="text-[0.65rem] text-muted-foreground font-body">{bet.selection}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <div className="text-right">
                        <p className="text-sm font-display font-bold text-foreground">
                          {bet.status === 'won' ? `+R$ ${(bet.payout! - bet.stake).toFixed(0)}` : `R$ ${bet.stake}`}
                        </p>
                        <p className="text-[0.6rem] text-muted-foreground font-body">@{bet.odds.toFixed(2)}</p>
                      </div>
                      {isExpanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-1 border-t border-foreground/5 space-y-2">
                          <div className="flex justify-between text-xs font-body">
                            <span className="text-muted-foreground flex items-center gap-1"><Calendar size={12} /> Data</span>
                            <span className="text-foreground">{new Date(bet.date).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex justify-between text-xs font-body">
                            <span className="text-muted-foreground">Valor Apostado</span>
                            <span className="text-foreground">R$ {bet.stake.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xs font-body">
                            <span className="text-muted-foreground">Odd</span>
                            <span className="text-primary font-display font-bold">{bet.odds.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xs font-body">
                            <span className="text-muted-foreground">Retorno Potencial</span>
                            <span className="text-foreground">R$ {(bet.stake * bet.odds).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xs font-body">
                            <span className="text-muted-foreground">Status</span>
                            <span className={`px-2 py-0.5 rounded-full text-[0.6rem] font-semibold ${config.color}`}>
                              {config.label}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Trophy size={32} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground font-body">Nenhuma aposta encontrada</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default BetHistoryPage;
