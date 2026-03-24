import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import bannerHexa from '@/assets/banner-hexa.jpg';
import bannerOdds from '@/assets/banner-odds.jpg';
import bannerBonus from '@/assets/banner-bonus.jpg';
import bannerLiga from '@/assets/banner-liga.jpg';
import MatchCard from '@/components/MatchCard';
import SportFilter from '@/components/SportFilter';
import VisitorBanner from '@/components/VisitorBanner';
import { liveMatches, boostedMatches, upcomingMatches, popularMultiples, playerProps, heroBanners, competitions, specials, oddsByCategory } from '@/data/mockData';
import { useBetSlipStore } from '@/store/betSlipStore';
import { useAuthStore } from '@/store/authStore';
import { Flame, ChevronRight, Trophy, Gift, Zap, User, Calendar, Target, Scale, CreditCard, CornerDownRight, Award, Star, LayoutGrid } from 'lucide-react';
import { PageTransition, SectionReveal, staggerContainer, staggerItem } from '@/components/animations';
import QuickAccessRow from '@/components/home/QuickAccessRow';
import BettingTipsSection from '@/components/home/BettingTipsSection';
import PopularTournamentsSection from '@/components/home/PopularTournamentsSection';
import GoalReplaysSection from '@/components/home/GoalReplaysSection';
import MultiCreatorBanner from '@/components/home/MultiCreatorBanner';
import LiveInPlaySection from '@/components/home/LiveInPlaySection';
import NewsSection from '@/components/home/NewsSection';
import SuperSocialCTA from '@/components/home/SuperSocialCTA';

