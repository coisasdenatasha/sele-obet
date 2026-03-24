import { Home, Zap, Search, Receipt, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBetSlipStore } from '@/store/betSlipStore';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  onBetSlipToggle: () => void;
}

const tabs = [
  { id: '/', icon: Home, label: 'Home' },
  { id: '/ao-vivo', icon: Zap, label: 'Ao Vivo' },
  { id: '/busca', icon: Search, label: 'Busca' },
  { id: 'betslip', icon: Receipt, label: 'Bilhete' },
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
    <nav className="fixed bottom-0 left-0 right-0 z-30 glass lg:hidden">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = tab.id !== 'betslip' && location.pathname === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTap(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] transition-colors relative",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon size={22} />
              <span className="text-[0.6rem] font-body font-medium">{tab.label}</span>
              {tab.id === 'betslip' && betCount > 0 && (
                <span className="absolute -top-0.5 right-0.5 bg-primary text-primary-foreground text-[0.55rem] font-display font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {betCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
