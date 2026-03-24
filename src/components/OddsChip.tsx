import { motion } from 'framer-motion';
import { useBetSlipStore } from '@/store/betSlipStore';
import { cn } from '@/lib/utils';

interface OddsChipProps {
  odds: number;
  label?: string;
  betId: string;
  match: string;
  market: string;
  selection: string;
  boosted?: boolean;
  originalOdds?: number;
}

const OddsChip = ({ odds, label, betId, match, market, selection, boosted, originalOdds }: OddsChipProps) => {
  const { bets, addBet } = useBetSlipStore();
  const isSelected = bets.some((b) => b.id === betId);

  const handleClick = () => {
    addBet({ id: betId, match, market, selection, odds });
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      onClick={handleClick}
      className={cn(
        "flex flex-col items-center justify-center min-w-[72px] min-h-[44px] px-3 py-2 rounded-lg transition-colors font-display",
        isSelected
          ? "bg-primary text-primary-foreground"
          : "bg-surface-interactive text-foreground hover:bg-muted"
      )}
    >
      {label && (
        <span className="text-[0.65rem] font-body font-medium text-muted-foreground mb-0.5">
          {label}
        </span>
      )}
      <div className="flex items-center gap-1">
        {boosted && originalOdds && (
          <span className="text-[0.65rem] line-through text-muted-foreground">{originalOdds.toFixed(2)}</span>
        )}
        <span className={cn("text-base font-bold", boosted && "text-primary")}>
          {odds.toFixed(2)}
        </span>
        {boosted && <span className="text-xs">🔥</span>}
      </div>
    </motion.button>
  );
};

export default OddsChip;
