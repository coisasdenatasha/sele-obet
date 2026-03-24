import { motion } from 'framer-motion';
import { Home, Radio, Trophy, Receipt, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBetSlipStore } from '@/store/betSlipStore';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  onBetSlipToggle: () => void;
}

const tabs = [
  { id: '/', icon: Home, label: 'Home' },
  { id: '/ao-vivo', icon: Radio, label: 'Ao Vivo' },
  { id: '/esportes', icon: Trophy, label: 'Esportes' },
  { id: 'betslip', icon: Receipt, label: 'Apostas' },
  { id: '/perfil', icon: User, label: 'Perfil' },
];

const BottomNav = ({ onBetSlipToggle }: BottomNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const betCount = useBetSlipStore((s) => s.bets.length);

  const handleTap = (id: string) => {
    if (id === 'betslip') {
      onBetSlipToggle();
    } else {
      navigate(id);
    }
  };

  return (
    <motion.nav
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300, delay: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-30 bg-background border-t border-foreground/5 lg:hidden safe-area-bottom"
    >
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = tab.id !== 'betslip' && location.pathname === tab.id;
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              onClick={() => handleTap(tab.id)}
              whileTap={{ scale: 0.85 }}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] transition-colors relative",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                {tab.id === '/ao-vivo' && (
                  <span className="absolute -top-1.5 -right-3 bg-destructive text-destructive-foreground text-[0.5rem] font-display font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                    5
                  </span>
                )}
                {tab.id === 'betslip' && betCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                    className="absolute -top-1.5 -right-3 bg-destructive text-destructive-foreground text-[0.5rem] font-display font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center"
                  >
                    {betCount}
                  </motion.span>
                )}
              </div>
              <span className="text-[0.55rem] font-body font-medium truncate max-w-[56px]">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default BottomNav;
