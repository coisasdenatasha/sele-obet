import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Radio, Flame, Trophy, Gift, Zap, LogIn, Play } from 'lucide-react';
import bannerHexa from '@/assets/banner-hexa.jpg';
import bannerOdds from '@/assets/banner-odds.jpg';
import bannerBonus from '@/assets/banner-bonus.jpg';
import bannerLiga from '@/assets/banner-liga.jpg';
import MatchCard from '@/components/MatchCard';
import VisitorBanner from '@/components/VisitorBanner';
import { liveMatches, boostedMatches, upcomingMatches, popularMultiples, heroBanners, competitions, specials } from '@/data/mockData';
import { useBetSlipStore } from '@/store/betSlipStore';
import { useAuthStore } from '@/store/authStore';
import { PageTransition, SectionReveal, staggerContainer, staggerItem } from '@/components/animations';

/* ───────── Section Title (Superbet style - bold uppercase) ───────── */
const SectionTitle = ({ children, icon, action, count }: { children: React.ReactNode; icon?: React.ReactNode; action?: string; count?: number }) => (
  <motion.div
    className="flex items-center justify-between mb-3"
    initial={{ opacity: 0, x: -12 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
  >
    <h2 className="font-display text-base font-extrabold uppercase tracking-wide flex items-center gap-2">
      {icon}
      {children}
      {count !== undefined && (
        <span className="text-destructive font-display text-sm">{count} Eventos</span>
      )}
    </h2>
    {action && (
      <button className="text-xs text-destructive font-body font-semibold flex items-center gap-0.5 min-h-[44px]">
        {action} <ChevronRight size={14} />
      </button>
    )}
  </motion.div>
);

/* ───────── Super Odds Carousel (Superbet style) ───────── */
const SuperOddsCarousel = () => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();
  const addBet = useBetSlipStore((s) => s.addBet);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % boostedMatches.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const match = boostedMatches[current];
  if (!match) return null;

  return (
    <div className="mx-4">
      <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-background rounded-2xl p-4 border border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 opacity-20">
          <Zap size={96} className="text-primary" />
        </div>
        <div className="relative z-10">
          <h3 className="font-display text-2xl font-black italic text-primary uppercase tracking-tight">Super Odds</h3>
          <p className="text-sm font-body text-foreground/70 mt-0.5">Maximize Ganhos Hoje!</p>
          
          <div className="bg-surface-card rounded-xl p-4 mt-3 space-y-2">
            <p className="text-xs font-body text-muted-foreground">{match.league}</p>
            <p className="font-display text-base font-bold">{match.homeTeam} — {match.awayTeam}</p>
            <p className="text-xs font-body text-muted-foreground">Hoje, {match.time}</p>
            
            <div className="mt-2">
              <span className="bg-primary/20 text-primary text-xs font-display font-bold px-2 py-1 rounded-md italic">SUPER BOOST</span>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => addBet({
                id: match.id,
                match: `${match.homeTeam} vs ${match.awayTeam}`,
                market: 'Super Odds',
                selection: match.homeTeam,
                odds: match.oddsHome,
              })}
              className="w-full mt-3 bg-surface-interactive rounded-xl py-3 flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span className="text-sm font-body text-muted-foreground line-through">{match.originalOddsHome?.toFixed(2)}</span>
              <Flame size={16} className="text-primary" />
              <span className="font-display text-lg font-bold text-primary">{match.oddsHome.toFixed(2)}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ───────── Quick Actions Row (Superbet style circles) ───────── */
const QuickActions = () => {
  const navigate = useNavigate();
  const actions = [
    { label: 'Promoções', icon: Gift, color: 'text-destructive', route: '/' },
    { label: 'Odds Turbo', icon: Zap, color: 'text-primary', route: '/' },
    { label: 'Ao Vivo', icon: Radio, color: 'text-secondary', route: '/ao-vivo' },
    { label: 'Bolão', icon: Trophy, color: 'text-primary', route: '/bolao' },
  ];

  return (
    <div className="flex justify-around px-4">
      {actions.map((a) => (
        <motion.button
          key={a.label}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(a.route)}
          className="flex flex-col items-center gap-1.5"
        >
          <div className="w-14 h-14 rounded-full bg-surface-card flex items-center justify-center">
            <a.icon size={24} className={a.color} />
          </div>
          <span className="text-[0.65rem] font-body font-medium text-foreground/70">{a.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

/* ───────── Live Match Card (Superbet style - detailed) ───────── */
const LiveMatchCardSuperbet = ({ match }: { match: typeof liveMatches[0] }) => {
  const addBet = useBetSlipStore((s) => s.addBet);
  const navigate = useNavigate();
  const matchName = `${match.homeTeam} vs ${match.awayTeam}`;

  return (
    <div className="bg-surface-card rounded-xl overflow-hidden" onClick={() => navigate(`/evento/${match.id}`)}>
      {/* League header */}
      <div className="px-4 pt-3 pb-1 flex items-center gap-2 text-xs font-body text-muted-foreground">
        <span>{match.league}</span>
      </div>
      
      {/* Time indicator */}
      <div className="px-4 py-1 flex items-center gap-2">
        <span className="text-destructive font-display text-xs font-bold">{match.time}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
        <Play size={12} className="text-destructive" />
      </div>
      
      {/* Teams and scores */}
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
      
      {/* Progress bar */}
      <div className="px-4 pb-2">
        <div className="h-0.5 bg-surface-interactive rounded-full overflow-hidden">
          <div className="h-full bg-secondary rounded-full" style={{ width: '60%' }} />
        </div>
      </div>
      
      {/* Odds row */}
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

/* ───────── Tournaments Carousel (Superbet style) ───────── */
const TournamentsCarousel = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
      {competitions.map((comp) => (
        <motion.button
          key={comp.id}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/esportes')}
          className="flex-shrink-0 w-[160px] bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-3 space-y-1 text-left"
        >
          <img src={comp.flag} alt={comp.country} className="w-6 h-4 object-cover rounded" />
          <p className="font-display text-xs font-bold truncate">{comp.name}</p>
          <p className="text-[0.6rem] font-body text-muted-foreground">{comp.country}</p>
        </motion.button>
      ))}
    </div>
  );
};

/* ───────── Betting Tips (Superbet style) ───────── */
const BettingTips = () => {
  const addBet = useBetSlipStore((s) => s.addBet);

  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
      {specials.map((spec) => (
        <div key={spec.id} className="flex-shrink-0 w-[280px] bg-surface-card rounded-xl p-4 space-y-3">
          <p className="text-xs font-body text-muted-foreground">Hoje</p>
          <p className="font-display text-sm font-bold">{spec.title}</p>
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              <span className="text-xs font-body text-foreground/70">{spec.topPick}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              <span className="text-xs font-body text-foreground/70">{spec.market}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-body text-muted-foreground">
              Odds totais @ <span className="font-display font-bold text-foreground">{spec.topOdds.toFixed(2)}</span>
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => addBet({
                id: spec.id,
                match: spec.title,
                market: spec.market,
                selection: spec.topPick,
                odds: spec.topOdds,
              })}
              className="bg-surface-interactive rounded-lg px-4 py-2 text-sm font-display font-bold min-h-[44px] hover:bg-muted transition-colors flex items-center gap-1.5"
            >
              <Receipt size={14} />
              Apostar
            </motion.button>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ───────── Multi Builder Promo (Superbet style) ───────── */
const MultiBuilderPromo = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mx-4">
      <motion.div 
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/esportes')}
        className="bg-gradient-to-br from-destructive/80 via-destructive/60 to-destructive/40 rounded-2xl p-5 cursor-pointer relative overflow-hidden"
      >
        <h3 className="font-display text-xl font-black italic uppercase">Multi Criar Aposta</h3>
        <p className="text-sm font-body text-foreground/80 mt-1">
          Fácil e rápido: crie apostas com os melhores eventos do dia!
        </p>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-sm font-body">15 eventos em 9 esportes</span>
          <span className="font-display font-bold">APOSTAR</span>
          <ChevronRight size={16} />
        </div>
      </motion.div>
    </div>
  );
};

/* ───────── Main Home ───────── */
const HomePage = () => {
  const addBet = useBetSlipStore((s) => s.addBet);
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="space-y-6 pb-20">
        {/* Visitor CTA Banner (Superbet style - teal) */}
        {!isLoggedIn && (
          <SectionReveal>
            <div className="mx-4">
              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/auth')}
                className="w-full bg-secondary rounded-xl p-4 flex items-center gap-3 min-h-[44px]"
              >
                <div className="w-10 h-10 rounded-full bg-secondary-foreground/20 flex items-center justify-center">
                  <LogIn size={20} className="text-secondary-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-display text-base font-bold text-secondary-foreground">Efetue o login ou crie uma conta</p>
                  <p className="text-xs font-body text-secondary-foreground/70">Participe da ação!</p>
                </div>
                <ChevronRight size={20} className="text-secondary-foreground" />
              </motion.button>
            </div>
          </SectionReveal>
        )}

        {/* Super Odds section */}
        <SectionReveal>
          <SuperOddsCarousel />
        </SectionReveal>

        {/* Quick Actions */}
        <SectionReveal delay={0.05}>
          <QuickActions />
        </SectionReveal>

        {/* Ao Vivo Popular */}
        <SectionReveal delay={0.1}>
          <section className="px-4">
            <SectionTitle icon={<Radio size={20} className="text-destructive" />}>
              Ao Vivo Popular
            </SectionTitle>
          </section>
          <div className="px-4 space-y-3">
            <motion.div className="space-y-3" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}>
              {liveMatches.slice(0, 2).map((match) => (
                <motion.div key={match.id} variants={staggerItem}>
                  <LiveMatchCardSuperbet match={match} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </SectionReveal>

        {/* Dicas de Aposta Populares */}
        <SectionReveal delay={0.1}>
          <section className="px-4">
            <SectionTitle icon={<Flame size={20} className="text-destructive" />}>
              Dicas de Aposta Populares
            </SectionTitle>
          </section>
          <BettingTips />
        </SectionReveal>

        {/* Torneios Populares */}
        <SectionReveal delay={0.1}>
          <section className="px-4">
            <SectionTitle icon={<Trophy size={20} className="text-destructive" />} action="Ver tudo">
              Torneios Populares
            </SectionTitle>
          </section>
          <TournamentsCarousel />
        </SectionReveal>

        {/* Multi Criar Aposta */}
        <SectionReveal delay={0.1}>
          <MultiBuilderPromo />
        </SectionReveal>

        {/* Em Jogo - Ao Vivo */}
        <SectionReveal delay={0.1}>
          <section className="px-4">
            <SectionTitle 
              icon={<Radio size={20} className="text-destructive" />}
              count={liveMatches.length + 140}
            >
              Em Jogo
              <span className="bg-destructive text-destructive-foreground text-[0.6rem] font-display font-bold px-2 py-0.5 rounded-md ml-2">AO VIVO</span>
            </SectionTitle>
          </section>
          <div className="px-4 space-y-3">
            <motion.div className="space-y-3" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}>
              {liveMatches.map((match) => (
                <motion.div key={match.id} variants={staggerItem}>
                  <LiveMatchCardSuperbet match={match} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </SectionReveal>

        {/* Múltiplas Populares */}
        <SectionReveal delay={0.1}>
          <section className="px-4">
            <SectionTitle icon={<Trophy size={20} className="text-primary" />}>
              Múltiplas Populares
            </SectionTitle>
            <div className="space-y-3">
              {popularMultiples.map((multi) => (
                <div key={multi.id} className="bg-surface-card rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-sm font-bold">{multi.title}</h3>
                    <span className="bg-secondary/20 text-secondary text-[0.65rem] font-display font-bold px-2 py-0.5 rounded-full">
                      {multi.bonus} Bônus
                    </span>
                  </div>
                  <div className="space-y-2">
                    {multi.picks.map((pick, i) => (
                      <div key={i} className="flex items-center justify-between text-sm font-body">
                        <div>
                          <span className="text-muted-foreground text-xs">{pick.match}</span>
                          <p className="font-medium">{pick.selection}</p>
                        </div>
                        <span className="font-display text-primary font-bold">{pick.odds.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-[0.65rem] text-muted-foreground font-body">Odds totais</span>
                      <p className="font-display text-xl font-bold text-primary">{multi.totalOdds.toFixed(2)}</p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        multi.picks.forEach((pick, i) => {
                          addBet({
                            id: `${multi.id}-${i}`,
                            match: pick.match,
                            market: 'Múltipla',
                            selection: pick.selection,
                            odds: pick.odds,
                          });
                        });
                      }}
                      className="bg-primary text-primary-foreground font-display font-bold text-sm px-5 py-2.5 rounded-lg min-h-[44px] hover:brightness-110 transition-all"
                    >
                      Adicionar ao Cupom
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </SectionReveal>

        {/* Próximos Jogos */}
        <SectionReveal>
          <section className="px-4">
            <SectionTitle icon={<Zap size={20} className="text-primary" />} action="Ver Todos">
              Próximos Jogos
            </SectionTitle>
            <motion.div className="bg-surface-card rounded-xl overflow-hidden" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-2 items-center px-4 py-2 text-[0.6rem] font-body text-muted-foreground uppercase tracking-wider">
                <span>Partida</span>
                <span className="w-12 text-center">1</span>
                <span className="w-12 text-center">X</span>
                <span className="w-12 text-center">2</span>
              </div>
              {upcomingMatches.map((m, i) => (
                <div key={m.id} className={`grid grid-cols-[1fr_auto_auto_auto] gap-x-2 items-center px-4 py-3 ${i > 0 ? 'bg-surface-section' : ''}`}>
                  <div>
                    <p className="text-sm font-body font-semibold">{m.homeTeam} vs {m.awayTeam}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[0.6rem] font-body text-muted-foreground">{m.league}</span>
                      <span className="text-[0.6rem] font-body text-muted-foreground">{m.time}</span>
                    </div>
                  </div>
                  {[m.oddsHome, m.oddsDraw, m.oddsAway].map((odd, j) => (
                    <motion.button
                      key={j}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        addBet({
                          id: `${m.id}-${j}`,
                          match: `${m.homeTeam} vs ${m.awayTeam}`,
                          market: 'Resultado',
                          selection: j === 0 ? m.homeTeam : j === 1 ? 'Empate' : m.awayTeam,
                          odds: odd,
                        })
                      }
                      className="w-12 py-1.5 rounded-lg bg-surface-interactive text-center font-display text-sm font-bold text-foreground min-h-[44px] flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      {odd.toFixed(2)}
                    </motion.button>
                  ))}
                </div>
              ))}
            </motion.div>
          </section>
        </SectionReveal>
      </div>
    </PageTransition>
  );
};

export default HomePage;
