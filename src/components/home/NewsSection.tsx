import { motion } from 'framer-motion';
import { Newspaper, ChevronRight } from 'lucide-react';
import { SectionReveal } from '@/components/animations';

const news = [
  {
    id: 'n-1',
    title: 'Flamengo x Palmeiras – Prévia e Estatísticas',
    time: '4 dias atrás',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=300&h=200&fit=crop',
  },
  {
    id: 'n-2',
    title: 'Corinthians x São Paulo – Derby Paulista',
    time: '2 dias atrás',
    image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=300&h=200&fit=crop',
  },
  {
    id: 'n-3',
    title: 'Real Madrid x Barcelona – El Clásico',
    time: '1 dia atrás',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=300&h=200&fit=crop',
  },
];

const NewsSection = () => {
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
            <Newspaper size={20} className="text-primary" />
            Notícias
          </h2>
          <button className="text-xs text-primary font-body font-semibold flex items-center gap-0.5 min-h-[44px]">
            Ver tudo <ChevronRight size={14} />
          </button>
        </motion.div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
          {news.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex-shrink-0 w-[200px] bg-surface-card rounded-xl overflow-hidden"
            >
              <img
                src={n.image}
                alt={n.title}
                className="w-full h-[120px] object-cover"
                loading="lazy"
              />
              <div className="p-3">
                <p className="text-[0.6rem] font-body text-muted-foreground">{n.time}</p>
                <p className="font-display text-xs font-bold mt-1 leading-snug line-clamp-3">{n.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </SectionReveal>
  );
};

export default NewsSection;
