import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CircleDot, Dribbble, Target, Gamepad2, Swords, Circle, type LucideIcon } from 'lucide-react';

const sports: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'futebol', label: 'Futebol', icon: CircleDot },
  { id: 'basquete', label: 'Basquete', icon: Dribbble },
  { id: 'tenis', label: 'Tênis', icon: Target },
  { id: 'esports', label: 'Esports', icon: Gamepad2 },
  { id: 'mma', label: 'MMA', icon: Swords },
  { id: 'volei', label: 'Vôlei', icon: Circle },
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
