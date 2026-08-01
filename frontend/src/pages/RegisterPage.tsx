import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import type { TaxProfile } from '@/types'
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Shield, Clock } from 'lucide-react'

const PROFILES: { value: TaxProfile; label: string }[] = [
  { value: 'STUDENT', label: 'Etudiant' },
  { value: 'INDIVIDUAL', label: 'Particulier' },
  { value: 'SELF_EMPLOYED', label: 'Travailleur autonome' },
  { value: 'SENIOR', label: 'Aine' },
  { value: 'NEWCOMER', label: 'Nouvel arrivant' },
  { value: 'MILITARY', label: 'Militaire' },
  { value: 'EXPATRIATE', label: 'Expatrie' },
]

export default function RegisterPage() {
  const { t } = useTranslation()
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    taxProfile: 'INDIVIDUAL' as TaxProfile,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || "Erreur lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left panel - dark hero matching landing page */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-800 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-md px-8">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">IF</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">ImpotFacile</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight tracking-tight">
            Commencez en <br />quelques minutes.
          </h2>
          <p className="text-slate-400 leading-relaxed mb-8">
            Creez votre compte, remplissez le formulaire guide et soumettez votre declaration.
            Nos experts s'occupent du reste.
          </p>
          <div className="flex flex-wrap gap-5 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <Shield size={14} className="text-teal-400" /> Securise
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} className="text-teal-400" /> 5-10 min
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

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">{t('auth.register')}</h1>
          <p className="text-sm text-slate-500 mb-8">Creez votre compte pour commencer.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-danger-50 border border-danger-200 text-danger-700 p-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('auth.firstName')}</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="input-field pl-10"
                    placeholder="Jean"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('auth.lastName')}</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="input-field"
                  placeholder="Tremblay"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('auth.email')}</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pl-10 pr-10"
                  placeholder="8 caracteres minimum"
                  required
                  minLength={8}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('auth.taxProfile')}</label>
              <select
                value={form.taxProfile}
                onChange={(e) => setForm({ ...form, taxProfile: e.target.value as TaxProfile })}
                className="input-field"
              >
                {PROFILES.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Inscription...
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
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-500">{t('auth.login')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
