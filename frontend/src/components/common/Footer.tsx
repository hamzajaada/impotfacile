import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Globe } from 'lucide-react'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">IF</span>
            </div>
            <span className="text-base font-bold text-slate-900">ImpotFacile</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <Link to="/contact" className="hover:text-slate-900 transition-colors">{t('nav.contact')}</Link>
            <a href="#" className="hover:text-slate-900 transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-slate-900 transition-colors">{t('footer.terms')}</a>
          </div>
          <div className="flex items-center gap-3">
            <Globe size={16} className="text-slate-400" />
            <span className="text-sm text-slate-500">Francais / English</span>
          </div>
        </div>
        <div className="border-t border-slate-100 mt-6 pt-6 text-center">
          <p className="text-xs text-slate-400">&copy; {new Date().getFullYear()} ImpotFacile. {t('footer.rights')}.</p>
        </div>
      </div>
    </footer>
  )
}
