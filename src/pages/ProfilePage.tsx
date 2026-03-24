import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, TrendingUp, History, Shield, Settings, LogOut, ChevronRight,
  Award, Trophy, CreditCard, Star, UserPlus, LogIn, Pencil, Check, X,
  Mail, Phone, MapPin, Calendar, FileText, Camera, Image, Loader2
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition, staggerContainer, staggerItem } from '@/components/animations';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const stats = [
  { label: 'Apostas', value: '142' },
  { label: 'Taxa de Acerto', value: '58%' },
  { label: 'ROI', value: '+12.4%' },
  { label: 'Nível', value: 'Ouro' },
];

const menuItems = [
  { icon: History, label: 'Histórico de Apostas', route: '/historico' },
  { icon: TrendingUp, label: 'Relatório de Desempenho', route: '/desempenho' },
  { icon: Trophy, label: 'Bolão', route: '/bolao' },
  { icon: Award, label: 'Plano Premium', route: '/planos' },
  { icon: CreditCard, label: 'Carteira', route: '/carteira' },
  { icon: Shield, label: 'Jogo Responsável', route: '/jogo-responsavel' },
  { icon: Settings, label: 'Configurações', route: '/configuracoes' },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, profile, logout, updateProfile, fetchProfile } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    full_name: '',
    username: '',
    phone: '',
    cpf: '',
    dob: '',
    country: '',
    state: '',
    city: '',
  });
  const [newEmail, setNewEmail] = useState('');
  const [emailEditing, setEmailEditing] = useState(false);

  const handlePhotoUpload = async (file: File) => {
    if (!user) return;
    setUploadingPhoto(true);
    setShowPhotoMenu(false);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${user.id}/avatar.${ext}`;

      // Remove old avatar if exists
      await supabase.storage.from('avatars').remove([path]);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(path);

      const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      await updateProfile({ avatar_url: avatarUrl } as any);
      await fetchProfile();
      toast.success('Foto atualizada!');
    } catch (err: any) {
      console.error(err);
      toast.error('Erro ao enviar foto');
    } finally {
      setUploadingPhoto(false);
    }
  };

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        username: profile.username || '',
        phone: profile.phone || '',
        cpf: profile.cpf || '',
        dob: profile.dob || '',
        country: profile.country || 'Brasil',
        state: profile.state || '',
        city: profile.city || '',
      });
    }
    if (user?.email) {
      setNewEmail(user.email);
    }
  }, [profile, user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success('Perfil atualizado com sucesso!');
      setEditing(false);
    } catch {
      toast.error('Erro ao salvar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleEmailChange = async () => {
    if (!newEmail || newEmail === user?.email) {
      setEmailEditing(false);
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      toast.success('Email de confirmação enviado para o novo endereço');
      setEmailEditing(false);
    } catch (err: any) {
      toast.error(err.message || 'Erro ao alterar email');
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success('Email de redefinição de senha enviado!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao enviar email');
    }
  };

  if (!isLoggedIn) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center px-6 pt-12 pb-20 space-y-6 text-center">
          <div className="w-20 h-20 rounded-full bg-surface-card flex items-center justify-center">
            <User size={36} className="text-muted-foreground" />
          </div>
          <div>
            <h2 className="font-display text-xl font-extrabold">Visitante</h2>
            <p className="text-sm font-body text-muted-foreground mt-1">
              Você está navegando como visitante
            </p>
          </div>
          <div className="w-full bg-surface-card rounded-2xl p-5 space-y-3">
            <p className="text-sm font-body text-foreground/80">
              Uma experiência única em apostas te espera. Mas antes, precisamos te conhecer!
            </p>
            <div className="flex gap-2">
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/auth')}
                className="flex-1 bg-primary text-primary-foreground font-display font-bold text-sm py-3 rounded-xl min-h-[44px] flex items-center justify-center gap-1.5">
                <UserPlus size={16} /> Registre-se
              </motion.button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/auth')}
                className="flex-1 bg-surface-interactive text-foreground font-display font-bold text-sm py-3 rounded-xl min-h-[44px] flex items-center justify-center gap-1.5">
                <LogIn size={16} /> Login
              </motion.button>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  const fieldRows = [
    { key: 'full_name', label: 'Nome Completo', icon: User, type: 'text', placeholder: 'Seu nome completo' },
    { key: 'username', label: 'Usuário', icon: User, type: 'text', placeholder: '@usuario' },
    { key: 'phone', label: 'Telefone', icon: Phone, type: 'tel', placeholder: '(11) 99999-9999' },
    { key: 'cpf', label: 'CPF', icon: FileText, type: 'text', placeholder: '000.000.000-00' },
    { key: 'dob', label: 'Data de Nascimento', icon: Calendar, type: 'date', placeholder: '' },
    { key: 'state', label: 'Estado', icon: MapPin, type: 'text', placeholder: 'SP' },
    { key: 'city', label: 'Cidade', icon: MapPin, type: 'text', placeholder: 'São Paulo' },
  ];

  return (
    <PageTransition>
      <div className="space-y-5 pb-24 px-4 pt-2">
        {/* Profile Header */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative">
            <div className="w-18 h-18 rounded-full bg-accent flex items-center justify-center w-[72px] h-[72px]">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={30} className="text-primary" />
              )}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <Camera size={14} />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold">{profile?.full_name || 'Usuário'}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="bg-primary/20 text-primary text-[0.65rem] font-display font-bold px-2 py-0.5 rounded-full">
                <Star size={12} className="inline mr-0.5" /> {profile?.level || 'Bronze'}
              </span>
              <span className="text-xs text-muted-foreground font-body">@{profile?.username || 'usuario'}</span>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setEditing(!editing)}
            className="w-10 h-10 rounded-xl bg-surface-card flex items-center justify-center"
          >
            {editing ? <X size={18} className="text-destructive" /> : <Pencil size={18} className="text-muted-foreground" />}
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-4 gap-2"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={staggerItem} className="bg-surface-card rounded-xl p-3 text-center">
              <p className="font-display text-lg font-bold text-primary">{stat.value}</p>
              <p className="text-[0.6rem] text-muted-foreground font-body mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Editable Profile Fields */}
        <AnimatePresence>
          {editing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-surface-card rounded-2xl p-4 space-y-4">
                <h3 className="font-display text-sm font-bold text-foreground">Editar Perfil</h3>

                {/* Email field (separate - uses auth) */}
                <div className="space-y-1.5">
                  <label className="text-[0.65rem] font-body text-muted-foreground flex items-center gap-1.5">
                    <Mail size={12} /> Email
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      disabled={!emailEditing}
                      className="flex-1 bg-surface-interactive rounded-xl px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary disabled:opacity-60 min-h-[44px]"
                    />
                    {emailEditing ? (
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleEmailChange}
                        className="w-11 h-11 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center"
                      >
                        <Check size={16} />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setEmailEditing(true)}
                        className="w-11 h-11 rounded-xl bg-surface-interactive flex items-center justify-center"
                      >
                        <Pencil size={14} className="text-muted-foreground" />
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Profile fields */}
                {fieldRows.map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <label className="text-[0.65rem] font-body text-muted-foreground flex items-center gap-1.5">
                      <field.icon size={12} /> {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={(form as any)[field.key]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full bg-surface-interactive rounded-xl px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary min-h-[44px]"
                    />
                  </div>
                ))}

                {/* Password reset */}
                <button
                  onClick={handlePasswordReset}
                  className="w-full text-sm font-body text-primary font-semibold py-2.5 min-h-[44px]"
                >
                  Redefinir Senha
                </button>

                {/* Save button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-primary text-primary-foreground font-display font-bold text-sm py-3.5 rounded-xl min-h-[44px] flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving ? (
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check size={16} /> Salvar Alterações
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menu */}
        <motion.div className="space-y-1" variants={staggerContainer} initial="hidden" animate="show">
          {menuItems.map((item) => (
            <motion.button
              key={item.label}
              variants={staggerItem}
              whileTap={{ scale: 0.97 }}
              onClick={() => item.route && navigate(item.route)}
              className="w-full flex items-center justify-between bg-surface-card rounded-xl p-4 min-h-[44px] hover:bg-surface-interactive transition-colors"
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className="text-muted-foreground" />
                <span className="text-sm font-body font-medium">{item.label}</span>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </motion.button>
          ))}
        </motion.div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center justify-center gap-2 bg-destructive/10 text-destructive rounded-xl p-4 min-h-[44px] font-body font-medium text-sm"
        >
          <LogOut size={18} />
          Sair da Conta
        </motion.button>
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
