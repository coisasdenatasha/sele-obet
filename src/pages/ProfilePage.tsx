import { useNavigate } from 'react-router-dom';
import { User, TrendingUp, History, Shield, Settings, LogOut, ChevronRight, Award, Trophy, CreditCard, Star, UserPlus, LogIn } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Apostas', value: '142' },
  { label: 'Taxa de Acerto', value: '58%' },
  { label: 'ROI', value: '+12.4%' },
  { label: 'Nível', value: 'Ouro' },
];

const menuItems = [
  { icon: History, label: 'Histórico de Apostas', route: '' },
  { icon: TrendingUp, label: 'Relatório de Desempenho', route: '' },
  { icon: Trophy, label: 'Bolão', route: '/bolao' },
  { icon: Award, label: 'Plano Premium', route: '/planos' },
  { icon: CreditCard, label: 'Carteira', route: '/carteira' },
  { icon: Shield, label: 'Jogo Responsável', route: '/configuracoes' },
  { icon: Settings, label: 'Configurações', route: '/configuracoes' },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, profile, logout } = useAuthStore();

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center px-6 pt-12 pb-20 space-y-6 text-center">
        <div className="w-20 h-20 rounded-full bg-surface-card flex items-center justify-center">
          <User size={36} className="text-muted-foreground" />
        </div>
        <div>
          <h2 className="font-display text-xl font-extrabold">Visitante</h2>
          <p className="text-sm font-body text-muted-foreground mt-1">
            Você está navegando como visitante
          </p>
        </div>

        <div className="w-full bg-surface-card rounded-2xl p-5 space-y-3">
          <p className="text-sm font-body text-foreground/80">
            Uma experiência única em apostas te espera. Mas antes, precisamos te conhecer!
          </p>
          <div className="flex gap-2">
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/auth')}
              className="flex-1 bg-primary text-primary-foreground font-display font-bold text-sm py-3 rounded-xl min-h-[44px] flex items-center justify-center gap-1.5">
              <UserPlus size={16} />
              Registre-se
            </motion.button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/auth')}
              className="flex-1 bg-surface-interactive text-foreground font-display font-bold text-sm py-3 rounded-xl min-h-[44px] flex items-center justify-center gap-1.5">
              <LogIn size={16} />
              Login
            </motion.button>
          </div>
        </div>

        <button onClick={() => navigate('/configuracoes')} className="flex items-center gap-2 text-sm font-body text-muted-foreground min-h-[44px]">
          <Settings size={16} />
          Configurações
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 px-4 pt-2">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
          <User size={28} className="text-primary" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold">{profile?.full_name || 'Usuário'}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="bg-primary/20 text-primary text-[0.65rem] font-display font-bold px-2 py-0.5 rounded-full">
              <Star size={12} className="inline mr-0.5" /> Nível {profile?.level || 'Bronze'}
            </span>
            <span className="text-xs text-muted-foreground font-body">@{profile?.username || 'usuario'}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-card rounded-xl p-3 text-center">
            <p className="font-display text-lg font-bold text-primary">{stat.value}</p>
            <p className="text-[0.6rem] text-muted-foreground font-body mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => item.route && navigate(item.route)}
            className="w-full flex items-center justify-between bg-surface-card rounded-xl p-4 min-h-[44px] hover:bg-surface-interactive transition-colors"
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} className="text-muted-foreground" />
              <span className="text-sm font-body font-medium">{item.label}</span>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        ))}
      </div>

      <button
        onClick={() => { logout(); navigate('/'); }}
        className="w-full flex items-center justify-center gap-2 bg-destructive/10 text-destructive rounded-xl p-4 min-h-[44px] font-body font-medium text-sm"
      >
        <LogOut size={18} />
        Sair da Conta
      </button>
    </div>
  );
};

export default ProfilePage;
