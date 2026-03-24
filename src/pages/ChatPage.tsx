import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, TrendingUp, MessageCircle, Crown, Flame, ThumbsUp,
  Plus, Clock, Target, Zap, UserCircle, Star, Copy,
  MessageSquare, CheckCircle2, Share2, Bookmark,
  Flag, Radio, BarChart3, CreditCard, Swords, Award, CircleDot
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

interface FeedPost {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    level: string;
    verified: boolean;
  };
  timeAgo: string;
  text?: string;
  bet: {
    match: string;
    league: string;
    market: string;
    odd: number;
    stake?: number;
    result?: 'green' | 'red' | 'pending';
  };
  likes: number;
  comments: Comment[];
  copies: number;
  liked?: boolean;
}

interface Comment {
  id: string;
  user: string;
  avatar: string;
  verified: boolean;
  text: string;
  timeAgo: string;
  likes: number;
}

type Tab = 'popular' | 'apostas' | 'criar' | 'recentes' | 'odds100' | 'gols' | 'jogadores';

const tabsList: { id: Tab; label: string; icon: typeof Flame }[] = [
  { id: 'popular', label: 'Popular', icon: Flame },
  { id: 'apostas', label: 'Apostas', icon: TrendingUp },
  { id: 'recentes', label: 'Recentes', icon: Clock },
  { id: 'odds100', label: 'Odds > 100', icon: Zap },
  { id: 'gols', label: 'Gols', icon: Target },
  { id: 'jogadores', label: 'Jogadores', icon: UserCircle },
  { id: 'criar', label: 'Criar', icon: Plus },
];

const avatars = [
  'https://i.pravatar.cc/80?img=1',
  'https://i.pravatar.cc/80?img=2',
  'https://i.pravatar.cc/80?img=3',
  'https://i.pravatar.cc/80?img=4',
  'https://i.pravatar.cc/80?img=5',
  'https://i.pravatar.cc/80?img=6',
  'https://i.pravatar.cc/80?img=7',
  'https://i.pravatar.cc/80?img=8',
  'https://i.pravatar.cc/80?img=9',
  'https://i.pravatar.cc/80?img=10',
  'https://i.pravatar.cc/80?img=11',
  'https://i.pravatar.cc/80?img=12',
];

const makeComments = (texts: string[]): Comment[] =>
  texts.map((t, i) => ({
    id: `c${i}`,
    user: ['Lucas M.', 'Bruna S.', 'Felipe R.', 'Camila D.', 'Andre L.', 'Tatiana P.'][i % 6],
    avatar: `https://i.pravatar.cc/40?img=${20 + i}`,
    verified: i === 0,
    text: t,
    timeAgo: `${i + 1}h`,
    likes: Math.floor(Math.random() * 50),
  }));

