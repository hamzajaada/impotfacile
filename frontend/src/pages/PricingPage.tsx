import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'

const tarifs = [
  { profile: 'Etudiant', price: 49, features: ['Declaration T1 simple', '1 revenu', 'Email de suivi'], popular: false },
  { profile: 'Particulier', price: 89, features: ['Declaration T1 complete', 'Multiples revenus', 'Suivi en temps reel', 'Support prioritaire'], popular: true },
  { profile: 'Travailleur autonome', price: 179, features: ['Declaration T1 + T2125', 'Revenus d\'entreprise', 'Deductions professionnelles', 'Conseiller dedie'], popular: false },
  { profile: 'Aine', price: 69, features: ['Declaration T1 complete', 'Pension, REER', 'Credits d\'impot aines', 'Assistance telephone'], popular: false },
]

export default function PricingPage() {
  const { t } = useTranslation()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-2">Tarifs</p>
        <h1 className="section-title mb-3">{t('nav.pricing')}</h1>
        <p className="section-subtitle mx-auto">
          Choisissez le forfait qui correspond a votre profil fiscal.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {tarifs.map((tarif) => (
          <div key={tarif.profile} className={`card p-6 flex flex-col relative ${tarif.popular ? 'ring-2 ring-teal-500 shadow-elevated' : ''}`}>
            {tarif.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Populaire
              </div>
            )}
            <h3 className="text-lg font-bold text-slate-900 mb-1">{tarif.profile}</h3>
            <div className="text-3xl font-extrabold text-teal-600 mb-5">{tarif.price}$</div>
            <ul className="space-y-2.5 mb-6 flex-1">
              {tarif.features.map((f) => (
                <li key={f} className="text-sm text-slate-600 flex items-start gap-2.5">
                  <Check size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button className={tarif.popular ? 'btn-primary w-full' : 'btn-secondary w-full'}>
              {t('home.cta')}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
