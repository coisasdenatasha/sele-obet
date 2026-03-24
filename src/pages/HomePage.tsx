import { motion } from 'framer-motion';
import heroBanner from '@/assets/hero-banner.jpg';
import MatchCard from '@/components/MatchCard';
import SportFilter from '@/components/SportFilter';
import { liveMatches, boostedMatches, upcomingMatches, popularMultiples } from '@/data/mockData';
import { useBetSlipStore } from '@/store/betSlipStore';
import { Flame, ChevronRight, Trophy, Gift } from 'lucide-react';

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

const HomePage = () => {
  const addBet = useBetSlipStore((s) => s.addBet);

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Banner */}
      <div className="relative rounded-xl overflow-hidden mx-1">
        <img src={heroBanner} alt="SeleçãoBet" className="w-full h-48 sm:h-64 object-cover" width={1920} height={800} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="text-[0.65rem] font-body font-semibold text-primary uppercase tracking-widest">Promoção</span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold leading-tight mt-1">
            Rumo ao Hexa
          </h1>
          <p className="text-sm font-body text-foreground/80 mt-1">
            Ganhe até <span className="text-primary font-bold">R$ 500</span> no primeiro depósito
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="mt-3 bg-primary text-primary-foreground font-display font-bold text-sm px-6 py-2.5 rounded-lg min-h-[44px] hover:brightness-110 transition-all"
          >
            Cadastre-se Agora
          </motion.button>
        </div>
      </div>

      {/* Sport Filter */}
      <div className="px-4">
        <SportFilter />
      </div>

      {/* Live Matches */}
      <section className="px-4">
        <SectionTitle icon={<span className="w-2 h-2 rounded-full bg-secondary animate-pulse-live" />} action="Ver Todos">
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

      {/* Boosted Odds */}
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

      {/* Popular Multiples */}
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

      {/* Upcoming Matches */}
      <section className="px-4">
        <SectionTitle icon={<Gift size={20} className="text-primary" />} action="Ver Todos">
          Próximos Jogos
        </SectionTitle>
        <div className="space-y-3">
          {upcomingMatches.map((match) => (
            <MatchCard key={match.id} {...match} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
