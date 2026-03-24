import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronDown, X, Flame, Trophy,
  CircleDot, Dribbble, CircleEllipsis, Gamepad2, Activity,
  Crosshair, Sword, TableProperties, Joystick, Snowflake,
  Swords, BoxSelect, Hand, Circle, Footprints, Hexagon,
  Diamond, Target, Disc, Bike, Car, Waves, PersonStanding,
  Wind, Gem, Glasses, Zap, Globe, type LucideIcon
} from 'lucide-react';
import { useBetSlipStore } from '@/store/betSlipStore';

// Sport list with Lucide icons
const sportsList: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'futebol', label: 'Futebol', icon: CircleDot },
  { id: 'basquete', label: 'Basquete', icon: Dribbble },
  { id: 'tenis', label: 'Tênis', icon: CircleEllipsis },
  { id: 'esoccer', label: 'e-Soccer', icon: Gamepad2 },
  { id: 'volei', label: 'Vôlei', icon: Activity },
  { id: 'cs2', label: 'Counter-Strike 2', icon: Crosshair },
  { id: 'lol', label: 'League of Legends', icon: Sword },
  { id: 'tenis-mesa', label: 'Tênis de mesa', icon: TableProperties },
  { id: 'ebasketball', label: 'e-Basketball', icon: Joystick },
  { id: 'hoquei', label: 'Hóquei no gelo', icon: Snowflake },
  { id: 'mma', label: 'MMA/UFC', icon: Swords },
  { id: 'boxe', label: 'Boxe', icon: BoxSelect },
  { id: 'handebol', label: 'Handebol', icon: Hand },
  { id: 'rugby', label: 'Rugby', icon: Oval },
  { id: 'futsal', label: 'Futsal', icon: Footprints },
  { id: 'fut-americano', label: 'Futebol Americano', icon: Football },
  { id: 'beisebol', label: 'Beisebol', icon: Diamond },
  { id: 'cricket', label: 'Cricket', icon: Target },
  { id: 'dardos', label: 'Dardos', icon: Target },
  { id: 'sinuca', label: 'Sinuca', icon: Disc },
  { id: 'badminton', label: 'Badminton', icon: Wind },
  { id: 'ciclismo', label: 'Ciclismo', icon: Bike },
  { id: 'automobilismo', label: 'Automobilismo', icon: Car },
  { id: 'f1', label: 'Fórmula 1', icon: Zap },
  { id: 'natacao', label: 'Natação', icon: Waves },
  { id: 'atletismo', label: 'Atletismo', icon: PersonStanding },
  { id: 'surf', label: 'Surf', icon: Waves },
  { id: 'skate', label: 'Skate', icon: Zap },
  { id: 'golf', label: 'Golfe', icon: Globe },
  { id: 'corrida-cavalos', label: 'Corrida de Cavalos', icon: Gem },
  { id: 'valorant', label: 'Valorant', icon: Crosshair },
  { id: 'dota2', label: 'Dota 2', icon: Sword },
  { id: 'starcraft', label: 'StarCraft', icon: Gamepad2 },
  { id: 'kings-glory', label: 'King of Glory', icon: Gamepad2 },
  { id: 'futevolei', label: 'Futevôlei', icon: Activity },
  { id: 'polo-aquatico', label: 'Polo Aquático', icon: Waves },
  { id: 'squash', label: 'Squash', icon: CircleEllipsis },
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

type EventType = { id: string; sport: string; country: string; league: string; time: string; home: string; away: string; oddsHome: number; oddsDraw: number; oddsAway: number };

