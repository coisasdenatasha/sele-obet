import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video } from 'lucide-react';
import OddsChip from './OddsChip';
import LiveBadge from './LiveBadge';

interface MatchCardProps {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  time?: string;
  league: string;
  isLive?: boolean;
  oddsHome: number;
  oddsDraw: number;
  oddsAway: number;
  boosted?: boolean;
  originalOddsHome?: number;
  originalOddsDraw?: number;
  originalOddsAway?: number;
}

const MatchCard = ({
  id, homeTeam, awayTeam, homeScore, awayScore, time, league, isLive,
  oddsHome, oddsDraw, oddsAway, boosted,
  originalOddsHome, originalOddsDraw, originalOddsAway,
}: MatchCardProps) => {
  const navigate = useNavigate();
  const matchName = `${homeTeam} vs ${awayTeam}`;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="bg-surface-card rounded-xl p-4 space-y-3 cursor-pointer" onClick={() => navigate(`/evento/${id}`)} role="button">
      <div className="flex items-center justify-between">
        <span className="text-[0.65rem] font-body text-muted-foreground uppercase tracking-wider">
          {league}
        </span>
        {isLive ? <LiveBadge /> : (
          <span className="text-[0.65rem] font-body text-muted-foreground">{time}</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Match info */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-body font-semibold text-sm">{homeTeam}</span>
            {isLive && homeScore !== undefined && (
              <span className="font-display text-lg font-bold text-primary">{homeScore}</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="font-body font-semibold text-sm">{awayTeam}</span>
            {isLive && awayScore !== undefined && (
              <span className="font-display text-lg font-bold text-primary">{awayScore}</span>
            )}
          </div>
        </div>

        {/* Live video thumbnail */}
        {isLive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-20 h-14 rounded-lg bg-gradient-to-br from-surface-interactive to-accent overflow-hidden flex items-center justify-center shrink-0"
          >
            {/* Fake field pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-x-0 top-1/2 h-px bg-secondary" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-secondary" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-secondary" />
            </div>
            {/* Play icon */}
            <Video size={16} className="text-secondary relative z-10" />
            {/* Live dot */}
            <span className="absolute top-1 right-1 flex items-center gap-0.5 bg-destructive/90 text-destructive-foreground text-[0.45rem] font-bold px-1 py-px rounded">
              <span className="w-1 h-1 rounded-full bg-destructive-foreground animate-pulse" />
              LIVE
            </span>
          </motion.div>
        )}
      </div>

      <div className="flex gap-2">
        <OddsChip
          odds={oddsHome}
          label="1"
          betId={`${id}-home`}
          match={matchName}
          market="Resultado"
          selection={homeTeam}
          boosted={boosted}
          originalOdds={originalOddsHome}
        />
        <OddsChip
          odds={oddsDraw}
          label="X"
          betId={`${id}-draw`}
          match={matchName}
          market="Resultado"
          selection="Empate"
          boosted={boosted}
          originalOdds={originalOddsDraw}
        />
        <OddsChip
          odds={oddsAway}
          label="2"
          betId={`${id}-away`}
          match={matchName}
          market="Resultado"
          selection={awayTeam}
          boosted={boosted}
          originalOdds={originalOddsAway}
        />
      </div>
    </motion.div>
  );
};
export default MatchCard;
