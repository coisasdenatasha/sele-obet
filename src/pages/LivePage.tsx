import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Radio, Play, Video, ChevronDown, Star } from 'lucide-react';
import { liveMatches } from '@/data/mockData';
import { useBetSlipStore } from '@/store/betSlipStore';
import { PageTransition, staggerContainer, staggerItem } from '@/components/animations';
import { cn } from '@/lib/utils';

const sportTabs = ['Todos os esportes', 'Futebol', 'Tênis', 'Basquete', 'e-Basketball', 'Ciclismo'];
const filterChips = ['Ao vivo', 'Video', 'Ordenar por'];

const extraLive = [
  {
    id: 'live-4',
    homeTeam: 'Athletico-PR',
    awayTeam: 'Coritiba',
    homeScore: 1,
    awayScore: 0,
    time: "45'+2",
    league: 'Brasileirão Série A',
    isLive: true as const,
    oddsHome: 1.70,
    oddsDraw: 3.80,
    oddsAway: 4.60,
  },
  {
    id: 'live-5',
    homeTeam: 'Juventus',
    awayTeam: 'Inter Milan',
    homeScore: 2,
    awayScore: 2,
    time: "71'",
    league: 'Serie A',
    isLive: true as const,
    oddsHome: 3.20,
    oddsDraw: 2.90,
    oddsAway: 2.50,
  },
];

const LiveMatchCard = ({ match }: { match: typeof liveMatches[0] }) => {
  const addBet = useBetSlipStore((s) => s.addBet);
  const navigate = useNavigate();
  const matchName = `${match.homeTeam} vs ${match.awayTeam}`;

  return (
    <div className="bg-surface-card rounded-xl overflow-hidden" onClick={() => navigate(`/evento/${match.id}`)}>
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
          <span>{match.league}</span>
        </div>
        <Star size={16} className="text-muted-foreground" />
      </div>
      
      <div className="px-4 py-1 flex items-center gap-2">
        <span className="text-destructive font-display text-xs font-bold">{match.time}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
        <Play size={12} className="text-destructive" />
      </div>
      
      <div className="px-4 py-2 space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-body font-bold text-sm">{match.homeTeam}</span>
          <span className="font-display text-base font-bold">{match.homeScore}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-body text-sm text-foreground/70">{match.awayTeam}</span>
          <span className="font-display text-base font-bold">{match.awayScore}</span>
        </div>
      </div>
      
      <div className="px-4 pb-2">
        <div className="h-0.5 bg-surface-interactive rounded-full overflow-hidden">
          <div className="h-full bg-secondary rounded-full" style={{ width: '60%' }} />
        </div>
      </div>
      
      <div className="flex gap-2 px-4 pb-3" onClick={(e) => e.stopPropagation()}>
        {[
          { label: '1', odds: match.oddsHome, sel: match.homeTeam },
          { label: 'X', odds: match.oddsDraw, sel: 'Empate' },
          { label: '2', odds: match.oddsAway, sel: match.awayTeam },
        ].map((o) => (
          <motion.button
            key={o.label}
            whileTap={{ scale: 0.95 }}
            onClick={() => addBet({ id: `${match.id}-${o.label}`, match: matchName, market: 'Resultado', selection: o.sel, odds: o.odds })}
            className="flex-1 bg-surface-interactive rounded-lg py-2 flex items-center justify-between px-3 min-h-[44px] hover:bg-muted transition-colors"
          >
            <span className="text-xs font-body text-muted-foreground">{o.label}</span>
            <span className="font-display text-sm font-bold">{o.odds.toFixed(2)}</span>
          </motion.button>
        ))}
        <button className="bg-surface-interactive rounded-lg px-3 py-2 text-xs font-body text-muted-foreground min-h-[44px]">
          +55
        </button>
      </div>
    </div>
  );
};

const LivePage = () => {
  const allLive = [...liveMatches, ...extraLive];
  const [activeSport, setActiveSport] = useState(0);
  const [activeFilter, setActiveFilter] = useState(0);

  return (
    <PageTransition>
      <div className="space-y-4 pb-20">
        {/* Title */}
        <div className="px-4 pt-2">
          <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight">Ao Vivo</h1>
        </div>

        {/* Sport tabs - horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-4">
          {sportTabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveSport(i)}
              className={cn(
                "flex-shrink-0 pb-2 font-display text-sm font-bold transition-colors relative whitespace-nowrap",
                i === activeSport ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {tab}
              {i === activeSport && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-destructive rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 px-4">
          {filterChips.map((chip, i) => (
            <button
              key={chip}
              onClick={() => setActiveFilter(i)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-body font-medium min-h-[36px] transition-colors flex items-center gap-1",
                i === activeFilter ? 'bg-destructive text-destructive-foreground' : 'bg-surface-interactive text-foreground/70'
              )}
            >
              {chip}
              {chip === 'Ordenar por' && <ChevronDown size={14} />}
            </button>
          ))}
        </div>

        {/* Section title */}
        <div className="px-4 flex items-center gap-2">
          <Radio size={20} className="text-destructive" />
          <h2 className="font-display text-base font-extrabold uppercase">Ao Vivo Popular</h2>
        </div>

        {/* Live matches */}
        <div className="px-4">
          <motion.div className="space-y-3" variants={staggerContainer} initial="hidden" animate="show">
            {allLive.map((match) => (
              <motion.div key={match.id} variants={staggerItem}>
                <LiveMatchCard match={match} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LivePage;
