import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Copy, Check, ChevronRight, Crown, Medal, Award } from 'lucide-react';

const leaderboard = [
  { pos: 1, name: 'Carlos M.', points: 87, icon: Crown },
  { pos: 2, name: 'Ana P.', points: 82, icon: Medal },
  { pos: 3, name: 'Rafael S.', points: 78, icon: Award },
  { pos: 4, name: 'Juliana F.', points: 71 },
  { pos: 5, name: 'Pedro L.', points: 65 },
  { pos: 6, name: 'Mariana R.', points: 60 },
  { pos: 7, name: 'Você', points: 54 },
];

const roundMatches = [
  { id: 'b1', home: 'Flamengo', away: 'Palmeiras', date: 'Dom, 16:00' },
  { id: 'b2', home: 'Corinthians', away: 'São Paulo', date: 'Dom, 18:30' },
  { id: 'b3', home: 'Grêmio', away: 'Internacional', date: 'Dom, 16:00' },
  { id: 'b4', home: 'Atlético-MG', away: 'Cruzeiro', date: 'Dom, 19:00' },
  { id: 'b5', home: 'Santos', away: 'Vasco', date: 'Seg, 20:00' },
];

type BolaoTab = 'lobby' | 'palpites' | 'criar';

const BolaoPage = () => {
  const [tab, setTab] = useState<BolaoTab>('lobby');
  const [scores, setScores] = useState<Record<string, { home: string; away: string }>>({});
  const [copied, setCopied] = useState(false);

  const setScore = (id: string, side: 'home' | 'away', val: string) => {
    setScores((prev) => ({
      ...prev,
      [id]: { ...prev[id], [side]: val },
    }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('https://selecaobet.com/bolao/liga/abc123');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { id: BolaoTab; label: string }[] = [
    { id: 'lobby', label: 'Classificação' },
    { id: 'palpites', label: 'Palpites' },
    { id: 'criar', label: 'Criar Liga' },
  ];

  return (
    <div className="pb-20 px-4 pt-2 space-y-4">
      <h1 className="font-display text-xl font-extrabold flex items-center gap-2">
        <Trophy size={22} className="text-primary" /> Bolão
      </h1>

      {/* Tabs */}
      <div className="flex bg-surface-section rounded-xl p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-body font-semibold transition-colors min-h-[44px] ${
              tab === t.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'lobby' && (
        <div className="space-y-4">
          {/* Grand Prize */}
          <div className="bg-accent rounded-2xl p-5 text-center space-y-2">
            <span className="text-3xl">🏆</span>
            <h3 className="font-display text-lg font-bold">Grande Prêmio</h3>
            <p className="font-display text-2xl font-extrabold text-gradient-gold">SUV 0km</p>
            <p className="text-xs font-body text-muted-foreground">Para o 1º lugar da classificação geral</p>
          </div>

          {/* Scoring explanation */}
          <div className="bg-surface-card rounded-xl p-4 space-y-2">
            <h4 className="font-body font-semibold text-sm">Sistema de Pontos</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-body">
              <div className="bg-surface-interactive rounded-lg p-2 text-center">
                <p className="font-display text-lg font-bold text-primary">10</p>
                <p className="text-muted-foreground">Placar exato</p>
              </div>
              <div className="bg-surface-interactive rounded-lg p-2 text-center">
                <p className="font-display text-lg font-bold text-secondary">5</p>
                <p className="text-muted-foreground">Resultado certo</p>
              </div>
              <div className="bg-surface-interactive rounded-lg p-2 text-center">
                <p className="font-display text-lg font-bold text-muted-foreground">3</p>
                <p className="text-muted-foreground">Gols de 1 time</p>
              </div>
              <div className="bg-surface-interactive rounded-lg p-2 text-center">
                <p className="font-display text-lg font-bold text-muted-foreground">0</p>
                <p className="text-muted-foreground">Errado</p>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="space-y-1">
            {leaderboard.map((entry) => (
              <div
                key={entry.pos}
                className={`flex items-center gap-3 rounded-xl p-3 ${
                  entry.name === 'Você' ? 'bg-primary/10' : 'bg-surface-card'
                }`}
              >
                <span className={`w-7 text-center font-display font-bold text-sm ${
                  entry.pos <= 3 ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {entry.pos}
                </span>
                {entry.icon && <entry.icon size={16} className="text-primary" />}
                <span className={`flex-1 font-body text-sm font-medium ${entry.name === 'Você' ? 'text-primary font-bold' : ''}`}>
                  {entry.name}
                </span>
                <span className="font-display font-bold text-sm">{entry.points} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'palpites' && (
        <div className="space-y-4">
          <p className="text-sm font-body text-muted-foreground">Rodada 28 — Brasileirão Série A</p>
          <div className="space-y-3">
            {roundMatches.map((match) => (
              <div key={match.id} className="bg-surface-card rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[0.65rem] text-muted-foreground font-body uppercase tracking-wider">
                    {match.date}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 text-right">
                    <span className="font-body font-semibold text-sm">{match.home}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={scores[match.id]?.home ?? ''}
                      onChange={(e) => setScore(match.id, 'home', e.target.value)}
                      className="w-12 h-12 bg-surface-interactive rounded-lg text-center font-display text-xl font-bold text-foreground outline-none focus:ring-1 focus:ring-primary"
                      placeholder="-"
                    />
                    <span className="text-muted-foreground font-display">×</span>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={scores[match.id]?.away ?? ''}
                      onChange={(e) => setScore(match.id, 'away', e.target.value)}
                      className="w-12 h-12 bg-surface-interactive rounded-lg text-center font-display text-xl font-bold text-foreground outline-none focus:ring-1 focus:ring-primary"
                      placeholder="-"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="font-body font-semibold text-sm">{match.away}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-full bg-primary text-primary-foreground font-display font-bold text-base py-3.5 rounded-xl min-h-[44px] hover:brightness-110 transition-all"
          >
            Confirmar Palpites
          </motion.button>
        </div>
      )}

      {tab === 'criar' && (
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-body font-medium text-muted-foreground">Nome da Liga</label>
              <input
                type="text"
                placeholder="Ex: Liga dos Amigos"
                className="w-full bg-surface-interactive rounded-xl py-3 px-4 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground min-h-[44px]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-body font-medium text-muted-foreground">Senha (opcional)</label>
              <input
                type="password"
                placeholder="Deixe vazio para liga pública"
                className="w-full bg-surface-interactive rounded-xl py-3 px-4 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground min-h-[44px]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-body font-medium text-muted-foreground">Modo de Pontuação</label>
              <div className="flex gap-2">
                <button className="flex-1 bg-primary text-primary-foreground font-body font-semibold text-sm py-3 rounded-xl min-h-[44px]">
                  Clássica
                </button>
                <button className="flex-1 bg-surface-interactive text-muted-foreground font-body font-semibold text-sm py-3 rounded-xl min-h-[44px]">
                  Expert
                </button>
              </div>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-full bg-primary text-primary-foreground font-display font-bold text-base py-3.5 rounded-xl min-h-[44px] hover:brightness-110 transition-all"
          >
            Criar Liga
          </motion.button>

          <div className="bg-surface-card rounded-xl p-4 space-y-3">
            <h4 className="font-body font-semibold text-sm flex items-center gap-2">
              <Users size={16} className="text-primary" />
              Link de Convite
            </h4>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-surface-interactive rounded-lg py-2.5 px-3 text-xs font-body text-muted-foreground truncate">
                selecaobet.com/bolao/liga/abc123
              </div>
              <button onClick={handleCopy} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center bg-primary text-primary-foreground rounded-lg">
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BolaoPage;
