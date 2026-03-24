import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Upload } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';

type AuthStep = 'welcome' | 'login' | 'signup' | 'recovery' | 'kyc';

const AuthPage = () => {
  const [step, setStep] = useState<AuthStep>('welcome');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const BackButton = ({ to }: { to: AuthStep }) => (
    <button onClick={() => setStep(to)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground/70 hover:text-foreground">
      <ArrowLeft size={22} />
    </button>
  );

  const InputField = ({ label, type = 'text', placeholder, icon }: { label: string; type?: string; placeholder: string; icon?: React.ReactNode }) => (
    <div className="space-y-1.5">
      <label className="text-xs font-body font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          placeholder={placeholder}
          className="w-full bg-surface-interactive rounded-xl py-3 px-4 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground min-h-[44px]"
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        {icon && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
            <div className="relative h-[45vh]">
              <img src={heroBanner} alt="Estádio" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="font-display text-3xl text-primary font-extrabold">Seleção</span>
                <span className="font-display text-3xl text-foreground font-extrabold">Bet</span>
              </div>
            </div>
            <div className="flex-1 px-6 pt-6 pb-8 flex flex-col justify-between">
              <div className="space-y-3">
                <h1 className="font-display text-2xl font-extrabold leading-tight">
                  A emoção do jogo<br />na palma da mão 🇧🇷
                </h1>
                <p className="text-sm font-body text-muted-foreground">
                  Odds turbinadas, apostas ao vivo e os melhores mercados. Ganhe até <span className="text-primary font-bold">R$ 500</span> no primeiro depósito!
                </p>
              </div>
              <div className="space-y-3 mt-8">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep('signup')}
                  className="w-full bg-primary text-primary-foreground font-display font-bold text-base py-3.5 rounded-xl min-h-[44px] hover:brightness-110 transition-all"
                >
                  Criar Conta Grátis
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep('login')}
                  className="w-full bg-surface-interactive text-foreground font-display font-bold text-base py-3.5 rounded-xl min-h-[44px] hover:bg-muted transition-colors"
                >
                  Já tenho conta
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'login' && (
          <motion.div key="login" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1 px-6 pt-4 pb-8">
            <BackButton to="welcome" />
            <div className="mt-4 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-extrabold">Entrar</h2>
                <p className="text-sm font-body text-muted-foreground mt-1">Bem-vindo de volta!</p>
              </div>
              <div className="space-y-4">
                <InputField label="E-mail" type="email" placeholder="seu@email.com" />
                <InputField label="Senha" type="password" placeholder="Sua senha" />
              </div>
              <button onClick={() => setStep('recovery')} className="text-xs font-body text-primary font-semibold min-h-[44px]">
                Esqueceu a senha?
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/')}
                className="w-full bg-primary text-primary-foreground font-display font-bold text-base py-3.5 rounded-xl min-h-[44px] hover:brightness-110 transition-all"
              >
                Entrar
              </motion.button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full bg-surface-interactive h-px" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-3 text-xs text-muted-foreground font-body">ou</span>
                </div>
              </div>
              <button className="w-full bg-surface-card text-foreground font-body font-semibold text-sm py-3 rounded-xl min-h-[44px] flex items-center justify-center gap-2 hover:bg-surface-interactive transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Entrar com Google
              </button>
            </div>
          </motion.div>
        )}

        {step === 'signup' && (
          <motion.div key="signup" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1 px-6 pt-4 pb-8 overflow-y-auto">
            <BackButton to="welcome" />
            <div className="mt-4 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-extrabold">Criar Conta</h2>
                <p className="text-sm font-body text-muted-foreground mt-1">Preencha seus dados para começar</p>
              </div>
              <div className="space-y-4">
                <InputField label="Nome completo" placeholder="João da Silva" />
                <InputField label="E-mail" type="email" placeholder="seu@email.com" />
                <InputField label="CPF" placeholder="000.000.000-00" />
                <InputField label="Data de nascimento" placeholder="DD/MM/AAAA" />
                <InputField label="Senha" type="password" placeholder="Mínimo 8 caracteres" />
              </div>
              <div className="bg-surface-card rounded-xl p-4 flex items-start gap-3">
                <span className="text-2xl">🎁</span>
                <div>
                  <p className="text-sm font-display font-bold text-primary">Bônus de Boas-Vindas</p>
                  <p className="text-xs font-body text-muted-foreground mt-0.5">
                    Ganhe até R$ 500 em bônus no seu primeiro depósito!
                  </p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep('kyc')}
                className="w-full bg-primary text-primary-foreground font-display font-bold text-base py-3.5 rounded-xl min-h-[44px] hover:brightness-110 transition-all"
              >
                Continuar
              </motion.button>
              <p className="text-[0.6rem] text-muted-foreground font-body text-center">
                Ao criar sua conta, você concorda com os Termos de Uso e Política de Privacidade. Jogue com responsabilidade. 18+
              </p>
            </div>
          </motion.div>
        )}

        {step === 'recovery' && (
          <motion.div key="recovery" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1 px-6 pt-4 pb-8">
            <BackButton to="login" />
            <div className="mt-4 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-extrabold">Recuperar Senha</h2>
                <p className="text-sm font-body text-muted-foreground mt-1">Digite seu e-mail e enviaremos um link para redefinir sua senha.</p>
              </div>
              <InputField label="E-mail" type="email" placeholder="seu@email.com" />
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="w-full bg-primary text-primary-foreground font-display font-bold text-base py-3.5 rounded-xl min-h-[44px] hover:brightness-110 transition-all"
              >
                Enviar Link
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 'kyc' && (
          <motion.div key="kyc" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1 px-6 pt-4 pb-8">
            <BackButton to="signup" />
            <div className="mt-4 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-extrabold">Verificação de Identidade</h2>
                <p className="text-sm font-body text-muted-foreground mt-1">Envie um documento com foto para ativar sua conta.</p>
              </div>
              <div className="space-y-4">
                <div className="bg-surface-card rounded-xl p-6 flex flex-col items-center justify-center gap-3 min-h-[160px]">
                  <div className="w-14 h-14 rounded-full bg-surface-interactive flex items-center justify-center">
                    <Upload size={24} className="text-primary" />
                  </div>
                  <p className="text-sm font-body font-medium">Frente do documento</p>
                  <p className="text-[0.65rem] text-muted-foreground font-body">RG, CNH ou Passaporte</p>
                  <button className="bg-surface-interactive text-foreground font-body font-semibold text-xs px-4 py-2 rounded-lg min-h-[44px]">
                    Escolher Arquivo
                  </button>
                </div>
                <div className="bg-surface-card rounded-xl p-6 flex flex-col items-center justify-center gap-3 min-h-[160px]">
                  <div className="w-14 h-14 rounded-full bg-surface-interactive flex items-center justify-center">
                    <Upload size={24} className="text-primary" />
                  </div>
                  <p className="text-sm font-body font-medium">Verso do documento</p>
                  <button className="bg-surface-interactive text-foreground font-body font-semibold text-xs px-4 py-2 rounded-lg min-h-[44px]">
                    Escolher Arquivo
                  </button>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/')}
                className="w-full bg-primary text-primary-foreground font-display font-bold text-base py-3.5 rounded-xl min-h-[44px] hover:brightness-110 transition-all"
              >
                Enviar e Finalizar
              </motion.button>
              <button onClick={() => navigate('/')} className="w-full text-center text-xs text-muted-foreground font-body min-h-[44px]">
                Pular por agora
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthPage;
