import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sun, Moon, Contrast, Eye, Shield, Clock, Ban, ExternalLink, AlertTriangle, Trash2, Pause, X } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const fontSizes = ['P', 'M', 'G', 'GG'];
const daltonismModes = [
  { id: 'none', label: 'Nenhum' },
  { id: 'deuteranopia', label: 'Deuteranopia' },
  { id: 'protanopia', label: 'Protanopia' },
  { id: 'tritanopia', label: 'Tritanopia' },
];

const SettingsPage = () => {
  const navigate = useNavigate();
  const {
    theme, setTheme,
    fontSize, setFontSize,
    daltonism, setDaltonism,
    sessionAlert, setSessionAlert, sessionMinutes, setSessionMinutes,
    depositLimit, setDepositLimit,
    betLimit, setBetLimit,
    limitPeriod, setLimitPeriod,
  } = useSettingsStore();

  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'delete' | 'deactivate' | null>(null);
  const [confirmText, setConfirmText] = useState('');
  const sessionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Session alert timer
  useEffect(() => {
    if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    if (sessionAlert && sessionMinutes > 0) {
      sessionTimerRef.current = setInterval(() => {
        toast.warning(`⏰ Você está jogando há ${sessionMinutes} minutos. Faça uma pausa!`, { duration: 8000 });
      }, sessionMinutes * 60 * 1000);
    }
    return () => { if (sessionTimerRef.current) clearInterval(sessionTimerRef.current); };
  }, [sessionAlert, sessionMinutes]);

  const handleDeleteAccount = async () => {
    toast.error('Sua conta foi marcada para exclusão. Entraremos em contato por e-mail.');
    setConfirmAction(null);
    setConfirmText('');
    setAccountModalOpen(false);
  };

  const handleDeactivateAccount = async () => {
    await supabase.auth.signOut();
    toast.success('Conta desativada. Você pode reativar fazendo login novamente.');
    navigate('/auth');
  };

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
    <div className="pb-20 px-4 pt-2 space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground/70 hover:text-foreground">
          <ArrowLeft size={22} />
        </button>
        <h1 className="font-display text-xl font-extrabold">Configurações</h1>
      </div>

      {/* Accessibility */}
      <section className="space-y-3">
        <h2 className="font-display text-sm font-bold flex items-center gap-2">
          <Eye size={16} className="text-primary" /> Acessibilidade
        </h2>

        {/* Theme */}
        <div className="bg-surface-card rounded-xl p-4 space-y-3">
          <p className="text-xs font-body font-medium text-muted-foreground">Tema</p>
          <div className="flex gap-2">
            {[
              { id: 'dark', label: 'Escuro', icon: Moon },
              { id: 'light', label: 'Claro', icon: Sun },
              { id: 'contrast', label: 'Alto Contraste', icon: Contrast },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-body font-medium min-h-[44px] transition-colors ${
                  theme === t.id ? 'bg-primary text-primary-foreground' : 'bg-surface-interactive text-muted-foreground'
                }`}
              >
                <t.icon size={18} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font size */}
        <div className="bg-surface-card rounded-xl p-4 space-y-3">
          <p className="text-xs font-body font-medium text-muted-foreground">Tamanho da fonte</p>
          <div className="flex gap-2">
            {fontSizes.map((s) => (
              <button
                key={s}
                onClick={() => setFontSize(s)}
                className={`flex-1 py-3 rounded-xl font-body font-semibold min-h-[44px] transition-colors ${
                  fontSize === s ? 'bg-primary text-primary-foreground' : 'bg-surface-interactive text-muted-foreground'
                } ${s === 'P' ? 'text-xs' : s === 'M' ? 'text-sm' : s === 'G' ? 'text-base' : 'text-lg'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Daltonism */}
        <div className="bg-surface-card rounded-xl p-4 space-y-3">
          <p className="text-xs font-body font-medium text-muted-foreground">Modo de Daltonismo</p>
          <div className="grid grid-cols-2 gap-2">
            {daltonismModes.map((d) => (
              <button
                key={d.id}
                onClick={() => setDaltonism(d.id)}
                className={`py-2.5 rounded-xl text-xs font-body font-medium min-h-[44px] transition-colors ${
                  daltonism === d.id ? 'bg-primary text-primary-foreground' : 'bg-surface-interactive text-muted-foreground'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Responsible Gaming */}
      <section className="space-y-3">
        <h2 className="font-display text-sm font-bold flex items-center gap-2">
          <Shield size={16} className="text-primary" /> Jogo Responsável
        </h2>

        {/* Deposit Limit */}
        <div className="bg-surface-card rounded-xl p-4 space-y-3">
          <p className="text-xs font-body font-medium text-muted-foreground">Limite de Depósito</p>
          <div className="flex gap-2 mb-2">
            {['diario', 'semanal', 'mensal'].map((p) => (
              <button
                key={p}
                onClick={() => setLimitPeriod(p)}
                className={`flex-1 py-2 rounded-lg text-[0.65rem] font-body font-semibold min-h-[44px] transition-colors capitalize ${
                  limitPeriod === p ? 'bg-primary text-primary-foreground' : 'bg-surface-interactive text-muted-foreground'
                }`}
              >
                {p}
              </button>
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
        </div>

        {/* Bet Limit */}
        <div className="bg-surface-card rounded-xl p-4 space-y-3">
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
        </div>

        {/* Session Alert */}
        <div className="bg-surface-card rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-body font-medium text-foreground">Alerta de Tempo de Sessão</p>
                <p className="text-[0.65rem] text-muted-foreground font-body">
                  {sessionAlert ? `Notificar a cada ${sessionMinutes} min` : 'Desativado'}
                </p>
              </div>
            </div>
            <ToggleSwitch checked={sessionAlert} onChange={setSessionAlert} />
          </div>
          {sessionAlert && (
            <div className="flex gap-2">
              {[30, 60, 90, 120].map((m) => (
                <button
                  key={m}
                  onClick={() => setSessionMinutes(m)}
                  className={`flex-1 py-2 rounded-lg text-xs font-body font-semibold min-h-[40px] transition-colors ${
                    sessionMinutes === m ? 'bg-primary text-primary-foreground' : 'bg-surface-interactive text-muted-foreground'
                  }`}
                >
                  {m}min
                </button>
              ))}
            </div>
          )}
        </div>

        {/* External link */}
        <a
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
        </a>
      </section>

      {/* Account Management */}
      <section className="space-y-3">
        <h2 className="font-display text-sm font-bold flex items-center gap-2">
          <AlertTriangle size={16} className="text-destructive" /> Conta
        </h2>

        <button
          onClick={() => setAccountModalOpen(true)}
          className="w-full bg-surface-card rounded-xl p-4 flex items-center justify-between min-h-[52px] hover:bg-surface-interactive transition-colors"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle size={18} className="text-destructive" />
            <div className="text-left">
              <p className="text-sm font-body font-medium text-foreground">Gerenciar conta</p>
              <p className="text-[0.65rem] text-muted-foreground font-body">Desativar ou excluir sua conta</p>
            </div>
          </div>
          <ArrowLeft size={16} className="text-muted-foreground rotate-180" />
        </button>
      </section>

      {/* Account Modal */}
      <AnimatePresence>
        {accountModalOpen && !confirmAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
            onClick={() => setAccountModalOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-surface-card rounded-t-2xl p-5 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>
              <h3 className="font-display text-lg font-extrabold text-foreground">Gerenciar conta</h3>
              <p className="text-xs font-body text-muted-foreground">
                Escolha uma opção abaixo. Essa ação pode ser irreversível.
              </p>

              <button
                onClick={() => setConfirmAction('deactivate')}
                className="w-full flex items-center gap-3 bg-surface-interactive rounded-xl p-4 min-h-[56px] hover:bg-muted transition-colors"
              >
                <Pause size={20} className="text-primary" />
                <div className="text-left flex-1">
                  <p className="text-sm font-body font-semibold text-foreground">Desativar conta</p>
                  <p className="text-[0.6rem] text-muted-foreground font-body">Sua conta será pausada. Você pode reativar a qualquer momento fazendo login.</p>
                </div>
              </button>

              <button
                onClick={() => setConfirmAction('delete')}
                className="w-full flex items-center gap-3 bg-surface-interactive rounded-xl p-4 min-h-[56px] hover:bg-destructive/10 transition-colors"
              >
                <Trash2 size={20} className="text-destructive" />
                <div className="text-left flex-1">
                  <p className="text-sm font-body font-semibold text-destructive">Excluir conta permanentemente</p>
                  <p className="text-[0.6rem] text-muted-foreground font-body">Todos os seus dados serão apagados. Essa ação não pode ser desfeita.</p>
                </div>
              </button>

              <button
                onClick={() => setAccountModalOpen(false)}
                className="w-full py-3 rounded-xl bg-surface-interactive text-sm font-body font-semibold text-muted-foreground min-h-[44px] hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm action modal */}
      <AnimatePresence>
        {confirmAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
            onClick={() => { setConfirmAction(null); setConfirmText(''); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-surface-card rounded-2xl p-5 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-extrabold text-foreground">
                  {confirmAction === 'delete' ? 'Excluir conta' : 'Desativar conta'}
                </h3>
                <button onClick={() => { setConfirmAction(null); setConfirmText(''); }} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
                  <X size={20} className="text-muted-foreground" />
                </button>
              </div>

              {confirmAction === 'delete' ? (
                <>
                  <p className="text-xs font-body text-muted-foreground">
                    Para confirmar, digite <span className="text-destructive font-bold">EXCLUIR</span> abaixo.
                  </p>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Digite EXCLUIR"
                    className="w-full bg-surface-interactive rounded-xl py-3 px-4 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-destructive placeholder:text-muted-foreground min-h-[44px]"
                  />
                  <button
                    onClick={handleDeleteAccount}
                    disabled={confirmText !== 'EXCLUIR'}
                    className={`w-full py-3 rounded-xl font-display font-bold text-sm min-h-[44px] transition-colors ${
                      confirmText === 'EXCLUIR'
                        ? 'bg-destructive text-destructive-foreground'
                        : 'bg-surface-interactive text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    Excluir minha conta
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xs font-body text-muted-foreground">
                    Sua conta será desativada e você será deslogado. Quando quiser voltar, é só fazer login novamente.
                  </p>
                  <button
                    onClick={handleDeactivateAccount}
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm min-h-[44px]"
                  >
                    Desativar minha conta
                  </button>
                </>
              )}

              <button
                onClick={() => { setConfirmAction(null); setConfirmText(''); }}
                className="w-full py-2.5 rounded-xl text-sm font-body font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Voltar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsPage;
