import { useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Clock, Ban, ExternalLink } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { toast } from 'sonner';
import { PageTransition } from '@/components/animations';

const ResponsibleGamingPage = () => {
  const navigate = useNavigate();
  const {
    sessionAlert, setSessionAlert, sessionMinutes, setSessionMinutes,
    depositLimit, setDepositLimit,
    betLimit, setBetLimit,
    limitPeriod, setLimitPeriod,
  } = useSettingsStore();

  const sessionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    if (sessionAlert && sessionMinutes > 0) {
      sessionTimerRef.current = setInterval(() => {
        toast.warning(`⏰ Você está jogando há ${sessionMinutes} minutos. Faça uma pausa!`, { duration: 8000 });
      }, sessionMinutes * 60 * 1000);
    }
    return () => { if (sessionTimerRef.current) clearInterval(sessionTimerRef.current); };
  }, [sessionAlert, sessionMinutes]);

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`w-12 h-7 rounded-full relative transition-colors min-w-[48px] min-h-[28px] flex items-center ${
        checked ? 'bg-primary' : 'bg-surface-interactive'
      }`}
    >
      <span className={`absolute w-5 h-5 rounded-full transition-transform ${
        checked ? 'bg-primary-foreground translate-x-6' : 'bg-muted-foreground translate-x-1'
      }`} />
    </button>
  );

  return (
    <PageTransition>
      <div className="pb-20 px-4 pt-2 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground/70 hover:text-foreground">
            <ArrowLeft size={22} />
          </button>
          <h1 className="font-display text-xl font-extrabold">Jogo Responsável</h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-secondary/10 rounded-xl p-4 flex items-start gap-3">
          <Shield size={20} className="text-secondary mt-0.5" />
          <p className="text-xs font-body text-foreground/80">
            Definir limites ajuda a manter o jogo divertido e saudável. Suas configurações são aplicadas imediatamente.
          </p>
        </motion.div>

        {/* Deposit Limit */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-surface-card rounded-xl p-4 space-y-3">
          <p className="text-xs font-body font-medium text-muted-foreground">Limite de Depósito</p>
          <div className="flex gap-2 mb-2">
            {['diario', 'semanal', 'mensal'].map((p) => (
              <motion.button
                key={p}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLimitPeriod(p)}
                className={`flex-1 py-2.5 rounded-xl text-[0.65rem] font-body font-semibold min-h-[44px] transition-colors capitalize ${
                  limitPeriod === p ? 'bg-primary text-primary-foreground' : 'bg-surface-interactive text-muted-foreground'
                }`}
              >
                {p}
              </motion.button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
            <input
              type="number"
              value={depositLimit}
              onChange={(e) => setDepositLimit(e.target.value)}
              placeholder="Definir limite"
              className="w-full bg-surface-interactive rounded-xl py-3 pl-10 pr-4 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground min-h-[44px]"
            />
          </div>
        </motion.div>

        {/* Bet Limit */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-surface-card rounded-xl p-4 space-y-3">
          <p className="text-xs font-body font-medium text-muted-foreground">Limite de Apostas por Sessão</p>
          <div className="relative">
            <input
              type="number"
              value={betLimit}
              onChange={(e) => setBetLimit(e.target.value)}
              placeholder="Número máximo de apostas"
              className="w-full bg-surface-interactive rounded-xl py-3 px-4 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground min-h-[44px]"
            />
          </div>
        </motion.div>

        {/* Session Alert */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-surface-card rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-body font-medium text-foreground">Alerta de Tempo</p>
                <p className="text-[0.65rem] text-muted-foreground font-body">
                  {sessionAlert ? `Notificar a cada ${sessionMinutes} min` : 'Desativado'}
                </p>
              </div>
            </div>
            <ToggleSwitch checked={sessionAlert} onChange={setSessionAlert} />
          </div>
          {sessionAlert && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex gap-2">
              {[30, 60, 90, 120].map((m) => (
                <motion.button
                  key={m}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSessionMinutes(m)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-body font-semibold min-h-[40px] transition-colors ${
                    sessionMinutes === m ? 'bg-primary text-primary-foreground' : 'bg-surface-interactive text-muted-foreground'
                  }`}
                >
                  {m}min
                </motion.button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* External link */}
        <motion.a
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          href="https://www.jogadoresanonimos.org.br"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-surface-card rounded-xl p-4 flex items-center justify-between min-h-[44px]"
        >
          <div className="flex items-center gap-3">
            <Ban size={18} className="text-muted-foreground" />
            <span className="text-sm font-body font-medium text-foreground">Jogadores Anônimos</span>
          </div>
          <ExternalLink size={16} className="text-muted-foreground" />
        </motion.a>
      </div>
    </PageTransition>
  );
};

export default ResponsibleGamingPage;