const feedPosts: FeedPost[] = [
  {
    id: '1',
    user: { name: 'Carlos Mendes', username: '@carlosm', avatar: avatars[0], level: 'VIP', verified: true },
    timeAgo: '2 min',
    text: 'Confia nessa, galera! Fla vai destruir hoje',
    bet: { match: 'Flamengo x Palmeiras', league: 'Brasileirao Serie A', market: 'Resultado Final - Flamengo', odd: 2.10, stake: 50, result: 'pending' },
    likes: 124, comments: makeComments(['Bora Mengao!', 'Vou copiar essa', 'Arriscado hein']), copies: 18,
  },
  {
    id: '2',
    user: { name: 'Neymar Jr', username: '@neymarjr', avatar: avatars[1], level: 'VIP', verified: true },
    timeAgo: '15 min',
    text: 'Bora Brasil! Sem medo',
    bet: { match: 'Brasil x Franca', league: 'Amistoso Internacional', market: 'Resultado Final - Brasil', odd: 3.20, stake: 1000, result: 'pending' },
    likes: 8943, comments: makeComments(['O cara apostou 1000 reais', 'Se o Ney ta confiante eu to tambem', 'Vamo selecao!', 'Copiado!', 'Odd boa demais']), copies: 3421,
  },
  {
    id: '3',
    user: { name: 'Ana Paula', username: '@anapbet', avatar: avatars[2], level: 'Ouro', verified: false },
    timeAgo: '28 min',
    bet: { match: 'Real Madrid x Barcelona', league: 'La Liga', market: 'Ambos Marcam - Sim', odd: 1.72, stake: 30, result: 'green' },
    likes: 89, comments: makeComments(['Green bonito', 'Essa sempre paga']), copies: 45,
  },
  {
    id: '4',
    user: { name: 'Rafael Koch', username: '@rafaelk', avatar: avatars[3], level: 'VIP', verified: true },
    timeAgo: '1h',
    text: 'Tip do dia. Confiem no pai',
    bet: { match: 'Liverpool x Arsenal', league: 'Premier League', market: 'Over 2.5 Gols', odd: 1.85, stake: 100, result: 'green' },
    likes: 567, comments: makeComments(['Monstro demais', 'Sempre acerta', 'Melhor tipster da plataforma', 'Green!']), copies: 234,
  },
  {
    id: '5',
    user: { name: 'Thiago Fernandes', username: '@thifern', avatar: avatars[4], level: 'Prata', verified: false },
    timeAgo: '1h',
    bet: { match: 'Corinthians x Sao Paulo', league: 'Brasileirao Serie A', market: 'Empate', odd: 3.40, stake: 20, result: 'red' },
    likes: 12, comments: makeComments(['Nao deu dessa vez']), copies: 2,
  },
  {
    id: '6',
    user: { name: 'Ronaldo Fenomeno', username: '@ronaldo', avatar: avatars[5], level: 'VIP', verified: true },
    timeAgo: '2h',
    text: 'Multipla insana, quem tem coragem?',
    bet: { match: 'Multipla 5 jogos', league: 'Varias ligas', market: 'Combo especial', odd: 145.00, stake: 10, result: 'pending' },
    likes: 4521, comments: makeComments(['Loucura total', 'Se pagar eu te sigo pra sempre', 'Copiado na fe', 'All in!']), copies: 1567,
  },
  {
    id: '7',
    user: { name: 'Juliana Costa', username: '@julibet', avatar: avatars[6], level: 'Ouro', verified: false },
    timeAgo: '2h',
    text: 'GREEN! Obrigada @rafaelk pela dica',
    bet: { match: 'Manchester City x Chelsea', league: 'Premier League', market: 'Vit. Man City + Over 1.5', odd: 2.45, stake: 40, result: 'green' },
    likes: 234, comments: makeComments(['Parabens!', 'Quanto ganhou?', 'Vou seguir ele tambem']), copies: 67,
  },
  {
    id: '8',
    user: { name: 'Diego Silva', username: '@diegosil', avatar: avatars[7], level: 'VIP', verified: true },
    timeAgo: '3h',
    bet: { match: 'Boca Juniors x River Plate', league: 'Libertadores', market: 'Ambos Marcam + Over 2.5', odd: 3.80, stake: 25, result: 'pending' },
    likes: 345, comments: makeComments(['Superclassico!', 'Odd linda']), copies: 89,
  },
  {
    id: '9',
    user: { name: 'Fernanda Lima', username: '@ferbet', avatar: avatars[8], level: 'Ouro', verified: false },
    timeAgo: '4h',
    text: 'Vini Jr vai marcar, pode printar',
    bet: { match: 'Real Madrid x Barcelona', league: 'La Liga', market: 'Vini Jr - Marca a qualquer momento', odd: 2.10, stake: 50, result: 'green' },
    likes: 456, comments: makeComments(['Craque demais', 'Printei e deu green!', 'Vou copiar na proxima']), copies: 123,
  },
  {
    id: '10',
    user: { name: 'Pedro Henrique', username: '@pedroh99', avatar: avatars[9], level: 'Bronze', verified: false },
    timeAgo: '5h',
    bet: { match: 'Gremio x Internacional', league: 'Brasileirao Serie A', market: 'Resultado Final - Gremio', odd: 2.30, stake: 15, result: 'red' },
    likes: 18, comments: makeComments(['Grenal e sempre imprevisivel']), copies: 1,
  },
  {
    id: '11',
    user: { name: 'Casimiro', username: '@casimiro', avatar: avatars[10], level: 'VIP', verified: true },
    timeAgo: '6h',
    text: 'METEU ESSA? Odd absurda pagou!',
    bet: { match: 'Multipla 8 jogos', league: 'Varias ligas', market: 'Super Combo', odd: 320.00, stake: 5, result: 'green' },
    likes: 12400, comments: makeComments(['IMPOSSIVEL', 'Quanto esse maluco ganhou?', 'R$ 1600 com 5 reais???', 'Lenda', 'Casimiro eh outro nivel']), copies: 5600,
  },
  {
    id: '12',
    user: { name: 'Mariana Santos', username: '@marisantos', avatar: avatars[11], level: 'Ouro', verified: false },
    timeAgo: '7h',
    bet: { match: 'Bayern x Dortmund', league: 'Bundesliga', market: 'Over 3.5 Gols', odd: 2.00, stake: 35, result: 'green' },
    likes: 156, comments: makeComments(['Bundesliga sempre da gol', 'Boa!']), copies: 45,
  },
];

