import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import heroBanner from '@/assets/hero-banner.jpg';
import MatchCard from '@/components/MatchCard';
import SportFilter from '@/components/SportFilter';
import VisitorBanner from '@/components/VisitorBanner';
import { liveMatches, boostedMatches, upcomingMatches, popularMultiples, playerProps, heroBanners } from '@/data/mockData';
import { useBetSlipStore } from '@/store/betSlipStore';
import { useAuthStore } from '@/store/authStore';
import { Flame, ChevronRight, Trophy, Gift, Zap, User, Calendar } from 'lucide-react';

const SectionTitle = ({ children, icon, action }: { children: React.ReactNode; icon?: React.ReactNode; action?: string }) => (
  <div className="flex items-center justify-between mb-3">
    <h2 className="font-display text-lg font-bold flex items-center gap-2">
      {icon}
      {children}
    </h2>
    {action && (
      <button className="text-xs text-primary font-body font-semibold flex items-center gap-0.5 min-h-[44px]">
        {action} <ChevronRight size={14} />
      </button>
    )}
  </div>
);

/* ───────── Hero Carousel ───────── */
const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % heroBanners.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, []);

  const accentColors: Record<string, string> = {
    Brasil: 'from-secondary/40 to-accent/60',
    Fogo: 'from-primary/40 to-destructive/40',
    Promo: 'from-primary/30 to-secondary/30',
    Liga: 'from-accent/50 to-secondary/40',
  };

  return (
    <div className="relative overflow-hidden rounded-2xl mx-4">
      <div className="relative h-48 sm:h-56">
        <img src={heroBanner} alt="SeleçãoBet" className="w-full h-full object-cover" />
        <AnimatePresence mode="wait">
          <motion.div
            key={heroBanners[current].id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            className={`absolute inset-0 bg-gradient-to-r ${accentColors[heroBanners[current].accent] || 'from-accent/50 to-background/80'}`}
          >
            <div className="absolute bottom-5 left-5 right-5">
              <span className="text-[0.6rem] font-body font-semibold text-primary uppercase tracking-widest">
                {heroBanners[current].accent}
              </span>
              <h1 className="font-display text-2xl font-extrabold leading-tight mt-1">
                {heroBanners[current].title}
              </h1>
              <p className="text-xs font-body text-foreground/80 mt-1">{heroBanners[current].subtitle}</p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="mt-3 bg-primary text-primary-foreground font-display font-bold text-sm px-5 py-2.5 rounded-lg min-h-[44px] hover:brightness-110 transition-all"
              >
                {heroBanners[current].cta}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Dots */}
      <div className="absolute bottom-2 right-4 flex gap-1.5">
        {heroBanners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-primary w-5' : 'bg-foreground/30'}`}
          />
        ))}
      </div>
    </div>
  );
};

/* ───────── Player Props Carousel ───────── */
const PlayerPropsCarousel = () => {
  const addBet = useBetSlipStore((s) => s.addBet);

  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
      {playerProps.map((p) => (
        <motion.button
          key={p.id}
          whileTap={{ scale: 0.97 }}
          onClick={() =>
            addBet({ id: p.id, match: p.team, market: p.market, selection: p.player, odds: p.odds })
          }
          className="flex-shrink-0 w-[140px] bg-surface-card rounded-xl p-3 space-y-2 text-left"
        >
          <div className="w-12 h-12 rounded-full bg-surface-interactive flex items-center justify-center mx-auto">
            <User size={20} className="text-muted-foreground" />
          </div>
          <p className="font-display text-sm font-bold text-center truncate">{p.player}</p>
          <p className="text-[0.6rem] font-body text-muted-foreground text-center">{p.team}</p>
          <p className="text-[0.55rem] font-body text-foreground/60 text-center">{p.market}</p>
          <div className="bg-surface-interactive rounded-lg py-1.5 text-center">
            <span className="font-display text-primary font-bold text-lg">{p.odds.toFixed(2)}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

/* ───────── Main Home ───────── */
const HomePage = () => {
  const addBet = useBetSlipStore((s) => s.addBet);
  const { isLoggedIn } = useAuthStore();

  return (
    <div className="space-y-6 pb-20">
      {/* Visitor Banner */}
      {!isLoggedIn && <VisitorBanner />}

      {/* 1. Hero Carousel */}
      <HeroCarousel />

      {/* Sport Filter */}
      <div className="px-4">
        <SportFilter />
      </div>

      {/* 2. Live Matches */}
      <section className="px-4">
        <SectionTitle icon={<Zap size={20} className="text-secondary" />} action="Ver Todos">
          Ao Vivo
        </SectionTitle>
        <div className="space-y-3">
          {liveMatches.map((match) => (
            <motion.div key={match.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <MatchCard {...match} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Boosted Odds */}
      <section className="px-4">
        <SectionTitle icon={<Flame size={20} className="text-primary" />} action="Ver Todas">
          Odds Turbinadas
        </SectionTitle>
        <div className="space-y-3">
          {boostedMatches.map((match) => (
            <MatchCard key={match.id} {...match} />
          ))}
        </div>
      </section>

      {/* 4. Popular Multiples */}
      <section className="px-4">
        <SectionTitle icon={<Trophy size={20} className="text-primary" />} action="Ver Mais">
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

      {/* 5. Player Props Carousel */}
      <section>
        <div className="px-4">
          <SectionTitle icon={<User size={20} className="text-primary" />} action="Ver Todos">
            Player Props
          </SectionTitle>
        </div>
        <PlayerPropsCarousel />
      </section>

      {/* 6. Upcoming Matches */}
      <section className="px-4">
        <SectionTitle icon={<Calendar size={20} className="text-primary" />} action="Ver Todos">
          Próximos Jogos
        </SectionTitle>
        {/* Compact table */}
        <div className="bg-surface-card rounded-xl overflow-hidden">
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
                  className="w-12 py-1.5 rounded-lg bg-surface-interactive text-center font-display text-sm font-bold text-primary min-h-[44px] flex items-center justify-center hover:bg-muted transition-colors"
                >
                  {odd.toFixed(2)}
                </motion.button>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
