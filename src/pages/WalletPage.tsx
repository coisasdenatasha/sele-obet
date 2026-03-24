import { motion } from 'framer-motion';
import { Wallet, ArrowDownLeft, ArrowUpRight, CreditCard, Smartphone, Bitcoin, Clock } from 'lucide-react';

const transactions = [
  { id: 1, type: 'deposit', method: 'PIX', amount: 200, date: '24/03/2026', status: 'confirmed' },
  { id: 2, type: 'bet', method: 'Aposta', amount: -50, date: '24/03/2026', status: 'pending' },
  { id: 3, type: 'win', method: 'Ganho', amount: 125, date: '23/03/2026', status: 'confirmed' },
  { id: 4, type: 'withdrawal', method: 'PIX', amount: -300, date: '22/03/2026', status: 'confirmed' },
  { id: 5, type: 'deposit', method: 'Cartão', amount: 500, date: '21/03/2026', status: 'confirmed' },
];

const depositMethods = [
  { icon: Smartphone, label: 'PIX', tag: 'Popular' },
  { icon: CreditCard, label: 'Cartão' },
  { icon: Bitcoin, label: 'Cripto' },
];

const WalletPage = () => {
  return (
    <div className="space-y-6 pb-20 px-4 pt-2">
      {/* Balance Card */}
      <div className="bg-accent rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Wallet size={20} className="text-primary" />
          <span className="text-sm font-body text-foreground/70">Saldo Disponível</span>
        </div>
        <p className="font-display text-4xl font-extrabold text-gradient-gold">R$ 1.250,00</p>
        <div className="flex gap-3 text-sm font-body">
          <div>
            <span className="text-muted-foreground text-xs">Em apostas</span>
            <p className="font-semibold text-primary">R$ 150,00</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Bônus</span>
            <p className="font-semibold text-secondary">R$ 75,00</p>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.97 }} className="flex-1 bg-primary text-primary-foreground font-display font-bold text-sm py-3 rounded-xl min-h-[44px] flex items-center justify-center gap-2">
            <ArrowDownLeft size={16} /> Depositar
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} className="flex-1 bg-surface-interactive text-foreground font-display font-bold text-sm py-3 rounded-xl min-h-[44px] flex items-center justify-center gap-2">
            <ArrowUpRight size={16} /> Sacar
          </motion.button>
        </div>
      </div>

      {/* Deposit Methods */}
      <section>
        <h3 className="font-display text-sm font-bold mb-3">Depositar via</h3>
        <div className="flex gap-3">
          {depositMethods.map((m) => (
            <button key={m.label} className="flex-1 bg-surface-card rounded-xl p-4 flex flex-col items-center gap-2 min-h-[44px] hover:bg-surface-interactive transition-colors relative">
              <m.icon size={24} className="text-primary" />
              <span className="text-xs font-body font-medium">{m.label}</span>
              {m.tag && (
                <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-[0.55rem] font-display font-bold px-1.5 py-0.5 rounded-full">
                  {m.tag}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Transactions */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-sm font-bold flex items-center gap-2">
            <Clock size={16} className="text-muted-foreground" />
            Histórico
          </h3>
        </div>
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-surface-card rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-secondary/20' : 'bg-destructive/20'}`}>
                  {tx.amount > 0 ? <ArrowDownLeft size={14} className="text-secondary" /> : <ArrowUpRight size={14} className="text-destructive" />}
                </div>
                <div>
                  <p className="text-sm font-body font-medium">{tx.method}</p>
                  <p className="text-[0.65rem] text-muted-foreground font-body">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-display font-bold ${tx.amount > 0 ? 'text-secondary' : 'text-foreground'}`}>
                  {tx.amount > 0 ? '+' : ''}R$ {Math.abs(tx.amount).toFixed(2)}
                </p>
                <span className={`text-[0.55rem] font-body px-1.5 py-0.5 rounded-full ${tx.status === 'confirmed' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}`}>
                  {tx.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WalletPage;
