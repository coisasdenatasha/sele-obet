import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronDown, X, Flame,
  CircleDot, Dribbble, Target, Swords, Zap, Gamepad2,
  Disc3, Crosshair, Trophy, Award
} from 'lucide-react';
import { useBetSlipStore } from '@/store/betSlipStore';

// Sport list with icons
const sportsList = [
  { id: 'futebol', label: 'Futebol', icon: CircleDot },
  { id: 'basquete', label: 'Basquete', icon: Dribbble },
  { id: 'tenis', label: 'Tênis', icon: Disc3 },
  { id: 'esoccer', label: 'e-Soccer', icon: Gamepad2 },
  { id: 'volei', label: 'Vôlei', icon: Target },
  { id: 'cs2', label: 'Counter-Strike 2', icon: Crosshair },
  { id: 'lol', label: 'League of Legends', icon: Swords },
  { id: 'tenis-mesa', label: 'Tênis de mesa', icon: Disc3 },
  { id: 'ebasketball', label: 'e-Basketball', icon: Gamepad2 },
  { id: 'hoquei', label: 'Hóquei no gelo', icon: Zap },
  { id: 'mma', label: 'MMA/UFC', icon: Swords },
  { id: 'boxe', label: 'Boxe', icon: Zap },
  { id: 'handebol', label: 'Handebol', icon: Target },
  { id: 'rugby', label: 'Rugby', icon: CircleDot },
  { id: 'futsal', label: 'Futsal', icon: CircleDot },
  { id: 'fut-americano', label: 'Futebol Americano', icon: CircleDot },
  { id: 'beisebol', label: 'Beisebol', icon: Target },
  { id: 'cricket', label: 'Cricket', icon: Swords },
  { id: 'dardos', label: 'Dardos', icon: Crosshair },
  { id: 'sinuca', label: 'Sinuca', icon: Disc3 },
  { id: 'badminton', label: 'Badminton', icon: Disc3 },
  { id: 'ciclismo', label: 'Ciclismo', icon: Zap },
  { id: 'automobilismo', label: 'Automobilismo', icon: Zap },
  { id: 'f1', label: 'Fórmula 1', icon: Zap },
  { id: 'natacao', label: 'Natação', icon: Target },
  { id: 'atletismo', label: 'Atletismo', icon: Zap },
  { id: 'surf', label: 'Surf', icon: Target },
  { id: 'skate', label: 'Skate', icon: Zap },
  { id: 'golf', label: 'Golfe', icon: Crosshair },
  { id: 'corrida-cavalos', label: 'Corrida de Cavalos', icon: Zap },
  { id: 'valorant', label: 'Valorant', icon: Gamepad2 },
  { id: 'dota2', label: 'Dota 2', icon: Gamepad2 },
  { id: 'starcraft', label: 'StarCraft', icon: Gamepad2 },
  { id: 'kings-glory', label: 'King of Glory', icon: Gamepad2 },
  { id: 'futevolei', label: 'Futevôlei', icon: Target },
  { id: 'polo-aquatico', label: 'Polo Aquático', icon: Target },
  { id: 'squash', label: 'Squash', icon: Disc3 },
  { id: 'esgrima', label: 'Esgrima', icon: Swords },
  { id: 'luta-livre', label: 'Luta Livre', icon: Swords },
];

// Calendar days (real dates)
const buildCalendar = () => {
  const days = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      key: d.toISOString().split('T')[0],
      weekday: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').slice(0, 3),
      dayNum: d.getDate(),
      month: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
    });
  }
  return days;
};
const calendarDays = buildCalendar();

// Mock events per sport
const popularEvents: Record<string, { id: string; sport: string; country: string; league: string; time: string; home: string; away: string; oddsHome: number; oddsDraw: number; oddsAway: number }[]> = {
  futebol: [
    { id: 'ev1', sport: 'Futebol', country: 'Brasil', league: 'Brasileirão Série A', time: 'Hoje, 21:30', home: 'Ferroviário CE', away: 'Fortaleza', oddsHome: 4.80, oddsDraw: 3.40, oddsAway: 1.69 },
    { id: 'ev2', sport: 'Futebol', country: 'Brasil', league: 'Brasileirão Série A', time: 'Hoje, 19:00', home: 'Flamengo', away: 'Palmeiras', oddsHome: 2.10, oddsDraw: 3.30, oddsAway: 3.50 },
    { id: 'ev3', sport: 'Futebol', country: 'Brasil', league: 'Copa do Brasil', time: 'Amanhã, 20:00', home: 'Corinthians', away: 'Grêmio', oddsHome: 2.40, oddsDraw: 3.20, oddsAway: 2.90 },
    { id: 'ev4', sport: 'Futebol', country: 'Europa', league: 'Champions League', time: 'Qua, 16:00', home: 'PSG', away: 'Bayern Munich', oddsHome: 2.50, oddsDraw: 3.60, oddsAway: 2.70 },
  ],
  basquete: [
    { id: 'bk1', sport: 'Basquete', country: 'EUA', league: 'NBA', time: 'Hoje, 22:00', home: 'Lakers', away: 'Celtics', oddsHome: 1.90, oddsDraw: 0, oddsAway: 1.95 },
    { id: 'bk2', sport: 'Basquete', country: 'Brasil', league: 'NBB', time: 'Amanhã, 19:30', home: 'Flamengo', away: 'Franca', oddsHome: 1.75, oddsDraw: 0, oddsAway: 2.10 },
  ],
};

