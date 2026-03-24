import { motion } from 'framer-motion';
import MatchCard from '@/components/MatchCard';
import SportFilter from '@/components/SportFilter';
import LiveBadge from '@/components/LiveBadge';
import { liveMatches } from '@/data/mockData';
import { Video } from 'lucide-react';
import { PageTransition, staggerContainer, staggerItem } from '@/components/animations';

const extraLive = [
  {
    id: 'live-4',
    homeTeam: 'Athletico-PR',
    awayTeam: 'Coritiba',
    homeScore: 1,
    awayScore: 0,
    time: "45'+2",
    league: 'Brasileirão Série A',
    isLive: true,
    oddsHome: 1.70,
    oddsDraw: 3.80,
    oddsAway: 4.60,
  },
  {
    id: 'live-5',
    homeTeam: 'Juventus',
    awayTeam: 'Inter Milan',
    homeScore: 2,
    awayScore: 2,
    time: "71'",
    league: 'Serie A',
    isLive: true,
    oddsHome: 3.20,
    oddsDraw: 2.90,
    oddsAway: 2.50,
  },
];

const LivePage = () => {
  const allLive = [...liveMatches, ...extraLive];

  return (
    <PageTransition>
    <div className="space-y-4 pb-20 px-4">
      <div className="flex items-center gap-2 pt-2">
        <LiveBadge />
        <span className="font-display text-lg font-bold">{allLive.length} eventos ao vivo</span>
      </div>

      <SportFilter />

      <motion.div className="space-y-3" variants={staggerContainer} initial="hidden" animate="show">
        {allLive.map((match) => (
          <motion.div key={match.id} variants={staggerItem}>
            <MatchCard {...match} />
          </motion.div>
        ))}
      </motion.div>
    </div>
    </PageTransition>
  );
};

export default LivePage;
