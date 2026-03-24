import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, ArrowDownLeft, ArrowUpRight, CreditCard, Smartphone, Bitcoin, Clock,
  QrCode, Copy, Check, ChevronLeft, ChevronRight, Shield, AlertTriangle,
  Apple, Gift, Banknote, X, CheckCircle2, Timer, Eye, EyeOff
} from 'lucide-react';

/* ───────── Mock Data ───────── */
const transactions = [
  { id: 1, type: 'deposit', method: 'PIX', amount: 200, date: '24/03/2026 14:32', status: 'confirmed' },
  { id: 2, type: 'bet', method: 'Aposta — Flamengo vs Palmeiras', amount: -50, date: '24/03/2026 13:15', status: 'pending' },
  { id: 3, type: 'win', method: 'Ganho — Corinthians vs São Paulo', amount: 125, date: '23/03/2026 22:40', status: 'confirmed' },
  { id: 4, type: 'withdrawal', method: 'Saque PIX', amount: -300, date: '22/03/2026 10:05', status: 'confirmed' },
  { id: 5, type: 'deposit', method: 'Cartão de Crédito', amount: 500, date: '21/03/2026 18:20', status: 'confirmed' },
  { id: 6, type: 'bonus', method: 'Bônus de Boas-Vindas', amount: 75, date: '20/03/2026 09:00', status: 'confirmed' },
  { id: 7, type: 'bet', method: 'Aposta — Liverpool vs Man City', amount: -30, date: '19/03/2026 16:45', status: 'lost' },
  { id: 8, type: 'deposit', method: 'PIX', amount: 100, date: '18/03/2026 11:30', status: 'confirmed' },
];

const PIX_KEY = '00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540520.005802BR5925SELECAOBET APOSTAS LTDA6009SAO PAULO62070503***6304A1B2';

type View = 'main' | 'deposit' | 'deposit-pix' | 'deposit-card' | 'deposit-boleto' | 'deposit-crypto' | 'withdraw' | 'withdraw-confirm';

const WalletPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<View>('main');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('pix');
  const [pixCopied, setPixCopied] = useState(false);
  const [pixTimer, setPixTimer] = useState(300);
  const [showBalance, setShowBalance] = useState(true);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // PIX countdown timer
  useEffect(() => {
    if (view !== 'deposit-pix') return;
    if (pixTimer <= 0) return;
    const interval = setInterval(() => setPixTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [view, pixTimer]);

  const formatTimer = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(PIX_KEY).catch(() => {});
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  };

  const maskCard = (v: string) => v.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
  const maskExpiry = (v: string) => v.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/').slice(0, 5);

  const quickAmounts = [20, 50, 100, 200, 500, 1000];

  const statusConfig: Record<string, { label: string; class: string }> = {
    confirmed: { label: 'Confirmado', class: 'bg-secondary/20 text-secondary' },
    pending: { label: 'Pendente', class: 'bg-primary/20 text-primary' },
    lost: { label: 'Perdido', class: 'bg-destructive/20 text-destructive' },
    processing: { label: 'Processando', class: 'bg-accent/30 text-accent-foreground' },
  };

  /* ───────── Sub-header ───────── */
  const SubHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
    <div className="flex items-center gap-3 mb-5">
      <button onClick={onBack} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground">
        <ChevronLeft size={22} />
      </button>
      <h2 className="font-display text-lg font-bold">{title}</h2>
    </div>
  );

  /* ═══════════════════════════════════════════════
     MAIN VIEW
  ═══════════════════════════════════════════════ */
  if (view === 'main') return (
    <div className="space-y-6 pb-20 px-4 pt-2">
      {/* Balance Card */}
      <div className="bg-accent rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet size={20} className="text-primary" />
            <span className="text-sm font-body text-foreground/70">Saldo Disponível</span>
          </div>
          <button onClick={() => setShowBalance(!showBalance)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground">
            {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
        <p className="font-display text-4xl font-extrabold text-gradient-gold">
          {showBalance ? 'R$ 1.250,00' : 'R$ •••••'}
        </p>
        <div className="flex gap-6 text-sm font-body">
          <div>
            <span className="text-muted-foreground text-xs">Em apostas</span>
            <p className="font-semibold text-primary">{showBalance ? 'R$ 150,00' : '•••'}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Bônus</span>
            <p className="font-semibold text-secondary">{showBalance ? 'R$ 75,00' : '•••'}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Total</span>
            <p className="font-semibold text-foreground">{showBalance ? 'R$ 1.475,00' : '•••'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setView('deposit')}
            className="flex-1 bg-primary text-primary-foreground font-display font-bold text-sm py-3 rounded-xl min-h-[44px] flex items-center justify-center gap-2">
            <ArrowDownLeft size={16} /> Depositar
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setView('withdraw')}
            className="flex-1 bg-surface-interactive text-foreground font-display font-bold text-sm py-3 rounded-xl min-h-[44px] flex items-center justify-center gap-2">
            <ArrowUpRight size={16} /> Sacar
          </motion.button>
        </div>
      </div>

      {/* Transactions */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-sm font-bold flex items-center gap-2">
            <Clock size={16} className="text-muted-foreground" />
            Histórico de Transações
          </h3>
          <button onClick={() => navigate('/historico')} className="text-xs text-primary font-body font-semibold flex items-center gap-0.5 min-h-[44px]">
            Ver tudo <ChevronRight size={14} />
          </button>
        </div>
        <div className="space-y-2">
          {transactions.map((tx) => {
            const sc = statusConfig[tx.status] || statusConfig.confirmed;
            return (
              <div key={tx.id} className="bg-surface-card rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-secondary/20' : 'bg-destructive/20'}`}>
                    {tx.type === 'bonus' ? <Gift size={15} className="text-secondary" /> :
                     tx.amount > 0 ? <ArrowDownLeft size={15} className="text-secondary" /> : <ArrowUpRight size={15} className="text-destructive" />}
                  </div>
                  <div>
                    <p className="text-sm font-body font-medium">{tx.method}</p>
                    <p className="text-[0.6rem] text-muted-foreground font-body">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-display font-bold ${tx.amount > 0 ? 'text-secondary' : 'text-foreground'}`}>
                    {tx.amount > 0 ? '+' : ''}R$ {Math.abs(tx.amount).toFixed(2)}
                  </p>
                  <span className={`text-[0.5rem] font-body font-semibold px-1.5 py-0.5 rounded-full ${sc.class}`}>
                    {sc.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );

  /* ═══════════════════════════════════════════════
     DEPOSIT - METHOD SELECTION
  ═══════════════════════════════════════════════ */
  if (view === 'deposit') return (
    <div className="px-4 pt-2 pb-20 space-y-5">
      <SubHeader title="Depositar" onBack={() => setView('main')} />

      {/* Amount */}
      <div className="space-y-3">
        <label className="text-xs font-body font-medium text-muted-foreground">Valor do depósito</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-display font-bold text-muted-foreground">R$</span>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="0,00"
            className="w-full bg-surface-card rounded-xl py-4 pl-14 pr-4 text-2xl font-display font-bold text-foreground outline-none focus:ring-1 focus:ring-primary"
            min={10}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {quickAmounts.map((a) => (
            <button key={a} onClick={() => setDepositAmount(String(a))}
              className={`px-4 py-2 rounded-lg text-xs font-display font-bold min-h-[36px] transition-colors ${
                depositAmount === String(a) ? 'bg-primary text-primary-foreground' : 'bg-surface-interactive text-foreground/70 hover:bg-muted'
              }`}>
              R$ {a}
            </button>
          ))}
        </div>
        <p className="text-[0.6rem] text-muted-foreground font-body">Mínimo R$ 10,00 • Máximo R$ 50.000,00</p>
      </div>

      {/* Methods */}
      <div className="space-y-3">
        <label className="text-xs font-body font-medium text-muted-foreground">Escolha o método</label>
        <div className="space-y-2">
          {[
            { id: 'pix', icon: QrCode, label: 'PIX', desc: 'Instantâneo • Sem taxas', tag: 'Mais rápido', view: 'deposit-pix' as View },
            { id: 'card', icon: CreditCard, label: 'Cartão de Crédito/Débito', desc: 'Visa, Mastercard, Elo', view: 'deposit-card' as View },
            { id: 'boleto', icon: Banknote, label: 'Boleto Bancário', desc: '1-3 dias úteis', view: 'deposit-boleto' as View },
            { id: 'crypto', icon: Bitcoin, label: 'Criptomoedas', desc: 'Bitcoin, Ethereum, USDT', view: 'deposit-crypto' as View },
            { id: 'paypal', icon: Wallet, label: 'PayPal', desc: 'Até 24h para confirmar' },
            { id: 'apple', icon: Apple, label: 'Apple Pay / Google Pay', desc: 'Instantâneo' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => {
                if (m.view && Number(depositAmount) >= 10) {
                  setPixTimer(300);
                  setView(m.view);
                }
              }}
              disabled={!depositAmount || Number(depositAmount) < 10}
              className="w-full flex items-center gap-3 bg-surface-card rounded-xl p-4 min-h-[44px] hover:bg-surface-interactive transition-colors disabled:opacity-40 relative"
            >
              <div className="w-10 h-10 rounded-full bg-surface-interactive flex items-center justify-center">
                <m.icon size={20} className="text-primary" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-body font-semibold">{m.label}</p>
                <p className="text-[0.6rem] font-body text-muted-foreground">{m.desc}</p>
              </div>
              {m.tag && (
                <span className="bg-secondary/20 text-secondary text-[0.55rem] font-display font-bold px-2 py-0.5 rounded-full">
                  {m.tag}
                </span>
              )}
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════
     DEPOSIT - PIX (QR CODE)
  ═══════════════════════════════════════════════ */
  if (view === 'deposit-pix') return (
    <div className="px-4 pt-2 pb-20 space-y-5">
      <SubHeader title="Depósito via PIX" onBack={() => setView('deposit')} />

      <div className="bg-surface-card rounded-2xl p-5 space-y-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Timer size={16} className="text-primary" />
          <span className="text-xs font-body text-muted-foreground">
            Expira em <span className="font-display font-bold text-primary">{formatTimer(pixTimer)}</span>
          </span>
        </div>

        <p className="font-display text-2xl font-extrabold text-primary">
          R$ {Number(depositAmount).toFixed(2)}
        </p>

        {/* QR Code simulation */}
        <div className="bg-white rounded-xl p-4 mx-auto w-52 h-52 flex items-center justify-center">
          <div className="w-full h-full relative">
            {/* Generate a fake QR code pattern */}
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <rect width="200" height="200" fill="white"/>
              {/* Corner squares */}
              <rect x="10" y="10" width="50" height="50" fill="black" rx="4"/>
              <rect x="16" y="16" width="38" height="38" fill="white" rx="2"/>
              <rect x="22" y="22" width="26" height="26" fill="black" rx="2"/>
              
              <rect x="140" y="10" width="50" height="50" fill="black" rx="4"/>
              <rect x="146" y="16" width="38" height="38" fill="white" rx="2"/>
              <rect x="152" y="22" width="26" height="26" fill="black" rx="2"/>
              
              <rect x="10" y="140" width="50" height="50" fill="black" rx="4"/>
              <rect x="16" y="146" width="38" height="38" fill="white" rx="2"/>
              <rect x="22" y="152" width="26" height="26" fill="black" rx="2"/>
              
              {/* Data pattern */}
              {Array.from({ length: 12 }, (_, i) =>
                Array.from({ length: 12 }, (_, j) => {
                  const show = ((i * 7 + j * 13 + 3) % 3) !== 0;
                  if (!show) return null;
                  const x = 70 + j * 8;
                  const y = 10 + i * 8;
                  if (x > 130 && y < 60) return null;
                  if (x < 60 && y > 130) return null;
                  if (x < 60 && y < 60) return null;
                  return <rect key={`${i}-${j}`} x={x} y={y} width="6" height="6" fill="black" rx="1"/>;
                })
              )}
              {Array.from({ length: 8 }, (_, i) =>
                Array.from({ length: 8 }, (_, j) => {
                  const show = ((i * 11 + j * 7 + 5) % 4) !== 0;
                  if (!show) return null;
                  return <rect key={`b${i}-${j}`} x={70 + j * 9} y={100 + i * 9} width="7" height="7" fill="black" rx="1"/>;
                })
              )}
              {/* Center logo */}
              <rect x="85" y="85" width="30" height="30" fill="hsl(51,100%,50%)" rx="6"/>
              <text x="100" y="105" textAnchor="middle" fontSize="14" fontWeight="bold" fill="black">S</text>
            </svg>
          </div>
        </div>

        <p className="text-xs font-body text-muted-foreground">
          Escaneie o QR Code com o app do seu banco
        </p>

        <div className="relative">
          <div className="w-full bg-surface-interactive rounded-lg p-3 text-[0.55rem] font-mono text-muted-foreground break-all text-left">
            {PIX_KEY.slice(0, 60)}...
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleCopyPix}
          className="w-full bg-primary text-primary-foreground font-display font-bold text-sm py-3.5 rounded-xl min-h-[44px] flex items-center justify-center gap-2"
        >
          {pixCopied ? <><Check size={16} /> Copiado!</> : <><Copy size={16} /> Copiar código PIX</>}
        </motion.button>

        <p className="text-[0.55rem] font-body text-muted-foreground">
          Após o pagamento, o saldo será creditado <span className="text-secondary font-semibold">instantaneamente</span>
        </p>
      </div>

      <div className="bg-surface-card rounded-xl p-4 flex items-start gap-3">
        <Shield size={18} className="text-secondary shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-body font-semibold">Transação segura</p>
          <p className="text-[0.55rem] font-body text-muted-foreground">
            Seus dados são protegidos com criptografia de ponta a ponta. Regulado pelo Banco Central do Brasil.
          </p>
        </div>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════
     DEPOSIT - CARTÃO
  ═══════════════════════════════════════════════ */
  if (view === 'deposit-card') return (
    <div className="px-4 pt-2 pb-20 space-y-5">
      <SubHeader title="Depósito via Cartão" onBack={() => setView('deposit')} />

      <div className="bg-accent rounded-2xl p-5 space-y-1">
        <p className="text-xs font-body text-muted-foreground">Valor do depósito</p>
        <p className="font-display text-2xl font-extrabold text-primary">R$ {Number(depositAmount).toFixed(2)}</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-body font-medium text-muted-foreground">Número do cartão</label>
          <div className="relative">
            <CreditCard size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={cardNumber} onChange={(e) => setCardNumber(maskCard(e.target.value))}
              placeholder="0000 0000 0000 0000"
              className="w-full bg-surface-card rounded-xl py-3 pl-11 pr-4 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary min-h-[44px]" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-body font-medium text-muted-foreground">Nome no cartão</label>
          <input value={cardName} onChange={(e) => setCardName(e.target.value.toUpperCase())}
            placeholder="NOME COMO NO CARTÃO"
            className="w-full bg-surface-card rounded-xl py-3 px-4 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary min-h-[44px]" />
        </div>

        <div className="flex gap-3">
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-body font-medium text-muted-foreground">Validade</label>
            <input value={cardExpiry} onChange={(e) => setCardExpiry(maskExpiry(e.target.value))}
              placeholder="MM/AA"
              className="w-full bg-surface-card rounded-xl py-3 px-4 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary min-h-[44px]" />
          </div>
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-body font-medium text-muted-foreground">CVV</label>
            <input value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="000" type="password"
              className="w-full bg-surface-card rounded-xl py-3 px-4 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary min-h-[44px]" />
          </div>
        </div>
      </div>

      <motion.button whileTap={{ scale: 0.97 }}
        disabled={cardNumber.length < 19 || !cardName || cardExpiry.length < 5 || cardCvv.length < 3}
        className="w-full bg-primary text-primary-foreground font-display font-bold text-sm py-3.5 rounded-xl min-h-[44px] disabled:opacity-40">
        Confirmar Depósito
      </motion.button>

      <div className="flex items-center justify-center gap-4 text-muted-foreground">
        {['Visa', 'Master', 'Elo'].map((b) => (
          <span key={b} className="text-[0.6rem] font-body font-semibold bg-surface-card px-2.5 py-1 rounded">{b}</span>
        ))}
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════
     DEPOSIT - BOLETO
  ═══════════════════════════════════════════════ */
  if (view === 'deposit-boleto') return (
    <div className="px-4 pt-2 pb-20 space-y-5">
      <SubHeader title="Depósito via Boleto" onBack={() => setView('deposit')} />
      <div className="bg-surface-card rounded-2xl p-5 space-y-4 text-center">
        <p className="font-display text-2xl font-extrabold text-primary">R$ {Number(depositAmount).toFixed(2)}</p>
        <div className="bg-surface-interactive rounded-xl p-3">
          <p className="text-[0.55rem] font-mono text-muted-foreground break-all">
            23793.38128 60000.000003 00000.000405 1 93670000{depositAmount}00
          </p>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={handleCopyPix}
          className="w-full bg-primary text-primary-foreground font-display font-bold text-sm py-3.5 rounded-xl min-h-[44px] flex items-center justify-center gap-2">
          {pixCopied ? <><Check size={16} /> Copiado!</> : <><Copy size={16} /> Copiar código de barras</>}
        </motion.button>
        <div className="flex items-start gap-2 text-left">
          <AlertTriangle size={16} className="text-primary shrink-0 mt-0.5" />
          <p className="text-[0.6rem] font-body text-muted-foreground">
            O boleto será compensado em até <span className="font-semibold text-foreground">3 dias úteis</span>. O saldo será creditado após a confirmação do pagamento.
          </p>
        </div>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════
     DEPOSIT - CRYPTO
  ═══════════════════════════════════════════════ */
  if (view === 'deposit-crypto') return (
    <div className="px-4 pt-2 pb-20 space-y-5">
      <SubHeader title="Depósito via Cripto" onBack={() => setView('deposit')} />
      <div className="space-y-3">
        {['Bitcoin (BTC)', 'Ethereum (ETH)', 'USDT (TRC-20)', 'USDT (ERC-20)'].map((crypto) => (
          <div key={crypto} className="bg-surface-card rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bitcoin size={18} className="text-primary" />
                <span className="text-sm font-body font-semibold">{crypto}</span>
              </div>
            </div>
            <div className="bg-surface-interactive rounded-lg p-2.5">
              <p className="text-[0.5rem] font-mono text-muted-foreground break-all">
                {crypto.includes('BTC') ? 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' :
                 crypto.includes('ETH') || crypto.includes('ERC') ? '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' :
                 'TN2A3h9sEDkMq2P5eBJx5jb3NzXMU3gXqd'}
              </p>
            </div>
            <button className="w-full bg-surface-interactive text-foreground font-body font-semibold text-xs py-2 rounded-lg min-h-[36px] flex items-center justify-center gap-1.5">
              <Copy size={14} /> Copiar endereço
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════
     WITHDRAW
  ═══════════════════════════════════════════════ */
  if (view === 'withdraw') return (
    <div className="px-4 pt-2 pb-20 space-y-5">
      <SubHeader title="Sacar" onBack={() => setView('main')} />

      {/* Available */}
      <div className="bg-accent rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-body text-muted-foreground">Disponível para saque</p>
          <p className="font-display text-xl font-extrabold text-primary">R$ 1.250,00</p>
        </div>
        <Shield size={20} className="text-secondary" />
      </div>

      {/* Amount */}
      <div className="space-y-3">
        <label className="text-xs font-body font-medium text-muted-foreground">Valor do saque</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-display font-bold text-muted-foreground">R$</span>
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="0,00"
            className="w-full bg-surface-card rounded-xl py-4 pl-14 pr-4 text-2xl font-display font-bold text-foreground outline-none focus:ring-1 focus:ring-primary"
            min={20} max={1250}
          />
        </div>
        <div className="flex gap-2">
          {[50, 100, 200, 500].map((a) => (
            <button key={a} onClick={() => setWithdrawAmount(String(a))}
              className={`flex-1 py-2 rounded-lg text-xs font-display font-bold min-h-[36px] transition-colors ${
                withdrawAmount === String(a) ? 'bg-primary text-primary-foreground' : 'bg-surface-interactive text-foreground/70'
              }`}>
              R$ {a}
            </button>
          ))}
        </div>
        <p className="text-[0.6rem] text-muted-foreground font-body">Mínimo R$ 20,00</p>
      </div>

      {/* Method */}
      <div className="space-y-3">
        <label className="text-xs font-body font-medium text-muted-foreground">Método de saque</label>
        {[
          { id: 'pix', icon: QrCode, label: 'PIX', desc: 'Instantâneo', time: 'Até 1 hora' },
          { id: 'bank', icon: Banknote, label: 'Transferência Bancária', desc: 'TED/DOC', time: '1-2 dias úteis' },
        ].map((m) => (
          <button key={m.id} onClick={() => setWithdrawMethod(m.id)}
            className={`w-full flex items-center gap-3 rounded-xl p-4 min-h-[44px] transition-colors ${
              withdrawMethod === m.id ? 'bg-primary/10 ring-1 ring-primary' : 'bg-surface-card hover:bg-surface-interactive'
            }`}>
            <m.icon size={20} className="text-primary" />
            <div className="text-left flex-1">
              <p className="text-sm font-body font-semibold">{m.label}</p>
              <p className="text-[0.6rem] font-body text-muted-foreground">{m.desc}</p>
            </div>
            <span className="text-[0.55rem] font-body text-muted-foreground">{m.time}</span>
          </button>
        ))}
      </div>

      {/* KYC notice */}
      <div className="bg-surface-card rounded-xl p-4 flex items-start gap-3">
        <Shield size={18} className="text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-body font-semibold">Verificação necessária</p>
          <p className="text-[0.55rem] font-body text-muted-foreground">
            Para saques acima de R$ 500, é necessário ter a verificação de identidade (KYC) aprovada.
          </p>
        </div>
      </div>

      <motion.button whileTap={{ scale: 0.97 }}
        onClick={() => { setView('withdraw-confirm'); setWithdrawSuccess(false); }}
        disabled={!withdrawAmount || Number(withdrawAmount) < 20 || Number(withdrawAmount) > 1250}
        className="w-full bg-primary text-primary-foreground font-display font-bold text-sm py-3.5 rounded-xl min-h-[44px] disabled:opacity-40">
        Solicitar Saque
      </motion.button>
    </div>
  );

  /* ═══════════════════════════════════════════════
     WITHDRAW - CONFIRMATION
  ═══════════════════════════════════════════════ */
  if (view === 'withdraw-confirm') return (
    <div className="px-4 pt-2 pb-20 space-y-5">
      <SubHeader title="Confirmar Saque" onBack={() => setView('withdraw')} />

      {!withdrawSuccess ? (
        <div className="bg-surface-card rounded-2xl p-5 space-y-4">
          <div className="text-center space-y-2">
            <p className="text-xs font-body text-muted-foreground">Valor do saque</p>
            <p className="font-display text-3xl font-extrabold text-primary">R$ {Number(withdrawAmount).toFixed(2)}</p>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Método', value: withdrawMethod === 'pix' ? 'PIX' : 'Transferência Bancária' },
              { label: 'Prazo estimado', value: withdrawMethod === 'pix' ? 'Até 1 hora' : '1-2 dias úteis' },
              { label: 'Taxa', value: 'Grátis' },
              { label: 'Chave PIX', value: '***.***.789-00' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <span className="text-xs font-body text-muted-foreground">{item.label}</span>
                <span className="text-xs font-body font-semibold">{item.value}</span>
              </div>
            ))}
          </div>

          <motion.button whileTap={{ scale: 0.97 }}
            onClick={() => setWithdrawSuccess(true)}
            className="w-full bg-primary text-primary-foreground font-display font-bold text-sm py-3.5 rounded-xl min-h-[44px]">
            Confirmar Saque
          </motion.button>
        </div>
      ) : (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-surface-card rounded-2xl p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} className="text-secondary" />
          </div>
          <h3 className="font-display text-xl font-extrabold">Saque Solicitado!</h3>
          <p className="text-sm font-body text-muted-foreground">
            Seu saque de <span className="text-primary font-bold">R$ {Number(withdrawAmount).toFixed(2)}</span> foi processado.
            {withdrawMethod === 'pix' ? ' O valor será creditado na sua conta em até 1 hora.' : ' O valor será creditado em 1-2 dias úteis.'}
          </p>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setView('main')}
            className="w-full bg-primary text-primary-foreground font-display font-bold text-sm py-3.5 rounded-xl min-h-[44px]">
            Voltar à Carteira
          </motion.button>
        </motion.div>
      )}
    </div>
  );

  return null;
};

export default WalletPage;