// Real events per sport
const popularEvents: Record<string, EventType[]> = {
  futebol: [
    { id: 'ev1', sport: 'Futebol', country: 'Brasil', league: 'Brasileirão Série A', time: 'Hoje, 21:30', home: 'Ferroviário CE', away: 'Fortaleza', oddsHome: 4.80, oddsDraw: 3.40, oddsAway: 1.69 },
    { id: 'ev2', sport: 'Futebol', country: 'Brasil', league: 'Brasileirão Série A', time: 'Hoje, 19:00', home: 'Flamengo', away: 'Palmeiras', oddsHome: 2.10, oddsDraw: 3.30, oddsAway: 3.50 },
    { id: 'ev3', sport: 'Futebol', country: 'Brasil', league: 'Copa do Brasil', time: 'Amanhã, 20:00', home: 'Corinthians', away: 'Grêmio', oddsHome: 2.40, oddsDraw: 3.20, oddsAway: 2.90 },
    { id: 'ev4', sport: 'Futebol', country: 'Europa', league: 'Champions League', time: 'Qua, 16:00', home: 'PSG', away: 'Bayern Munich', oddsHome: 2.50, oddsDraw: 3.60, oddsAway: 2.70 },
    { id: 'ev5', sport: 'Futebol', country: 'Brasil', league: 'Brasileirão Série A', time: 'Amanhã, 16:00', home: 'São Paulo', away: 'Santos', oddsHome: 1.85, oddsDraw: 3.50, oddsAway: 4.20 },
  ],
  basquete: [
    { id: 'bk1', sport: 'Basquete', country: 'EUA', league: 'NBA', time: 'Hoje, 22:00', home: 'LA Lakers', away: 'Boston Celtics', oddsHome: 1.90, oddsDraw: 0, oddsAway: 1.95 },
    { id: 'bk2', sport: 'Basquete', country: 'Brasil', league: 'NBB', time: 'Amanhã, 19:30', home: 'Flamengo', away: 'Franca', oddsHome: 1.75, oddsDraw: 0, oddsAway: 2.10 },
    { id: 'bk3', sport: 'Basquete', country: 'EUA', league: 'NBA', time: 'Amanhã, 21:00', home: 'Golden State Warriors', away: 'Milwaukee Bucks', oddsHome: 2.05, oddsDraw: 0, oddsAway: 1.80 },
    { id: 'bk4', sport: 'Basquete', country: 'Europa', league: 'Euroliga', time: 'Qua, 16:30', home: 'Real Madrid', away: 'Barcelona', oddsHome: 1.65, oddsDraw: 0, oddsAway: 2.25 },
  ],
  tenis: [
    { id: 'tn1', sport: 'Tênis', country: 'Internacional', league: 'ATP 1000 Madrid', time: 'Hoje, 14:00', home: 'Carlos Alcaraz', away: 'Novak Djokovic', oddsHome: 1.75, oddsDraw: 0, oddsAway: 2.10 },
    { id: 'tn2', sport: 'Tênis', country: 'Internacional', league: 'WTA Roma', time: 'Hoje, 16:00', home: 'Iga Swiatek', away: 'Aryna Sabalenka', oddsHome: 1.60, oddsDraw: 0, oddsAway: 2.30 },
    { id: 'tn3', sport: 'Tênis', country: 'Internacional', league: 'ATP 500 Barcelona', time: 'Amanhã, 13:00', home: 'Jannik Sinner', away: 'Daniil Medvedev', oddsHome: 1.55, oddsDraw: 0, oddsAway: 2.45 },
  ],
  volei: [
    { id: 'vl1', sport: 'Vôlei', country: 'Brasil', league: 'Superliga Masc.', time: 'Hoje, 19:00', home: 'Sada Cruzeiro', away: 'Taubaté', oddsHome: 1.50, oddsDraw: 0, oddsAway: 2.55 },
    { id: 'vl2', sport: 'Vôlei', country: 'Brasil', league: 'Superliga Fem.', time: 'Amanhã, 20:00', home: 'Praia Clube', away: 'Minas', oddsHome: 1.70, oddsDraw: 0, oddsAway: 2.15 },
    { id: 'vl3', sport: 'Vôlei', country: 'Europa', league: 'Champions League', time: 'Qua, 15:00', home: 'Perugia', away: 'Zenit Kazan', oddsHome: 1.85, oddsDraw: 0, oddsAway: 1.95 },
  ],
  mma: [
    { id: 'mma1', sport: 'MMA', country: 'EUA', league: 'UFC 310', time: 'Sáb, 23:00', home: 'Alex Pereira', away: 'Jamahal Hill', oddsHome: 1.45, oddsDraw: 0, oddsAway: 2.75 },
    { id: 'mma2', sport: 'MMA', country: 'EUA', league: 'UFC 310', time: 'Sáb, 22:00', home: 'Islam Makhachev', away: 'Charles Oliveira', oddsHome: 1.55, oddsDraw: 0, oddsAway: 2.50 },
    { id: 'mma3', sport: 'MMA', country: 'EUA', league: 'UFC Fight Night', time: 'Dom, 20:00', home: 'Amanda Nunes', away: 'Valentina Shevchenko', oddsHome: 2.10, oddsDraw: 0, oddsAway: 1.75 },
  ],
  cs2: [
    { id: 'cs1', sport: 'CS2', country: 'Internacional', league: 'IEM Katowice', time: 'Hoje, 15:00', home: 'NAVI', away: 'FaZe Clan', oddsHome: 1.85, oddsDraw: 0, oddsAway: 1.95 },
    { id: 'cs2a', sport: 'CS2', country: 'Internacional', league: 'BLAST Premier', time: 'Amanhã, 13:00', home: 'G2 Esports', away: 'Team Vitality', oddsHome: 2.10, oddsDraw: 0, oddsAway: 1.75 },
    { id: 'cs3', sport: 'CS2', country: 'Brasil', league: 'FURIA Invitational', time: 'Amanhã, 18:00', home: 'FURIA', away: 'LOUD', oddsHome: 1.70, oddsDraw: 0, oddsAway: 2.15 },
  ],
  lol: [
    { id: 'lol1', sport: 'LoL', country: 'Internacional', league: 'Worlds 2026', time: 'Hoje, 10:00', home: 'T1', away: 'Gen.G', oddsHome: 1.90, oddsDraw: 0, oddsAway: 1.90 },
    { id: 'lol2', sport: 'LoL', country: 'Brasil', league: 'CBLOL', time: 'Sáb, 15:00', home: 'LOUD', away: 'paiN Gaming', oddsHome: 1.60, oddsDraw: 0, oddsAway: 2.30 },
    { id: 'lol3', sport: 'LoL', country: 'Internacional', league: 'LCK', time: 'Amanhã, 08:00', home: 'DRX', away: 'KT Rolster', oddsHome: 1.75, oddsDraw: 0, oddsAway: 2.10 },
  ],
  boxe: [
    { id: 'bx1', sport: 'Boxe', country: 'Internacional', league: 'WBC Heavyweight', time: 'Sáb, 23:00', home: 'Tyson Fury', away: 'Oleksandr Usyk', oddsHome: 2.20, oddsDraw: 15.0, oddsAway: 1.70 },
    { id: 'bx2', sport: 'Boxe', country: 'Internacional', league: 'WBA Super Middle', time: 'Sáb, 22:00', home: 'Canelo Álvarez', away: 'David Benavidez', oddsHome: 1.65, oddsDraw: 18.0, oddsAway: 2.25 },
  ],
  'fut-americano': [
    { id: 'nfl1', sport: 'Fut. Americano', country: 'EUA', league: 'NFL', time: 'Dom, 18:00', home: 'Kansas City Chiefs', away: 'San Francisco 49ers', oddsHome: 1.85, oddsDraw: 0, oddsAway: 2.00 },
    { id: 'nfl2', sport: 'Fut. Americano', country: 'EUA', league: 'NFL', time: 'Dom, 21:30', home: 'Dallas Cowboys', away: 'Philadelphia Eagles', oddsHome: 2.30, oddsDraw: 0, oddsAway: 1.65 },
  ],
  hoquei: [
    { id: 'hk1', sport: 'Hóquei', country: 'EUA/Canadá', league: 'NHL', time: 'Hoje, 21:00', home: 'Toronto Maple Leafs', away: 'Montreal Canadiens', oddsHome: 1.70, oddsDraw: 4.20, oddsAway: 2.20 },
    { id: 'hk2', sport: 'Hóquei', country: 'EUA/Canadá', league: 'NHL', time: 'Amanhã, 22:00', home: 'Edmonton Oilers', away: 'Colorado Avalanche', oddsHome: 1.95, oddsDraw: 3.80, oddsAway: 1.90 },
  ],
  valorant: [
    { id: 'val1', sport: 'Valorant', country: 'Internacional', league: 'VCT Champions', time: 'Hoje, 14:00', home: 'Sentinels', away: 'LOUD', oddsHome: 2.05, oddsDraw: 0, oddsAway: 1.80 },
    { id: 'val2', sport: 'Valorant', country: 'Internacional', league: 'VCT Americas', time: 'Amanhã, 16:00', home: 'MIBR', away: 'Leviatán', oddsHome: 2.40, oddsDraw: 0, oddsAway: 1.58 },
  ],
  rugby: [
    { id: 'rg1', sport: 'Rugby', country: 'Internacional', league: 'Six Nations', time: 'Sáb, 12:00', home: 'Inglaterra', away: 'França', oddsHome: 2.10, oddsDraw: 18.0, oddsAway: 1.75 },
    { id: 'rg2', sport: 'Rugby', country: 'Internacional', league: 'Super Rugby', time: 'Dom, 07:00', home: 'Crusaders', away: 'Blues', oddsHome: 1.90, oddsDraw: 20.0, oddsAway: 1.90 },
  ],
  beisebol: [
    { id: 'bb1', sport: 'Beisebol', country: 'EUA', league: 'MLB', time: 'Hoje, 20:00', home: 'NY Yankees', away: 'LA Dodgers', oddsHome: 1.85, oddsDraw: 0, oddsAway: 2.00 },
    { id: 'bb2', sport: 'Beisebol', country: 'EUA', league: 'MLB', time: 'Amanhã, 19:00', home: 'Houston Astros', away: 'Atlanta Braves', oddsHome: 1.95, oddsDraw: 0, oddsAway: 1.90 },
  ],
  'tenis-mesa': [
    { id: 'tm1', sport: 'Tênis de mesa', country: 'Internacional', league: 'WTT Champions', time: 'Hoje, 11:00', home: 'Fan Zhendong', away: 'Ma Long', oddsHome: 1.80, oddsDraw: 0, oddsAway: 2.00 },
    { id: 'tm2', sport: 'Tênis de mesa', country: 'Brasil', league: 'Liga Nacional', time: 'Amanhã, 14:00', home: 'Hugo Calderano', away: 'Gustavo Tsuboi', oddsHome: 1.40, oddsDraw: 0, oddsAway: 2.90 },
  ],
  dota2: [
    { id: 'dt1', sport: 'Dota 2', country: 'Internacional', league: 'The International', time: 'Hoje, 12:00', home: 'Team Spirit', away: 'Tundra Esports', oddsHome: 1.85, oddsDraw: 0, oddsAway: 1.95 },
    { id: 'dt2', sport: 'Dota 2', country: 'Internacional', league: 'DPC', time: 'Amanhã, 14:00', home: 'OG', away: 'Team Liquid', oddsHome: 2.20, oddsDraw: 0, oddsAway: 1.70 },
  ],
  esoccer: [
    { id: 'es1', sport: 'e-Soccer', country: 'Internacional', league: 'eFootball Pro', time: 'Hoje, 18:00', home: 'Manchester United eSports', away: 'Barcelona eSports', oddsHome: 2.10, oddsDraw: 3.40, oddsAway: 1.80 },
    { id: 'es2', sport: 'e-Soccer', country: 'Internacional', league: 'FIFA eWorld Cup', time: 'Amanhã, 20:00', home: 'Tekkz', away: 'Ollelito', oddsHome: 1.65, oddsDraw: 0, oddsAway: 2.25 },
  ],
  ebasketball: [
    { id: 'eb1', sport: 'e-Basketball', country: 'EUA', league: 'NBA 2K League', time: 'Hoje, 21:00', home: 'Knicks Gaming', away: 'Wizards DG', oddsHome: 1.75, oddsDraw: 0, oddsAway: 2.10 },
  ],
  handebol: [
    { id: 'hb1', sport: 'Handebol', country: 'Europa', league: 'EHF Champions', time: 'Amanhã, 18:00', home: 'Barcelona', away: 'THW Kiel', oddsHome: 1.55, oddsDraw: 8.50, oddsAway: 2.40 },
    { id: 'hb2', sport: 'Handebol', country: 'Europa', league: 'EHF Champions', time: 'Qua, 19:00', home: 'PSG', away: 'Aalborg', oddsHome: 1.45, oddsDraw: 9.00, oddsAway: 2.70 },
  ],
  futsal: [
    { id: 'fs1', sport: 'Futsal', country: 'Brasil', league: 'Liga Nacional', time: 'Hoje, 19:00', home: 'Magnus', away: 'Corinthians', oddsHome: 1.65, oddsDraw: 3.80, oddsAway: 2.20 },
    { id: 'fs2', sport: 'Futsal', country: 'Brasil', league: 'Liga Nacional', time: 'Amanhã, 20:00', home: 'Pato', away: 'Cascavel', oddsHome: 1.80, oddsDraw: 3.50, oddsAway: 2.05 },
  ],
  f1: [
    { id: 'f11', sport: 'Fórmula 1', country: 'Internacional', league: 'GP de Mônaco', time: 'Dom, 10:00', home: 'Max Verstappen', away: 'Lewis Hamilton', oddsHome: 1.90, oddsDraw: 0, oddsAway: 3.50 },
  ],
  automobilismo: [
    { id: 'au1', sport: 'Automobilismo', country: 'Brasil', league: 'Stock Car', time: 'Dom, 14:00', home: 'Gabriel Casagrande', away: 'Daniel Serra', oddsHome: 3.50, oddsDraw: 0, oddsAway: 4.00 },
  ],
  golf: [
    { id: 'gl1', sport: 'Golfe', country: 'EUA', league: 'PGA Tour - Masters', time: 'Dom, 16:00', home: 'Scottie Scheffler', away: 'Rory McIlroy', oddsHome: 2.50, oddsDraw: 0, oddsAway: 5.00 },
  ],
};

