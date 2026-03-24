import { motion } from 'framer-motion';
import { Play, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SectionReveal } from '@/components/animations';

const replays = [
  { id: 'r-1', minute: "54'", player: 'P. Dulcea', match: 'Unirea Slobozia 2-1 Otelul Galati', duration: '00:18' },
  { id: 'r-2', minute: "21'", player: 'S. Banovic', match: 'Unirea Slobozia 1-0 Otelul Galati', duration: '00:22' },
  { id: 'r-3', minute: "67'", player: 'Gabigol', match: 'Flamengo 2-1 Palmeiras', duration: '00:15' },
];

const GoalReplaysSection = () => {
  return (
    <SectionReveal>
      <section className="px-4">
        <motion.div
          className="flex items-center justify-between mb-3"
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-lg font-bold flex items-center gap-2">
            <Play size={20} className="text-secondary" fill="currentColor" />
            Replays de Gols ({replays.length})
          </h2>
          <button className="text-xs text-primary font-body font-semibold flex items-center gap-0.5 min-h-[44px]">
            Ver tudo <ChevronRight size={14} />
          </button>
        </motion.div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
          {replays.map((r) => (
            <motion.button
              key={r.id}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex-shrink-0 w-[240px] bg-surface-card rounded-xl overflow-hidden text-left"
            >
              {/* Video placeholder */}
              <div className="relative h-[135px] bg-surface-section flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-foreground/20 backdrop-blur-sm flex items-center justify-center">
                  <Play size={20} className="text-foreground" fill="currentColor" />
                </div>
                <span className="absolute bottom-2 right-2 text-[0.6rem] font-display font-bold bg-background/80 backdrop-blur-sm text-foreground px-1.5 py-0.5 rounded">
                  {r.duration}
                </span>
              </div>
              <div className="p-3">
                <p className="font-display text-sm font-bold">{r.minute} {r.player}</p>
                <p className="text-[0.6rem] font-body text-muted-foreground mt-0.5 truncate">{r.match}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>
    </SectionReveal>
  );
};

export default GoalReplaysSection;
