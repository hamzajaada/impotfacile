import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Shield, Zap, Users, FileCheck, ArrowRight, Lock, Clock, Award } from 'lucide-react'

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-transparent to-accent-500/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-500/8 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-400/20 rounded-full px-4 py-1.5 mb-6">
              <div className="w-1.5 h-1.5 bg-success-400 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-primary-200">Plante 2025 - Disponible</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
              Vos impots, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-accent-300">simplifies.</span>
            </h1>
            <p className="text-lg text-navy-300 mb-10 max-w-xl leading-relaxed">
              {t('home.subtitle')} Plateforme conforme aux normes de l'ARC et de Revenu Quebec.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/register" className="btn-primary text-base px-8 py-3">
                {t('home.cta')}
                <ArrowRight size={18} />
              </Link>
              <Link to="/tarifs" className="btn-secondary text-base px-8 py-3 border-navy-700 text-navy-200 hover:bg-navy-800 hover:text-white">
                Voir les tarifs
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-10 text-sm text-navy-400">
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-success-400" />
                Chiffrement SSL 256-bit
              </div>
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-success-400" />
                Conforme PIPEDA
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-success-400" />
                Support 7j/7
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-sm text-navy-400">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-primary-500" />
              <span className="font-medium">Certifie RPDB</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-primary-500" />
              <span className="font-medium">Donnees hebergees au Canada</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock size={18} className="text-primary-500" />
              <span className="font-medium">Cryptage de bout en bout</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCheck size={18} className="text-primary-500" />
              <span className="font-medium">Conforme ARC</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title mb-3">Pourquoi ImpotFacile</h2>
            <p className="section-subtitle mx-auto">
              Une plateforme complete pour vos declarations, concue pour des professionnels exigeants.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-7 group hover:shadow-elevated transition-shadow duration-200">
              <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary-100 transition-colors">
                <Shield className="text-primary-600" size={22} />
              </div>
              <h3 className="text-lg font-semibold text-navy-900 mb-2">{t('home.features.secure')}</h3>
              <p className="text-sm text-navy-500 leading-relaxed">{t('home.features.secureDesc')}</p>
            </div>
            <div className="card p-7 group hover:shadow-elevated transition-shadow duration-200">
              <div className="w-11 h-11 bg-accent-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-accent-100 transition-colors">
                <Zap className="text-accent-500" size={22} />
              </div>
              <h3 className="text-lg font-semibold text-navy-900 mb-2">{t('home.features.fast')}</h3>
              <p className="text-sm text-navy-500 leading-relaxed">{t('home.features.fastDesc')}</p>
            </div>
            <div className="card p-7 group hover:shadow-elevated transition-shadow duration-200">
              <div className="w-11 h-11 bg-success-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-success-100 transition-colors">
                <Users className="text-success-600" size={22} />
              </div>
              <h3 className="text-lg font-semibold text-navy-900 mb-2">{t('home.features.expert')}</h3>
              <p className="text-sm text-navy-500 leading-relaxed">{t('home.features.expertDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Profiles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title mb-3">Profils supportes</h2>
          <p className="section-subtitle mx-auto mb-10">
            Que vous soyez etudiant, travailleur autonome, aine ou nouvel arrivant, ImpotFacile s'adapte a votre situation.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {['Etudiant', 'Particulier', 'Travailleur autonome', 'Aine', 'Nouvel arrivant', 'Militaire', 'Expatrie'].map((profile) => (
              <span key={profile} className="bg-navy-50 border border-navy-100 px-5 py-2.5 rounded-full text-sm font-medium text-navy-700 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition-colors cursor-default">
                {profile}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy-950 rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-4">Pret a simplifier vos impots?</h2>
              <p className="text-navy-300 mb-8 max-w-lg mx-auto">
                Creez votre compte gratuit et commencez votre declaration en quelques minutes.
              </p>
              <Link to="/register" className="btn-primary text-base px-8 py-3 bg-white text-primary-700 hover:bg-gray-50">
                Commencer maintenant
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
