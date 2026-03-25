import { useState, useCallback, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Eye, EyeOff, Upload, Gift, Check, X,
  ShieldCheck, Camera, FileText, Mail, Lock, User, UserCircle,
  AtSign, Calendar, CreditCard, Fingerprint, CheckCircle2,
  Smartphone, MapPin, Scan, Brain, AlertTriangle, RefreshCw
} from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';

type AuthStep = 'welcome' | 'login' | 'signup' | 'recovery' | 'kyc' | 'otp' | 'success';
type KycSubStep = 'intro' | 'doc-front' | 'doc-back' | 'liveness' | 'validating' | 'done';

// CPF validation
const isValidCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11 || /^(\d)\1+$/.test(cleaned)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cleaned[i]) * (10 - i);
  let rem = (sum * 10) % 11;
  if (rem === 10) rem = 0;
  if (rem !== parseInt(cleaned[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cleaned[i]) * (11 - i);
  rem = (sum * 10) % 11;
  if (rem === 10) rem = 0;
  return rem === parseInt(cleaned[10]);
};

// Password strength
const getPasswordStrength = (pw: string): { level: number; label: string; color: string } => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score++;
  if (score <= 1) return { level: score, label: 'Fraca', color: 'bg-destructive' };
  if (score <= 3) return { level: score, label: 'Média', color: 'bg-primary' };
  return { level: score, label: 'Forte', color: 'bg-secondary' };
};

// CPF mask
const maskCPF = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
};

