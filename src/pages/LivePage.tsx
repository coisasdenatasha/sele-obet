import MatchCard from '@/components/MatchCard';
import SportFilter from '@/components/SportFilter';
import LiveBadge from '@/components/LiveBadge';
import { liveMatches } from '@/data/mockData';
import { Video } from 'lucide-react';

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
    <div className="space-y-4 pb-20 px-4">
      <div className="flex items-center gap-2 pt-2">
        <LiveBadge />
        <span className="font-display text-lg font-bold">{allLive.length} eventos ao vivo</span>
      </div>

      <SportFilter />

      <div className="space-y-3">
        {allLive.map((match) => (
          <div key={match.id} className="relative">
            <MatchCard {...match} />
            <button className="absolute top-3 right-3 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center bg-surface-interactive rounded-lg text-muted-foreground hover:text-foreground transition-colors">
              <Video size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LivePage;