const onlineUsers = 12847;

const getLevelStyle = (level: string) => {
  switch (level) {
    case 'VIP': return 'text-primary bg-primary/20';
    case 'Ouro': return 'text-primary bg-primary/10';
    case 'Prata': return 'text-foreground bg-surface-interactive';
    case 'Bronze': return 'text-muted-foreground bg-surface-interactive';
    default: return 'text-muted-foreground bg-surface-interactive';
  }
};

const formatNumber = (n: number) => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
};

const ChatPage = () => {
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('popular');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [createName, setCreateName] = useState('');
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [sharePost, setSharePost] = useState<string | null>(null);

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId); else next.add(postId);
      return next;
    });
  };

  const toggleSave = (postId: string) => {
    setSavedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId); else next.add(postId);
      return next;
    });
  };

  const getFilteredPosts = () => {
    switch (activeTab) {
      case 'popular': return feedPosts.sort((a, b) => b.likes - a.likes);
      case 'apostas': return feedPosts.filter(p => p.bet.result === 'pending');
      case 'recentes': return [...feedPosts].reverse();
      case 'odds100': return feedPosts.filter(p => p.bet.odd >= 100);
      case 'gols': return feedPosts.filter(p => p.bet.market.toLowerCase().includes('gol') || p.bet.market.toLowerCase().includes('marca') || p.bet.market.toLowerCase().includes('over'));
      case 'jogadores': return feedPosts.filter(p => p.bet.market.includes('Vini') || p.bet.market.includes('Jr') || p.user.verified);
      default: return feedPosts;
    }
  };

  const ResultBadge = ({ result }: { result?: 'green' | 'red' | 'pending' }) => {
    if (!result) return null;
    if (result === 'green') return (
      <span className="flex items-center gap-1 text-[0.6rem] font-display font-bold text-secondary bg-secondary/15 px-2 py-0.5 rounded-full">
        <CheckCircle2 size={10} /> GREEN
      </span>
    );
    if (result === 'red') return (
      <span className="flex items-center gap-1 text-[0.6rem] font-display font-bold text-destructive bg-destructive/15 px-2 py-0.5 rounded-full">
        RED
      </span>
    );
    return (
      <span className="flex items-center gap-1 text-[0.6rem] font-display font-bold text-primary bg-primary/15 px-2 py-0.5 rounded-full">
        <Clock size={10} /> AO VIVO
      </span>
    );
  };

  const PostCard = ({ post }: { post: FeedPost }) => {
    const isLiked = likedPosts.has(post.id);
    const isSaved = savedPosts.has(post.id);
    const isCommentsOpen = openComments === post.id;
    const [newComment, setNewComment] = useState('');
    const [localComments, setLocalComments] = useState(post.comments);
    const commentInputRef = useRef<HTMLInputElement>(null);

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-card rounded-xl overflow-hidden"
      >
        {/* User header */}
        <div className="flex items-center gap-3 p-3 pb-2">
          <div className="relative">
            <img
              src={post.user.avatar}
              alt={post.user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {post.user.level === 'VIP' && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <Crown size={8} className="text-primary-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-display font-bold text-foreground truncate">{post.user.name}</span>
              {post.user.verified && (
                <CheckCircle2 size={14} className="text-primary flex-shrink-0" fill="currentColor" strokeWidth={0} />
              )}
              <span className={`text-[0.5rem] font-display font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${getLevelStyle(post.user.level)}`}>
                {post.user.level}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[0.65rem] font-body text-muted-foreground">{post.user.username}</span>
              <span className="text-[0.5rem] text-muted-foreground/50">-</span>
              <span className="text-[0.65rem] font-body text-muted-foreground">{post.timeAgo}</span>
            </div>
          </div>
          <ResultBadge result={post.bet.result} />
        </div>

        {/* Text */}
        {post.text && (
          <p className="px-3 pb-2 text-sm font-body text-foreground/90">{post.text}</p>
        )}

        {/* Bet card */}
        <div className="mx-3 mb-3 rounded-xl bg-surface-section p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary/15 flex items-center justify-center">
                <TrendingUp size={14} className="text-primary" />
              </div>
              <div>
                <p className="text-[0.65rem] font-body text-muted-foreground uppercase tracking-wide">{post.bet.league}</p>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-display font-bold text-foreground">{post.bet.match}</p>
            <p className="text-xs font-body text-foreground/70">{post.bet.market}</p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 rounded-lg px-3 py-1.5">
                <span className="text-xs font-body text-muted-foreground">Odd</span>
                <p className={`text-sm font-display font-extrabold ${post.bet.odd >= 100 ? 'text-primary' : 'text-foreground'}`}>
                  {post.bet.odd.toFixed(2)}
                </p>
              </div>
              {post.bet.stake && (
                <div>
                  <span className="text-xs font-body text-muted-foreground">Aposta</span>
                  <p className="text-sm font-display font-bold text-foreground">R$ {post.bet.stake}</p>
                </div>
              )}
              {post.bet.stake && (
                <div>
                  <span className="text-xs font-body text-muted-foreground">Retorno</span>
                  <p className="text-sm font-display font-bold text-secondary">R$ {(post.bet.stake * post.bet.odd).toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleLike(post.id)}
              className="flex items-center gap-1.5 min-h-[36px] transition-colors"
            >
              <ThumbsUp size={16} className={isLiked ? 'text-primary fill-primary' : 'text-muted-foreground'} />
              <span className={`text-xs font-body ${isLiked ? 'text-primary' : 'text-muted-foreground'}`}>
                {formatNumber(post.likes + (isLiked ? 1 : 0))}
              </span>
            </button>
            <button className="flex items-center gap-1.5 min-h-[36px] text-muted-foreground hover:text-foreground transition-colors">
              <MessageSquare size={16} />
              <span className="text-xs font-body">{formatNumber(post.comments)}</span>
            </button>
            <button className="flex items-center gap-1.5 min-h-[36px] text-muted-foreground hover:text-foreground transition-colors">
              <Share2 size={16} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleSave(post.id)}
              className="min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <Bookmark size={16} className={isSaved ? 'text-primary fill-primary' : 'text-muted-foreground'} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 bg-primary/15 text-primary px-3 py-1.5 rounded-lg text-xs font-display font-bold min-h-[36px] hover:bg-primary/25 transition-colors"
            >
              <Copy size={14} />
              Copiar Bilhete
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24 pt-16 overflow-y-auto">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-extrabold flex items-center gap-2">
            <MessageCircle size={22} className="text-primary" />
            Social
          </h1>
          <div className="flex items-center gap-1.5 bg-surface-card rounded-full px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-xs font-body font-semibold">{onlineUsers.toLocaleString('pt-BR')}</span>
            <Users size={14} className="text-muted-foreground" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4" style={{ WebkitOverflowScrolling: 'touch' }}>
          {tabsList.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-full text-xs font-body font-semibold min-h-[36px] transition-all ${
                  activeTab === t.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-surface-card text-muted-foreground'
                }`}
              >
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 mt-2">
        <AnimatePresence mode="wait">
          {/* CRIAR TAB */}
          {activeTab === 'criar' && (
            <motion.div key="criar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="bg-surface-card rounded-xl p-4 space-y-3">
                <h3 className="font-display font-bold text-sm flex items-center gap-2">
                  <Plus size={16} className="text-primary" />
                  Criar Publicacao
                </h3>
                <input
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="O que voce esta apostando?"
                  className="w-full bg-surface-interactive rounded-xl py-3 px-4 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground min-h-[44px]"
                />
                <div className="space-y-2">
                  <p className="text-xs font-body text-muted-foreground">Tipo</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Simples', 'Multipla', 'Tip', 'Analise', 'Resultado'].map(cat => (
                      <button key={cat} className="px-3 py-1.5 bg-surface-interactive rounded-full text-xs font-body text-foreground/70 hover:bg-primary hover:text-primary-foreground transition-colors min-h-[32px]">
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { if (!isLoggedIn) navigate('/auth'); }}
                  className="w-full bg-primary text-primary-foreground font-display font-bold text-sm py-3 rounded-xl min-h-[44px]"
                >
                  Publicar
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* FEED */}
          {activeTab !== 'criar' && (
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {activeTab === 'odds100' && (
                <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl p-4 mb-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap size={18} className="text-primary" />
                    <span className="font-display font-extrabold text-sm text-primary">ODDS INSANAS</span>
                  </div>
                  <p className="text-xs font-body text-foreground/70">Apostas com odds acima de 100x. Alto risco, alta recompensa!</p>
                </div>
              )}

              {getFilteredPosts().map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatPage;
