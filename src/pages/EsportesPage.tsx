import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Calendar, Flag, ChevronRight, Star, Flame,
  CircleDot, Dribbble, Target, Swords, Zap, Car, Gamepad2,
  Waves, Disc3, Award, Globe, MapPin
} from 'lucide-react';

const competitions = [
  { id: 1, name: 'Brasileirao Serie A', icon: Flag, matches: 12, hot: true },
  { id: 2, name: 'Copa do Brasil', icon: Trophy, matches: 4, hot: false },
  { id: 3, name: 'Libertadores', icon: Globe, matches: 8, hot: true },
  { id: 4, name: 'Premier League', icon: Award, matches: 10, hot: false },
  { id: 5, name: 'La Liga', icon: Star, matches: 10, hot: false },
  { id: 6, name: 'Serie A Italia', icon: Flag, matches: 10, hot: false },
  { id: 7, name: 'Bundesliga', icon: Flag, matches: 9, hot: false },
  { id: 8, name: 'Ligue 1', icon: Flag, matches: 10, hot: false },
  { id: 9, name: 'Champions League', icon: Trophy, matches: 6, hot: true },
  { id: 10, name: 'Copa Sul-Americana', icon: Globe, matches: 4, hot: false },
  { id: 11, name: 'Copa America', icon: Globe, matches: 3, hot: false },
  { id: 12, name: 'Eliminatorias', icon: MapPin, matches: 2, hot: true },
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

const sports: { icon: typeof CircleDot; label: string; count: number }[] = [
  { icon: CircleDot, label: 'Futebol', count: 142 },
  { icon: Dribbble, label: 'Basquete', count: 38 },
  { icon: Disc3, label: 'Tenis', count: 56 },
  { icon: Target, label: 'Volei', count: 22 },
  { icon: Swords, label: 'Futebol Americano', count: 12 },
  { icon: CircleDot, label: 'Beisebol', count: 18 },
  { icon: Zap, label: 'Boxe/MMA', count: 8 },
  { icon: Car, label: 'Automobilismo', count: 4 },
  { icon: Disc3, label: 'Tenis de Mesa', count: 30 },
  { icon: Gamepad2, label: 'E-Sports', count: 24 },
  { icon: Waves, label: 'Natacao', count: 6 },
  { icon: Swords, label: 'Hoquei', count: 14 },
];

type Tab = 'esportes' | 'calendario' | 'competicoes';

const EsportesPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('esportes');
  const [selectedDay, setSelectedDay] = useState(calendarDays[0].full);

  const tabList: { id: Tab; label: string; icon: typeof Trophy }[] = [
    { id: 'esportes', label: 'Esportes', icon: Trophy },
    { id: 'calendario', label: 'Calendario', icon: Calendar },
    { id: 'competicoes', label: 'Competicoes', icon: Flag },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 pt-16">
      {/* Tabs */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur-md px-4 pt-3 pb-2">
        <div className="flex gap-1 bg-surface-section rounded-xl p-1">
          {tabList.map((tab) => {
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
            {sports.map((sport) => {
              const SportIcon = sport.icon;
              return (
                <motion.button
                  key={sport.label}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 bg-surface-card rounded-xl px-4 py-3 min-h-[44px] hover:bg-surface-interactive transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <SportIcon size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-display font-bold text-foreground">{sport.label}</p>
                  </div>
                  <span className="text-xs font-body text-muted-foreground bg-surface-interactive px-2 py-0.5 rounded-full">
                    {sport.count} eventos
                  </span>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </motion.button>
              );
            })}
          </motion.div>
        )}

        {/* CALENDARIO TAB */}
        {activeTab === 'calendario' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2" style={{ WebkitOverflowScrolling: 'touch' }}>
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

            <div className="space-y-2">
              <p className="text-xs font-body text-muted-foreground font-semibold uppercase tracking-wider">
                Jogos do dia
              </p>
              {[
                { time: '16:00', home: 'Flamengo', away: 'Palmeiras', league: 'Brasileirao' },
                { time: '18:30', home: 'Corinthians', away: 'Sao Paulo', league: 'Brasileirao' },
                { time: '19:00', home: 'Barcelona', away: 'Real Madrid', league: 'La Liga' },
                { time: '20:00', home: 'Gremio', away: 'Internacional', league: 'Brasileirao' },
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

        {/* COMPETICOES TAB */}
        {activeTab === 'competicoes' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            <div className="flex gap-2 overflow-x-auto pb-3" style={{ WebkitOverflowScrolling: 'touch' }}>
              {competitions.filter(c => c.hot).map((comp) => {
                const CompIcon = comp.icon;
                return (
                  <motion.button
                    key={comp.id}
                    whileTap={{ scale: 0.96 }}
                    className="flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl px-4 py-3 min-w-[140px] text-left"
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <Flame size={14} className="text-primary" />
                      <span className="text-[0.6rem] font-body font-bold text-primary uppercase">Em alta</span>
                    </div>
                    <p className="text-sm font-display font-bold text-foreground">{comp.name}</p>
                    <p className="text-[0.6rem] font-body text-muted-foreground mt-0.5">{comp.matches} jogos</p>
                  </motion.button>
                );
              })}
            </div>

            <p className="text-xs font-body text-muted-foreground font-semibold uppercase tracking-wider">
              Todas as competicoes
            </p>
            {competitions.map((comp) => {
              const CompIcon = comp.icon;
              return (
                <motion.button
                  key={comp.id}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 bg-surface-card rounded-xl px-4 py-3 min-h-[44px] hover:bg-surface-interactive transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <CompIcon size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-display font-bold text-foreground">{comp.name}</p>
                    <p className="text-[0.6rem] font-body text-muted-foreground">{comp.matches} jogos disponiveis</p>
                  </div>
                  {comp.hot && <Star size={14} className="text-primary fill-primary" />}
                  <ChevronRight size={16} className="text-muted-foreground" />
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EsportesPage;
