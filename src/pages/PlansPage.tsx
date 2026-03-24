import { motion } from 'framer-motion';
import { Check, Video, TrendingUp, Gift, Headphones, Zap } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 'R$ 0',
    period: '',
    highlight: false,
    features: [
      { icon: Video, text: 'Streaming limitado', included: true },
      { icon: TrendingUp, text: 'Odds padrão', included: true },
      { icon: Headphones, text: 'Suporte normal', included: true },
      { icon: Zap, text: 'Boost de odds', included: false },
      { icon: Gift, text: 'Bônus exclusivos', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'R$ 29,90',
    period: '/mês',
    highlight: true,
    badge: 'Mais Popular',
    features: [
      { icon: Video, text: 'Streaming ilimitado', included: true },
      { icon: TrendingUp, text: '+5% Boost de odds', included: true },
      { icon: Headphones, text: 'Suporte prioritário', included: true },
      { icon: Gift, text: 'Bônus mensais', included: true },
      { icon: Zap, text: 'Cash Out antecipado', included: true },
    ],
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 'R$ 79,90',
    period: '/mês',
    highlight: false,
    features: [
      { icon: Video, text: 'Streaming ilimitado + 4K', included: true },
      { icon: TrendingUp, text: '+15% Boost de odds', included: true },
      { icon: Headphones, text: 'Suporte dedicado 24/7', included: true },
      { icon: Gift, text: 'Bônus VIP exclusivos', included: true },
      { icon: Zap, text: 'Todos os recursos Premium', included: true },
    ],
  },
];

const PlansPage = () => {
  return (
    <div className="pb-20 px-4 pt-2 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-display text-2xl font-extrabold">Escolha seu Plano</h1>
        <p className="text-sm font-body text-muted-foreground">Desbloqueie recursos exclusivos e turbine suas apostas</p>
      </div>

      <div className="space-y-4">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ scale: 1.01 }}
            className={`rounded-2xl p-5 space-y-4 relative ${
              plan.highlight ? 'bg-accent ring-2 ring-primary' : 'bg-surface-card'
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[0.65rem] font-display font-bold px-3 py-1 rounded-full">
                {plan.badge}
              </span>
            )}
            <div className="text-center pt-1">
              <h3 className="font-display text-lg font-bold">{plan.name}</h3>
              <div className="mt-1">
                <span className="font-display text-3xl font-extrabold text-gradient-gold">{plan.price}</span>
                <span className="text-sm font-body text-muted-foreground">{plan.period}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {plan.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    feat.included ? 'bg-secondary/20' : 'bg-surface-interactive'
                  }`}>
                    {feat.included ? (
                      <Check size={12} className="text-secondary" />
                    ) : (
                      <span className="text-[0.5rem] text-muted-foreground">—</span>
                    )}
                  </div>
                  <feat.icon size={16} className={feat.included ? 'text-primary' : 'text-muted-foreground/40'} />
                  <span className={`text-sm font-body ${feat.included ? 'text-foreground' : 'text-muted-foreground/40'}`}>
                    {feat.text}
                  </span>
                </div>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              className={`w-full font-display font-bold text-sm py-3 rounded-xl min-h-[44px] transition-all ${
                plan.highlight
                  ? 'bg-primary text-primary-foreground hover:brightness-110'
                  : 'bg-surface-interactive text-foreground hover:bg-muted'
              }`}
            >
              {plan.id === 'free' ? 'Plano Atual' : 'Assinar Agora'}
            </motion.button>
          </motion.div>
        ))}
      </div>

      <p className="text-[0.6rem] text-muted-foreground font-body text-center">
        Renovação automática. Cancele a qualquer momento nas configurações da conta.
      </p>
    </div>
  );
};

export default PlansPage;
