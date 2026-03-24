import { motion } from 'framer-motion';
import { Radio, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBetSlipStore } from '@/store/betSlipStore';
import LiveBadge from '@/components/LiveBadge';
import { SectionReveal, staggerContainer, staggerItem } from '@/components/animations';

const inPlayMatches = [
  {
    id: 'ip-1',
    sport: 'Futebol',
    country: 'Arábia Saudita',
    league: 'Second Division',
    time: "42'",
    period: '1ºT',
    home: 'Al Sahel',
    away: 'Jubbah Club',
    homeScore: 1,
    awayScore: 0,
    oddsHome: 1.22,
    oddsDraw: 5.25,
    oddsAway: 12.0,
    extraMarkets: 55,
  },
  {
    id: 'ip-2',
    sport: 'Futebol',
    country: 'Egito',
    league: 'Premier League (F)',
    time: "90+5'",
    period: '2ºT',
    home: 'Zamalek SC (F)',
    away: 'RA SC (F)',
    homeScore: 1,
    awayScore: 0,
    oddsHome: 1.05,
    oddsDraw: 11.0,
    oddsAway: 25.0,
    extraMarkets: 12,
  },
];

const LiveInPlaySection = () => {
  const navigate = useNavigate();
  const addBet = useBetSlipStore((s) => s.addBet);

  return (
    <SectionReveal>
      <section className="px-4">
        <motion.div
          className="flex items-center gap-2 mb-3"
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Radio size={20} className="text-secondary" />
          <h2 className="font-display text-lg font-bold">EM JOGO</h2>
          <LiveBadge />
          <button
            onClick={() => navigate('/ao-vivo')}
            className="ml-auto text-xs text-secondary font-display font-bold min-h-[44px] flex items-center"
          >
            {inPlayMatches.length * 70} Eventos
          </button>
        </motion.div>

        <motion.div className="space-y-3" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {inPlayMatches.map((m) => (
            <motion.div
              key={m.id}
              variants={staggerItem}
              className="bg-surface-card rounded-xl p-4 space-y-3"
            >
              <p className="text-[0.6rem] font-body text-muted-foreground">
                {m.sport} • {m.country} • {m.league}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-display font-bold text-secondary">{m.time}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                <span className="text-[0.6rem] font-body text-secondary">{m.period}</span>
                <span className="ml-auto text-[0.6rem] font-body text-muted-foreground">{m.period}</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-bold">{m.home}</span>
                  <span className="font-display text-sm font-bold">{m.homeScore}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-foreground/80">{m.away}</span>
                  <span className="font-body text-sm text-foreground/80">{m.awayScore}</span>
                </div>
                <div className="h-0.5 rounded-full bg-secondary/30 mt-1">
                  <div className="h-full rounded-full bg-secondary" style={{ width: '45%' }} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {[
                  { label: '1', odds: m.oddsHome },
                  { label: 'X', odds: m.oddsDraw },
                  { label: '2', odds: m.oddsAway },
                ].map((o) => (
                  <motion.button
                    key={o.label}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      addBet({
                        id: `${m.id}-${o.label}`,
                        match: `${m.home} vs ${m.away}`,
                        market: 'Resultado',
                        selection: o.label === '1' ? m.home : o.label === 'X' ? 'Empate' : m.away,
                        odds: o.odds,
                      })
                    }
                    className="flex-1 bg-surface-interactive rounded-lg py-2.5 flex items-center justify-between px-3 min-h-[44px]"
                  >
                    <span className="text-xs font-body text-muted-foreground">{o.label}</span>
                    <span className="font-display text-sm font-bold text-primary">{o.odds.toFixed(2)}</span>
                  </motion.button>
                ))}
                <span className="text-[0.6rem] font-body text-muted-foreground">+{m.extraMarkets}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </SectionReveal>
  );
};

export default LiveInPlaySection;
