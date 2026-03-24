import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Flag, ChevronRight, Star, Flame } from 'lucide-react';

const competitions = [
  { id: 1, name: 'Brasileirão Série A', country: '🇧🇷', matches: 12, hot: true },
  { id: 2, name: 'Copa do Brasil', country: '🇧🇷', matches: 4, hot: false },
  { id: 3, name: 'Libertadores', country: '🌎', matches: 8, hot: true },
  { id: 4, name: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', matches: 10, hot: false },
  { id: 5, name: 'La Liga', country: '🇪🇸', matches: 10, hot: false },
  { id: 6, name: 'Serie A (Itália)', country: '🇮🇹', matches: 10, hot: false },
  { id: 7, name: 'Bundesliga', country: '🇩🇪', matches: 9, hot: false },
  { id: 8, name: 'Ligue 1', country: '🇫🇷', matches: 10, hot: false },
  { id: 9, name: 'Champions League', country: '🇪🇺', matches: 6, hot: true },
  { id: 10, name: 'Copa Sul-Americana', country: '🌎', matches: 4, hot: false },
  { id: 11, name: 'Copa América', country: '🌎', matches: 3, hot: false },
  { id: 12, name: 'Eliminatórias', country: '🌎', matches: 2, hot: true },
];

const calendarDays = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return {
    day: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
    date: d.getDate(),
    full: d.toISOString().split('T')[0],
    matchCount: Math.floor(Math.random() * 15) + 3,
  };
});

const sports = [
  { emoji: '⚽', label: 'Futebol', count: 142 },
  { emoji: '🏀', label: 'Basquete', count: 38 },
  { emoji: '🎾', label: 'Tênis', count: 56 },
  { emoji: '🏐', label: 'Vôlei', count: 22 },
  { emoji: '🏈', label: 'Futebol Americano', count: 12 },
  { emoji: '⚾', label: 'Beisebol', count: 18 },
  { emoji: '🥊', label: 'Boxe/MMA', count: 8 },
  { emoji: '🏎️', label: 'Automobilismo', count: 4 },
  { emoji: '🏓', label: 'Tênis de Mesa', count: 30 },
  { emoji: '🎮', label: 'E-Sports', count: 24 },
  { emoji: '🏊', label: 'Natação', count: 6 },
  { emoji: '🏑', label: 'Hóquei', count: 14 },
];

type Tab = 'esportes' | 'calendario' | 'competicoes';

const EsportesPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('esportes');
  const [selectedDay, setSelectedDay] = useState(calendarDays[0].full);

  const tabs: { id: Tab; label: string; icon: typeof Trophy }[] = [
    { id: 'esportes', label: 'Esportes', icon: Trophy },
    { id: 'calendario', label: 'Calendário', icon: Calendar },
    { id: 'competicoes', label: 'Competições', icon: Flag },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 pt-16">
      {/* Tabs */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur-md px-4 pt-3 pb-2">
        <div className="flex gap-1 bg-surface-section rounded-xl p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-display font-bold transition-all min-h-[44px] ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 mt-4">
        {/* ESPORTES TAB */}
        {activeTab === 'esportes' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {sports.map((sport) => (
              <motion.button
                key={sport.label}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 bg-surface-card rounded-xl px-4 py-3 min-h-[44px] hover:bg-surface-interactive transition-colors"
              >
                <span className="text-2xl">{sport.emoji}</span>
                <div className="flex-1 text-left">
                  <p className="text-sm font-display font-bold text-foreground">{sport.label}</p>
                </div>
                <span className="text-xs font-body text-muted-foreground bg-surface-interactive px-2 py-0.5 rounded-full">
                  {sport.count} eventos
                </span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* CALENDÁRIO TAB */}
        {activeTab === 'calendario' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Day selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {calendarDays.map((d) => (
                <button
                  key={d.full}
                  onClick={() => setSelectedDay(d.full)}
                  className={`flex flex-col items-center min-w-[52px] py-2.5 px-2 rounded-xl transition-all ${
                    selectedDay === d.full
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-surface-card text-muted-foreground'
                  }`}
                >
                  <span className="text-[0.6rem] font-body font-medium uppercase">{d.day}</span>
                  <span className="text-lg font-display font-extrabold">{d.date}</span>
                  <span className="text-[0.55rem] font-body">{d.matchCount} jogos</span>
                </button>
              ))}
            </div>

            {/* Games for selected day */}
            <div className="space-y-2">
              <p className="text-xs font-body text-muted-foreground font-semibold uppercase tracking-wider">
                Jogos do dia
              </p>
              {[
                { time: '16:00', home: 'Flamengo', away: 'Palmeiras', league: 'Brasileirão' },
                { time: '18:30', home: 'Corinthians', away: 'São Paulo', league: 'Brasileirão' },
                { time: '19:00', home: 'Barcelona', away: 'Real Madrid', league: 'La Liga' },
                { time: '20:00', home: 'Grêmio', away: 'Internacional', league: 'Brasileirão' },
                { time: '21:00', home: 'Boca Juniors', away: 'River Plate', league: 'Libertadores' },
                { time: '21:30', home: 'Man City', away: 'Liverpool', league: 'Premier League' },
              ].map((game, i) => (
                <motion.div
                  key={i}
                  whileTap={{ scale: 0.98 }}
                  className="bg-surface-card rounded-xl p-3 flex items-center gap-3"
                >
                  <div className="text-center min-w-[40px]">
                    <p className="text-sm font-display font-bold text-primary">{game.time}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-body font-semibold text-foreground">{game.home} x {game.away}</p>
                    <p className="text-[0.65rem] font-body text-muted-foreground">{game.league}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* COMPETIÇÕES TAB */}
        {activeTab === 'competicoes' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {/* Destaque */}
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
              {competitions.filter(c => c.hot).map((comp) => (
                <motion.button
                  key={comp.id}
                  whileTap={{ scale: 0.96 }}
                  className="flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl px-4 py-3 min-w-[140px] text-left"
                >
                  <div className="flex items-center gap-1 mb-1">
                    <Flame size={14} className="text-primary" />
                    <span className="text-[0.6rem] font-body font-bold text-primary uppercase">Em alta</span>
                  </div>
                  <p className="text-sm font-display font-bold text-foreground">{comp.country} {comp.name}</p>
                  <p className="text-[0.6rem] font-body text-muted-foreground mt-0.5">{comp.matches} jogos</p>
                </motion.button>
              ))}
            </div>

            {/* All competitions */}
            <p className="text-xs font-body text-muted-foreground font-semibold uppercase tracking-wider">
              Todas as competições
            </p>
            {competitions.map((comp) => (
              <motion.button
                key={comp.id}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 bg-surface-card rounded-xl px-4 py-3 min-h-[44px] hover:bg-surface-interactive transition-colors"
              >
                <span className="text-xl">{comp.country}</span>
                <div className="flex-1 text-left">
                  <p className="text-sm font-display font-bold text-foreground">{comp.name}</p>
                  <p className="text-[0.6rem] font-body text-muted-foreground">{comp.matches} jogos disponíveis</p>
                </div>
                {comp.hot && <Star size={14} className="text-primary fill-primary" />}
                <ChevronRight size={16} className="text-muted-foreground" />
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EsportesPage;