const bettingTips = [
  { id: 'tip1', time: 'Hoje, 14:45', home: 'Sport', away: 'Náutico', league: 'Série B', tip: 'Sport vence', odds: 1.85 },
  { id: 'tip2', time: 'Hoje, 16:00', home: 'Flamengo', away: 'Palmeiras', league: 'Brasileirão', tip: 'Ambos marcam', odds: 1.72 },
  { id: 'tip3', time: 'Hoje, 19:00', home: 'Vasco', away: 'Botafogo', league: 'Brasileirão', tip: '+2.5 gols', odds: 2.05 },
  { id: 'tip4', time: 'Amanhã, 16:00', home: 'Barcelona', away: 'Real Madrid', league: 'La Liga', tip: 'Barcelona vence', odds: 2.30 },
];

const competitionsList = [
  { id: 'c1', name: 'Brasileirão Série A', country: 'Brasil', flag: 'https://flagcdn.com/w40/br.png', matches: 38 },
  { id: 'c2', name: 'Copa do Brasil', country: 'Brasil', flag: 'https://flagcdn.com/w40/br.png', matches: 8 },
  { id: 'c3', name: 'Libertadores', country: 'América do Sul', flag: 'https://flagcdn.com/w40/br.png', matches: 12 },
  { id: 'c4', name: 'Champions League', country: 'Europa', flag: 'https://flagcdn.com/w40/eu.png', matches: 16 },
  { id: 'c5', name: 'Premier League', country: 'Inglaterra', flag: 'https://flagcdn.com/w40/gb-eng.png', matches: 24 },
  { id: 'c6', name: 'La Liga', country: 'Espanha', flag: 'https://flagcdn.com/w40/es.png', matches: 18 },
  { id: 'c7', name: 'Serie A', country: 'Itália', flag: 'https://flagcdn.com/w40/it.png', matches: 15 },
  { id: 'c8', name: 'Bundesliga', country: 'Alemanha', flag: 'https://flagcdn.com/w40/de.png', matches: 14 },
  { id: 'c9', name: 'Ligue 1', country: 'França', flag: 'https://flagcdn.com/w40/fr.png', matches: 12 },
  { id: 'c10', name: 'Eliminatórias', country: 'CONMEBOL', flag: 'https://flagcdn.com/w40/br.png', matches: 4 },
];

