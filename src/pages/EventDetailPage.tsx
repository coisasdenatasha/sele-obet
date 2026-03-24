import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Video, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import OddsChip from '@/components/OddsChip';
import LiveBadge from '@/components/LiveBadge';

const markets = [
  {
    name: 'Resultado Final (1X2)',
    options: [
      { label: 'Flamengo', odds: 1.55, id: 'ev-1x2-1' },
      { label: 'Empate', odds: 4.20, id: 'ev-1x2-x' },
      { label: 'Palmeiras', odds: 5.10, id: 'ev-1x2-2' },
    ],
  },
  {
    name: 'Ambos Marcam',
    options: [
      { label: 'Sim', odds: 1.72, id: 'ev-btts-y' },
      { label: 'Não', odds: 2.05, id: 'ev-btts-n' },
    ],
  },
  {
    name: 'Total de Gols (Mais/Menos)',
    options: [
      { label: 'Mais 1.5', odds: 1.30, id: 'ev-ou-o15' },
      { label: 'Menos 1.5', odds: 3.40, id: 'ev-ou-u15' },
      { label: 'Mais 2.5', odds: 1.75, id: 'ev-ou-o25' },
      { label: 'Menos 2.5', odds: 2.05, id: 'ev-ou-u25' },
      { label: 'Mais 3.5', odds: 2.60, id: 'ev-ou-o35' },
      { label: 'Menos 3.5', odds: 1.45, id: 'ev-ou-u35' },
    ],
  },
  {
    name: 'Handicap Asiático',
    options: [
      { label: 'Flamengo -0.5', odds: 1.80, id: 'ev-ah-h1' },
      { label: 'Palmeiras +0.5', odds: 2.00, id: 'ev-ah-h2' },
      { label: 'Flamengo -1.5', odds: 3.10, id: 'ev-ah-h3' },
      { label: 'Palmeiras +1.5', odds: 1.35, id: 'ev-ah-h4' },
    ],
  },
  {
    name: 'Próximo Gol',
    options: [
      { label: 'Flamengo', odds: 1.65, id: 'ev-ng-1' },
      { label: 'Nenhum', odds: 5.50, id: 'ev-ng-n' },
      { label: 'Palmeiras', odds: 3.40, id: 'ev-ng-2' },
    ],
  },
  {
    name: 'Escanteios (Mais/Menos)',
    options: [
      { label: 'Mais 8.5', odds: 1.85, id: 'ev-co-o' },
      { label: 'Menos 8.5', odds: 1.95, id: 'ev-co-u' },
    ],
  },
  {
    name: 'Cartões (Mais/Menos)',
    options: [
      { label: 'Mais 3.5', odds: 1.70, id: 'ev-ca-o' },
      { label: 'Menos 3.5', odds: 2.10, id: 'ev-ca-u' },
    ],
  },
];

const EventDetailPage = () => {
  const navigate = useNavigate();
  const [openMarkets, setOpenMarkets] = useState<Record<string, boolean>>({
    'Resultado Final (1X2)': true,
    'Ambos Marcam': true,
    'Total de Gols (Mais/Menos)': true,
  });

  const toggleMarket = (name: string) => {
    setOpenMarkets((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const matchName = 'Flamengo vs Palmeiras';

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-accent px-4 py-4 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground/70 hover:text-foreground">
            <ArrowLeft size={22} />
          </button>
          <span className="text-xs font-body text-muted-foreground uppercase tracking-wider">Brasileirão Série A</span>
        </div>

        <div className="flex items-center justify-between px-4">
          <div className="text-center flex-1">
            <div className="w-12 h-12 rounded-full bg-surface-interactive mx-auto flex items-center justify-center text-2xl">🔴</div>
            <p className="font-body font-semibold text-sm mt-2">Flamengo</p>
          </div>
          <div className="text-center px-4">
            <div className="flex items-center gap-3">
              <span className="font-display text-4xl font-extrabold text-primary">2</span>
              <span className="font-display text-2xl text-muted-foreground">:</span>
              <span className="font-display text-4xl font-extrabold text-primary">1</span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-1">
              <LiveBadge />
              <span className="text-xs font-body text-muted-foreground flex items-center gap-1">
                <Clock size={12} /> 67'
              </span>
            </div>
          </div>
          <div className="text-center flex-1">
            <div className="w-12 h-12 rounded-full bg-surface-interactive mx-auto flex items-center justify-center text-2xl">🟢</div>
            <p className="font-body font-semibold text-sm mt-2">Palmeiras</p>
          </div>
        </div>

        {/* Streaming placeholder */}
        <button className="w-full bg-surface-interactive rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors min-h-[44px]">
          <Video size={18} className="text-primary" />
          Assistir Transmissão ao Vivo
        </button>
      </div>

      {/* Markets accordion */}
      <div className="px-4 pt-4 space-y-2">
        {markets.map((market) => {
          const isOpen = openMarkets[market.name] ?? false;
          return (
            <div key={market.name} className="bg-surface-card rounded-xl overflow-hidden">
              <button
                onClick={() => toggleMarket(market.name)}
                className="w-full flex items-center justify-between px-4 py-3 min-h-[44px]"
              >
                <span className="font-body font-semibold text-sm">{market.name}</span>
                {isOpen ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
              </button>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="px-4 pb-3"
                >
                  <div className="flex flex-wrap gap-2">
                    {market.options.map((opt) => (
                      <OddsChip
                        key={opt.id}
                        odds={opt.odds}
                        label={opt.label}
                        betId={opt.id}
                        match={matchName}
                        market={market.name}
                        selection={opt.label}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventDetailPage;
