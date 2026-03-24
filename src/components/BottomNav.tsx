import { Home, Zap, Dice5, Rocket, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBetSlipStore } from '@/store/betSlipStore';
import { cn } from '@/lib/utils';

const tabs = [
  { id: '/', icon: Home, label: 'Home' },
  { id: '/ao-vivo', icon: Zap, label: 'Ao Vivo' },
  { id: '/cassino', icon: Dice5, label: 'Cassino' },
  { id: '/crash', icon: Rocket, label: 'Crash' },
  { id: '/perfil', icon: User, label: 'Conta' },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const betCount = useBetSlipStore((s) => s.bets.length);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 glass lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] transition-colors relative",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon size={22} />
              <span className="text-[0.6rem] font-body font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
