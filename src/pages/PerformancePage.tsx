import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, Target, Percent, DollarSign } from 'lucide-react';
import { PageTransition, staggerContainer, staggerItem } from '@/components/animations';

const periods = [
  { id: '7d', label: '7 dias' },
  { id: '30d', label: '30 dias' },
  { id: '90d', label: '90 dias' },
  { id: 'all', label: 'Tudo' },
];

const sportStats = [
  { sport: 'Futebol', bets: 89, winRate: 62, profit: 420 },
  { sport: 'Basquete', bets: 32, winRate: 53, profit: -45 },
  { sport: 'Tênis', bets: 21, winRate: 71, profit: 280 },
];

const monthlyData = [
  { month: 'Out', profit: 120 },
  { month: 'Nov', profit: -80 },
  { month: 'Dez', profit: 250 },
  { month: 'Jan', profit: 180 },
  { month: 'Fev', profit: -30 },
  { month: 'Mar', profit: 340 },
];

const PerformancePage = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('30d');

  const maxProfit = Math.max(...monthlyData.map(d => Math.abs(d.profit)));

  return (
    <PageTransition>
      <div className="pb-20 px-4 pt-2 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground/70 hover:text-foreground">
            <ArrowLeft size={22} />
          </button>
          <h1 className="font-display text-xl font-extrabold">Relatório de Desempenho</h1>
        </div>

        {/* Period Filter */}
        <div className="flex gap-2">
          {periods.map(p => (
            <motion.button
              key={p.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPeriod(p.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-body font-semibold min-h-[40px] transition-colors ${
                period === p.id ? 'bg-primary text-primary-foreground' : 'bg-surface-card text-muted-foreground'
              }`}
            >
              {p.label}
            </motion.button>
          ))}
        </div>

        {/* KPIs */}
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-2 gap-2">
          {[
            { label: 'Lucro Total', value: 'R$ 780', icon: DollarSign, positive: true },
            { label: 'ROI', value: '+12.4%', icon: Percent, positive: true },
            { label: 'Taxa de Acerto', value: '58%', icon: Target, positive: true },
            { label: 'Total Apostas', value: '142', icon: BarChart3, positive: true },
          ].map(kpi => (
            <motion.div key={kpi.label} variants={staggerItem} className="bg-surface-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon size={14} className="text-muted-foreground" />
                <span className="text-[0.65rem] text-muted-foreground font-body">{kpi.label}</span>
              </div>
              <p className={`font-display text-lg font-bold ${kpi.positive ? 'text-secondary' : 'text-destructive'}`}>
                {kpi.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Mini Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-card rounded-xl p-4 space-y-3"
        >
          <h3 className="text-xs font-body font-medium text-muted-foreground flex items-center gap-2">
            <BarChart3 size={14} className="text-primary" /> Lucro Mensal
          </h3>
          <div className="flex items-end gap-2 h-28">
            {monthlyData.map((d, i) => {
              const height = (Math.abs(d.profit) / maxProfit) * 100;
              return (
                <motion.div
                  key={d.month}
                  className="flex-1 flex flex-col items-center gap-1"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.3 + i * 0.05, type: 'spring', stiffness: 200 }}
                  style={{ originY: 1 }}
                >
                  <span className={`text-[0.55rem] font-display font-bold ${d.profit >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                    {d.profit > 0 ? '+' : ''}{d.profit}
                  </span>
                  <div
                    className={`w-full rounded-lg ${d.profit >= 0 ? 'bg-secondary/30' : 'bg-destructive/30'}`}
                    style={{ height: `${Math.max(height, 8)}%` }}
                  />
                  <span className="text-[0.55rem] text-muted-foreground font-body">{d.month}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* By Sport */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface-card rounded-xl p-4 space-y-3"
        >
          <h3 className="text-xs font-body font-medium text-muted-foreground flex items-center gap-2">
            <Target size={14} className="text-primary" /> Desempenho por Esporte
          </h3>
          <div className="space-y-3">
            {sportStats.map(s => (
              <div key={s.sport} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-body font-medium text-foreground">{s.sport}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[0.65rem] text-muted-foreground font-body">{s.bets} apostas</span>
                      <span className={`text-xs font-display font-bold flex items-center gap-0.5 ${s.profit >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                        {s.profit >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        R$ {Math.abs(s.profit)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-surface-interactive rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.winRate}%` }}
                      transition={{ delay: 0.4, duration: 0.6, type: 'spring' }}
                      className={`h-full rounded-full ${s.profit >= 0 ? 'bg-secondary' : 'bg-destructive'}`}
                    />
                  </div>
                  <p className="text-[0.6rem] text-muted-foreground font-body mt-1">Taxa de acerto: {s.winRate}%</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default PerformancePage;