const SectionTitle = ({ children, icon, action }: { children: React.ReactNode; icon?: React.ReactNode; action?: string }) => (
  <motion.div
    className="flex items-center justify-between mb-3"
    initial={{ opacity: 0, x: -12 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
  >
    <h2 className="font-display text-lg font-bold flex items-center gap-2">
      {icon}
      {children}
    </h2>
    {action && (
      <button className="text-xs text-primary font-body font-semibold flex items-center gap-0.5 min-h-[44px]">
        {action} <ChevronRight size={14} />
      </button>
    )}
  </motion.div>
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

  const bannerImages: Record<string, string> = {
    Brasil: bannerHexa,
    Fogo: bannerOdds,
    Promo: bannerBonus,
    Liga: bannerLiga,
  };

  return (
    <div className="relative overflow-hidden rounded-2xl mx-4">
      <div className="relative h-48 sm:h-56">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroBanners[current].id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <img
              src={bannerImages[heroBanners[current].accent] || bannerHexa}
              alt={heroBanners[current].title}
              className="w-full h-full object-cover"
              width={960}
              height={512}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
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
    <PageTransition>
    <div className="space-y-6 pb-20">
      {/* Visitor Banner */}
      {!isLoggedIn && <VisitorBanner />}

      {/* 1. Hero Carousel */}
      <HeroCarousel />

      {/* Quick Access Row */}
      <QuickAccessRow />

      {/* 2. Live Matches */}
      <SectionReveal>
      <section className="px-4">
        <SectionTitle icon={<Zap size={20} className="text-secondary" />} action="Ver Todos">
          Ao Vivo Popular
        </SectionTitle>
        <motion.div className="space-y-3" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {liveMatches.map((match) => (
            <motion.div key={match.id} variants={staggerItem}>
              <MatchCard {...match} />
            </motion.div>
          ))}
        </motion.div>
      </section>
      </SectionReveal>

      <SectionReveal delay={0.1}>
      <section className="px-4">
        <SectionTitle icon={<Flame size={20} className="text-primary" />} action="Ver Todas">
          Odds Turbinadas
        </SectionTitle>
        <motion.div className="space-y-3" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {boostedMatches.map((match) => (
            <motion.div key={match.id} variants={staggerItem}>
              <MatchCard {...match} />
            </motion.div>
          ))}
        </motion.div>
      </section>
      </SectionReveal>

      <SectionReveal delay={0.15}>
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
      </SectionReveal>

      <SectionReveal delay={0.1}>
      <section>
        <div className="px-4">
          <SectionTitle icon={<User size={20} className="text-primary" />} action="Ver Todos">
            Player Props
          </SectionTitle>
        </div>
        <PlayerPropsCarousel />
      </section>
      </SectionReveal>

      <SectionReveal>
      <section className="px-4">
        <SectionTitle icon={<Calendar size={20} className="text-primary" />} action="Ver Todos">
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
                  whileHover={{ scale: 1.05 }}
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
        </motion.div>
      </section>
      </SectionReveal>

      <SectionReveal>
      <section className="px-4">
        <SectionTitle icon={<Trophy size={20} className="text-secondary" />} action="Ver Todas">
          Competições
        </SectionTitle>
        <motion.div className="space-y-2" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {competitions.map((comp) => (
            <motion.div key={comp.id} variants={staggerItem} className="bg-surface-card rounded-xl p-3.5 flex items-center gap-3">
              <img src={comp.flag} alt={comp.country} className="w-8 h-6 object-cover rounded" />
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm font-bold truncate">{comp.name}</p>
                <p className="text-[0.65rem] font-body text-muted-foreground">{comp.country}</p>
              </div>
              <span className="text-xs font-display font-bold text-primary bg-primary/15 px-2 py-1 rounded-lg">
                {comp.matchCount} jogos
              </span>
            </motion.div>
          ))}
        </motion.div>
      </section>
      </SectionReveal>

      <SectionReveal>
      <section className="px-4">
        <SectionTitle icon={<Star size={20} className="text-primary" />} action="Ver Todos">
          Especiais
        </SectionTitle>
        <motion.div className="space-y-3" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {specials.map((spec) => (
            <motion.div key={spec.id} variants={staggerItem} className="bg-surface-card rounded-xl p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <span className="text-[0.6rem] font-display font-bold text-secondary bg-secondary/15 px-2 py-0.5 rounded-full">
                    {spec.market}
                  </span>
                  <h3 className="font-display text-sm font-bold mt-1.5">{spec.title}</h3>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[0.6rem] font-body text-muted-foreground">Favorito</p>
                  <p className="font-display text-sm font-bold">{spec.topPick}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl font-bold text-primary">{spec.topOdds.toFixed(2)}</p>
                  <p className="text-[0.6rem] font-body text-muted-foreground">{spec.options} opções</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                onClick={() =>
                  addBet({
                    id: spec.id,
                    match: spec.title,
                    market: spec.market,
                    selection: spec.topPick,
                    odds: spec.topOdds,
                  })
                }
                className="w-full bg-surface-interactive text-foreground font-display font-bold text-sm py-2.5 rounded-xl min-h-[44px] hover:bg-muted transition-colors"
              >
                Apostar
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </section>
      </SectionReveal>

      <SectionReveal>
      <section className="px-4">
        <SectionTitle icon={<LayoutGrid size={20} className="text-primary" />} action="Ver Todas">
          Odds por Categoria
        </SectionTitle>
        <motion.div className="grid grid-cols-2 gap-3" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {oddsByCategory.map((cat) => {
            const iconMap: Record<string, React.ReactNode> = {
              trophy: <Trophy size={20} className="text-primary" />,
              target: <Target size={20} className="text-primary" />,
              scale: <Scale size={20} className="text-primary" />,
              card: <CreditCard size={20} className="text-primary" />,
              corner: <CornerDownRight size={20} className="text-primary" />,
              user: <User size={20} className="text-primary" />,
            };
            return (
              <motion.div
                key={cat.id}
                variants={staggerItem}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.03 }}
                className="bg-surface-card rounded-xl p-4 space-y-2 cursor-pointer"
              >
                <motion.div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center" whileHover={{ rotate: 10 }}>
                  {iconMap[cat.icon]}
                </motion.div>
                <h3 className="font-display text-sm font-bold">{cat.category}</h3>
                <p className="text-[0.6rem] font-body text-muted-foreground">{cat.description}</p>
                <span className="text-xs font-display font-bold text-secondary">{cat.matches} mercados</span>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
      </SectionReveal>
    </div>
    </PageTransition>
  );
};

export default HomePage;
