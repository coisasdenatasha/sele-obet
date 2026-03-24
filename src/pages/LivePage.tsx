import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Video, ChevronDown, Star } from 'lucide-react';
import MatchCard from '@/components/MatchCard';
import { liveMatches } from '@/data/mockData';
import { PageTransition, staggerContainer, staggerItem } from '@/components/animations';
import StreamingSection from '@/components/home/StreamingSection';

const extraLive = [
  {
    id: 'live-4', homeTeam: 'Athletico-PR', awayTeam: 'Coritiba',
    homeScore: 1, awayScore: 0, time: "45'+2", league: 'Brasileirão Série A',
    isLive: true, oddsHome: 1.70, oddsDraw: 3.80, oddsAway: 4.60, sport: 'Futebol',
  },
  {
    id: 'live-5', homeTeam: 'Juventus', awayTeam: 'Inter Milan',
    homeScore: 2, awayScore: 2, time: "71'", league: 'Serie A',
    isLive: true, oddsHome: 3.20, oddsDraw: 2.90, oddsAway: 2.50, sport: 'Futebol',
  },
  {
    id: 'live-6', homeTeam: 'Lakers', awayTeam: 'Warriors',
    homeScore: 89, awayScore: 94, time: "Q3 4:22", league: 'NBA',
    isLive: true, oddsHome: 2.10, oddsDraw: 0, oddsAway: 1.75, sport: 'Basquete',
  },
  {
    id: 'live-7', homeTeam: 'Daniel M. Aguilar', awayTeam: 'Max Houkes',
    homeScore: 1, awayScore: 1, time: "S3", league: 'ATP Challenger',
    isLive: true, oddsHome: 1.78, oddsDraw: 0, oddsAway: 1.97, sport: 'Tênis',
  },
];

const sportTabs = [
  { id: 'all', label: 'Todos os esportes' },
  { id: 'Futebol', label: 'Futebol' },
  { id: 'Basquete', label: 'Basquete' },
  { id: 'Tênis', label: 'Tênis' },
  { id: 'Esports', label: 'e-Sports' },
];

const filterChips = [
  { id: 'live', label: 'Ao vivo', icon: Radio },
  { id: 'video', label: 'Vídeo', icon: Video },
];

const sortOptions = ['Popularidade', 'Horário', 'Liga'];

const LivePage = () => {
  const allLive = [...liveMatches.map(m => ({ ...m, sport: 'Futebol' })), ...extraLive];
  const [activeSport, setActiveSport] = useState('all');
  const [activeFilter, setActiveFilter] = useState('live');
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Popularidade');

  const filtered = activeSport === 'all' ? allLive : allLive.filter(m => m.sport === activeSport);

  return (
    <PageTransition>
      <div className="pb-20">
        {/* Hero gradient header */}
        <div className="relative px-4 pt-3 pb-4" style={{ background: 'linear-gradient(180deg, hsl(0 70% 25%) 0%, hsl(0 0% 7.1%) 100%)' }}>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-2xl font-extrabold text-foreground tracking-tight"
          >
            AO VIVO
          </motion.h1>

          {/* Sport tabs - horizontal scroll */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex gap-1 mt-4 overflow-x-auto scrollbar-none -mx-4 px-4"
          >
            {sportTabs.map((tab) => {
              const isActive = activeSport === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveSport(tab.id)}
                  className={`whitespace-nowrap px-4 py-2.5 text-sm font-body font-semibold min-h-[40px] transition-colors relative ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="sport-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-destructive rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Filter chips */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex gap-2 mt-3"
          >
            {filterChips.map((chip) => {
              const isActive = activeFilter === chip.id;
              const Icon = chip.icon;
              return (
                <motion.button
                  key={chip.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(chip.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-body font-semibold min-h-[36px] transition-colors ${
                    isActive
                      ? 'bg-destructive text-destructive-foreground'
                      : 'bg-surface-card text-muted-foreground'
                  }`}
                >
                  <Icon size={14} />
                  {chip.label}
                </motion.button>
              );
            })}

            {/* Sort dropdown */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-body font-semibold min-h-[36px] bg-surface-card text-muted-foreground transition-colors"
              >
                Ordenar por
                <ChevronDown size={14} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    className="absolute top-full mt-1 left-0 bg-surface-card rounded-xl overflow-hidden z-10 min-w-[150px] shadow-lg"
                  >
                    {sortOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setSortBy(opt); setSortOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-xs font-body min-h-[40px] transition-colors ${
                          sortBy === opt ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-surface-interactive'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Section title */}
        <div className="px-4 pt-4 pb-2">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <Radio size={18} className="text-destructive" />
            <h2 className="font-display text-base font-extrabold uppercase tracking-wide">
              Ao Vivo Popular
            </h2>
            <span className="bg-destructive/15 text-destructive text-[0.6rem] font-display font-bold px-2 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </motion.div>
        </div>

        {/* Match list */}
        <div className="px-4">
          <motion.div className="space-y-3" variants={staggerContainer} initial="hidden" animate="show">
            <AnimatePresence mode="popLayout">
              {filtered.map((match) => (
                <motion.div
                  key={match.id}
                  variants={staggerItem}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <MatchCard {...match} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Radio size={32} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground font-body">Nenhum evento ao vivo neste esporte</p>
            </motion.div>
          )}
        </div>

        {/* Streaming Esportivo */}
        <StreamingSection />
      </div>
    </PageTransition>
  );
};

export default LivePage;
