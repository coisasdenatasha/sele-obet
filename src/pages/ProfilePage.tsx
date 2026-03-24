import { User, TrendingUp, History, Shield, Settings, LogOut, ChevronRight, Award } from 'lucide-react';

const stats = [
  { label: 'Apostas', value: '142' },
  { label: 'Taxa de Acerto', value: '58%' },
  { label: 'ROI', value: '+12.4%' },
  { label: 'Nível', value: 'Ouro' },
];

const menuItems = [
  { icon: History, label: 'Histórico de Apostas' },
  { icon: TrendingUp, label: 'Relatório de Desempenho' },
  { icon: Award, label: 'Plano Premium' },
  { icon: Shield, label: 'Jogo Responsável' },
  { icon: Settings, label: 'Configurações' },
];

const ProfilePage = () => {
  return (
    <div className="space-y-6 pb-20 px-4 pt-2">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
          <User size={28} className="text-primary" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold">João Silva</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="bg-primary/20 text-primary text-[0.65rem] font-display font-bold px-2 py-0.5 rounded-full">
              ⭐ Nível Ouro
            </span>
            <span className="text-xs text-muted-foreground font-body">Membro desde Jan 2025</span>
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

      <button className="w-full flex items-center justify-center gap-2 bg-destructive/10 text-destructive rounded-xl p-4 min-h-[44px] font-body font-medium text-sm">
        <LogOut size={18} />
        Sair da Conta
      </button>
    </div>
  );
};

export default ProfilePage;