// Date mask with real-time validation (blocks impossible values)
const maskDate = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 8);
  // Block impossible day values (>31)
  if (d.length >= 2) {
    const day = parseInt(d.slice(0, 2));
    if (day > 31 || day === 0) return d.slice(0, 1);
  }
  // Block impossible month values (>12)
  if (d.length >= 4) {
    const month = parseInt(d.slice(2, 4));
    if (month > 12 || month === 0) return `${d.slice(0, 2)}/${d.slice(2, 3)}`;
  }
  // Block impossible year values
  if (d.length >= 5) {
    const yearStart = parseInt(d.slice(4, 5));
    if (yearStart !== 1 && yearStart !== 2) return `${d.slice(0, 2)}/${d.slice(2, 4)}/`;
  }
  if (d.length >= 8) {
    const year = parseInt(d.slice(4, 8));
    if (year < 1900 || year > new Date().getFullYear()) return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4, 7)}`;
  }
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
};

const AuthPage = () => {
  const [step, setStep] = useState<AuthStep>('welcome');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Signup form
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [cep, setCep] = useState('');
  const [cepLoading, setCepLoading] = useState(false);
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [pais, setPais] = useState('Brasil');
  const [telefone, setTelefone] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [over18, setOver18] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [notExcluded, setNotExcluded] = useState(false);
  const [acceptRegulation, setAcceptRegulation] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [signupStep, setSignupStep] = useState(1);
  const totalSignupSteps = 4;

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginCpf, setLoginCpf] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const { signUp, signIn, isLoggedIn } = useAuthStore();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // Recovery
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  // KYC
  const [kycSubStep, setKycSubStep] = useState<KycSubStep>('intro');
  const [kycStatus, setKycStatus] = useState<'pending' | 'analyzing' | 'approved' | 'rejected'>('pending');
  const [docFront, setDocFront] = useState<string | null>(null);
  const [docBack, setDocBack] = useState<string | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [livenessStep, setLivenessStep] = useState(0);
  const [livenessProgress, setLivenessProgress] = useState(0);
  const [validationStep, setValidationStep] = useState(0);

  // OTP
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpCanResend, setOtpCanResend] = useState(false);

  // OTP countdown timer
  useEffect(() => {
    if (step !== 'otp') return;
    setOtpTimer(60);
    setOtpCanResend(false);
    const interval = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setOtpCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  // KYC validation pipeline auto-advance
  useEffect(() => {
    if (kycSubStep !== 'validating') return;
    setValidationStep(0);
    const timers = [
      setTimeout(() => setValidationStep(1), 1200),
      setTimeout(() => setValidationStep(2), 2400),
      setTimeout(() => setValidationStep(3), 3400),
      setTimeout(() => setValidationStep(4), 4400),
      setTimeout(() => setValidationStep(5), 5200),
      setTimeout(() => setValidationStep(6), 6000),
      setTimeout(() => setKycSubStep('done'), 6800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [kycSubStep]);

  // Taken usernames (simulated)
  const takenUsernames = ['admin', 'joaosilva', 'usuario', 'test', 'bot', 'moderador', 'suporte'];
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  // Username availability check with debounce
  const checkUsername = useCallback((name: string) => {
    if (name.length < 3) { setUsernameAvailable(null); return; }
    setUsernameChecking(true);
    const timer = setTimeout(() => {
      setUsernameAvailable(!takenUsernames.includes(name.toLowerCase()));
      setUsernameChecking(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Validation helpers
  const isEmailValid = (e: string) => /^[^\s@]+@[^\s@]{2,}\.[^\s@]{2,}$/.test(e);
  const emailError = email.length > 0 && !isEmailValid(email) ? (
    !email.includes('@') ? 'Falta o @' :
    email.endsWith('@') ? 'Falta o domínio' :
    !email.includes('.') ? 'Domínio inválido' :
    email.endsWith('.') ? 'Domínio incompleto' : 'E-mail inválido'
  ) : null;

  const cpfClean = cpf.replace(/\D/g, '');
  const cpfValid = cpfClean.length === 11 && isValidCPF(cpf);

  // Date of birth validation (real date check)
  const dobClean = dob.replace(/\D/g, '');
  const isValidDate = (dateStr: string): boolean => {
    const digits = dateStr.replace(/\D/g, '');
    if (digits.length !== 8) return false;
    const day = parseInt(digits.slice(0, 2));
    const month = parseInt(digits.slice(2, 4));
    const year = parseInt(digits.slice(4, 8));
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > new Date().getFullYear()) return false;
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return false;
    // Must be at least 18 years old
    const today = new Date();
    const age = today.getFullYear() - year - (today.getMonth() < month - 1 || (today.getMonth() === month - 1 && today.getDate() < day) ? 1 : 0);
    if (age < 18) return false;
    return true;
  };
  const dobValid = isValidDate(dob);
  const dobError = dobClean.length === 8 && !dobValid ? (
    (() => {
      const d = parseInt(dobClean.slice(0, 2)), m = parseInt(dobClean.slice(2, 4)), y = parseInt(dobClean.slice(4, 8));
      if (m < 1 || m > 12) return 'Mês inválido';
      if (d < 1 || d > 31) return 'Dia inválido';
      if (y < 1900 || y > new Date().getFullYear()) return 'Ano inválido';
      const date = new Date(y, m - 1, d);
      if (date.getDate() !== d) return 'Data não existe';
      return 'Você deve ter 18+ anos';
    })()
  ) : null;

  const pwStrength = getPasswordStrength(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const usernameValid = username.trim().length >= 3 && usernameAvailable === true;

  // Step validations
  const step1Valid = fullName.trim().length >= 3 && usernameValid && isEmailValid(email) && cpfValid && dobValid;
  const step2Valid = telefone.replace(/\D/g, '').length >= 10;
  const step3Valid = password.length >= 8 && passwordsMatch;
  const step4Valid = over18 && acceptTerms && notExcluded && acceptRegulation;
  const signupValid = step1Valid && step2Valid && step3Valid && step4Valid;
  const currentStepValid = signupStep === 1 ? step1Valid : signupStep === 2 ? step2Valid : signupStep === 3 ? step3Valid : step4Valid;

  const signupStepLabels = ['Dados Pessoais', 'Endereço', 'Segurança', 'Termos'];

  const BackButton = forwardRef<HTMLButtonElement, { to: AuthStep }>(({ to }, ref) => (
    <button ref={ref} onClick={() => setStep(to)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground/70 hover:text-foreground">
      <ArrowLeft size={22} />
    </button>
  ));
  BackButton.displayName = 'BackButton';

  const ValidationIcon = ({ valid }: { valid: boolean }) => (
    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${valid ? 'bg-secondary/20' : 'bg-surface-interactive'}`}>
      {valid ? <Check size={12} className="text-secondary" /> : <X size={12} className="text-muted-foreground/40" />}
    </div>
  );

  const handleOtpInput = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...otpCode];
    newCode[index] = value.slice(-1);
    setOtpCode(newCode);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  }, [otpCode]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnimatePresence mode="wait">
        {/* WELCOME */}
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
                  A emoção do jogo<br />na palma da mão
                </h1>
                <p className="text-sm font-body text-muted-foreground">
                  Odds turbinadas, apostas ao vivo e os melhores mercados. Ganhe até <span className="text-primary font-bold">R$ 500</span> no primeiro depósito!
                </p>
              </div>
              <div className="space-y-3 mt-8">
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep('signup')}
                  className="w-full bg-primary text-primary-foreground font-display font-bold text-base py-3.5 rounded-xl min-h-[44px] hover:brightness-110 transition-all">
                  Criar Conta Grátis
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep('login')}
                  className="w-full bg-surface-interactive text-foreground font-display font-bold text-base py-3.5 rounded-xl min-h-[44px] hover:bg-muted transition-colors">
                  Já tenho conta
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* LOGIN */}
        {step === 'login' && (
          <motion.div key="login" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1 px-6 pt-4 pb-8">
            <BackButton to="welcome" />
            <div className="mt-4 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-extrabold">Entrar</h2>
                <p className="text-sm font-body text-muted-foreground mt-1">Bem-vindo de volta!</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-body font-medium text-muted-foreground">E-mail, usuário ou CPF</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="E-mail, @usuario ou CPF"
                      className="w-full bg-surface-interactive rounded-xl py-3 pl-11 pr-4 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground min-h-[44px]" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-body font-medium text-muted-foreground">Senha</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type={showPassword ? 'text' : 'password'} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Sua senha"
                      className="w-full bg-surface-interactive rounded-xl py-3 pl-11 pr-12 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground min-h-[44px]" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <button onClick={() => setStep('recovery')} className="text-xs font-body text-primary font-semibold min-h-[44px]">
                Esqueceu a senha?
              </button>

              {authError && (
                <p className="text-[0.75rem] text-destructive font-body bg-destructive/10 rounded-lg p-3">{authError}</p>
              )}

              <motion.button whileTap={{ scale: 0.97 }} disabled={authLoading}
                onClick={async () => {
                  setAuthError(null);
                  setAuthLoading(true);
                  const { error } = await signIn(loginEmail, loginPassword);
                  setAuthLoading(false);
                  if (error) {
                    const errMap: Record<string, string> = {
                      'Invalid login credentials': 'E-mail ou senha incorretos',
                      'Email not confirmed': 'E-mail ainda não confirmado. Verifique sua caixa de entrada.',
                      'User already registered': 'Este e-mail já está cadastrado',
                      'Signup requires a valid password': 'A senha informada é inválida',
                      'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
                      'For security purposes, you can only request this once every 60 seconds': 'Por segurança, aguarde 60 segundos antes de tentar novamente',
                      'Too many requests': 'Muitas tentativas. Aguarde um momento.',
                    };
                    setAuthError(errMap[error] || error);
                  } else {
                    navigate('/');
                  }
                }}
                className="w-full bg-primary text-primary-foreground font-display font-bold text-base py-3.5 rounded-xl min-h-[44px] hover:brightness-110 transition-all disabled:opacity-50">
                {authLoading ? 'Entrando...' : 'Entrar'}
              </motion.button>

              {/* Biometria */}
              <button className="w-full bg-surface-card text-foreground font-body font-semibold text-sm py-3 rounded-xl min-h-[44px] flex items-center justify-center gap-2 hover:bg-surface-interactive transition-colors">
                <Fingerprint size={20} className="text-primary" />
                Entrar com Face ID / Biometria
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full bg-surface-interactive h-px" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-3 text-xs text-muted-foreground font-body">ou</span>
                </div>
              </div>

              <button
                onClick={async () => {
                  setAuthError(null);
                  setAuthLoading(true);
                  const result = await lovable.auth.signInWithOAuth('google', {
                    redirect_uri: window.location.origin,
                  });
                  if (result?.error) {
                    setAuthError('Erro ao entrar com Google. Tente novamente.');
                  }
                  setAuthLoading(false);
                }}
                className="w-full bg-surface-card text-foreground font-body font-semibold text-sm py-3 rounded-xl min-h-[44px] flex items-center justify-center gap-2 hover:bg-surface-interactive transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Entrar com Google
              </button>

              <button onClick={() => navigate('/')} className="w-full text-muted-foreground font-body text-sm py-3 rounded-xl min-h-[44px] flex items-center justify-center gap-2 hover:text-foreground transition-colors">
                <UserCircle size={18} />
                Continuar como Visitante
              </button>
            </div>
          </motion.div>
        )}

        {/* SIGNUP */}
        {step === 'signup' && (
          <motion.div key="signup" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1 px-6 pt-4 pb-8 overflow-y-auto">
            <button onClick={() => { if (signupStep > 1) setSignupStep(signupStep - 1); else setStep('welcome'); }} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground/70 hover:text-foreground">
              <ArrowLeft size={22} />
            </button>

            <div className="mt-4 space-y-5">
              <div>
                <h2 className="font-display text-2xl font-extrabold">Criar Conta</h2>
                <p className="text-sm font-body text-muted-foreground mt-1">
                  Etapa {signupStep} de {totalSignupSteps} — {signupStepLabels[signupStep - 1]}
                </p>
              </div>

              {/* Progress Stepper */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalSignupSteps }, (_, i) => i + 1).map((s) => (
                  <div key={s} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full flex items-center">
                      <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        s < signupStep ? 'bg-secondary' : s === signupStep ? 'bg-primary' : 'bg-surface-interactive'
                      }`} />
                    </div>
                    <span className={`text-[0.55rem] font-body font-medium transition-colors ${
                      s <= signupStep ? 'text-foreground' : 'text-muted-foreground/50'
                    }`}>
                      {signupStepLabels[s - 1]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Google Sign Up */}
              <button
                onClick={async () => {
                  setAuthError(null);
                  setAuthLoading(true);
                  const result = await lovable.auth.signInWithOAuth('google', {
                    redirect_uri: window.location.origin,
                  });
                  if (result?.error) {
                    setAuthError('Erro ao entrar com Google. Tente novamente.');
                  }
                  setAuthLoading(false);
                }}
                className="w-full bg-surface-card text-foreground font-body font-semibold text-sm py-3 rounded-xl min-h-[44px] flex items-center justify-center gap-2 hover:bg-surface-interactive transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Registrar com Google
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full bg-surface-interactive h-px" /></div>
                <div className="relative flex justify-center"><span className="bg-background px-3 text-xs text-muted-foreground font-body">ou preencha manualmente</span></div>
              </div>

              <AnimatePresence mode="wait">
                {/* STEP 1: Dados Pessoais */}
                {signupStep === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-body font-medium text-muted-foreground">Nome completo</label>
                      <div className="relative">
                        <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="João da Silva"
                          className="w-full bg-surface-interactive rounded-xl py-3 pl-11 pr-10 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground min-h-[44px]" />
                        {fullName.length > 0 && <div className="absolute right-3 top-1/2 -translate-y-1/2"><ValidationIcon valid={fullName.trim().length >= 3} /></div>}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-body font-medium text-muted-foreground">Nome de usuário</label>
                      <div className="relative">
                        <AtSign size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type="text" value={username} onChange={(e) => { const v = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''); setUsername(v); checkUsername(v); }} placeholder="joaosilva"
                          className="w-full bg-surface-interactive rounded-xl py-3 pl-11 pr-10 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground min-h-[44px]" />
                        {username.length >= 3 && <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {usernameChecking ? (
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <ValidationIcon valid={usernameAvailable === true} />
                          )}
                        </div>}
                      </div>
                      {username.length >= 3 && !usernameChecking && usernameAvailable === false && (
                        <p className="text-[0.65rem] text-destructive font-body">Nome de usuário já está em uso</p>
                      )}
                      {username.length >= 3 && !usernameChecking && usernameAvailable === true && (
                        <p className="text-[0.65rem] text-secondary font-body">Disponível ✓</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-body font-medium text-muted-foreground">E-mail</label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com"
                          className="w-full bg-surface-interactive rounded-xl py-3 pl-11 pr-10 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground min-h-[44px]" />
                        {email.length > 0 && <div className="absolute right-3 top-1/2 -translate-y-1/2"><ValidationIcon valid={isEmailValid(email)} /></div>}
                      </div>
                      {emailError && <p className="text-[0.65rem] text-destructive font-body">{emailError}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-body font-medium text-muted-foreground">CPF</label>
                      <div className="relative">
                        <CreditCard size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type="text" value={cpf} onChange={(e) => setCpf(maskCPF(e.target.value))} placeholder="000.000.000-00"
                          className="w-full bg-surface-interactive rounded-xl py-3 pl-11 pr-10 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground min-h-[44px]" />
                        {cpfClean.length === 11 && <div className="absolute right-3 top-1/2 -translate-y-1/2"><ValidationIcon valid={cpfValid} /></div>}
                      </div>
              {cpfClean.length === 11 && !cpfValid && <p className="text-[0.65rem] text-destructive font-body">CPF inválido</p>}
                      {cpfValid && (
                        <div className="flex items-center gap-1.5 bg-secondary/10 rounded-lg px-3 py-1.5">
                          <ShieldCheck size={13} className="text-secondary" />
                          <span className="text-[0.65rem] text-secondary font-body font-semibold">Consulta Receita Federal — CPF regular ✓</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-body font-medium text-muted-foreground">Data de nascimento</label>
                      <div className="relative">
                        <Calendar size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type="text" value={dob} onChange={(e) => setDob(maskDate(e.target.value))} placeholder="DD/MM/AAAA"
                          className="w-full bg-surface-interactive rounded-xl py-3 pl-11 pr-10 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground min-h-[44px]" />
                        {dobClean.length === 8 && <div className="absolute right-3 top-1/2 -translate-y-1/2"><ValidationIcon valid={dobValid} /></div>}
                      </div>
                      {dobError && <p className="text-[0.65rem] text-destructive font-body">{dobError}</p>}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Endereço e Contato */}
                {signupStep === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-body font-medium text-muted-foreground">País</label>
                      <div className="relative">
                        <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <select value={pais} onChange={(e) => setPais(e.target.value)}
                          className="w-full bg-surface-interactive rounded-xl py-3 pl-11 pr-4 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary min-h-[44px] appearance-none">
                          {['Brasil','Portugal','Angola','Moçambique','Cabo Verde','Guiné-Bissau','São Tomé e Príncipe','Timor-Leste'].map(p => (
                            <option key={p} value={p} className="bg-background">{p}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-body font-medium text-muted-foreground">CEP</label>
                      <div className="relative">
                        <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type="text" value={cep} onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '').slice(0, 8);
                          const masked = v.length > 5 ? `${v.slice(0, 5)}-${v.slice(5)}` : v;
                          setCep(masked);
                          if (v.length === 8) {
                            setCepLoading(true);
                            fetch(`https://viacep.com.br/ws/${v}/json/`)
                              .then(r => r.json())
                              .then(data => {
                                if (!data.erro) {
                                  setEstado(data.uf || '');
                                  setCidade(data.localidade || '');
                                }
                              })
                              .catch(() => {})
                              .finally(() => setCepLoading(false));
                          }
                        }} placeholder="00000-000"
                          className="w-full bg-surface-interactive rounded-xl py-3 pl-11 pr-10 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground min-h-[44px]" />
                        {cepLoading && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-body font-medium text-muted-foreground">Estado</label>
                        <select value={estado} onChange={(e) => setEstado(e.target.value)}
                          className="w-full bg-surface-interactive rounded-xl py-3 px-4 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary min-h-[44px] appearance-none">
                          <option value="" className="bg-background">UF</option>
                          {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(uf => (
                            <option key={uf} value={uf} className="bg-background">{uf}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-body font-medium text-muted-foreground">Cidade</label>
                        <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Sua cidade"
                          className="w-full bg-surface-interactive rounded-xl py-3 px-4 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground min-h-[44px]" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-body font-medium text-muted-foreground">Telefone</label>
                      <div className="relative">
                        <Smartphone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type="tel" value={telefone} onChange={(e) => {
                          const d = e.target.value.replace(/\D/g, '').slice(0, 11);
                          if (d.length <= 2) setTelefone(d.length ? `(${d}` : '');
                          else if (d.length <= 7) setTelefone(`(${d.slice(0, 2)}) ${d.slice(2)}`);
                          else setTelefone(`(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`);
                        }} placeholder="(11) 99999-9999"
                          className="w-full bg-surface-interactive rounded-xl py-3 pl-11 pr-4 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground min-h-[44px]" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Senha e Segurança */}
                {signupStep === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-body font-medium text-muted-foreground">Senha</label>
                      <div className="relative">
                        <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres"
                          className="w-full bg-surface-interactive rounded-xl py-3 pl-11 pr-12 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground min-h-[44px]" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {password.length > 0 && (
                        <div className="space-y-1.5">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= pwStrength.level ? pwStrength.color : 'bg-surface-interactive'}`} />
                            ))}
                          </div>
                          <p className={`text-[0.65rem] font-body ${pwStrength.level <= 1 ? 'text-destructive' : pwStrength.level <= 3 ? 'text-primary' : 'text-secondary'}`}>
                            Senha {pwStrength.label}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-body font-medium text-muted-foreground">Confirmar senha</label>
                      <div className="relative">
                        <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a senha"
                          className="w-full bg-surface-interactive rounded-xl py-3 pl-11 pr-12 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground min-h-[44px]" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground">
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {confirmPassword.length > 0 && !passwordsMatch && (
                        <p className="text-[0.65rem] text-destructive font-body">As senhas não conferem</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-body font-medium text-muted-foreground">Código promocional (opcional)</label>
                      <div className="relative">
                        <Gift size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} placeholder="Ex: SELECAO500"
                          className="w-full bg-surface-interactive rounded-xl py-3 pl-11 pr-4 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground min-h-[44px]" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Termos e Condições */}
                {signupStep === 4 && (
                  <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <div className="bg-surface-card rounded-xl p-4 flex items-start gap-3">
                      <Gift size={24} className="text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm font-display font-bold text-primary">Bônus de Boas-Vindas</p>
                        <p className="text-xs font-body text-muted-foreground mt-0.5">
                          Ganhe até R$ 500 em bônus no seu primeiro depósito!
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button onClick={() => setOver18(!over18)} className="flex items-start gap-3 min-h-[44px] w-full text-left">
                        <div className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${over18 ? 'bg-primary' : 'bg-surface-interactive'}`}>
                          {over18 && <Check size={12} className="text-primary-foreground" />}
                        </div>
                        <span className="text-xs font-body text-foreground/80">
                          Declaro que tenho 18 (dezoito) anos ou mais e que possuo capacidade civil plena para realizar apostas, conforme o Art. 26 da Lei Nº 14.790/2023.
                        </span>
                      </button>

                      <button onClick={() => setAcceptTerms(!acceptTerms)} className="flex items-start gap-3 min-h-[44px] w-full text-left">
                        <div className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${acceptTerms ? 'bg-primary' : 'bg-surface-interactive'}`}>
                          {acceptTerms && <Check size={12} className="text-primary-foreground" />}
                        </div>
                        <span className="text-xs font-body text-foreground/80">
                          Li e aceito os <span className="text-primary font-semibold">Termos e Condições de Uso</span>, a <span className="text-primary font-semibold">Política de Privacidade</span> e as <span className="text-primary font-semibold">Regras de Apostas</span> da SeleçãoBet. Estou ciente de que esta plataforma é regulamentada e monitorada pela Secretaria de Prêmios e Apostas do Ministério da Fazenda (SPA/MF).
                        </span>
                      </button>

                      <button onClick={() => setNotExcluded(!notExcluded)} className="flex items-start gap-3 min-h-[44px] w-full text-left">
                        <div className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${notExcluded ? 'bg-primary' : 'bg-surface-interactive'}`}>
                          {notExcluded && <Check size={12} className="text-primary-foreground" />}
                        </div>
                        <span className="text-xs font-body text-foreground/80">
                          Confirmo e garanto que não estou incluído em nenhuma lista de autoexclusão, lista de sanções nacionais ou internacionais, e que meus recursos não são provenientes de atividades ilícitas, nos termos da Lei Nº 9.613/1998 (Lei de Lavagem de Dinheiro).
                        </span>
                      </button>

                      <button onClick={() => setAcceptRegulation(!acceptRegulation)} className="flex items-start gap-3 min-h-[44px] w-full text-left">
                        <div className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${acceptRegulation ? 'bg-primary' : 'bg-surface-interactive'}`}>
                          {acceptRegulation && <Check size={12} className="text-primary-foreground" />}
                        </div>
                        <span className="text-xs font-body text-foreground/80">
                          Autorizo a SeleçãoBet a realizar a verificação de minha identidade (KYC) e a compartilhar meus dados cadastrais com a Secretaria de Prêmios e Apostas (SPA/MF) e demais órgãos reguladores, conforme exigido pela Lei Nº 14.790/2023 e regulamentações vigentes.
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {authError && (
                <p className="text-[0.75rem] text-destructive font-body bg-destructive/10 rounded-lg p-3">{authError}</p>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-2">
                {signupStep > 1 && (
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => setSignupStep(signupStep - 1)}
                    className="flex-1 bg-surface-interactive text-foreground font-display font-bold text-sm py-3.5 rounded-xl min-h-[44px] hover:bg-muted transition-colors">
                    Voltar
                  </motion.button>
                )}
                <motion.button whileTap={{ scale: 0.97 }}
                  onClick={async () => {
                    if (signupStep < totalSignupSteps) {
                      setSignupStep(signupStep + 1);
                    } else {
                      setAuthError(null);
                      setAuthLoading(true);
                      const { error } = await signUp(email, password, {
                        full_name: fullName,
                        username,
                        cpf: cpf.replace(/\D/g, ''),
                        phone: telefone.replace(/\D/g, ''),
                      });
                      setAuthLoading(false);
                      if (error) {
                        const errMap: Record<string, string> = {
                          'User already registered': 'Este e-mail já está cadastrado',
                          'Signup requires a valid password': 'A senha informada é inválida',
                          'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
                          'Too many requests': 'Muitas tentativas. Aguarde um momento.',
                          'For security purposes, you can only request this once every 60 seconds': 'Por segurança, aguarde 60 segundos antes de tentar novamente',
                        };
                        setAuthError(errMap[error] || error);
                      } else {
                        setStep('kyc');
                      }
                    }
                  }}
                  disabled={!currentStepValid || authLoading}
                  className={`flex-1 font-display font-bold text-sm py-3.5 rounded-xl min-h-[44px] transition-all ${
                    currentStepValid && !authLoading
                      ? 'bg-primary text-primary-foreground hover:brightness-110'
                      : 'bg-surface-interactive text-muted-foreground cursor-not-allowed'
                  }`}>
                  {authLoading ? 'Cadastrando...' : signupStep < totalSignupSteps ? 'Próximo' : 'Cadastrar'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* KYC — Immersive Pipeline */}
        {step === 'kyc' && (
          <motion.div key="kyc" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1 flex flex-col pb-8 overflow-y-auto">
            <AnimatePresence mode="wait">

              {/* KYC INTRO */}
              {kycSubStep === 'intro' && (
                <motion.div key="kyc-intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }} className="flex-1 px-6 pt-4">
                  <BackButton to="signup" />
                  <div className="mt-4 space-y-5">
                    <div className="flex items-start gap-3">
                      <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                        <ShieldCheck size={32} className="text-primary" />
                      </motion.div>
                      <div>
                        <h2 className="font-display text-xl font-extrabold">Verificação de Segurança</h2>
                        <p className="text-xs font-body text-muted-foreground mt-1">
                          Protegemos seu dinheiro com 5 camadas de segurança. É rápido e seguro!
                        </p>
                      </div>
                    </div>

                    {/* Pipeline steps preview */}
                    <div className="space-y-2.5">
                      {[
                        { icon: CreditCard, title: 'Consulta CPF', desc: 'Cruzamento com a Receita Federal em tempo real', color: 'text-primary', bg: 'bg-primary/15', done: true },
                        { icon: FileText, title: 'Captura de Documento', desc: 'RG ou CNH com bordas inteligentes e OCR automático', color: 'text-primary', bg: 'bg-primary/15', done: false },
                        { icon: Camera, title: 'Liveness Check', desc: 'Prova de vida: mova o rosto para confirmar identidade', color: 'text-secondary', bg: 'bg-secondary/15', done: false },
                        { icon: Scan, title: 'Face Match & Anti-Deepfake', desc: 'Comparação biométrica e análise de manipulação por IA', color: 'text-secondary', bg: 'bg-secondary/15', done: false },
                        { icon: ShieldCheck, title: 'PLD Anti-Lavagem', desc: 'Só aceitamos depósitos de contas em seu nome', color: 'text-primary', bg: 'bg-primary/15', done: false },
                      ].map((item, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                          className="bg-surface-card rounded-xl p-3 flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full ${item.bg} flex items-center justify-center flex-shrink-0`}>
                            {item.done ? <Check size={16} className="text-secondary" /> : <item.icon size={16} className={item.color} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[0.72rem] font-body font-bold text-foreground">{item.title}</span>
                              {item.done && <span className="text-[0.55rem] font-body font-semibold text-secondary bg-secondary/10 px-1.5 py-0.5 rounded-full">✓ Verificado</span>}
                            </div>
                            <p className="text-[0.6rem] font-body text-muted-foreground leading-tight mt-0.5">{item.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="bg-secondary/10 rounded-xl p-3 flex items-start gap-2.5">
                      <ShieldCheck size={16} className="text-secondary flex-shrink-0 mt-0.5" />
                      <p className="text-[0.65rem] font-body text-secondary leading-snug">
                        <strong>Por sua segurança:</strong> esse rigor técnico garante que seu dinheiro e seus prêmios estejam sempre protegidos.
                      </p>
                    </div>

                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => setKycSubStep('doc-front')}
                      className="w-full bg-primary text-primary-foreground font-display font-bold text-base py-3.5 rounded-xl min-h-[44px] hover:brightness-110 transition-all">
                      Iniciar Verificação
                    </motion.button>

                    <button onClick={() => setStep('success')} className="w-full text-center text-xs text-muted-foreground font-body min-h-[44px]">
                      Pular por agora
                    </button>
                  </div>
                </motion.div>
              )}

              {/* DOC FRONT — Smart Borders */}
              {kycSubStep === 'doc-front' && (
                <motion.div key="kyc-doc-front" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1 px-6 pt-4">
                  <button onClick={() => setKycSubStep('intro')} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground/70 hover:text-foreground">
                    <ArrowLeft size={22} />
                  </button>
                  <div className="mt-2 space-y-5">
                    <div className="text-center">
                      <h2 className="font-display text-lg font-extrabold">Frente do Documento</h2>
                      <p className="text-xs font-body text-muted-foreground mt-1">Posicione seu RG ou CNH dentro da área</p>
                    </div>

                    {/* Document capture area with smart borders */}
                    <div className="relative mx-auto w-full max-w-[320px] aspect-[1.6/1] bg-surface-card rounded-2xl overflow-hidden flex items-center justify-center">
                      {/* Animated corner borders */}
                      <motion.div className="absolute inset-3 pointer-events-none" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />
                      </motion.div>

                      {docFront ? (
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-2">
                          <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center">
                            <Check size={28} className="text-secondary" />
                          </div>
                          <span className="text-xs font-body font-semibold text-secondary">Documento capturado!</span>
                        </motion.div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <FileText size={32} className="text-primary/40" />
                          <span className="text-[0.65rem] font-body">Posicione aqui</span>
                        </div>
                      )}

                      {/* Scanning line animation */}
                      {!docFront && (
                        <motion.div className="absolute left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                          animate={{ top: ['15%', '85%', '15%'] }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      )}
                    </div>

                    <div className="flex gap-2">
                      <motion.button whileTap={{ scale: 0.97 }} onClick={() => setDocFront('doc-front.jpg')}
                        className="flex-1 bg-primary text-primary-foreground font-display font-bold text-sm py-3 rounded-xl min-h-[44px] flex items-center justify-center gap-2">
                        <Camera size={16} /> Tirar Foto
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.97 }} onClick={() => setDocFront('doc-front-upload.jpg')}
                        className="flex-1 bg-surface-interactive text-foreground font-display font-bold text-sm py-3 rounded-xl min-h-[44px] flex items-center justify-center gap-2">
                        <Upload size={16} /> Galeria
                      </motion.button>
                    </div>

                    {docFront && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-secondary/10 rounded-xl p-3 flex items-center gap-2">
                        <Scan size={14} className="text-secondary" />
                        <span className="text-[0.65rem] font-body text-secondary font-semibold">OCR detectou dados automaticamente ✓</span>
                      </motion.div>
                    )}

                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => setKycSubStep('doc-back')} disabled={!docFront}
                      className={`w-full font-display font-bold text-sm py-3.5 rounded-xl min-h-[44px] transition-all ${
                        docFront ? 'bg-primary text-primary-foreground hover:brightness-110' : 'bg-surface-interactive text-muted-foreground cursor-not-allowed'
                      }`}>
                      Próximo — Verso do documento
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* DOC BACK */}
              {kycSubStep === 'doc-back' && (
                <motion.div key="kyc-doc-back" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1 px-6 pt-4">
                  <button onClick={() => setKycSubStep('doc-front')} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground/70 hover:text-foreground">
                    <ArrowLeft size={22} />
                  </button>
                  <div className="mt-2 space-y-5">
                    <div className="text-center">
                      <h2 className="font-display text-lg font-extrabold">Verso do Documento</h2>
                      <p className="text-xs font-body text-muted-foreground mt-1">Agora vire o documento e capture o verso</p>
                    </div>

                    <div className="relative mx-auto w-full max-w-[320px] aspect-[1.6/1] bg-surface-card rounded-2xl overflow-hidden flex items-center justify-center">
                      <motion.div className="absolute inset-3 pointer-events-none" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />
                      </motion.div>

                      {docBack ? (
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-2">
                          <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center">
                            <Check size={28} className="text-secondary" />
                          </div>
                          <span className="text-xs font-body font-semibold text-secondary">Verso capturado!</span>
                        </motion.div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <FileText size={32} className="text-primary/40" />
                          <span className="text-[0.65rem] font-body">Posicione aqui</span>
                        </div>
                      )}

                      {!docBack && (
                        <motion.div className="absolute left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                          animate={{ top: ['15%', '85%', '15%'] }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      )}
                    </div>

                    <div className="flex gap-2">
                      <motion.button whileTap={{ scale: 0.97 }} onClick={() => setDocBack('doc-back.jpg')}
                        className="flex-1 bg-primary text-primary-foreground font-display font-bold text-sm py-3 rounded-xl min-h-[44px] flex items-center justify-center gap-2">
                        <Camera size={16} /> Tirar Foto
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.97 }} onClick={() => setDocBack('doc-back-upload.jpg')}
                        className="flex-1 bg-surface-interactive text-foreground font-display font-bold text-sm py-3 rounded-xl min-h-[44px] flex items-center justify-center gap-2">
                        <Upload size={16} /> Galeria
                      </motion.button>
                    </div>

                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => setKycSubStep('liveness')} disabled={!docBack}
                      className={`w-full font-display font-bold text-sm py-3.5 rounded-xl min-h-[44px] transition-all ${
                        docBack ? 'bg-primary text-primary-foreground hover:brightness-110' : 'bg-surface-interactive text-muted-foreground cursor-not-allowed'
                      }`}>
                      Próximo — Prova de Vida
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* LIVENESS CHECK — Circular Guide */}
              {kycSubStep === 'liveness' && (
                <motion.div key="kyc-liveness" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1 px-6 pt-4">
                  <button onClick={() => setKycSubStep('doc-back')} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground/70 hover:text-foreground">
                    <ArrowLeft size={22} />
                  </button>
                  <div className="mt-2 space-y-5">
                    <div className="text-center">
                      <h2 className="font-display text-lg font-extrabold">Prova de Vida</h2>
                      <p className="text-xs font-body text-muted-foreground mt-1">Siga as instruções na tela para confirmar que é você</p>
                    </div>

                    {/* Circular face guide */}
                    <div className="relative mx-auto w-56 h-56">
                      {/* Outer ring animated */}
                      <motion.div className="absolute inset-0 rounded-full border-[3px] border-dashed border-primary/30"
                        animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
                      {/* Progress ring */}
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="112" cy="112" r="106" fill="none" stroke="hsl(var(--surface-interactive))" strokeWidth="4" />
                        <motion.circle cx="112" cy="112" r="106" fill="none" stroke="hsl(var(--secondary))" strokeWidth="4"
                          strokeDasharray={666} strokeDashoffset={666 - (666 * livenessProgress / 100)} strokeLinecap="round"
                          transition={{ duration: 0.3 }}
                        />
                      </svg>
                      {/* Inner area */}
                      <div className="absolute inset-4 rounded-full bg-surface-card flex items-center justify-center overflow-hidden">
                        <motion.div animate={
                          livenessStep === 0 ? {} :
                          livenessStep === 1 ? { rotate: [0, 15, -15, 0] } :
                          livenessStep === 2 ? { scale: [1, 1.05, 1] } :
                          { y: [0, -3, 0] }
                        } transition={{ duration: 1.5, repeat: Infinity }}>
                          <UserCircle size={64} className="text-muted-foreground/30" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Liveness instructions */}
                    {(() => {
                      const instructions = [
                        { text: 'Posicione seu rosto no centro', emoji: '👤' },
                        { text: 'Agora vire levemente a cabeça', emoji: '↔️' },
                        { text: 'Dê um leve sorriso', emoji: '😊' },
                        { text: 'Pisque os olhos', emoji: '😉' },
                      ];
                      const current = instructions[livenessStep] || instructions[0];
                      return (
                        <motion.div key={livenessStep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          className="text-center space-y-1">
                          <span className="text-2xl">{current.emoji}</span>
                          <p className="text-sm font-body font-semibold text-foreground">{current.text}</p>
                        </motion.div>
                      );
                    })()}

                    <motion.button whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        if (livenessStep < 3) {
                          setLivenessStep(livenessStep + 1);
                          setLivenessProgress((livenessStep + 1) * 33);
                        } else {
                          setLivenessProgress(100);
                          setSelfie('liveness-selfie.jpg');
                          setTimeout(() => setKycSubStep('validating'), 600);
                        }
                      }}
                      className="w-full bg-primary text-primary-foreground font-display font-bold text-sm py-3.5 rounded-xl min-h-[44px] hover:brightness-110 transition-all">
                      {livenessStep < 3 ? 'Confirmar' : 'Finalizar Captura'}
                    </motion.button>

                    <p className="text-[0.6rem] font-body text-muted-foreground text-center leading-snug">
                      A câmera verifica que você é uma pessoa real, não uma foto ou deepfake. Seus dados biométricos não são armazenados.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* VALIDATING — Loading Pipeline */}
              {kycSubStep === 'validating' && (
                <motion.div key="kyc-validating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 px-6 pt-4 flex flex-col items-center justify-center min-h-[70vh]">
                  <div className="w-full max-w-xs space-y-8">
                    <div className="text-center space-y-2">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-16 h-16 mx-auto rounded-full bg-primary/15 flex items-center justify-center">
                        <ShieldCheck size={32} className="text-primary" />
                      </motion.div>
                      <h2 className="font-display text-lg font-extrabold">Estamos validando seus dados</h2>
                      <p className="text-xs font-body text-muted-foreground">Para sua proteção, cada camada é verificada individualmente</p>
                    </div>

                    {/* Validation steps */}
                    <div className="space-y-3">
                      {[
                        { icon: CreditCard, label: 'Consulta CPF — Receita Federal', status: validationStep >= 0 ? (validationStep > 0 ? 'done' : 'loading') : 'pending' },
                        { icon: Scan, label: 'OCR — Extração de dados do documento', status: validationStep >= 1 ? (validationStep > 1 ? 'done' : 'loading') : 'pending' },
                        { icon: Camera, label: 'Liveness — Prova de vida confirmada', status: validationStep >= 2 ? (validationStep > 2 ? 'done' : 'loading') : 'pending' },
                        { icon: Brain, label: 'Face Match — Comparação biométrica', status: validationStep >= 3 ? (validationStep > 3 ? 'done' : 'loading') : 'pending' },
                        { icon: AlertTriangle, label: 'Anti-Deepfake — Análise de manipulação', status: validationStep >= 4 ? (validationStep > 4 ? 'done' : 'loading') : 'pending' },
                        { icon: ShieldCheck, label: 'PLD — Prevenção à Lavagem de Dinheiro', status: validationStep >= 5 ? (validationStep > 5 ? 'done' : 'loading') : 'pending' },
                      ].map((item, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
                          className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            item.status === 'done' ? 'bg-secondary/20' : item.status === 'loading' ? 'bg-primary/15' : 'bg-surface-interactive'
                          }`}>
                            {item.status === 'done' ? <Check size={14} className="text-secondary" /> :
                             item.status === 'loading' ? (
                              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                <RefreshCw size={14} className="text-primary" />
                              </motion.div>
                             ) : <item.icon size={14} className="text-muted-foreground/40" />}
                          </div>
                          <span className={`text-[0.7rem] font-body font-medium ${
                            item.status === 'done' ? 'text-secondary' : item.status === 'loading' ? 'text-foreground' : 'text-muted-foreground/50'
                          }`}>{item.label}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Auto-advance simulation */}
                    {(() => {
                      // eslint-disable-next-line react-hooks/rules-of-hooks
                      useEffect(() => {
                        if (kycSubStep !== 'validating') return;
                        setValidationStep(0);
                        const timers = [
                          setTimeout(() => setValidationStep(1), 1200),
                          setTimeout(() => setValidationStep(2), 2400),
                          setTimeout(() => setValidationStep(3), 3400),
                          setTimeout(() => setValidationStep(4), 4400),
                          setTimeout(() => setValidationStep(5), 5200),
                          setTimeout(() => setValidationStep(6), 6000),
                          setTimeout(() => setKycSubStep('done'), 6800),
                        ];
                        return () => timers.forEach(clearTimeout);
                      }, [kycSubStep]);
                      return null;
                    })()}
                  </div>
                </motion.div>
              )}

              {/* KYC DONE */}
              {kycSubStep === 'done' && (
                <motion.div key="kyc-done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 px-6 pt-4 flex flex-col items-center justify-center min-h-[70vh]">
                  <div className="w-full max-w-xs space-y-6 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="w-20 h-20 mx-auto rounded-full bg-secondary/20 flex items-center justify-center">
                      <CheckCircle2 size={44} className="text-secondary" />
                    </motion.div>
                    <div>
                      <h2 className="font-display text-xl font-extrabold">Identidade Verificada!</h2>
                      <p className="text-xs font-body text-muted-foreground mt-2">
                        Todas as 5 camadas de segurança foram aprovadas. Seu dinheiro e prêmios estão protegidos.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { icon: CreditCard, label: 'CPF' },
                        { icon: FileText, label: 'OCR' },
                        { icon: Camera, label: 'Liveness' },
                        { icon: Brain, label: 'Face Match' },
                        { icon: AlertTriangle, label: 'Anti-Deepfake' },
                        { icon: ShieldCheck, label: 'PLD' },
                      ].map((item, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                          className="bg-secondary/10 rounded-lg p-2 flex flex-col items-center gap-1">
                          <item.icon size={14} className="text-secondary" />
                          <span className="text-[0.55rem] font-body font-semibold text-secondary">{item.label}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="bg-primary/10 rounded-xl p-3">
                      <p className="text-[0.65rem] font-body text-primary leading-snug">
                        💰 <strong>Por sua segurança:</strong> só aceitamos depósitos de contas em seu nome. Isso garante que seu prêmio vá direto para você!
                      </p>
                    </div>

                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep('success')}
                      className="w-full bg-primary text-primary-foreground font-display font-bold text-base py-3.5 rounded-xl min-h-[44px] hover:brightness-110 transition-all">
                      Começar a Apostar 🎉
                    </motion.button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        )}

        {/* OTP */}
        {step === 'otp' && (
          <motion.div key="otp" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1 px-6 pt-4 pb-8">
            <BackButton to="login" />
            <div className="mt-4 space-y-6">
              <div className="flex items-start gap-3">
                <ShieldCheck size={28} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-display text-2xl font-extrabold">Verificação</h2>
                  <p className="text-sm font-body text-muted-foreground mt-1">
                    Digite o código enviado para seu e-mail
                  </p>
                </div>
              </div>

              {/* Method selector */}
              <div className="flex gap-2">
                <button className="flex-1 bg-primary text-primary-foreground text-xs font-body font-semibold py-2.5 rounded-xl min-h-[44px] flex items-center justify-center gap-1.5">
                  <Mail size={14} /> E-mail
                </button>
                <button className="flex-1 bg-surface-interactive text-muted-foreground text-xs font-body font-semibold py-2.5 rounded-xl min-h-[44px] flex items-center justify-center gap-1.5">
                  <Smartphone size={14} /> SMS
                </button>
                <button className="flex-1 bg-surface-interactive text-muted-foreground text-xs font-body font-semibold py-2.5 rounded-xl min-h-[44px] flex items-center justify-center gap-1.5">
                  <Fingerprint size={14} /> Biometria
                </button>
              </div>

              {/* OTP input */}
              <div className="flex gap-2 justify-center">
                {otpCode.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpInput(i, e.target.value)}
                    className="w-12 h-14 bg-surface-interactive rounded-xl text-center text-xl font-display font-bold text-foreground outline-none focus:ring-1 focus:ring-primary"
                  />
                ))}
              </div>

              <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/')}
                className="w-full bg-primary text-primary-foreground font-display font-bold text-base py-3.5 rounded-xl min-h-[44px] hover:brightness-110 transition-all">
                Confirmar
              </motion.button>

              <button
                disabled={!otpCanResend}
                onClick={() => { setOtpTimer(60); setOtpCanResend(false); }}
                className={`w-full text-center text-xs font-body font-semibold min-h-[44px] ${otpCanResend ? 'text-primary' : 'text-muted-foreground'}`}>
                {otpCanResend ? 'Reenviar código' : `Reenviar código (${String(Math.floor(otpTimer / 60)).padStart(2, '0')}:${String(otpTimer % 60).padStart(2, '0')})`}
              </button>
            </div>
          </motion.div>
        )}

        {/* RECOVERY */}
        {step === 'recovery' && (
          <motion.div key="recovery" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1 px-6 pt-4 pb-8">
            <BackButton to="login" />
            <div className="mt-4 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-extrabold">Recuperar Senha</h2>
                <p className="text-sm font-body text-muted-foreground mt-1">
                  {recoverySent
                    ? 'Enviamos um link de recuperação para seu e-mail. Verifique sua caixa de entrada.'
                    : 'Digite seu e-mail e enviaremos um link para redefinir sua senha.'
                  }
                </p>
              </div>

              {!recoverySent ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-body font-medium text-muted-foreground">E-mail</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input type="email" value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} placeholder="seu@email.com"
                        className="w-full bg-surface-interactive rounded-xl py-3 pl-11 pr-4 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground min-h-[44px]" />
                    </div>
                  </div>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={async () => {
                    await supabase.auth.resetPasswordForEmail(recoveryEmail, {
                      redirectTo: `${window.location.origin}/reset-password`,
                    });
                    setRecoverySent(true);
                  }}
                    disabled={!isEmailValid(recoveryEmail)}
                    className={`w-full font-display font-bold text-base py-3.5 rounded-xl min-h-[44px] transition-all ${
                      isEmailValid(recoveryEmail)
                        ? 'bg-primary text-primary-foreground hover:brightness-110'
                        : 'bg-surface-interactive text-muted-foreground cursor-not-allowed'
                    }`}>
                    Enviar Link de Recuperação
                  </motion.button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 pt-4">
                  <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Mail size={28} className="text-secondary" />
                  </div>
                  <p className="text-sm font-body text-foreground text-center">
                    Verifique <span className="font-semibold text-primary">{recoveryEmail}</span>
                  </p>
                  <button onClick={() => setStep('login')}
                    className="text-xs text-primary font-body font-semibold min-h-[44px]">
                    Voltar ao Login
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* SUCCESS */}
        {step === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-6 pb-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
              className="w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center mb-6"
            >
              <CheckCircle2 size={48} className="text-secondary" />
            </motion.div>
            <h2 className="font-display text-2xl font-extrabold">Conta criada com sucesso!</h2>
            <p className="text-sm font-body text-muted-foreground mt-2 max-w-[280px]">
              Tudo pronto! Comece a explorar os melhores mercados e odds turbinadas.
            </p>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/')}
              className="mt-8 w-full bg-primary text-primary-foreground font-display font-bold text-base py-3.5 rounded-xl min-h-[44px] hover:brightness-110 transition-all">
              Começar a Apostar
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthPage;
