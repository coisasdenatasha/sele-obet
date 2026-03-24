import { useState } from 'react';
import { Search, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import GlobalSearch from '@/components/GlobalSearch';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuToggle?: () => void;
}

const Header = ({ onMenuToggle }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuthStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'aposte' | 'social'>('aposte');

  const isHome = location.pathname === '/';

  return (
    <>
      <header className="sticky top-0 z-30 bg-background">
        {/* Top red gradient line */}
        <div className="h-0.5 bg-gradient-to-r from-destructive via-destructive/80 to-transparent" />
        
        {/* Main header row */}
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={onMenuToggle} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors">
            <Menu size={24} strokeWidth={1.5} />
          </button>

          <button onClick={() => navigate('/')} className="flex items-center">
            <span className="font-display text-xl text-primary font-extrabold tracking-tight">Seleção</span>
            <span className="font-display text-xl text-foreground font-extrabold tracking-tight">Bet</span>
          </button>

          <button 
            onClick={() => setSearchOpen(true)} 
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
          >
            <Search size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Tabs row - only on home */}
        {isHome && (
          <div className="flex gap-6 px-4 pb-1">
            <button
              onClick={() => setActiveTab('aposte')}
              className={cn(
                "pb-2 font-display text-base font-bold transition-colors relative",
                activeTab === 'aposte' ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              Aposte
              {activeTab === 'aposte' && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-destructive rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={cn(
                "pb-2 font-display text-base font-bold transition-colors relative",
                activeTab === 'social' ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              SuperSocial
              {activeTab === 'social' && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-destructive rounded-full" />
              )}
            </button>
          </div>
        )}
      </header>

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Header;
