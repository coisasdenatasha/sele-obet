import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Users, TrendingUp, MessageCircle, Crown, Flame, ThumbsUp,
  Plus, Clock, Target, Zap, UserCircle, Trophy, Star, Hash
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

interface ChatMessage {
  id: string;
  user: string;
  username: string;
  level: string;
  avatar?: string;
  text: string;
  time: string;
  likes: number;
  isTip?: boolean;
  betInfo?: { match: string; market: string; odd: number; result?: 'green' | 'red' };
}

interface ChatRoom {
  id: string;
  name: string;
  emoji: string;
  members: number;
  lastMessage: string;
  category: string;
}

type Tab = 'popular' | 'apostas' | 'criar' | 'recentes' | 'odds100' | 'gols' | 'jogadores';

const tabs: { id: Tab; label: string; icon: typeof Flame }[] = [
  { id: 'popular', label: 'Popular', icon: Flame },
  { id: 'apostas', label: 'Apostas', icon: TrendingUp },
  { id: 'recentes', label: 'Recentes', icon: Clock },
  { id: 'odds100', label: 'Odds > 100', icon: Zap },
  { id: 'gols', label: 'Gols', icon: Target },
  { id: 'jogadores', label: 'Jogadores', icon: UserCircle },
  { id: 'criar', label: 'Criar', icon: Plus },
];

