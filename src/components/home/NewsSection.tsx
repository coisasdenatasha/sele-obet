import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Loader2, ExternalLink } from 'lucide-react';
import { SectionReveal } from '@/components/animations';
import { supabase } from '@/integrations/supabase/client';

interface FifaArticle {
  title: string;
  url: string;
  image: string;
  tag: string;
}

const NewsSection = () => {
  const [articles, setArticles] = useState<FifaArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fetch-fifa-news');
        if (!error && data?.articles) {
          setArticles(data.articles);
          setLastUpdated(data.updated_at);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll contínuo e lento
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || articles.length === 0) return;

    let animId: number;
    let paused = false;

    const step = () => {
      if (!paused && el) {
        el.scrollLeft += 0.3;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
          el.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(step);
    };

    const pause = () => { paused = true; };
    const resume = () => { setTimeout(() => { paused = false; }, 2000); };

    el.addEventListener('pointerdown', pause);
    el.addEventListener('pointerup', resume);
    el.addEventListener('pointerenter', pause);
    el.addEventListener('pointerleave', resume);
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resume);

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
      el.removeEventListener('pointerdown', pause);
      el.removeEventListener('pointerup', resume);
      el.removeEventListener('pointerenter', pause);
      el.removeEventListener('pointerleave', resume);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resume);
    };
  }, [articles]);

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Agora';
    if (mins < 60) return `${mins}min atrás`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h atrás`;
    return `${Math.floor(hours / 24)}d atrás`;
  };

  return (
    <SectionReveal>
      <section className="px-4">
        <motion.div
          className="flex items-center justify-between mb-3"
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="font-display text-lg font-bold flex items-center gap-2">
              <Newspaper size={20} className="text-primary" />
              Notícias Copa 2026
            </h2>
            {lastUpdated && (
              <p className="text-[0.55rem] font-body text-muted-foreground mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                Ao vivo · Atualizado {timeAgo(lastUpdated)}
              </p>
            )}
          </div>
          <a
            href="https://www.fifa.com/pt/tournaments/mens/worldcup/canadamexicousa2026"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary font-body font-semibold flex items-center gap-0.5 min-h-[44px]"
          >
            FIFA.com <ExternalLink size={12} />
          </a>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : (
          <div ref={scrollRef} className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
            {articles.map((article, i) => (
              <motion.a
                key={i}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex-shrink-0 w-[200px] bg-surface-card rounded-xl overflow-hidden group"
              >
                <div className="relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-[120px] object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-[0.5rem] font-display font-bold px-1.5 py-0.5 rounded">
                    {article.tag}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-[0.6rem] font-body text-muted-foreground flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                    FIFA.com
                  </p>
                  <p className="font-display text-xs font-bold mt-1 leading-snug line-clamp-3 group-hover:text-primary transition-colors">
                    {article.title}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </section>
    </SectionReveal>
  );
};

export default NewsSection;
