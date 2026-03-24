import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Users, TrendingUp, MessageCircle, Crown, Flame, ArrowUp, ThumbsUp } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

interface ChatMessage {
  id: string;
  user: string;
  username: string;
  level: string;
  text: string;
  time: string;
  likes: number;
  isTip?: boolean;
}

const mockMessages: ChatMessage[] = [
  { id: '1', user: 'Carlos M.', username: '@carlosm', level: 'VIP', text: 'Flamengo vai meter 3 hoje, confia!', time: '14:32', likes: 24 },
  { id: '2', user: 'Ana Paula', username: '@anapbet', level: 'Ouro', text: 'Alguém viu a odd do Palmeiras? Tá valendo demais', time: '14:33', likes: 12 },
  { id: '3', user: 'Lucas R.', username: '@lucasr10', level: 'Prata', text: 'Peguei a múltipla de 15.00 ontem e deu green!!', time: '14:35', likes: 45, isTip: true },
  { id: '4', user: 'Thiago F.', username: '@thifern', level: 'VIP', text: 'Over 2.5 no jogo do Real Madrid tá pagando 1.85, bora', time: '14:36', likes: 18 },
  { id: '5', user: 'Mariana S.', username: '@marisantos', level: 'Ouro', text: 'Essa odd turbinada do Corinthians tá um roubo, peguem!', time: '14:38', likes: 31 },
  { id: '6', user: 'Pedro H.', username: '@pedroh99', level: 'Bronze', text: 'Primeira vez aqui, qual aposta vocês recomendam pro iniciante?', time: '14:39', likes: 8 },
  { id: '7', user: 'Rafael K.', username: '@rafaelk', level: 'VIP', text: 'Tip do dia: Ambos Marcam no Liverpool x Arsenal @ 1.72. Confiem no pai.', time: '14:41', likes: 67, isTip: true },
  { id: '8', user: 'Juliana C.', username: '@julibet', level: 'Ouro', text: 'Green de R$ 380 agora! Obrigada pela dica @rafaelk', time: '14:42', likes: 22 },
];

const onlineUsers = 2847;

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
  const [tab, setTab] = useState<'chat' | 'tips'>('chat');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const filteredMessages = tab === 'tips' ? messages.filter(m => m.isTip) : messages;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] pb-16">
      {/* Header */}
      <div className="px-4 pt-2 pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-extrabold flex items-center gap-2">
            <MessageCircle size={22} className="text-primary" />
            Chat Social
          </h1>
          <div className="flex items-center gap-1.5 bg-surface-card rounded-full px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-xs font-body font-semibold">{onlineUsers.toLocaleString('pt-BR')}</span>
            <Users size={14} className="text-muted-foreground" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-surface-section rounded-xl p-1">
          {[
            { id: 'chat' as const, label: 'Chat Geral', icon: MessageCircle },
            { id: 'tips' as const, label: 'Super Dicas', icon: Flame },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-body font-semibold min-h-[44px] transition-colors ${
                tab === t.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 space-y-2 no-scrollbar">
        {filteredMessages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-3 space-y-1 ${msg.isTip ? 'bg-accent' : 'bg-surface-card'}`}
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
            Faça login para participar do chat
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
};

export default ChatPage;
