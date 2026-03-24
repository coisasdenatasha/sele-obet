import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  CircleDot, Dribbble, Target, Gamepad2, Swords, Circle, Bike, Waves, Zap,
  Trophy, Flag, Crosshair, Dumbbell, Timer, Car, Horse, Volleyball,
  type LucideIcon
} from 'lucide-react';

const sports: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'futebol', label: 'Futebol', icon: CircleDot },
  { id: 'basquete', label: 'Basquete', icon: Dribbble },
  { id: 'tenis', label: 'Tênis', icon: Target },
  { id: 'tenis-mesa', label: 'Tênis de Mesa', icon: Target },
  { id: 'volei', label: 'Vôlei', icon: Circle },
  { id: 'mma', label: 'MMA/UFC', icon: Swords },
  { id: 'boxe', label: 'Boxe', icon: Dumbbell },
  { id: 'esports', label: 'Esports', icon: Gamepad2 },
  { id: 'futebol-americano', label: 'Futebol Americano', icon: Trophy },
  { id: 'beisebol', label: 'Beisebol', icon: Crosshair },
  { id: 'hockey', label: 'Hockey', icon: Flag },
  { id: 'handball', label: 'Handebol', icon: Circle },
  { id: 'rugby', label: 'Rugby', icon: Trophy },
  { id: 'f1', label: 'Fórmula 1', icon: Car },
  { id: 'ciclismo', label: 'Ciclismo', icon: Bike },
  { id: 'natacao', label: 'Natação', icon: Waves },
  { id: 'atletismo', label: 'Atletismo', icon: Timer },
  { id: 'corrida-cavalos', label: 'Corrida de Cavalos', icon: Horse },
  { id: 'cricket', label: 'Cricket', icon: Crosshair },
  { id: 'dardos', label: 'Dardos', icon: Target },
  { id: 'sinuca', label: 'Sinuca', icon: Circle },
  { id: 'badminton', label: 'Badminton', icon: Volleyball },
  { id: 'futsal', label: 'Futsal', icon: CircleDot },
  { id: 'waterpolo', label: 'Polo Aquático', icon: Waves },
  { id: 'esqui', label: 'Esqui', icon: Flag },
  { id: 'golf', label: 'Golf', icon: Flag },
  { id: 'nascar', label: 'NASCAR', icon: Car },
  { id: 'motogp', label: 'MotoGP', icon: Zap },
];

interface SportFilterProps {
  onFilterChange?: (sport: string) => void;
}

const SportFilter = ({ onFilterChange }: SportFilterProps) => {
  const [active, setActive] = useState('futebol');

  const handleClick = (id: string) => {
    setActive(id);
    onFilterChange?.(id);
  };

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-1">
      {sports.map((sport) => (
        <button
          key={sport.id}
          onClick={() => handleClick(sport.id)}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-body font-medium whitespace-nowrap transition-colors min-h-[44px]",
            active === sport.id
              ? "bg-primary text-primary-foreground"
              : "bg-surface-interactive text-muted-foreground hover:text-foreground"
          )}
        >
          <sport.icon size={16} />
          {sport.label}
        </button>
      ))}
    </div>
  );
};

export default SportFilter;
