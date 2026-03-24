import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import {
  CircleDot, Dribbble, Target, Gamepad2, Swords, Circle, Bike, Waves, Zap,
  Trophy, Flag, Crosshair, Dumbbell, Timer, Car, Volleyball,
} from 'lucide-react';

const sports: { id: string; label: string; icon: LucideIcon; count: number }[] = [
  { id: 'futebol', label: 'Futebol', icon: CircleDot, count: 342 },
  { id: 'basquete', label: 'Basquete', icon: Dribbble, count: 87 },
  { id: 'tenis', label: 'Tênis', icon: Target, count: 156 },
  { id: 'tenis-mesa', label: 'Tênis de Mesa', icon: Target, count: 64 },
  { id: 'volei', label: 'Vôlei', icon: Circle, count: 48 },
  { id: 'mma', label: 'MMA/UFC', icon: Swords, count: 23 },
  { id: 'boxe', label: 'Boxe', icon: Dumbbell, count: 15 },
  { id: 'esports', label: 'Esports', icon: Gamepad2, count: 112 },
  { id: 'futebol-americano', label: 'Futebol Americano', icon: Trophy, count: 38 },
  { id: 'beisebol', label: 'Beisebol', icon: Crosshair, count: 29 },
  { id: 'hockey', label: 'Hockey', icon: Flag, count: 42 },
  { id: 'handball', label: 'Handebol', icon: Circle, count: 31 },
  { id: 'rugby', label: 'Rugby', icon: Trophy, count: 18 },
  { id: 'f1', label: 'Fórmula 1', icon: Car, count: 8 },
  { id: 'ciclismo', label: 'Ciclismo', icon: Bike, count: 12 },
  { id: 'natacao', label: 'Natação', icon: Waves, count: 6 },
  { id: 'atletismo', label: 'Atletismo', icon: Timer, count: 14 },
  { id: 'corrida-cavalos', label: 'Corrida de Cavalos', icon: Trophy, count: 22 },
  { id: 'cricket', label: 'Cricket', icon: Crosshair, count: 35 },
  { id: 'dardos', label: 'Dardos', icon: Target, count: 10 },
  { id: 'sinuca', label: 'Sinuca', icon: Circle, count: 16 },
  { id: 'badminton', label: 'Badminton', icon: Volleyball, count: 19 },
  { id: 'futsal', label: 'Futsal', icon: CircleDot, count: 24 },
  { id: 'waterpolo', label: 'Polo Aquático', icon: Waves, count: 5 },
  { id: 'golf', label: 'Golf', icon: Flag, count: 9 },
  { id: 'nascar', label: 'NASCAR', icon: Car, count: 4 },
  { id: 'motogp', label: 'MotoGP', icon: Zap, count: 7 },
];

interface SportFilterProps {
  onFilterChange?: (sport: string) => void;
}

const SportFilter = ({ onFilterChange }: SportFilterProps) => {
  const [active, setActive] = useState('futebol');
  const [expanded, setExpanded] = useState(false);

  const handleClick = (id: string) => {
    setActive(id);
    onFilterChange?.(id);
  };

  const visibleSports = expanded ? sports : sports.slice(0, 8);

  return (
    <div className="space-y-2">
      {/* Quick horizontal scroll for top sports */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {sports.slice(0, 10).map((sport) => (
          <button
            key={sport.id}
            onClick={() => handleClick(sport.id)}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-body font-medium whitespace-nowrap transition-colors min-h-[36px]",
              active === sport.id
                ? "bg-primary text-primary-foreground"
                : "bg-surface-interactive text-muted-foreground hover:text-foreground"
            )}
          >
            <sport.icon size={14} />
            {sport.label}
          </button>
        ))}
      </div>

      {/* Vertical grid list */}
      <div className="grid grid-cols-2 gap-1.5">
        {visibleSports.map((sport) => (
          <button
            key={sport.id}
            onClick={() => handleClick(sport.id)}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors min-h-[44px]",
              active === sport.id
                ? "bg-primary/10 text-primary"
                : "bg-surface-card text-foreground/80 hover:bg-surface-interactive"
            )}
          >
            <sport.icon size={18} className={active === sport.id ? 'text-primary' : 'text-muted-foreground'} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-body font-semibold truncate">{sport.label}</p>
              <p className="text-[0.55rem] font-body text-muted-foreground">{sport.count} eventos</p>
            </div>
          </button>
        ))}
      </div>

      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="w-full flex items-center justify-center gap-1 text-xs font-body font-semibold text-primary py-2 min-h-[44px]"
        >
          Ver todos os esportes ({sports.length})
          <ChevronRight size={14} />
        </button>
      )}

      {expanded && (
        <button
          onClick={() => setExpanded(false)}
          className="w-full flex items-center justify-center gap-1 text-xs font-body font-semibold text-muted-foreground py-2 min-h-[44px]"
        >
          Mostrar menos
        </button>
      )}
    </div>
  );
};

export default SportFilter;
