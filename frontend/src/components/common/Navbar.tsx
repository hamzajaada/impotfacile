import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { Menu, X, Globe, LogOut, LayoutDashboard, FileEdit } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')
  }

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">IF</span>
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">ImpotFacile</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <Link to="/tarifs" className="text-slate-500 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                {t('nav.pricing')}
              </Link>
              <Link to="/blog" className="text-slate-500 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                {t('nav.blog')}
              </Link>
              <Link to="/contact" className="text-slate-500 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                {t('nav.contact')}
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button onClick={toggleLang} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
              <Globe size={18} />
            </button>
            {user ? (
              <>
                <Link to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors">
                  <LayoutDashboard size={16} />
                  {t('nav.dashboard')}
                </Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin/formulaire" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors">
                    <FileEdit size={16} />
                    {t('nav.formBuilder')}
                  </Link>
                )}
                <button onClick={logout} className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-danger-500 hover:bg-danger-50 px-3 py-2 rounded-lg transition-colors">
                  <LogOut size={16} />
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg transition-colors">
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-slate-100">
            <div className="flex flex-col gap-1">
              <Link to="/tarifs" className="text-slate-600 hover:bg-slate-50 text-sm font-medium px-3 py-2.5 rounded-lg" onClick={() => setMobileOpen(false)}>
                {t('nav.pricing')}
              </Link>
              <Link to="/blog" className="text-slate-600 hover:bg-slate-50 text-sm font-medium px-3 py-2.5 rounded-lg" onClick={() => setMobileOpen(false)}>
                {t('nav.blog')}
              </Link>
              <Link to="/contact" className="text-slate-600 hover:bg-slate-50 text-sm font-medium px-3 py-2.5 rounded-lg" onClick={() => setMobileOpen(false)}>
                {t('nav.contact')}
              </Link>
              <div className="border-t border-slate-100 my-2" />
              {user ? (
                <>
                  <Link to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} className="text-slate-600 hover:bg-slate-50 text-sm font-medium px-3 py-2.5 rounded-lg" onClick={() => setMobileOpen(false)}>
                    {t('nav.dashboard')}
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link to="/admin/formulaire" className="text-slate-600 hover:bg-slate-50 text-sm font-medium px-3 py-2.5 rounded-lg" onClick={() => setMobileOpen(false)}>
                      {t('nav.formBuilder')}
                    </Link>
                  )}
                  <button onClick={() => { logout(); setMobileOpen(false) }} className="text-left text-danger-500 text-sm font-medium px-3 py-2.5 rounded-lg hover:bg-danger-50">
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-slate-600 hover:bg-slate-50 text-sm font-medium px-3 py-2.5 rounded-lg" onClick={() => setMobileOpen(false)}>
                    {t('nav.login')}
                  </Link>
                  <Link to="/register" className="btn-primary text-sm mx-3 mt-1 text-center" onClick={() => setMobileOpen(false)}>
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
