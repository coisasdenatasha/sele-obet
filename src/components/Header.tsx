import { Search, Bell, Wallet, UserCircle, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface HeaderProps {
  onMenuToggle?: () => void;
}

const Header = ({ onMenuToggle }: HeaderProps) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 bg-accent px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <button onClick={onMenuToggle} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors lg:hidden">
            <Menu size={22} />
          </button>
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5">
            <span className="font-display text-xl text-primary font-extrabold tracking-tight">Seleção</span>
            <span className="font-display text-xl text-foreground font-extrabold tracking-tight">Bet</span>
          </button>
        </div>

        <nav className="hidden lg:flex items-center gap-6">
          {['Esportes', 'Ao Vivo', 'Cassino', 'Jogos Crash', 'Virtuais'].map((item) => (
            <button key={item} className="text-sm font-body font-medium text-foreground/70 hover:text-foreground transition-colors min-h-[44px]">
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button onClick={() => navigate('/busca')} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors">
            <Search size={20} />
          </button>
          {isLoggedIn ? (
            <>
              <button className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
              </button>
              <button onClick={() => navigate('/carteira')} className="flex items-center gap-1.5 bg-surface-interactive rounded-full px-3 py-1.5 min-h-[44px]">
                <Wallet size={16} className="text-primary" />
                <span className="font-display text-sm font-bold">R$ 1.250</span>
              </button>
            </>
          ) : (
            <button onClick={() => navigate('/auth')} className="flex items-center gap-1.5 bg-primary text-primary-foreground rounded-full px-4 py-1.5 min-h-[44px]">
              <UserCircle size={16} />
              <span className="font-display text-sm font-bold">Entrar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