type Tab = 'social' | 'calendario' | 'competicoes';

const EsportesPage = () => {
  const [selectedSport, setSelectedSport] = useState(sportsList[0]);
  const [sportPickerOpen, setSportPickerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('calendario');
  const [selectedDay, setSelectedDay] = useState(calendarDays[0].key);
  const addBet = useBetSlipStore((s) => s.addBet);

  const events = popularEvents[selectedSport.id] || [];

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
          <img src={selectedSport.img} alt="" className="w-6 h-6" />
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
            className="fixed inset-0 z-50 bg-background overflow-y-auto"
          >
            <div className="flex items-center justify-between px-5 py-4 sticky top-0 bg-background z-10">
              <h2 className="font-display text-xl font-extrabold uppercase">Escolha o esporte</h2>
              <button onClick={() => setSportPickerOpen(false)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <X size={24} className="text-foreground" />
              </button>
            </div>
            <div className="px-4 pb-8 space-y-1.5">
              {sportsList.map((sport) => {
                const isSelected = selectedSport.id === sport.id;
                return (
                  <motion.button
                    key={sport.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setSelectedSport(sport); setSportPickerOpen(false); }}
                    className={`w-full flex items-center gap-3 rounded-xl px-4 py-3.5 min-h-[52px] transition-colors ${
                      isSelected ? 'bg-primary/15' : 'bg-surface-card hover:bg-surface-interactive'
                    }`}
                  >
                    <img src={sport.img} alt={sport.label} className="w-7 h-7 flex-shrink-0" />
                    <span className={`text-sm font-display font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {sport.label}
                    </span>
                    {isSelected && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                    )}
                  </motion.button>
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
                <img src={selectedSport.img} alt="" className="w-5 h-5" />
                <span className="text-sm font-display font-bold text-destructive-foreground">
                  {events.length * 3} eventos em {events.length} competições
                </span>
              </div>
              <span className="text-xs font-display font-bold text-destructive-foreground flex items-center gap-1">
                APOSTAR <ChevronRight size={14} />
              </span>
            </div>

            {/* Popular Events */}
            {events.length > 0 && (
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
                          <img src={selectedSport.img} alt="" className="w-4 h-4" />
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
            )}

            {events.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <img src={selectedSport.img} alt="" className="w-12 h-12 opacity-30 mb-3" />
                <p className="font-display text-sm font-bold text-muted-foreground">Nenhum evento disponível agora</p>
                <p className="text-xs font-body text-muted-foreground mt-1">Volte em breve para novos eventos</p>
              </div>
            )}

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
                <img src={comp.flag} alt={comp.country} className="w-6 h-4 rounded-sm object-cover" />
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
