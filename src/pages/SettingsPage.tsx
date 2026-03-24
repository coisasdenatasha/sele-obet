import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sun, Moon, Contrast, Eye, Shield, Clock, Ban, ExternalLink, type LucideIcon } from 'lucide-react';

const fontSizes = ['P', 'M', 'G', 'GG'];
const daltonismModes = [
  { id: 'none', label: 'Nenhum' },
  { id: 'deuteranopia', label: 'Deuteranopia' },
  { id: 'protanopia', label: 'Protanopia' },
  { id: 'tritanopia', label: 'Tritanopia' },
];

const SettingsPage = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState('M');
  const [daltonism, setDaltonism] = useState('none');
  const [depositLimit, setDepositLimit] = useState('');
  const [betLimit, setBetLimit] = useState('');
  const [sessionAlert, setSessionAlert] = useState(false);
  const [selectedLimitPeriod, setSelectedLimitPeriod] = useState('diario');

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`w-12 h-7 rounded-full relative transition-colors min-w-[48px] min-h-[44px] flex items-center ${
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
                onClick={() => setSelectedLimitPeriod(p)}
                className={`flex-1 py-2 rounded-lg text-[0.65rem] font-body font-semibold min-h-[44px] transition-colors capitalize ${
                  selectedLimitPeriod === p ? 'bg-primary text-primary-foreground' : 'bg-surface-interactive text-muted-foreground'
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
        <div className="bg-surface-card rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock size={18} className="text-muted-foreground" />
            <div>
              <p className="text-sm font-body font-medium">Alerta de Tempo de Sessão</p>
              <p className="text-[0.65rem] text-muted-foreground font-body">Notificar a cada 1 hora</p>
            </div>
          </div>
          <ToggleSwitch checked={sessionAlert} onChange={setSessionAlert} />
        </div>

        {/* Self-exclusion */}
        <div className="bg-surface-card rounded-xl p-4 space-y-3">
          <p className="text-xs font-body font-medium text-muted-foreground">Autoexclusão</p>
          <div className="flex gap-2">
            <button className="flex-1 bg-surface-interactive text-foreground font-body font-medium text-xs py-3 rounded-xl min-h-[44px] hover:bg-destructive/20 hover:text-destructive transition-colors">
              Temporária (30 dias)
            </button>
            <button className="flex-1 bg-surface-interactive text-foreground font-body font-medium text-xs py-3 rounded-xl min-h-[44px] hover:bg-destructive/20 hover:text-destructive transition-colors">
              Permanente
            </button>
          </div>
        </div>

        {/* External link */}
        <button className="w-full bg-surface-card rounded-xl p-4 flex items-center justify-between min-h-[44px]">
          <div className="flex items-center gap-3">
            <Ban size={18} className="text-muted-foreground" />
            <span className="text-sm font-body font-medium">Jogadores Anônimos</span>
          </div>
          <ExternalLink size={16} className="text-muted-foreground" />
        </button>
      </section>
    </div>
  );
};

export default SettingsPage;