const rooms: ChatRoom[] = [
  { id: '1', name: 'Brasileirão Geral', emoji: '🇧🇷', members: 4821, lastMessage: 'Flamengo hoje vai meter!', category: 'popular' },
  { id: '2', name: 'Libertadores', emoji: '🏆', members: 3210, lastMessage: 'Quem pega essa odd do Boca?', category: 'popular' },
  { id: '3', name: 'Premier League BR', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', members: 2190, lastMessage: 'Arsenal tá voando demais', category: 'popular' },
  { id: '4', name: 'Tips do Dia', emoji: '💎', members: 5670, lastMessage: 'Green de R$ 500 agora!!!', category: 'popular' },
  { id: '5', name: 'Múltiplas & Combos', emoji: '🔥', members: 3450, lastMessage: 'Múltipla de 8.50 pagou!', category: 'apostas' },
  { id: '6', name: 'Ao Vivo - Reações', emoji: '🔴', members: 7820, lastMessage: 'GOOOOOOL DO MENGÃO!!!', category: 'apostas' },
  { id: '7', name: 'Over/Under Club', emoji: '📊', members: 1890, lastMessage: 'Over 2.5 sempre paga no Espanhol', category: 'apostas' },
  { id: '8', name: 'Cantos & Cartões', emoji: '🟨', members: 980, lastMessage: 'Over 9.5 cantos pagou bonito', category: 'apostas' },
  { id: '9', name: 'Odds Absurdas', emoji: '🚀', members: 6540, lastMessage: 'Peguei odd 250.00 e deu GREEN', category: 'odds100' },
  { id: '10', name: 'Loucuras > 100x', emoji: '💰', members: 4320, lastMessage: 'Múltipla de 12 jogos, odd 340', category: 'odds100' },
  { id: '11', name: 'Gols a Qualquer Momento', emoji: '⚽', members: 3200, lastMessage: 'Haaland marca primeiro, confia', category: 'gols' },
  { id: '12', name: 'Placar Exato', emoji: '🎯', members: 1450, lastMessage: '2x1 no clássico, tá pago', category: 'gols' },
  { id: '13', name: 'Ambos Marcam', emoji: '🤝', members: 2100, lastMessage: 'BTTS no Liverpool x City easy', category: 'gols' },
  { id: '14', name: 'Neymar Watch', emoji: '🇧🇷', members: 8900, lastMessage: 'Será que joga hoje?', category: 'jogadores' },
  { id: '15', name: 'Vini Jr. Fan Club', emoji: '⭐', members: 7650, lastMessage: 'Melhor do mundo, sem dúvidas', category: 'jogadores' },
  { id: '16', name: 'Haaland Machine', emoji: '🤖', members: 5430, lastMessage: 'Mais um hat-trick vindo aí', category: 'jogadores' },
  { id: '17', name: 'Mbappé Zone', emoji: '⚡', members: 6780, lastMessage: 'Odd de gol dele tá barata', category: 'jogadores' },
  { id: '18', name: 'Messi GOAT', emoji: '🐐', members: 9100, lastMessage: 'Último jogo da carreira?', category: 'jogadores' },
];

const mockMessages: ChatMessage[] = [
  { id: '1', user: 'Carlos M.', username: '@carlosm', level: 'VIP', text: 'Flamengo vai meter 3 hoje, confia! 🔥', time: '14:32', likes: 24, betInfo: { match: 'Flamengo x Palmeiras', market: 'Over 2.5', odd: 1.85 } },
  { id: '2', user: 'Ana Paula', username: '@anapbet', level: 'Ouro', text: 'Alguém viu a odd do Palmeiras? Tá valendo demais', time: '14:33', likes: 12 },
  { id: '3', user: 'Lucas R.', username: '@lucasr10', level: 'Prata', text: 'Peguei a múltipla de 15.00 ontem e deu green!! 💚', time: '14:35', likes: 45, isTip: true, betInfo: { match: 'Múltipla 4 jogos', market: 'Combo', odd: 15.00, result: 'green' } },
  { id: '4', user: 'Thiago F.', username: '@thifern', level: 'VIP', text: 'Over 2.5 no jogo do Real Madrid tá pagando 1.85, bora', time: '14:36', likes: 18, betInfo: { match: 'Real Madrid x Barcelona', market: 'Over 2.5', odd: 1.85 } },
  { id: '5', user: 'Mariana S.', username: '@marisantos', level: 'Ouro', text: 'Essa odd turbinada do Corinthians tá um roubo, peguem!', time: '14:38', likes: 31 },
  { id: '6', user: 'Pedro H.', username: '@pedroh99', level: 'Bronze', text: 'Primeira vez aqui, qual aposta vocês recomendam pro iniciante?', time: '14:39', likes: 8 },
  { id: '7', user: 'Rafael K.', username: '@rafaelk', level: 'VIP', text: 'Tip do dia: Ambos Marcam no Liverpool x Arsenal @ 1.72. Confiem no pai. 👑', time: '14:41', likes: 67, isTip: true, betInfo: { match: 'Liverpool x Arsenal', market: 'Ambos Marcam', odd: 1.72 } },
  { id: '8', user: 'Juliana C.', username: '@julibet', level: 'Ouro', text: 'Green de R$ 380 agora! Obrigada pela dica @rafaelk 💰', time: '14:42', likes: 22, betInfo: { match: 'Liverpool x Arsenal', market: 'Ambos Marcam', odd: 1.72, result: 'green' } },
  { id: '9', user: 'Diego S.', username: '@diegosil', level: 'VIP', text: 'Quem tiver coragem: múltipla de odd 145.00, 6 jogos, all in 🚀', time: '14:44', likes: 89, isTip: true, betInfo: { match: '6 jogos', market: 'Múltipla', odd: 145.00 } },
  { id: '10', user: 'Fernanda L.', username: '@ferbet', level: 'Ouro', text: 'Vini Jr marca a qualquer momento @ 2.10, easy money', time: '14:45', likes: 34, betInfo: { match: 'Real Madrid x Barcelona', market: 'Vini Jr - Gol', odd: 2.10 } },
];

const onlineUsers = 12847;

const getLevelColor = (level: string) => {
  switch (level) {
    case 'VIP': return 'text-primary bg-primary/20';
    case 'Ouro': return 'text-primary bg-primary/10';
    case 'Prata': return 'text-foreground bg-surface-interactive';
    case 'Bronze': return 'text-muted-foreground bg-surface-interactive';
    default: return 'text-muted-foreground bg-surface-interactive';
  }
};

const ChatPage = () => {
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [activeTab, setActiveTab] = useState<Tab>('popular');
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [createName, setCreateName] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeRoom) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeRoom]);

  const sendMessage = () => {
    if (!message.trim()) return;
    if (!isLoggedIn) { navigate('/auth'); return; }
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      user: 'Você',
      username: '@voce',
      level: 'Bronze',
      text: message,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      likes: 0,
    };
    setMessages([...messages, newMsg]);
    setMessage('');
  };

  const filteredRooms = activeTab === 'popular'
    ? rooms.filter(r => r.category === 'popular')
    : activeTab === 'apostas'
    ? rooms.filter(r => r.category === 'apostas')
    : activeTab === 'odds100'
    ? rooms.filter(r => r.category === 'odds100')
    : activeTab === 'gols'
    ? rooms.filter(r => r.category === 'gols')
    : activeTab === 'jogadores'
    ? rooms.filter(r => r.category === 'jogadores')
    : activeTab === 'recentes'
    ? rooms.slice(0, 6)
    : [];

  const selectedRoom = rooms.find(r => r.id === activeRoom);

  // Room chat view
  if (activeRoom && selectedRoom) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)] pb-16 pt-16">
        {/* Room header */}
        <div className="px-4 py-3 bg-surface-section flex items-center gap-3">
          <button onClick={() => setActiveRoom(null)} className="text-muted-foreground hover:text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center">
            ←
          </button>
          <span className="text-xl">{selectedRoom.emoji}</span>
          <div className="flex-1">
            <p className="text-sm font-display font-bold">{selectedRoom.name}</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              <span className="text-[0.6rem] font-body text-muted-foreground">{selectedRoom.members.toLocaleString('pt-BR')} membros</span>
            </div>
          </div>
          <Users size={18} className="text-muted-foreground" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 no-scrollbar">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl p-3 space-y-1.5 ${msg.isTip ? 'bg-accent' : 'bg-surface-card'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-surface-interactive flex items-center justify-center">
                    <span className="text-xs font-display font-bold">{msg.user[0]}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-body font-semibold">{msg.user}</span>
                    <span className={`text-[0.55rem] font-display font-bold px-1.5 py-0.5 rounded-full ${getLevelColor(msg.level)}`}>
                      {msg.level === 'VIP' && <Crown size={8} className="inline mr-0.5" />}
                      {msg.level}
                    </span>
                  </div>
                </div>
                <span className="text-[0.6rem] text-muted-foreground font-body">{msg.time}</span>
              </div>
              <p className="text-sm font-body text-foreground/90 pl-9">{msg.text}</p>
              {msg.betInfo && (
                <div className={`ml-9 rounded-lg p-2 text-xs font-body ${
                  msg.betInfo.result === 'green' ? 'bg-secondary/15' : msg.betInfo.result === 'red' ? 'bg-destructive/15' : 'bg-surface-interactive'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{msg.betInfo.match}</span>
                    <span className={`font-display font-bold ${
                      msg.betInfo.odd >= 100 ? 'text-primary' : msg.betInfo.result === 'green' ? 'text-secondary' : 'text-foreground'
                    }`}>
                      @{msg.betInfo.odd.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-foreground/70">{msg.betInfo.market}</span>
                    {msg.betInfo.result === 'green' && <span className="text-secondary font-bold ml-auto">GREEN ✅</span>}
                    {msg.betInfo.result === 'red' && <span className="text-destructive font-bold ml-auto">RED ❌</span>}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 pl-9">
                <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors min-h-[32px]">
                  <ThumbsUp size={12} />
                  <span className="text-[0.6rem] font-body">{msg.likes}</span>
                </button>
                {msg.isTip && (
                  <div className="flex items-center gap-1 text-primary">
                    <TrendingUp size={12} />
                    <span className="text-[0.6rem] font-display font-bold">Super Dica</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3">
          {!isLoggedIn ? (
            <button onClick={() => navigate('/auth')}
              className="w-full bg-surface-card rounded-xl py-3.5 text-sm font-body text-muted-foreground text-center min-h-[44px]">
              Faça login para participar
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Manda a visão..."
                className="flex-1 bg-surface-card rounded-xl py-3 px-4 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground min-h-[44px]"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                className="bg-primary text-primary-foreground w-12 h-12 rounded-xl flex items-center justify-center min-w-[44px] min-h-[44px]"
              >
                <Send size={18} />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main view — rooms list
  return (
    <div className="min-h-screen bg-background pb-24 pt-16">
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

        {/* Tabs scroll */}
        <div ref={tabsRef} className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
          {tabs.map((t) => {
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
                  Criar Sala
                </h3>
                <input
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="Nome da sala..."
                  className="w-full bg-surface-interactive rounded-xl py-3 px-4 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground min-h-[44px]"
                />
                <div className="space-y-2">
                  <p className="text-xs font-body text-muted-foreground">Categoria</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Futebol', 'Basquete', 'Tênis', 'E-Sports', 'Múltiplas', 'Jogadores', 'Outros'].map(cat => (
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
                  Criar Sala
                </motion.button>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-body text-muted-foreground font-semibold uppercase tracking-wider">Salas criadas recentemente</p>
                {rooms.slice(0, 3).map(room => (
                  <button key={room.id} onClick={() => setActiveRoom(room.id)}
                    className="w-full flex items-center gap-3 bg-surface-card rounded-xl p-3 min-h-[44px]">
                    <span className="text-xl">{room.emoji}</span>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-display font-bold">{room.name}</p>
                      <p className="text-[0.6rem] font-body text-muted-foreground">{room.members} membros</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ROOMS LIST */}
          {activeTab !== 'criar' && (
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              {/* Featured banner for odds100 */}
              {activeTab === 'odds100' && (
                <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl p-4 mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap size={18} className="text-primary" />
                    <span className="font-display font-extrabold text-sm text-primary">ODDS INSANAS</span>
                  </div>
                  <p className="text-xs font-body text-foreground/70">Apostas com odds acima de 100x. Alto risco, alta recompensa! 🚀</p>
                </div>
              )}

              {activeTab === 'gols' && (
                <div className="bg-gradient-to-r from-secondary/20 to-secondary/5 rounded-xl p-4 mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Target size={18} className="text-secondary" />
                    <span className="font-display font-extrabold text-sm text-secondary">MERCADO DE GOLS</span>
                  </div>
                  <p className="text-xs font-body text-foreground/70">Gols, placares, artilheiros e tudo sobre bola na rede ⚽</p>
                </div>
              )}

              {activeTab === 'jogadores' && (
                <div className="bg-gradient-to-r from-accent to-accent/50 rounded-xl p-4 mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Star size={18} className="text-primary" />
                    <span className="font-display font-extrabold text-sm text-primary">CRAQUES</span>
                  </div>
                  <p className="text-xs font-body text-foreground/70">Discussões e apostas focadas nos maiores jogadores do mundo ⭐</p>
                </div>
              )}

              {filteredRooms.map((room) => (
                <motion.button
                  key={room.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveRoom(room.id)}
                  className="w-full flex items-center gap-3 bg-surface-card rounded-xl p-3.5 min-h-[44px] hover:bg-surface-interactive transition-colors"
                >
                  <span className="text-2xl">{room.emoji}</span>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-display font-bold text-foreground">{room.name}</p>
                    </div>
                    <p className="text-[0.6rem] font-body text-muted-foreground mt-0.5 line-clamp-1">{room.lastMessage}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users size={12} />
                      <span className="text-[0.6rem] font-body">{room.members.toLocaleString('pt-BR')}</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-secondary inline-block mt-1" />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatPage;