const bettingTips = [
  { id: 'tip1', time: 'Hoje, 14:45', home: 'Sport', away: 'Náutico', league: 'Série B', tip: 'Sport vence', odds: 1.85 },
  { id: 'tip2', time: 'Hoje, 16:00', home: 'Flamengo', away: 'Palmeiras', league: 'Brasileirão', tip: 'Ambos marcam', odds: 1.72 },
  { id: 'tip3', time: 'Hoje, 19:00', home: 'Vasco', away: 'Botafogo', league: 'Brasileirão', tip: '+2.5 gols', odds: 2.05 },
  { id: 'tip4', time: 'Amanhã, 16:00', home: 'Barcelona', away: 'Real Madrid', league: 'La Liga', tip: 'Barcelona vence', odds: 2.30 },
];

const competitionsList = [
  { id: 'c1', name: 'Brasileirão Série A', country: 'Brasil', flag: '🇧🇷', matches: 38 },
  { id: 'c2', name: 'Copa do Brasil', country: 'Brasil', flag: '🇧🇷', matches: 8 },
  { id: 'c3', name: 'Libertadores', country: 'América do Sul', flag: '🌎', matches: 12 },
  { id: 'c4', name: 'Champions League', country: 'Europa', flag: '🇪🇺', matches: 16 },
  { id: 'c5', name: 'Premier League', country: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', matches: 24 },
  { id: 'c6', name: 'La Liga', country: 'Espanha', flag: '🇪🇸', matches: 18 },
  { id: 'c7', name: 'Serie A', country: 'Itália', flag: '🇮🇹', matches: 15 },
  { id: 'c8', name: 'Bundesliga', country: 'Alemanha', flag: '🇩🇪', matches: 14 },
  { id: 'c9', name: 'Ligue 1', country: 'França', flag: '🇫🇷', matches: 12 },
  { id: 'c10', name: 'Eliminatórias', country: 'CONMEBOL', flag: '🌎', matches: 4 },
];

type Tab = 'social' | 'calendario' | 'competicoes';

const EsportesPage = () => {
  const [selectedSport, setSelectedSport] = useState(sportsList[0]);
  const [sportPickerOpen, setSportPickerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('calendario');
  const [selectedDay, setSelectedDay] = useState(calendarDays[0].key);
  const addBet = useBetSlipStore((s) => s.addBet);

  const events = popularEvents[selectedSport.id] || popularEvents.futebol || [];

  const tabList: { id: Tab; label: string }[] = [
    { id: 'social', label: 'Social' },
    { id: 'calendario', label: 'Calendário' },
    { id: 'competicoes', label: 'Competições' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 pt-16">
      {/* Sport selector header */}
      <div className="sticky top-16 z-20 bg-background">
        <button
          onClick={() => setSportPickerOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3 min-h-[44px]"
        >
          <span className="font-display text-lg font-extrabold uppercase tracking-wide text-foreground">
            {selectedSport.label}
          </span>
          <ChevronDown size={18} className="text-muted-foreground" />
        </button>

        {/* Tabs */}
        <div className="flex px-4">
          {tabList.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-sm font-display font-bold text-center transition-colors relative min-h-[44px] ${
                activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="esportes-tab" className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-destructive rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sport picker modal */}
      <AnimatePresence>
        {sportPickerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background"
          >
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="font-display text-xl font-extrabold uppercase">Escolha o esporte</h2>
              <button onClick={() => setSportPickerOpen(false)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <X size={24} className="text-foreground" />
              </button>
            </div>
            <div className="px-5">
              {sportsList.map((sport) => {
                const Icon = sport.icon;
                return (
                  <button
                    key={sport.id}
                    onClick={() => { setSelectedSport(sport); setSportPickerOpen(false); }}
                    className="w-full flex items-center gap-4 py-4 border-b border-surface-interactive min-h-[52px]"
                  >
                    <Icon size={22} className="text-muted-foreground" />
                    <span className="text-base font-body font-medium text-foreground">{sport.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 mt-2">
        {/* CALENDÁRIO TAB */}
        {activeTab === 'calendario' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Date strip */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4" style={{ WebkitOverflowScrolling: 'touch' }}>
              {calendarDays.map((d) => (
                <button
                  key={d.key}
                  onClick={() => setSelectedDay(d.key)}
                  className={`flex-shrink-0 flex flex-col items-center min-w-[64px] py-2 px-2 rounded-lg transition-all ${
                    selectedDay === d.key
                      ? 'bg-surface-interactive text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  <span className="text-xs font-body font-medium capitalize">{d.weekday} {d.dayNum}. {d.month}</span>
                </button>
              ))}
            </div>

            {/* Event count banner */}
            <div className="bg-destructive rounded-xl px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-display font-bold text-destructive-foreground">
                  {events.length * 3} eventos em {events.length} competições
                </span>
              </div>
              <span className="text-xs font-display font-bold text-destructive-foreground flex items-center gap-1">
                APOSTAR <ChevronRight size={14} />
              </span>
            </div>

            {/* Popular Events */}
            <div className="mt-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Flame size={20} className="text-destructive" />
                  <h3 className="font-display text-lg font-extrabold uppercase">Eventos Populares</h3>
                </div>
                <span className="text-sm font-display font-bold text-destructive">Ver tudo</span>
              </div>

              <div className="space-y-3">
                {events.map((ev) => (
                  <div key={ev.id} className="bg-surface-card rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
                        <CircleDot size={14} className="text-secondary" />
                        <span>{ev.sport}</span>
                        <span>·</span>
                        <span>{ev.country}</span>
                        <span>·</span>
                        <span className="truncate max-w-[80px]">{ev.league}</span>
                      </div>
                      <button className="text-xs font-display font-bold text-primary flex items-center gap-0.5">
                        Criar Aposta <ChevronRight size={12} />
                      </button>
                    </div>
                    <div>
                      <p className="text-[0.65rem] text-muted-foreground font-body">{ev.time}</p>
                      <p className="text-sm font-body font-semibold text-foreground">{ev.home}</p>
                      <p className="text-sm font-body font-semibold text-foreground">{ev.away}</p>
                    </div>
                    <div className="flex gap-2">
                      {[
                        { label: '1', odds: ev.oddsHome, sel: ev.home },
                        ...(ev.oddsDraw > 0 ? [{ label: 'X', odds: ev.oddsDraw, sel: 'Empate' }] : []),
                        { label: '2', odds: ev.oddsAway, sel: ev.away },
                      ].map((o) => (
                        <motion.button
                          key={o.label}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addBet({
                            id: `${ev.id}-${o.label}`,
                            match: `${ev.home} vs ${ev.away}`,
                            market: 'Resultado Final',
                            selection: o.sel,
                            odds: o.odds,
                          })}
                          className="flex-1 bg-surface-interactive rounded-lg py-2.5 flex items-center justify-center gap-2 min-h-[44px] hover:bg-muted transition-colors"
                        >
                          <span className="text-xs font-body text-muted-foreground">{o.label}</span>
                          <span className="text-sm font-display font-extrabold text-foreground">{o.odds.toFixed(2)}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Betting Tips */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Flame size={20} className="text-destructive" />
                <h3 className="font-display text-lg font-extrabold uppercase">Dicas de Aposta Populares</h3>
              </div>
              <div className="flex gap-3 overflow-x-auto -mx-4 px-4 pb-2" style={{ WebkitOverflowScrolling: 'touch' }}>
                {bettingTips.map((tip) => (
                  <motion.button
                    key={tip.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => addBet({
                      id: tip.id,
                      match: `${tip.home} vs ${tip.away}`,
                      market: tip.tip,
                      selection: tip.tip,
                      odds: tip.odds,
                    })}
                    className="flex-shrink-0 bg-surface-card rounded-xl p-3.5 min-w-[200px] text-left space-y-1.5"
                  >
                    <p className="text-[0.6rem] text-muted-foreground font-body">{tip.time}</p>
                    <p className="text-sm font-body font-semibold text-foreground">{tip.home} vs {tip.away}</p>
                    <p className="text-[0.6rem] text-muted-foreground font-body">{tip.league}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-display font-bold text-primary">{tip.tip}</span>
                      <span className="bg-surface-interactive rounded-md px-2 py-1 text-sm font-display font-extrabold text-foreground">
                        {tip.odds.toFixed(2)}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* SOCIAL TAB */}
        {activeTab === 'social' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center">
            <Trophy size={48} className="text-muted-foreground/30 mb-4" />
            <p className="font-display text-lg font-bold text-foreground">Social</p>
            <p className="text-sm font-body text-muted-foreground mt-1">Em breve: veja apostas de outros usuários</p>
          </motion.div>
        )}

        {/* COMPETIÇÕES TAB */}
        {activeTab === 'competicoes' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 mt-2">
            {competitionsList.map((comp) => (
              <motion.button
                key={comp.id}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 bg-surface-card rounded-xl px-4 py-3.5 min-h-[52px] hover:bg-surface-interactive transition-colors"
              >
                <span className="text-xl">{comp.flag}</span>
                <div className="flex-1 text-left">
                  <p className="text-sm font-display font-bold text-foreground">{comp.name}</p>
                  <p className="text-[0.6rem] font-body text-muted-foreground">{comp.country} · {comp.matches} jogos</p>
                </div>
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
