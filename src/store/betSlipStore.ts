import { create } from 'zustand';

export interface BetItem {
  id: string;
  match: string;
  market: string;
  selection: string;
  odds: number;
}

interface BetSlipState {
  bets: BetItem[];
  stake: number;
  addBet: (bet: BetItem) => void;
  removeBet: (id: string) => void;
  clearBets: () => void;
  setStake: (stake: number) => void;
  totalOdds: () => number;
  potentialReturn: () => number;
}

export const useBetSlipStore = create<BetSlipState>((set, get) => ({
  bets: [],
  stake: 10,
  addBet: (bet) =>
    set((state) => {
      const exists = state.bets.find((b) => b.id === bet.id);
      if (exists) {
        return { bets: state.bets.filter((b) => b.id !== bet.id) };
      }
      return { bets: [...state.bets, bet] };
    }),
  removeBet: (id) =>
    set((state) => ({ bets: state.bets.filter((b) => b.id !== id) })),
  clearBets: () => set({ bets: [] }),
  setStake: (stake) => set({ stake }),
  totalOdds: () => {
    const { bets } = get();
    if (bets.length === 0) return 0;
    return bets.reduce((acc, b) => acc * b.odds, 1);
  },
  potentialReturn: () => {
    const { stake } = get();
    const totalOdds = get().totalOdds();
    return stake * totalOdds;
  },
}));
