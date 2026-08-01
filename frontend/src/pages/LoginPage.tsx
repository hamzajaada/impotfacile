import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Mail, Lock, ArrowRight, Eye, EyeOff, Shield, BadgeCheck } from 'lucide-react'

export default function LoginPage() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      if (user?.role === 'ADMIN') navigate('/admin')
      else if (user?.role === 'ADVISOR') navigate('/conseiller')
      else navigate('/dashboard')
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Courriel ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left panel - dark hero matching landing page */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-800 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-md px-8">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">IF</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">ImpotFacile</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight tracking-tight">
            Vos impots entre de <br />bonnes mains.
          </h2>
          <p className="text-slate-400 leading-relaxed mb-8">
            Plateforme securisee et conforme aux normes de l'ARC et de Revenu Quebec.
            Deposez vos declarations en toute confiance.
          </p>
          <div className="flex flex-wrap gap-5 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <Shield size={14} className="text-teal-400" /> SSL 256-bit
            </span>
            <span className="flex items-center gap-2">
              <BadgeCheck size={14} className="text-teal-400" /> Conforme PIPEDA
            </span>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">IF</span>
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">ImpotFacile</span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">{t('auth.login')}</h1>
          <p className="text-sm text-slate-500 mb-8">Connectez-vous pour acceder a votre tableau de bord.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-danger-50 border border-danger-200 text-danger-700 p-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('auth.email')}</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="vous@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('auth.password')}</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Connexion...
                </span>
              ) : (
                <>
                  {t('auth.submit')}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="font-semibold text-teal-600 hover:text-teal-500">{t('auth.register')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
