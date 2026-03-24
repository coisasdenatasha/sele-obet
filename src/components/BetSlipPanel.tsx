import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Sparkles } from 'lucide-react';
import { useBetSlipStore } from '@/store/betSlipStore';

interface BetSlipPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const BetSlipPanel = ({ isOpen, onClose }: BetSlipPanelProps) => {
  const { bets, stake, setStake, removeBet, clearBets, totalOdds, potentialReturn } = useBetSlipStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 glass rounded-t-2xl max-h-[80vh] overflow-y-auto lg:static lg:w-80 lg:rounded-xl lg:max-h-none"
          >
            <div className="p-4 space-y-4">
              {/* Handle bar */}
              <div className="flex justify-center lg:hidden">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold">Meu Bilhete</h3>
                <div className="flex items-center gap-2">
                  {bets.length > 0 && (
                    <button onClick={clearBets} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 size={18} />
                    </button>
                  )}
                  <button onClick={onClose} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors lg:hidden">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {bets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground font-body text-sm">
                  Selecione odds para adicionar apostas
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {bets.map((bet) => (
                      <div key={bet.id} className="bg-surface-interactive rounded-lg p-3 space-y-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground font-body">{bet.match}</p>
                            <p className="text-sm font-body font-semibold">{bet.selection}</p>
                            <p className="text-[0.65rem] text-muted-foreground font-body">{bet.market}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-display text-primary font-bold">{bet.odds.toFixed(2)}</span>
                            <button onClick={() => removeBet(bet.id)} className="p-1 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-destructive">
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI Suggestion */}
                  <div className="bg-accent/30 rounded-xl p-3 flex items-start gap-2">
                    <Sparkles size={16} className="text-primary mt-0.5 shrink-0" />
                    <p className="text-xs font-body text-foreground/80">
                      Para este nível de risco, recomendamos apostar <span className="text-primary font-bold">R$ {Math.max(5, Math.round(stake * 0.75))}</span>
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-body text-muted-foreground">Valor:</span>
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
                        <input
                          type="number"
                          value={stake}
                          onChange={(e) => setStake(Number(e.target.value))}
                          className="w-full bg-surface-interactive rounded-lg py-2.5 pl-10 pr-3 text-sm font-body font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary"
                          min={1}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm font-body">
                      <span className="text-muted-foreground">Odds totais:</span>
                      <span className="font-display font-bold text-primary">{totalOdds().toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground font-body">Retorno potencial:</span>
                      <span className="font-display text-xl font-bold text-primary">
                        R$ {potentialReturn().toFixed(2)}
                      </span>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      className="w-full bg-primary text-primary-foreground font-display font-bold text-base py-3.5 rounded-xl min-h-[44px] hover:brightness-110 transition-all"
                    >
                      Confirmar Aposta
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BetSlipPanel;
