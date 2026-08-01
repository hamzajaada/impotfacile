import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Shield, CheckCircle, FileText, Clock,
  Globe, Lock, Award, Star, BadgeCheck, TrendingUp,
  Calculator, Receipt, ShieldCheck, Fingerprint, Server, Eye, FileCheck,
  Check, X, Minus,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <NavSection />
      <HeroSection />
      <StatsBar />
      <StepsSection />
      <FeaturesSection />
      <SecuritySection />
      <PricingSection />
      <TestimonialsSection />
      <CtaSection />
      <FooterSection />
    </div>
  )
}

/* ──────────────── 1. NAVBAR ──────────────── */
function NavSection() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">IF</span>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">ImpotFacile</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {['Fonctionnement', 'Securite', 'Tarifs', 'Avis'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-slate-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5 transition-all">
                {l}
              </a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-lg border border-slate-600 hover:border-slate-400 transition-all">
              Se connecter
            </Link>
            <Link to="/register" className="inline-flex items-center gap-2 bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-teal-500 transition-all">
              Commencer <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

/* ──────────────── 2. HERO ──────────────── */
function HeroSection() {
  return (
    <section className="relative  bg-slate-800 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px]" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 ">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-1.5 mb-6">
              <BadgeCheck size={14} className="text-teal-400" />
              <span className="text-xs font-semibold text-teal-300 tracking-wide uppercase">Certifie ARC & Revenu Quebec</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              Vos impots, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300">declarés en ligne</span> <br />
              en quelques minutes.
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed">
              Plateforme securisee et conforme aux normes de l'ARC. Deposez vos declarations sans stress, depuis chez vous.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-teal-500 transition-all shadow-lg shadow-teal-600/25">
                Commencer gratuitement <ArrowRight size={18} />
              </Link>
              <a href="#fonctionnement" className="inline-flex items-center justify-center gap-2 border border-slate-600 text-slate-300 font-semibold px-7 py-3.5 rounded-xl hover:border-slate-400 hover:text-white transition-all">
                Comment ca marche
              </a>
            </div>
            <div className="flex flex-wrap gap-5 text-sm text-slate-400">
              <span className="flex items-center gap-2"><Lock size={14} className="text-teal-400" /> SSL 256-bit</span>
              <span className="flex items-center gap-2"><Shield size={14} className="text-teal-400" /> Conforme PIPEDA</span>
              <span className="flex items-center gap-2"><Clock size={14} className="text-teal-400" /> Support 7j/7</span>
            </div>
          </div>

          {/* Right - Mockup Card */}
          <div className="hidden lg:block relative">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-emerald-500/10 rounded-3xl blur-2xl" />
            <div className="relative bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
              {/* macOS title bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-700/50 border-b border-slate-600/50">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-xs text-slate-400 ml-3 font-medium">Declaration 2025</span>
              </div>
              <div className="p-6 space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>Progression</span>
                    <span className="text-teal-400 font-semibold">75%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-[75%] bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full" />
                  </div>
                </div>
                {/* Checklist */}
                <div className="space-y-2.5">
                  {[
                    { label: 'Informations personnelles', done: true },
                    { label: 'Revenus et employment', done: true },
                    { label: 'Deductions et credits', done: true },
                    { label: 'Signature electronique', done: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-600/50 text-slate-500'}`}>
                        {item.done ? <Check size={12} /> : <Minus size={12} />}
                      </div>
                      <span className={`text-sm ${item.done ? 'text-slate-300' : 'text-slate-500'}`}>{item.label}</span>
                    </div>
                  ))}
                </div>
                {/* Result card */}
                <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4 mt-4">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={16} className="text-teal-400" />
                    <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Resultat estime</span>
                  </div>
                  <p className="text-2xl font-bold text-white">Remboursement : 2 450 $</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────── STATS BAR ──────────────── */
function StatsBar() {
  return (
    <section className="bg-slate-800 border-t border-slate-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '50 000+', label: 'Declarations deposees' },
            { value: '98.5%', label: 'Taux de precision' },
            { value: '2 450 $', label: 'Remboursement moyen' },
            { value: '4.9/5', label: 'Satisfaction client' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl md:text-3xl font-extrabold text-white mb-1">{s.value}</p>
              <p className="text-sm text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────── 3. STEPS ──────────────── */
function StepsSection() {
  const steps = [
    { icon: FileText, num: '01', title: 'Remplissez le formulaire', desc: 'Guide interactif pas a pas. Nos questions s\'adaptent a votre situation fiscale.', tag: '5-10 min', tagColor: 'bg-teal-50 text-teal-700' },
    { icon: Upload, num: '02', title: 'Televersez vos documents', desc: 'Glissez-deposez vos feuillets T4, Releve 1 et pieces justificatives.', tag: 'Securise', tagColor: 'bg-emerald-50 text-emerald-700' },
    { icon: CheckCircle, num: '03', title: 'Soumettez et suivez', desc: 'Soumission electronique directe a l\'ARC. Suivez le statut en temps reel.', tag: 'Instantane', tagColor: 'bg-sky-50 text-sky-700' },
  ]

  return (
    <section id="fonctionnement" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-3">Comment ca marche</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Trois etapes simples</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Plus besoin de complexite. Declarez vos impots en un temps record.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.num} className="relative bg-white rounded-2xl border border-slate-200 p-7 hover:shadow-lg hover:border-slate-300 transition-all duration-200 group">
              <span className="absolute top-5 right-6 text-6xl font-extrabold text-slate-100 select-none group-hover:text-teal-50 transition-colors">{s.num}</span>
              <div className="relative">
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-5">
                  <s.icon size={22} className="text-teal-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{s.desc}</p>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${s.tagColor}`}>
                  {s.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/register" className="inline-flex items-center gap-2 bg-teal-600 text-white font-semibold px-7 py-3 rounded-xl hover:bg-teal-500 transition-all shadow-lg shadow-teal-600/20">
            Commencer maintenant <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

function Upload(props: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}

/* ──────────────── 4. FEATURES BENTO GRID ──────────────── */
function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Tout ce dont vous avez besoin</h2>
          <p className="text-slate-500 max-w-xl">Une plateforme complete pour vos declarations fiscales.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Small cards */}
          <FeatureCard icon={Calculator} title="Calcul automatique" desc="Impots, credits et deductions calcules automatiquement." />
          <FeatureCard icon={Receipt} title="Feuillets intelligents" desc="Importation automatique des T4, RL-1 et autres feuillets." />
          <FeatureCard icon={Globe} title="Bilingue FR/EN" desc="Interface entierement disponible en francais et en anglais." />

          {/* Wide checkmark card */}
          <div className="md:col-span-2 bg-slate-50 rounded-2xl border border-slate-200 p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                <FileCheck size={20} className="text-teal-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Credits et deductions inclus</h3>
                <p className="text-sm text-slate-500">Tous les credits canadiens et quebecois predefinis.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {[
                'Credit pour TVA', 'Credit d\'impot handicape', 'Frais de garde', 'Dons benévoles',
                'Frais medicals', 'Frais de scolarite', 'Credit TVQ', 'Prime au travail',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check size={14} className="text-teal-500 flex-shrink-0" />
                  <span className="text-sm text-slate-600">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certification card */}
          <div className="bg-darkteal-800 rounded-2xl p-7 text-white">
            <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center mb-4">
              <Award size={20} className="text-teal-300" />
            </div>
            <h3 className="font-bold mb-1">Certifie et approuve</h3>
            <p className="text-sm text-slate-400 mb-5">Conforme aux normes les plus strictes.</p>
            <div className="flex flex-wrap gap-2">
              {['ARC', 'Revenu Quebec', 'RPDB', 'PIPEDA'].map((cert) => (
                <span key={cert} className="text-xs font-medium bg-white/10 text-teal-200 px-3 py-1 rounded-full">{cert}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 hover:shadow-md hover:border-slate-300 transition-all duration-200">
      <div className="w-11 h-11 bg-teal-50 rounded-xl flex items-center justify-center mb-4">
        <Icon size={20} className="text-teal-600" />
      </div>
      <h3 className="font-bold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  )
}

/* ──────────────── 5. SECURITY ──────────────── */
function SecuritySection() {
  const features = [
    { icon: Lock, title: 'Chiffrement AES-256', desc: 'Toutes vos donnees sont chiffrees de bout en bout.' },
    { icon: Eye, title: 'Confidentialite totale', desc: 'Aucune donnee n\'est partagee avec des tiers.' },
    { icon: Server, title: 'Hebergement au Canada', desc: 'Serveurs situes au Quebec, conformes PIPEDA.' },
    { icon: Fingerprint, title: 'Authentification forte', desc: 'Double facteur et protection par mot de passe.' },
  ]

  return (
    <section id="securite" className="py-24 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <p className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-3">Securite</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">Vos donnees, notre priorite</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Nous utilisons les mêmes standards de securite que les grandes banques canadiennes pour proteger vos informations sensibles.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {features.map((f) => (
                <div key={f.title} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center mb-3">
                    <f.icon size={18} className="text-teal-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-1">{f.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual */}
          <div className="relative">
            <div className="bg-darkteal-800 rounded-3xl p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl" />
              <div className="relative">
                <div className="w-20 h-20 bg-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck size={40} className="text-teal-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Protection maximale</h3>
                <p className="text-sm text-slate-400 mb-8">Standards de securite bancaires</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Check, title: 'SSL/TLS', sub: '256-bit' },
                    { icon: Check, title: 'SOC 2', sub: 'Type II' },
                    { icon: Check, title: 'PIPEDA', sub: 'Conforme' },
                    { icon: Check, title: 'ARC', sub: 'Approuve' },
                  ].map((b) => (
                    <div key={b.title} className="bg-white/5 border border-white/10 rounded-xl p-3 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <b.icon size={14} className="text-teal-400" />
                        <span className="text-sm font-semibold text-white">{b.title}</span>
                      </div>
                      <span className="text-xs text-slate-400">{b.sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────── 6. PRICING ──────────────── */
function PricingSection() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="tarifs" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-3">Tarifs</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Simple et transparent</h2>
          <p className="text-slate-500 max-w-xl mx-auto mb-8">Choisissez le forfait qui correspond a vos besoins.</p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-slate-100 rounded-xl p-1">
            <button onClick={() => setAnnual(false)} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${!annual ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
              Mensuel
            </button>
            <button onClick={() => setAnnual(true)} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${annual ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
              Annuel <span className="text-[10px] font-bold bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-full">-33%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Gratuit</h3>
            <p className="text-sm text-slate-500 mb-6">Pour les declarations simples.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-slate-900">0 $</span>
              <span className="text-slate-500 text-sm"> / an</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                { text: 'Declaration T1 simple', active: true },
                { text: '1 seul revenu', active: true },
                { text: 'Calcul automatique', active: true },
                { text: 'Support par email', active: true },
                { text: 'Feuillets multiples', active: false },
                { text: 'Suivi en temps reel', active: false },
                { text: 'Support prioritaire', active: false },
              ].map((f) => (
                <li key={f.text} className="flex items-center gap-2.5">
                  {f.active ? <Check size={16} className="text-teal-500 flex-shrink-0" /> : <X size={16} className="text-slate-300 flex-shrink-0" />}
                  <span className={`text-sm ${f.active ? 'text-slate-700' : 'text-slate-400'}`}>{f.text}</span>
                </li>
              ))}
            </ul>
            <Link to="/register" className="block text-center w-full py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all">
              Creer un compte
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-white rounded-2xl border-2 border-teal-500 p-8 shadow-lg shadow-teal-500/10 relative">
            <div className="absolute -top-3 left-6 bg-teal-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Le plus populaire
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Pro</h3>
            <p className="text-sm text-slate-500 mb-6">Pour les declarations completes.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-slate-900">{annual ? '59 $' : '89 $'}</span>
              <span className="text-slate-500 text-sm"> / an</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                'Declaration T1 complete',
                'Feuillets multiples (T4, RL-1...)',
                'Calcul automatique avance',
                'Support prioritaire',
                'Suivi en temps reel',
                'Estimation du remboursement',
                'Soumission electronique ARC',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <Check size={16} className="text-teal-500 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/register" className="block text-center w-full py-3 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-500 transition-all shadow-lg shadow-teal-600/20">
              Commencer avec Pro
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-slate-400 mt-8">Sans engagement. Annulez a tout moment.</p>
      </div>
    </section>
  )
}

/* ──────────────── 7. TESTIMONIALS ──────────────── */
function TestimonialsSection() {
  const testimonials = [
    { name: 'Marie-Claire D.', role: 'Comptable, Montreal', stars: 5, amount: '2 450 $', quote: 'Interface intuitive et resultats impeccables. Je recommande ImpotFacile a tous mes clients.' },
    { name: 'Jean-Francois L.', role: 'Entrepreneur, Quebec', stars: 5, amount: '3 200 $', quote: 'Enfin une plateforme qui comprend les besoins des travailleurs autonomes. T2125 inclus!' },
    { name: 'Sarah M.', role: 'Etudiante, Sherbrooke', stars: 5, amount: '890 $', quote: 'Simple, rapide et gratuit pour les etudiants. J\'ai obtenu mon remboursement en 2 semaines.' },
  ]

  return (
    <section id="avis" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Ce que disent nos clients</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Des milliers de Canadiens nous font confiance chaque annee.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-teal-50 text-teal-700 px-3 py-1 rounded-full mb-4">
                <TrendingUp size={12} /> {t.amount} rembourses
              </span>
              <p className="text-sm text-slate-600 leading-relaxed mb-5 italic">"{t.quote}"</p>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <div className="inline-flex items-center gap-2 text-sm text-slate-500">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span><strong className="text-slate-900">4.9/5</strong> base sur 2 300+ avis</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────── 8. FINAL CTA ──────────────── */
function CtaSection() {
  return (
    <section className="py-24 bg-slate-800 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-500/10 rounded-full blur-[100px]" />
      </div>
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
          Pret a declarer vos impots?
        </h2>
        <p className="text-lg text-slate-400 mb-8 max-w-lg mx-auto">
          Creez votre compte gratuit en 30 secondes et commencez votre declaration.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
          <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-teal-500 transition-all shadow-lg shadow-teal-600/25">
            Creer un compte gratuit <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="inline-flex items-center justify-center gap-2 border border-slate-600 text-slate-300 font-semibold px-8 py-3.5 rounded-xl hover:border-slate-400 hover:text-white transition-all">
            Se connecter
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-5 text-sm text-slate-400">
          <span className="flex items-center gap-2"><Lock size={14} className="text-teal-400" /> Chiffrement SSL</span>
          <span className="flex items-center gap-2"><Shield size={14} className="text-teal-400" /> Conforme ARC</span>
          <span className="flex items-center gap-2"><Clock size={14} className="text-teal-400" /> Sans engagement</span>
        </div>
      </div>
    </section>
  )
}

/* ──────────────── 9. FOOTER ──────────────── */
function FooterSection() {
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
            <a href="#" className="hover:text-slate-900 transition-colors">Politique de confidentialite</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Conditions d'utilisation</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <Globe size={16} className="text-slate-400" />
            <select className="text-sm text-slate-600 bg-transparent border-none outline-none cursor-pointer">
              <option>Francais</option>
              <option>English</option>
            </select>
          </div>
        </div>
        <div className="border-t border-slate-100 mt-6 pt-6 text-center">
          <p className="text-xs text-slate-400">&copy; {new Date().getFullYear()} ImpotFacile. Tous droits reserves.</p>
        </div>
      </div>
    </footer>
  )
}
